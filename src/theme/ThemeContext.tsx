/**
 * ThemeProvider — wraps your app to enable density theming, light/dark colour
 * modes, and colour customisation.
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
 * @example Dark mode
 * ```tsx
 * <ThemeProvider colorMode="dark">
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
  colorSchemes,
  intentColors as defaultIntentColors,
} from '../tokens/colors';
import type { ColorMode, ColorScheme, IntentName } from '../tokens/colors';
import type { DensityTheme, ComponentTokens, DeepPartial } from './types';

// ---------------------------------------------------------------------------
// Theme shape
// ---------------------------------------------------------------------------

type IntentColorMap = typeof defaultIntentColors;

export type Theme = {
  density: DensityTheme;
  components: ComponentTokens;
  /** Active colour mode — light or dark. */
  colorMode: ColorMode;
  /** Full resolved colour scheme for the active mode (overrides applied). */
  scheme: ColorScheme;
  /** Intent colours of the active scheme — kept for backwards compatibility. */
  colors: IntentColorMap;
  /** Disabled colours of the active scheme — kept for backwards compatibility. */
  disabledColors: ColorScheme['disabled'];
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
  colorMode: 'light',
  scheme: colorSchemes.light,
  colors: colorSchemes.light.intents,
  disabledColors: colorSchemes.light.disabled,
};

const ThemeContext = createContext<Theme>(defaultTheme);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export type ThemeProviderProps = {
  /** Density theme — controls spacing and padding across all components. */
  density?: DensityTheme;
  /** Colour mode — switches between the light and dark colour schemes. */
  colorMode?: ColorMode;
  /**
   * Partial colour overrides — deep-merged with the active scheme's intent
   * colours. Only provide the values you want to change; everything else
   * stays default.
   */
  colors?: Partial<Record<IntentName, DeepPartial<IntentColorMap[IntentName]>>>;
  children: React.ReactNode;
};

export function ThemeProvider({
  density = 'default',
  colorMode = 'light',
  colors,
  children,
}: ThemeProviderProps) {
  const theme = useMemo<Theme>(() => {
    const baseScheme = colorSchemes[colorMode];
    const resolvedIntents = colors
      ? deepMerge(baseScheme.intents, colors as Record<string, unknown>)
      : baseScheme.intents;
    const scheme: ColorScheme = colors
      ? { ...baseScheme, intents: resolvedIntents }
      : baseScheme;

    return {
      density,
      components: themes[density],
      colorMode,
      scheme,
      colors: resolvedIntents as IntentColorMap,
      disabledColors: scheme.disabled,
    };
  }, [density, colorMode, colors]);

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
