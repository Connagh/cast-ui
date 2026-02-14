import React, { createContext, useContext } from 'react';
import type { AtlasTheme } from './types';
import { whiteLabel } from '../tokens/generated';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ThemeContext = createContext<AtlasTheme>(whiteLabel);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export interface AtlasThemeProviderProps {
  /** The theme object to provide. Defaults to White Label. */
  theme?: AtlasTheme;
  children: React.ReactNode;
}

/**
 * Wraps the component tree with the selected Atlas theme.
 *
 * ```tsx
 * import { AtlasThemeProvider } from 'atlas-design-system';
 * import { consumer } from 'atlas-design-system/tokens/generated';
 *
 * <AtlasThemeProvider theme={consumer}>
 *   <App />
 * </AtlasThemeProvider>
 * ```
 */
export function AtlasThemeProvider({
  theme = whiteLabel,
  children,
}: AtlasThemeProviderProps) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Returns the current Atlas theme object.
 *
 * Must be called inside an `<AtlasThemeProvider>`.
 *
 * ```tsx
 * const theme = useTheme();
 * <View style={{ backgroundColor: theme.semantic.color.surface }} />
 * ```
 */
export function useTheme(): AtlasTheme {
  return useContext(ThemeContext);
}
