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

import type { DeepPartial } from './types';
import type { ThemeProviderProps } from './ThemeContext';
import type { ColorMode, ColorScheme, IntentName } from '../tokens/colors';

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
  /** Theme-file format version emitted by the plugin (currently 3). */
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
  shadows?: Record<string, unknown>;
  [key: string]: unknown;
};

/** The subset of ThemeProvider props this helper produces. */
export type CastThemeProps = Pick<
  ThemeProviderProps,
  'colorMode' | 'colors' | 'scheme'
>;

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

  return {
    colorMode: mode,
    colors: intents,
    scheme: Object.keys(schemeOverride).length > 0 ? schemeOverride : undefined,
  };
}
