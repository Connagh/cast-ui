/**
 * HeroArt — the documentation hero's full-bleed backdrop.
 *
 * An animated, theme-driven crystalline wave background: a calm, translucent
 * sheet that flows and breathes, lit by a bright fresnel crest, over a soft
 * vertical gradient, with a field of drifting, twinkling sparkles.
 *
 * Everything is driven by Cast UI tokens, so the whole scene recolours the
 * instant the page's brand or colour mode changes:
 *   - ribbons + crest + sparkles  ← colors.brand.bold.default.bg
 *   - gradient + fades            ← scheme.surface.base
 * The hero above stays crisp: the sheet sits low, the top stays calm, and the
 * scene fades into the page surface at the bottom for a seamless join.
 *
 * Rendering is a single self-contained WebGL layer (no libraries). It only
 * starts on the client, so SSR and the no-WebGL / reduce-motion paths all fall
 * back to the same themed CSS gradient — the picture is never blank. Honours
 * prefers-reduced-motion (renders one still frame), pauses when scrolled off
 * screen or the tab is hidden, and caps device-pixel-ratio for performance.
 */

import React, { useEffect, useRef } from 'react';
import { useMotion, useTheme } from '@castui/cast-ui';

/* ------------------------------------------------------------------ colour */

const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
function parse(hex: string) {
  const h = (hex || '#000000').replace('#', '');
  const s = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return { r: parseInt(s.slice(0, 2), 16) || 0, g: parseInt(s.slice(2, 4), 16) || 0, b: parseInt(s.slice(4, 6), 16) || 0 };
}
function toHex({ r, g, b }: { r: number; g: number; b: number }) {
  return '#' + [r, g, b].map((v) => clamp(v).toString(16).padStart(2, '0')).join('');
}
function mix(a: string, b: string, t: number) {
  const x = parse(a);
  const y = parse(b);
  return toHex({ r: x.r + (y.r - x.r) * t, g: x.g + (y.g - x.g) * t, b: x.b + (y.b - x.b) * t });
}
const lighten = (hex: string, t: number) => mix(hex, '#ffffff', t);
const darken = (hex: string, t: number) => mix(hex, '#000000', t);
/** hex → [r,g,b] in 0..1 for WebGL uniforms. */
function rgb01(hex: string): [number, number, number] {
  const { r, g, b } = parse(hex);
  return [r / 255, g / 255, b / 255];
}

/** Everything the scene needs, derived from two tokens + the colour mode. */
type SceneColors = {
  brand: [number, number, number];
  crest: [number, number, number];
  top: [number, number, number];
  bottom: [number, number, number];
  /** CSS gradient string used as the SSR / no-WebGL / reduce-motion fallback. */
  cssGradient: string;
  /** Page surface, for the bottom fade + vignette overlays. */
  surface: string;
  dark: boolean;
};

function deriveScene(brandHex: string, surfaceHex: string, dark: boolean): SceneColors {
  const brand = brandHex || '#2563EB';
  const crestHex = lighten(brand, dark ? 0.55 : 0.25);
  let topHex: string;
  let botHex: string;
  if (dark) {
    // Dark mode: near-black top, a faintly brand-lit deep band lower down.
    topHex = mix(darken(surfaceHex, 0.55), brand, 0.06);
    botHex = mix(darken(surfaceHex, 0.2), brand, 0.16);
  } else {
    // Light mode: soft near-white, a whisper of brand toward the base.
    topHex = lighten(surfaceHex, 0.02);
    botHex = mix(surfaceHex, brand, 0.08);
  }
  return {
    brand: rgb01(brand),
    crest: rgb01(crestHex),
    top: rgb01(topHex),
    bottom: rgb01(botHex),
    cssGradient: `linear-gradient(180deg, ${topHex} 0%, ${mix(topHex, botHex, 0.6)} 62%, ${botHex} 100%)`,
    surface: surfaceHex,
    dark,
  };
}

