/**
 * ThemeProvider — wraps your app to enable density theming and colour customisation.
 *
 * @example Basic usage — switch density
 * ```tsx
 * import { ThemeProvider } from '@castui/cast-ui';
 *
 * <ThemeProvider density="comfortable">
 *   <App />
 * </ThemeProvider>
 * ```
 *
 * @example Rebrand — override intent colours
 * ```tsx
 * <ThemeProvider
 *   density="default"
 *   colors={{
 *     brand: {
 *       bold: {
 *         default: { bg: '#7C3AED', fg: '#FFFFFF', border: '#7C3AED' },
 *         hover:   { bg: '#6D28D9', fg: '#FFFFFF', border: '#6D28D9' },
 *         active:  { bg: '#5B21B6', fg: '#FFFFFF', border: '#5B21B6' },
 *       },
 *     },
 *   }}
 * >
 *   <App />
 * </ThemeProvider>
 * ```
 */

import React, { createContext, useContext, useMemo } from 'react';
import { themes } from './themes';
import {
  intentColors as defaultIntentColors,
  disabledColors as defaultDisabledColors,
} from '../tokens/colors';
import type { IntentName } from '../tokens/colors';
import type { DensityTheme, ComponentTokens, DeepPartial } from './types';

// ---------------------------------------------------------------------------
// Theme shape
// ---------------------------------------------------------------------------

type IntentColorMap = typeof defaultIntentColors;

export type Theme = {
  density: DensityTheme;
  components: ComponentTokens;
  colors: IntentColorMap;
  disabledColors: typeof defaultDisabledColors;
};

// ---------------------------------------------------------------------------
// Deep merge utility (for partial colour overrides)
// ---------------------------------------------------------------------------

function deepMerge<T extends Record<string, unknown>>(
  base: T,
  overrides: Record<string, unknown>,
): T {
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(overrides)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
    const baseVal = base[key];
    const overVal = overrides[key];
    if (
      overVal &&
      typeof overVal === 'object' &&
      !Array.isArray(overVal) &&
      baseVal &&
      typeof baseVal === 'object'
    ) {
      result[key] = deepMerge(
        baseVal as Record<string, unknown>,
        overVal as Record<string, unknown>,
      );
    } else {
      result[key] = overVal;
    }
  }
  return result as T;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const defaultTheme: Theme = {
  density: 'default',
  components: themes.default,
  colors: defaultIntentColors,
  disabledColors: defaultDisabledColors,
};

const ThemeContext = createContext<Theme>(defaultTheme);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export type ThemeProviderProps = {
  /** Density theme — controls spacing and padding across all components. */
  density?: DensityTheme;
  /**
   * Partial colour overrides — deep-merged with the default intent colours.
   * Only provide the values you want to change; everything else stays default.
   */
  colors?: Partial<Record<IntentName, DeepPartial<IntentColorMap[IntentName]>>>;
  children: React.ReactNode;
};

export function ThemeProvider({
  density = 'default',
  colors,
  children,
}: ThemeProviderProps) {
  const theme = useMemo<Theme>(() => {
    const resolvedColors = colors
      ? deepMerge(defaultIntentColors, colors as Record<string, unknown>)
      : defaultIntentColors;

    return {
      density,
      components: themes[density],
      colors: resolvedColors as IntentColorMap,
      disabledColors: defaultDisabledColors,
    };
  }, [density, colors]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Access the current theme — density tokens, intent colours, and component tokens.
 * Must be called within a ThemeProvider; falls back to the "default" density if not.
 */
export function useTheme(): Theme {
  return useContext(ThemeContext);
}
