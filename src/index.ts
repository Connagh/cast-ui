// ---------------------------------------------------------------------------
// Atlas Design System – Public API
// ---------------------------------------------------------------------------

// Theme system
export { AtlasThemeProvider, useTheme } from './theme';
export type { AtlasThemeProviderProps } from './theme';
export type {
  AtlasTheme,
  ThemeName,
  SemanticTokens,
  ComponentTokens,
  ButtonTokens,
} from './theme';
export { THEME_FONT_FAMILIES, googleFontsUrl } from './theme';

// Theme objects
export {
  whiteLabel,
  consumer,
  corporate,
  luxury,
} from './tokens/generated';

// Components
export { Button } from './components/Button/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button/Button';

