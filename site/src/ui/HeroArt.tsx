/**
 * The Cast — the hero's full-bleed backdrop. A "CristalWave": a calm, wide sheet
 * of many thin crystalline lines that ripple and flow together, inspired by the
 * Sony PS3 XWave background (after NeKoFu/CristalWave).
 *
 * Theme-driven: every line is the brand token `colors.brand.bold.default.bg`,
 * retuned by the colour mode, so it recolours with the page when the brand or
 * light/dark changes. The sheet sits low and to the right and fades at the edges
 * so the headline stays crisp.
 *
 * Renders as an absolutely-positioned layer (pointer-events: none) that fills
 * its relatively-positioned parent, behind the hero content. The base SVG is a
 * finished still, so reduce-motion and SSR both get the full picture with no
 * animation attached. Plain SVG — the site is web only.
 */

import React, { useId } from 'react';
import { useMotion, useTheme } from '@castui/cast-ui';

const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
function parse(hex: string) {
  const h = hex.replace('#', '');
  const s = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return { r: parseInt(s.slice(0, 2), 16), g: parseInt(s.slice(2, 4), 16), b: parseInt(s.slice(4, 6), 16) };
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
function rgba(hex: string, a: number) {
  const { r, g, b } = parse(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const W = 1600;
const H = 800;
const FREQ = 1.3; // big-wave cycles across the width
const WAVELEN = (W / FREQ).toFixed(1);
const MID_Y = 530; // calm and wide, sitting low
const LINES = 22; // sheet density
const SPACING = 6.5;
const STROKE = 1.2;
const BASE_A = 0.22;

/** One crystalline line: a shared big wave plus per-line ripple + shimmer. */
function linePath(baseY: number, i: number): string {
  const pts: string[] = [];
  for (let x = -W; x <= 2 * W; x += 26) {
    const u = (x / W) * Math.PI * 2;
    const y =
      baseY +
      44 * Math.sin(u * FREQ + 0.4) +
      15 * Math.sin(u * (FREQ * 2) + 0.6 + i * 0.3) +
      7 * Math.sin(u * (FREQ * 3.1) + i * 0.5);
    pts.push(`${x} ${y.toFixed(1)}`);
  }
  return 'M ' + pts.join(' L ');
}

function buildCristal(accent: string, dark: boolean, animate: boolean, id: string): string {
  const A = accent;
  const P = `${id}-`;
  const mid = (LINES - 1) / 2;
  const bright = lighten(A, dark ? 0.35 : 0.12);

  let lines = '';
  for (let i = 0; i < LINES; i++) {
    const baseY = MID_Y + (i - mid) * SPACING;
    const edge = 1 - Math.pow(Math.abs(i - mid) / mid, 1.5); // fade toward band edges
    const a = BASE_A * (0.3 + 0.7 * edge) * (dark ? 1 : 0.62);
    const col = Math.abs(i - mid) < 2 ? bright : A; // core lines a touch brighter
    lines += `<path d="${linePath(baseY, i)}" fill="none" stroke="${rgba(col, Number(a.toFixed(3)))}" stroke-width="${STROKE}"/>`;
  }

  // define the sheet once, reuse it for the glow + crisp passes (keeps the
  // inline SVG about half the size)
  const defs = `<defs>
    <linearGradient id="${P}edge" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000"/><stop offset="0.1" stop-color="#fff"/><stop offset="0.9" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
    <mask id="${P}em"><rect width="${W}" height="${H}" fill="url(#${P}edge)"/></mask>
    <filter id="${P}glow" x="-8%" y="-70%" width="116%" height="240%"><feGaussianBlur stdDeviation="16"/></filter>
    <g id="${P}lines">${lines}</g>
  </defs>`;

  const art = `<g mask="url(#${P}em)"><g class="${P}undu">
    <g class="${P}flow" opacity="${dark ? 0.75 : 0.5}" filter="url(#${P}glow)"><use href="#${P}lines"/></g>
    <g class="${P}flow"><use href="#${P}lines"/></g>
  </g></g>`;

  const style = animate
    ? `<style>
    .${P}flow{animation:${P}flow 26s linear infinite;}
    @keyframes ${P}flow{to{transform:translateX(-${WAVELEN}px)}}
    .${P}undu{animation:${P}breathe 13s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 50%;}
    @keyframes ${P}breathe{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.1)}}
    @media(prefers-reduced-motion:reduce){[class*="${P}"]{animation:none!important}}
  </style>`
    : '';

  return `${defs}${style}${art}`;
}

export function HeroArt() {
  const { colors, colorMode } = useTheme();
  const { reduceMotion } = useMotion();
  const rawId = useId();
  const id = 'cast' + rawId.replace(/[^a-zA-Z0-9]/g, ''); // useId() has colons; ids/selectors can't
  const markup = buildCristal(colors.brand.bold.default.bg, colorMode === 'dark', !reduceMotion, id);

  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    </div>
  );
}

export default HeroArt;
