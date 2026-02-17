import React, { createContext, useContext } from 'react';
import type { CastTheme } from './types';
import { defaultTheme } from '../tokens/generated';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ThemeContext = createContext<CastTheme>(defaultTheme);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export interface CastThemeProviderProps {
  /** The theme object to provide. Defaults to the Default base theme. */
  theme?: CastTheme;
  children: React.ReactNode;
}

/**
 * Wraps the component tree with the selected Cast theme.
 *
 * ```tsx
 * import { CastThemeProvider, createTheme } from '@castui/cast-ui';
 * import overrides from './my-brand.json';
 *
 * const myTheme = createTheme(overrides);
 *
 * <CastThemeProvider theme={myTheme}>
 *   <App />
 * </CastThemeProvider>
 * ```
 */
export function CastThemeProvider({
  theme = defaultTheme,
  children,
}: CastThemeProviderProps) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Returns the current Cast theme object.
 *
 * Must be called inside an `<CastThemeProvider>`.
 *
 * ```tsx
 * const theme = useTheme();
 * <View style={{ backgroundColor: theme.semantic.color.surface }} />
 * ```
 */
export function useTheme(): CastTheme {
  return useContext(ThemeContext);
}
