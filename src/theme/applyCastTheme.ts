/**
 * applyCastTheme — turn a cast-sync `cast-theme.json` object into props for
 * `ThemeProvider`.
 *
 * The cast-sync Figma plugin exports a theme file with the colour intents
 * keyed by mode (`colors.light` / `colors.dark`) plus reference sections
 * (`text`, `typography`, `shadows`). This helper does the wiring the consumer
 * used to do by hand:
 *
 *   - **Mode pairing.** You pass the whole theme plus the mode you're
 *     rendering; it pulls the matching intent block. No more pairing
 *     `colors.light` with `colorMode="light"` yourself and risking a desync.
 *   - **Scheme overrides.** The non-intent colour sections the file carries
 *     (`text`, `surface`, `focusRing`) are mapped into the `scheme` override
 *     prop, so they actually land instead of sitting inert. Forward-compatible:
 *     new sections flow through here with no change at the call site.
 *   - **Fonts.** A `fonts` block (or `typography.fontFamily`) is mapped onto the
 *     `fonts` prop, so a theme file can reskin the typeface too.
 *   - **Density.** A `density` value (`compact` | `default` | `comfortable`) is
 *     mapped onto the `density` prop, so a theme file carries its own spacing
 *     and padding rhythm instead of relying on a separate global setting.
 *
 * The plugin stays a pure exporter — all interpretation lives here, in one
 * tested place, so old theme files keep working as cast-ui evolves.
 *
 * @example
 * ```tsx
 * import theme from './cast-theme.json';
 * import { ThemeProvider, applyCastTheme } from '@castui/cast-ui';
 *
 * const [mode, setMode] = useState<'light' | 'dark'>('light');
 *
 * <ThemeProvider {...applyCastTheme(theme, mode)}>
 *   <App />
 * </ThemeProvider>
 * ```
 */

import type { DeepPartial, DensityTheme } from './types';
import type { ThemeProviderProps } from './ThemeContext';
import type { ColorMode, ColorScheme, IntentName } from '../tokens/colors';
import type { EasingName, MotionOverrides } from '../tokens/motion';
import type { FontFamilyTokens } from '../tokens/typography';

/** intent → prominence → state → { bg, fg, border } */
type FileIntentMap = Partial<
  Record<IntentName, Record<string, Record<string, Record<string, string>>>>
>;

/**
 * The shape of a cast-sync `cast-theme.json`. Every section is optional so a
 * partial or future-versioned file never throws — unknown keys are ignored.
 */
export type CastThemeFile = {
  name?: string;
  description?: string;
  generatedAt?: string;
  /** Theme-file format version emitted by the plugin (version 4 adds motion). */
  version?: number;
  /** Optional explicit schema version for consumer validation. */
  schemaVersion?: number;
  colors?: Partial<Record<ColorMode, FileIntentMap>>;
  text?: Partial<Record<ColorMode, Record<string, string>>>;
  surface?: Partial<
    Record<
      ColorMode,
      { base?: string; subtle?: string; overlay?: { bg?: string; border?: string } }
    >
  >;
  focusRing?: Partial<Record<ColorMode, { color?: string }>>;
  typography?: Record<string, unknown>;
  /**
   * Font families for the theme (cast-theme version 5+). Mode-independent.
   * `sans` covers body/label text, `display` headings, `mono` code, `serif`
   * serif. Omit `display` and it follows `sans`. Read into the ThemeProvider
   * `fonts` prop by applyCastTheme.
   */
  fonts?: Partial<FontFamilyTokens>;
  /**
   * Density for the theme (cast-theme version 6+). Sets the spacing and padding
   * rhythm: `compact`, `default`, or `comfortable`. Mode-independent. Read into
   * the ThemeProvider `density` prop by applyCastTheme, so a theme file carries
   * its own spacing instead of relying on a separate global setting. Only
   * spacing changes with density. Colours, radius and type stay constant.
   */
  density?: DensityTheme;
  shadows?: Record<string, unknown>;
  /**
   * Motion block exported from the kit's `motion` variable collection
   * (cast-theme version 4+). `easing` carries cubic-bezier control points
   * as [x1, y1, x2, y2]. Motion is mode-independent, so this block is not
   * keyed by colour mode.
   */
  motion?: {
    duration?: Record<string, number>;
    cycle?: Record<string, number>;
    easing?: Record<string, readonly number[]>;
    spring?: Record<string, { damping?: number; stiffness?: number; mass?: number }>;
    feedback?: { press?: { scale?: number }; shake?: { amplitude?: number } };
    loop?: { pulse?: { from?: number; to?: number } };
  };
  [key: string]: unknown;
};

