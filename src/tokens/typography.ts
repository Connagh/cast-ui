/**
 * Typography tokens — derived from primitive.tokens.json + semantic.tokens.json
 *
 * Source tokens:
 *   font-family/{sans|mono|serif}
 *   font-weight/{light|regular|medium|semibold|bold}
 *   label/{sm|md|lg} → fontSize, lineHeight, letterSpacing
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

export const label: Record<
  LabelSize,
  { fontSize: number; lineHeight: number; letterSpacing: number }
> = {
  sm: { fontSize: 12, lineHeight: 16, letterSpacing: 0.25 },
  md: { fontSize: 14, lineHeight: 20, letterSpacing: 0 },
  lg: { fontSize: 16, lineHeight: 24, letterSpacing: 0 },
};