/* ------------------------------------------------------------------ shaders */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

// Main scene: gradient + crystalline wave sheet + fresnel crest + sparkle field.
const FRAG = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2  uRes;
uniform vec3  uBrand;
uniform vec3  uCrest;
uniform vec3  uTop;
uniform vec3  uBot;
uniform float uDark;
uniform float uMotion;   // 0..1 global motion scale (0 = frozen still)

// Dave Hoskins hash — cheap, high-quality.
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
// One crystalline band. Returns coverage 0..1. 'side' bends the falloff so the
// sheet is soft above and sharp below, like a surface catching light on one face.
float band(vec2 uv, float speed, float freq, float amp, float phase,
           float yoff, float width, float sharp, float side) {
  float t = uTime * uMotion;
  float angle = -t * speed * freq + (phase + uv.x) * 6.2831853 * freq;
  float wy = sin(angle) * amp + yoff;
  // slow travelling harmonics for organic, non-repeating motion
  wy += sin(uv.x * 2.3 - t * speed * 0.7 + phase) * amp * 0.5;
  wy += sin(uv.x * 5.1 + t * speed * 0.35 + phase * 1.7) * amp * 0.2;
  float dy = wy - uv.y;
  float dist = abs(dy);
  if (side * dy < 0.0) dist *= 4.0;              // asymmetric falloff
  float s = smoothstep(width, 0.0, dist);
  return pow(s, sharp);
}

// One layer of soft, round, twinkling stars on a hashed grid. Empty cells stay
// dark; live cells place a point at a random spot in the cell and fall off
// radially, so sparkles read as glints, not pixels. Slow drift = rising embers.
float starLayer(vec2 uv, float ar, float scale, float thr, float t, float seed, vec2 drift) {
  vec2 p = vec2(uv.x * ar, uv.y) * scale + drift * t;
  vec2 cell = floor(p);
  vec2 f = fract(p);
  float h = hash12(cell + seed);
  if (h < thr) return 0.0;
  float bright = (h - thr) / (1.0 - thr);
  vec2 sp = vec2(hash12(cell + seed + 3.1), hash12(cell + seed + 7.7));
  float d = length(f - sp);
  float radius = 0.05 + 0.16 * bright;
  float pt = pow(smoothstep(radius, 0.0, d), 1.6);
  float tw = 0.4 + 0.6 * sin(t * (1.6 + bright * 3.0) + h * 62.83);
  return pt * max(tw, 0.0) * bright;
}
float sparkles(vec2 uv) {
  float ar = uRes.x / max(uRes.y, 1.0);
  float t = uTime * uMotion;
  float s = 0.0;
  s += starLayer(uv, ar, 24.0, 0.90, t, 11.0, vec2(0.34, -0.14));
  s += starLayer(uv, ar, 40.0, 0.93, t, 47.0, vec2(0.22, -0.09)) * 0.7;
  return s;
}