/** The subset of ThemeProvider props this helper produces. */
export type CastThemeProps = Pick<
  ThemeProviderProps,
  'colorMode' | 'colors' | 'scheme' | 'motion' | 'fonts' | 'density'
>;

const EASING_NAMES: EasingName[] = ['standard', 'entrance', 'exit', 'emphasized', 'linear'];
const DURATION_KEYS = ['instant', 'fast', 'base', 'slow'] as const;
const CYCLE_KEYS = ['pulse', 'spin', 'sweep'] as const;

function pickNumbers<K extends string>(
  source: Record<string, number> | undefined,
  keys: readonly K[],
): Partial<Record<K, number>> | undefined {
  if (!source) return undefined;
  const out: Partial<Record<K, number>> = {};
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'number' && Number.isFinite(value)) out[key] = value;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

/** Map the file's `motion` block onto ThemeProvider motion overrides. */
function mapMotion(
  fileMotion: CastThemeFile['motion'],
): MotionOverrides | undefined {
  if (!fileMotion || typeof fileMotion !== 'object') return undefined;
  const out: MotionOverrides = {};

  const durations = pickNumbers(fileMotion.duration, DURATION_KEYS);
  if (durations) out.duration = durations;
  const cycles = pickNumbers(fileMotion.cycle, CYCLE_KEYS);
  if (cycles) out.cycle = cycles;

  if (fileMotion.easing) {
    const beziers: NonNullable<MotionOverrides['easingBezier']> = {};
    for (const name of EASING_NAMES) {
      const pts = fileMotion.easing[name];
      if (
        Array.isArray(pts) &&
        pts.length === 4 &&
        pts.every((n) => typeof n === 'number' && Number.isFinite(n))
      ) {
        beziers[name] = [pts[0], pts[1], pts[2], pts[3]];
      }
    }
    if (Object.keys(beziers).length > 0) out.easingBezier = beziers;
  }

  const overlay = fileMotion.spring?.overlay;
  if (overlay && typeof overlay === 'object') {
    const springOut: { damping?: number; stiffness?: number; mass?: number } = {};
    if (typeof overlay.damping === 'number') springOut.damping = overlay.damping;
    if (typeof overlay.stiffness === 'number') springOut.stiffness = overlay.stiffness;
    if (typeof overlay.mass === 'number') springOut.mass = overlay.mass;
    if (Object.keys(springOut).length > 0) out.spring = { overlay: springOut };
  }

  const press = fileMotion.feedback?.press;
  const shake = fileMotion.feedback?.shake;
  const fb: NonNullable<MotionOverrides['feedback']> = {};
  if (press && typeof press.scale === 'number') fb.press = { scale: press.scale };
  if (shake && typeof shake.amplitude === 'number') fb.shake = { amplitude: shake.amplitude };
  if (Object.keys(fb).length > 0) out.feedback = fb;

  const pulse = fileMotion.loop?.pulse;
  if (pulse && typeof pulse === 'object') {
    const pulseOut: { from?: number; to?: number } = {};
    if (typeof pulse.from === 'number') pulseOut.from = pulse.from;
    if (typeof pulse.to === 'number') pulseOut.to = pulse.to;
    if (Object.keys(pulseOut).length > 0) out.loop = { pulse: pulseOut };
  }

  return Object.keys(out).length > 0 ? out : undefined;
}

