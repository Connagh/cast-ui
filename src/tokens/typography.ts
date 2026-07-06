/**
 * Typography tokens — derived from primitive.tokens.json + semantic.tokens.json
 *
 * Source tokens:
 *   font-family/{sans|mono|serif}
 *   font-weight/{light|regular|medium|semibold|bold}
 *   label/{sm|md|lg}, title/{sm|md|lg}, body/{sm|md|lg} → fontSize, lineHeight, letterSpacing
 */

import { Platform } from 'react-native';

export const fontFamily = {
  sans: Platform.select({ web: 'Geist, system-ui, sans-serif', default: 'Geist' }),
  mono: Platform.select({
    web: '"JetBrains Mono", monospace',
    default: 'JetBrains Mono',
  }),
  serif: Platform.select({ web: '"Noto Serif", serif', default: 'Noto Serif' }),
} as const;

/**
 * Resolved font families the theme can carry. `sans` covers all body and label
 * text, `mono` code, `serif` is available for serif faces, and `display` is
 * used for heading and display type. Defaults make `display` follow `sans`, so
 * setting only `sans` reskins everything and adding `display` gives a heading
 * pairing. Fonts must be loaded by the app (see the Fonts docs); an unloaded
 * family falls back to the platform default with a dev-only warning.
 */
export type FontFamilyTokens = {
  sans: string;
  mono: string;
  serif: string;
  display: string;
};

/** The built-in font families. The ThemeProvider `fonts` prop overrides these. */
export const defaultFonts: FontFamilyTokens = {
  sans: fontFamily.sans as string,
  mono: fontFamily.mono as string,
  serif: fontFamily.serif as string,
  display: fontFamily.sans as string,
};

export const fontWeight = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export type LabelSize = 'sm' | 'md' | 'lg';

type TypographyScale = Record<
  'sm' | 'md' | 'lg',
  { fontSize: number; lineHeight: number; letterSpacing: number }
>;

export const label: TypographyScale = {
  sm: { fontSize: 12, lineHeight: 16, letterSpacing: 0.25 },
  md: { fontSize: 14, lineHeight: 20, letterSpacing: 0 },
  lg: { fontSize: 16, lineHeight: 24, letterSpacing: 0 },
};

export const title: TypographyScale = {
  sm: { fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  md: { fontSize: 18, lineHeight: 24, letterSpacing: 0 },
  lg: { fontSize: 20, lineHeight: 28, letterSpacing: 0 },
};

export const body: TypographyScale = {
  sm: { fontSize: 12, lineHeight: 18, letterSpacing: 0.25 },
  md: { fontSize: 14, lineHeight: 20, letterSpacing: 0 },
  lg: { fontSize: 16, lineHeight: 24, letterSpacing: 0 },
};

/** Heading scale — heading/{sm|md|lg}, rendered semibold */
export const heading: TypographyScale = {
  sm: { fontSize: 24, lineHeight: 32, letterSpacing: 0 },
  md: { fontSize: 30, lineHeight: 36, letterSpacing: -0.25 },
  lg: { fontSize: 36, lineHeight: 40, letterSpacing: -0.25 },
};

/** Display scale — display/{sm|md|lg}, hero/marketing sizes, rendered regular */
export const display: TypographyScale = {
  sm: { fontSize: 48, lineHeight: 56, letterSpacing: -0.25 },
  md: { fontSize: 60, lineHeight: 64, letterSpacing: -0.5 },
  lg: { fontSize: 72, lineHeight: 80, letterSpacing: -0.5 },
};

/** Caption scale — helper text, group labels, tags */
export const caption = { fontSize: 11, lineHeight: 16, letterSpacing: 0.5 } as const;