void main() {
  vec2 uv = vUv;

  // base vertical gradient (smoothstepped)
  float g = smoothstep(0.0, 1.0, uv.y);
  vec3 col = mix(uBot, uTop, g);

  // --- crystalline sheet: a stack of bands, low on the canvas ---------------
  // wide soft body
  float sheet = 0.0;
  sheet += band(uv, 0.20, 1.00, 0.070, 0.00, 0.34, 0.230, 2.2,  1.0) * 0.55;
  sheet += band(uv, 0.32, 1.30, 0.055, 1.30, 0.32, 0.180, 2.6,  1.0) * 0.55;
  sheet += band(uv, 0.26, 1.70, 0.050, 2.40, 0.30, 0.150, 3.0, -1.0) * 0.50;
  sheet += band(uv, 0.16, 0.80, 0.090, 3.10, 0.28, 0.120, 3.4, -1.0) * 0.45;
  sheet += band(uv, 0.40, 2.10, 0.035, 4.20, 0.36, 0.100, 4.0,  1.0) * 0.40;
  // bright, narrow fresnel crest riding the top of the sheet
  float crest = 0.0;
  crest += band(uv, 0.22, 1.10, 0.075, 0.60, 0.355, 0.045, 6.0, 1.0);
  crest += band(uv, 0.30, 1.55, 0.060, 2.00, 0.335, 0.035, 7.5, 1.0) * 0.8;

  // vertical envelope: keep the top (headline zone) calm, richest in the lower
  // third, and fade before the very bottom so it meets the page fade cleanly.
  float env = smoothstep(0.92, 0.55, uv.y) * smoothstep(0.02, 0.16, uv.y);
  sheet *= env;
  crest *= env;

  // horizontal edge fade so the sheet dissolves at the left/right margins
  float edge = smoothstep(0.0, 0.16, uv.x) * smoothstep(1.0, 0.84, uv.x);
  sheet *= mix(0.55, 1.0, edge);
  crest *= edge;

  // sparkles, concentrated around the sheet, thinning toward the top, and
  // clearing before the very bottom so they meet the page fade cleanly
  float spk = sparkles(uv) * (0.25 + 0.75 * smoothstep(0.9, 0.32, uv.y)) * smoothstep(0.03, 0.12, uv.y);

  if (uDark > 0.5) {
    // additive glow over the dark gradient
    col += uBrand * sheet * 1.15;
    col += uCrest * crest * 1.35;
    col += uCrest * spk * 0.9;
  } else {
    // ribbons read as gentle brand-tinted shading on the light gradient
    col = mix(col, mix(col, uBrand, 0.85), sheet * 0.9);
    col = mix(col, uCrest, crest * 0.5);
    col = mix(col, uBrand, spk * 0.6);
  }

  gl_FragColor = vec4(col, 1.0);
}`;

// Additive point-sprite particles: the closer, softer sparkles drifting over
// the sheet.
const PT_VERT = `
attribute vec3 aSeed;
uniform float uTime;
uniform float uFlow;
uniform float uRatio;
uniform float uSizeBase;
uniform float uSizeVar;
uniform float uMotion;
varying float vAlpha;
void main() {
  gl_PointSize = aSeed.z * uSizeVar + uSizeBase;
  float time = uTime * uFlow * uMotion;
  float x = fract(time * (aSeed.x - 0.5) / 15.0 + aSeed.y * 50.0) * 2.0 - 1.0;
  float y = sin(sign(aSeed.y - 0.5) * time * (aSeed.y + 1.5) / 4.0 + aSeed.x * 100.0)
          / ((6.0 - aSeed.x * 4.0 * aSeed.y) / uRatio);
  // sit the drift in the lower half, where the sheet lives
  y = y * 0.5 - 0.35;
  float opVar = mix(
    sin(time * (aSeed.x + 0.5) * 12.0 + aSeed.y * 10.0),
    sin(time * (aSeed.y + 1.5) * 6.0 + aSeed.x * 4.0),
    y * 0.5 + 0.5) * aSeed.x + aSeed.y;
  vAlpha = opVar * opVar * (1.0 - fract(aSeed.x + time * 0.00285));
  gl_Position = vec4(x, y, 0.0, 1.0);
}`;

const PT_FRAG = `
precision highp float;
varying float vAlpha;
uniform vec3 uColor;
uniform float uOpacity;
void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float d = dot(c, c);
  if (d > 1.0) discard;
  float s = (1.0 - d) * (1.0 - d);
  gl_FragColor = vec4(uColor * (vAlpha * uOpacity * s), 1.0);
}`;

/* --------------------------------------------------------------- component */

type Params = {
  brand: [number, number, number];
  crest: [number, number, number];
  top: [number, number, number];
  bottom: [number, number, number];
  dark: number;
  motion: number;
};

export function HeroArt() {
  const { colors, colorMode, scheme } = useTheme();
  const { reduceMotion } = useMotion();

  const brandHex = colors?.brand?.bold?.default?.bg ?? '#2563EB';
  const surfaceHex = scheme?.surface?.base ?? (colorMode === 'dark' ? '#0b0f19' : '#ffffff');
  const dark = colorMode === 'dark';
  const scene = deriveScene(brandHex, surfaceHex, dark);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // When frozen (reduced motion) we idle; flip this to redraw the still once,
  // e.g. after the brand or colour mode changes.
  const dirtyRef = useRef(true);
  // Live params the render loop reads each frame, so retheming is instant and
  // never rebuilds the GL context.
  const paramsRef = useRef<Params>({
    brand: scene.brand,
    crest: scene.crest,
    top: scene.top,
    bottom: scene.bottom,
    dark: dark ? 1 : 0,
    motion: reduceMotion ? 0 : 1,
  });

  // keep live params in sync with the theme without re-initialising WebGL
  useEffect(() => {
    paramsRef.current = {
      brand: scene.brand,
      crest: scene.crest,
      top: scene.top,
      bottom: scene.bottom,
      dark: dark ? 1 : 0,
      motion: reduceMotion ? 0 : 1,
    };
    dirtyRef.current = true;
  }, [scene.brand, scene.crest, scene.top, scene.bottom, dark, reduceMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || typeof window === 'undefined') return;

    const gl = (canvas.getContext('webgl', { alpha: false, antialias: true, premultipliedAlpha: false }) ||
      canvas.getContext('experimental-webgl', { alpha: false })) as WebGLRenderingContext | null;
    if (!gl) return; // CSS gradient fallback stays visible

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        // fail quietly — fallback gradient remains
        console.warn('HeroArt shader:', gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };
    const linkProg = (vs: string, fs: string) => {
      const v = compile(gl.VERTEX_SHADER, vs);
      const f = compile(gl.FRAGMENT_SHADER, fs);
      if (!v || !f) return null;
      const p = gl.createProgram()!;
      gl.attachShader(p, v);
      gl.attachShader(p, f);
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.warn('HeroArt link:', gl.getProgramInfoLog(p));
        return null;
      }
      return p;
    };

    const prog = linkProg(VERT, FRAG);
    if (!prog) return;
    const ptProg = linkProg(PT_VERT, PT_FRAG); // optional enhancement

    // fullscreen quad
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const uni = {
      time: gl.getUniformLocation(prog, 'uTime'),
      res: gl.getUniformLocation(prog, 'uRes'),
      brand: gl.getUniformLocation(prog, 'uBrand'),
      crest: gl.getUniformLocation(prog, 'uCrest'),
      top: gl.getUniformLocation(prog, 'uTop'),
      bot: gl.getUniformLocation(prog, 'uBot'),
      dark: gl.getUniformLocation(prog, 'uDark'),
      motion: gl.getUniformLocation(prog, 'uMotion'),
    };
    const aPos = gl.getAttribLocation(prog, 'aPos');

    // particle seeds
    const PT_COUNT = 900;
    let ptBuf: WebGLBuffer | null = null;
    let ptUni: Record<string, WebGLUniformLocation | null> = {};
    let aSeed = -1;
    if (ptProg) {
      const seeds = new Float32Array(PT_COUNT * 3);
      for (let i = 0; i < PT_COUNT; i++) {
        seeds[i * 3] = Math.random();
        seeds[i * 3 + 1] = Math.random();
        seeds[i * 3 + 2] = Math.pow(Math.random(), 8) + 0.1;
      }
      ptBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, ptBuf);
      gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);
      aSeed = gl.getAttribLocation(ptProg, 'aSeed');
      ptUni = {
        time: gl.getUniformLocation(ptProg, 'uTime'),
        flow: gl.getUniformLocation(ptProg, 'uFlow'),
        ratio: gl.getUniformLocation(ptProg, 'uRatio'),
        sizeBase: gl.getUniformLocation(ptProg, 'uSizeBase'),
        sizeVar: gl.getUniformLocation(ptProg, 'uSizeVar'),
        motion: gl.getUniformLocation(ptProg, 'uMotion'),
        color: gl.getUniformLocation(ptProg, 'uColor'),
        opacity: gl.getUniformLocation(ptProg, 'uOpacity'),
      };
    }

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const cw = container.clientWidth || window.innerWidth;
      const ch = container.clientHeight || 520;
      w = Math.max(2, Math.floor(cw * dpr));
      h = Math.max(2, Math.floor(ch * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
    };
    resize();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    ro?.observe(container);
    window.addEventListener('resize', resize);

    // pause when off-screen or tab hidden
    let onScreen = true;
    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver((e) => { onScreen = e[0]?.isIntersecting ?? true; }, { threshold: 0 })
        : null;
    io?.observe(container);

    const drawFrame = (t: number) => {
      const p = paramsRef.current;
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.useProgram(prog);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      gl.disable(gl.BLEND);
      gl.uniform1f(uni.time, t);
      gl.uniform2f(uni.res, w, h);
      gl.uniform3fv(uni.brand, p.brand);
      gl.uniform3fv(uni.crest, p.crest);
      gl.uniform3fv(uni.top, p.top);
      gl.uniform3fv(uni.bot, p.bottom);
      gl.uniform1f(uni.dark, p.dark);
      gl.uniform1f(uni.motion, p.motion);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (ptProg && ptBuf && aSeed >= 0) {
        gl.useProgram(ptProg);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE); // additive
        gl.bindBuffer(gl.ARRAY_BUFFER, ptBuf);
        gl.enableVertexAttribArray(aSeed);
        gl.vertexAttribPointer(aSeed, 3, gl.FLOAT, false, 0, 0);
        const aspect = Math.max(1, Math.min(w / Math.max(h, 1), 2)) * 0.375;
        gl.uniform1f(ptUni.time, t + 40.0);
        gl.uniform1f(ptUni.flow, 0.18);
        gl.uniform1f(ptUni.ratio, aspect);
        gl.uniform1f(ptUni.sizeBase, 2.2 * Math.min(window.devicePixelRatio || 1, 1.75));
        gl.uniform1f(ptUni.sizeVar, 2.0 * Math.min(window.devicePixelRatio || 1, 1.75));
        gl.uniform1f(ptUni.motion, p.motion);
        gl.uniform3fv(ptUni.color, p.crest);
        gl.uniform1f(ptUni.opacity, p.dark > 0.5 ? 0.55 : 0.28);
        gl.drawArrays(gl.POINTS, 0, PT_COUNT);
        gl.disable(gl.BLEND);
      }
    };

    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!onScreen || document.hidden) return;
      if (paramsRef.current.motion === 0) {
        if (!dirtyRef.current) return; // reduced motion: idle after the still
        dirtyRef.current = false;
        drawFrame(9.2); // one pretty, deterministic still frame
      } else {
        drawFrame((now - start) / 1000);
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      ro?.disconnect();
      io?.disconnect();
      const lose = gl.getExtension('WEBGL_lose_context');
      lose?.loseContext();
    };
    // init once; live theme flows through paramsRef
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const surface = scene.surface;
  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        background: scene.cssGradient, // SSR / no-WebGL / reduce-motion fallback
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      />
      {/* soft top scrim + bottom fade into the page surface, so the centred
          headline stays crisp and the hero joins the page seamlessly */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(120% 80% at 50% 24%, ${dark ? 'rgba(0,0,0,0.30)' : 'rgba(255,255,255,0.35)'} 0%, rgba(0,0,0,0) 55%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '38%',
          background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${surface} 100%)`,
        }}
      />
    </div>
  );
}

export default HeroArt;