/** Map the file's `text` block onto the scheme's `text` slots (matching keys only). */
function mapText(
  fileText: Record<string, string> | undefined,
): DeepPartial<ColorScheme>['text'] | undefined {
  if (!fileText) return undefined;
  const out: Record<string, string> = {};
  // Only keys the runtime scheme actually has. `muted` has no scheme slot, so
  // it's intentionally dropped rather than guessed.
  if (typeof fileText.primary === 'string') out.primary = fileText.primary;
  if (typeof fileText.description === 'string') out.description = fileText.description;
  if (typeof fileText.placeholder === 'string') out.placeholder = fileText.placeholder;
  // `muted` has no runtime scheme slot, so it is intentionally dropped.
  return Object.keys(out).length > 0 ? out : undefined;
}

/** One mode's surface block as it appears in a cast-theme file. */
type FileSurface = {
  base?: string;
  subtle?: string;
  overlay?: { bg?: string; border?: string };
};

/** Map the file's `surface` block onto the scheme's surface colours. */
function mapSurface(
  fileSurface: FileSurface | undefined,
): DeepPartial<ColorScheme>['surface'] | undefined {
  if (!fileSurface) return undefined;
  const out: { base?: string; subtle?: string; overlay?: { bg?: string; border?: string } } = {};
  if (typeof fileSurface.base === 'string') out.base = fileSurface.base;
  if (typeof fileSurface.subtle === 'string') out.subtle = fileSurface.subtle;
  if (fileSurface.overlay) {
    const overlay: { bg?: string; border?: string } = {};
    if (typeof fileSurface.overlay.bg === 'string') overlay.bg = fileSurface.overlay.bg;
    if (typeof fileSurface.overlay.border === 'string') overlay.border = fileSurface.overlay.border;
    if (Object.keys(overlay).length > 0) out.overlay = overlay;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

/**
 * Map the file's fonts onto the ThemeProvider `fonts` prop. Reads a top-level
 * `fonts` block first, then falls back to `typography.fontFamily`. Fonts are
 * mode-independent, so this is not keyed by colour mode.
 */
function mapFonts(theme: CastThemeFile): Partial<FontFamilyTokens> | undefined {
  const direct = theme?.fonts as Record<string, unknown> | undefined;
  const typo = theme?.typography as { fontFamily?: Record<string, unknown> } | undefined;
  const fromTypo =
    typo && typeof typo.fontFamily === 'object' && typo.fontFamily
      ? (typo.fontFamily as Record<string, unknown>)
      : undefined;
  const pick = (key: string): string | undefined => {
    const d = direct?.[key];
    if (typeof d === 'string' && d.trim()) return d;
    const t = fromTypo?.[key];
    if (typeof t === 'string' && t.trim()) return t;
    return undefined;
  };
  const out: Partial<FontFamilyTokens> = {};
  const sans = pick('sans');
  const mono = pick('mono');
  const serif = pick('serif');
  const heading = typeof fromTypo?.heading === 'string' ? (fromTypo.heading as string) : undefined;
  const display = pick('display') ?? heading;
  if (sans) out.sans = sans;
  if (mono) out.mono = mono;
  if (serif) out.serif = serif;
  if (display) out.display = display;
  return Object.keys(out).length > 0 ? out : undefined;
}

/**
 * Build ThemeProvider props from a cast-theme file for a given colour mode.
 *
 * @param theme  The parsed `cast-theme.json` object.
 * @param mode   The colour mode to render — defaults to `'light'`.
 */
export function applyCastTheme(
  theme: CastThemeFile,
  mode: ColorMode = 'light',
): CastThemeProps {
  const intents = theme?.colors?.[mode] as ThemeProviderProps['colors'] | undefined;

  const schemeOverride: DeepPartial<ColorScheme> = {};
  const text = mapText(theme?.text?.[mode]);
  if (text) schemeOverride.text = text;
  const surface = mapSurface(theme?.surface?.[mode]);
  if (surface) schemeOverride.surface = surface;
  const ring = theme?.focusRing?.[mode];
  if (ring && typeof ring.color === 'string') schemeOverride.focusRing = { color: ring.color };

  const density =
    theme?.density === 'compact' ||
    theme?.density === 'default' ||
    theme?.density === 'comfortable'
      ? theme.density
      : undefined;

  return {
    colorMode: mode,
    colors: intents,
    scheme: Object.keys(schemeOverride).length > 0 ? schemeOverride : undefined,
    motion: mapMotion(theme?.motion),
    fonts: mapFonts(theme),
    density,
  };
}
