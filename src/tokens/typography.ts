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
  sans: Platform.select({ web: 'Inter, system-ui, sans-serif', default: 'Inter' }),
  mono: Platform.select({
    web: '"JetBrains Mono", monospace',
    default: 'JetBrains Mono',
  }),
  serif: Platform.select({ web: '"Noto Serif", serif', default: 'Noto Serif' }),
} as const;

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
