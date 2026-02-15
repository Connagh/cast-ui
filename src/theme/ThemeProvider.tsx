import React, { createContext, useContext } from 'react';
import type { CastTheme } from './types';
import { whiteLabel } from '../tokens/generated';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ThemeContext = createContext<CastTheme>(whiteLabel);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export interface CastThemeProviderProps {
  /** The theme object to provide. Defaults to White Label. */
  theme?: CastTheme;
  children: React.ReactNode;
}

/**
 * Wraps the component tree with the selected Cast theme.
 *
 * ```tsx
 * import { CastThemeProvider } from '@castui/cast-ui';
 * import { consumer } from '@castui/cast-ui/tokens/generated';
 *
 * <CastThemeProvider theme={consumer}>
 *   <App />
 * </CastThemeProvider>
 * ```
 */
export function CastThemeProvider({
  theme = whiteLabel,
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
