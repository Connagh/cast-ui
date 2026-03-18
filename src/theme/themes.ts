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
