/**
 * Density theme definitions — extracted from component token files.
 *
 * Source files:
 *   design-tokens/component/component-compact.tokens.json
 *   design-tokens/component/component-default.tokens.json
 *   design-tokens/component/component-comfortable.tokens.json
 *
 * Values verified against Figma variable defs.
 * Only spacing/sizing tokens live here — colours are constant across densities.
 */

import type { DensityTheme, ComponentTokens } from './types';

export const themes: Record<DensityTheme, ComponentTokens> = {
  compact: {
    dialog: {
      small:   { padding: 16, gap: 12, iconSize: 24 },
      default: { padding: 24, gap: 16, iconSize: 32 },
      large:   { padding: 32, gap: 24, iconSize: 40 },
    },
    button: {
      small: {
        gap: 4,
        paddingX: 6,
        paddingY: 2,
        borderRadius: 8,
        focusRingWidth: 2,
        focusRingOffset: 2,
      },
      default: {
        gap: 8,
        paddingX: 10,
        paddingY: 6,
        borderRadius: 8,
        focusRingWidth: 2,
        focusRingOffset: 2,
      },
      large: {
        gap: 16,
        paddingX: 20,
        paddingY: 14,
        borderRadius: 8,
        focusRingWidth: 2,
        focusRingOffset: 2,
      },
    },
  },

  default: {
    dialog: {
      small:   { padding: 24, gap: 16, iconSize: 24 },
      default: { padding: 32, gap: 24, iconSize: 32 },
      large:   { padding: 40, gap: 32, iconSize: 40 },
    },
    button: {
      small: {
        gap: 8,
        paddingX: 10,
        paddingY: 6,
        borderRadius: 8,
        focusRingWidth: 2,
        focusRingOffset: 2,
      },
      default: {
        gap: 12,
        paddingX: 14,
        paddingY: 10,
        borderRadius: 8,
        focusRingWidth: 2,
        focusRingOffset: 2,
      },
      large: {
        gap: 20,
        paddingX: 24,
        paddingY: 16,
        borderRadius: 8,
        focusRingWidth: 2,
        focusRingOffset: 2,
      },
    },
  },

  comfortable: {
    dialog: {
      small:   { padding: 40, gap: 24, iconSize: 24 },
      default: { padding: 40, gap: 32, iconSize: 32 },
      large:   { padding: 48, gap: 40, iconSize: 40 },
    },
    button: {
      small: {
        gap: 12,
        paddingX: 14,
        paddingY: 10,
        borderRadius: 8,
        focusRingWidth: 2,
        focusRingOffset: 2,
      },
      default: {
        gap: 16,
        paddingX: 20,
        paddingY: 14,
        borderRadius: 8,
        focusRingWidth: 2,
        focusRingOffset: 2,
      },
      large: {
        gap: 24,
        paddingX: 32,
        paddingY: 20,
        borderRadius: 8,
        focusRingWidth: 2,
        focusRingOffset: 2,
      },
    },
  },
};
