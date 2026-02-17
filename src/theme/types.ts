/**
 * Cast Design System theme type.
 *
 * Every theme conforms to this interface. The library ships a Default base
 * theme; consumers create custom themes via `createTheme()` with partial
 * overrides. Components consume tokens via `useTheme()` and reference
 * properties from the semantic and component layers.
 *
 * Generated theme objects resolve all Figma token aliases to final values.
 */

// ---------------------------------------------------------------------------
// Semantic layer
// ---------------------------------------------------------------------------

export interface SemanticColors {
  surface: string;
  onSurface: string;
  onSurfaceMuted: string;
  surfaceContainer: string;

  primary: string;
  onPrimary: string;
  primaryHover: string;
  primaryPressed: string;

  secondary: string;
  onSecondary: string;

  success: string;
  onSuccess: string;
  error: string;
  onError: string;
  warning: string;
  onWarning: string;

  border: string;
  borderSubtle: string;

  disabledContainer: string;
  onDisabled: string;

  primaryContainer: string;
  onPrimaryContainer: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  errorContainer: string;
  onErrorContainer: string;
  successContainer: string;
  onSuccessContainer: string;
  warningContainer: string;
  onWarningContainer: string;
}

export interface SemanticFontFamily {
  /** Brand typeface for headlines and marketing. */
  brand: string;
  /** UI typeface for body text and controls. */
  interface: string;
  /** Monospaced typeface for code and data. */
  data: string;
}

export interface SemanticFontSize {
  display: number;
  h1: number;
  h2: number;
  h3: number;
  body: number;
  small: number;
  button: number;
}

export interface SemanticFontWeight {
  heading: number;
  body: number;
  button: number;
}

export interface SemanticLineHeight {
  heading: number;
  body: number;
  uiLabel: number;
}

export interface SemanticLetterSpacing {
  heading: number;
  body: number;
  label: number;
}

export interface SemanticParagraphSpacing {
  body: number;
  editorial: number;
}

export interface SemanticParagraphIndent {
  editorial: number;
}

export interface SemanticBorderRadius {
  small: number;
  medium: number;
  large: number;
}

export interface SemanticTokens {
  color: SemanticColors;
  fontFamily: SemanticFontFamily;
  fontSize: SemanticFontSize;
  fontWeight: SemanticFontWeight;
  lineHeight: SemanticLineHeight;
  letterSpacing: SemanticLetterSpacing;
  paragraphSpacing: SemanticParagraphSpacing;
  paragraphIndent: SemanticParagraphIndent;
  borderRadius: SemanticBorderRadius;
}

// ---------------------------------------------------------------------------
// Component layer
// ---------------------------------------------------------------------------

export interface ButtonVariantTokens {
  background: string;
  content: string;
}

export interface ButtonOutlineTokens extends ButtonVariantTokens {
  border: string;
}

export interface ButtonStateTokens {
  hoverBackground: string;
  pressedBackground: string;
  disabledBackground: string;
  disabledContent: string;
}

export interface ButtonTokens {
  paddingHorizontal: number;
  paddingVertical: number;
  gap: number;
  cornerRadius: number;
  borderWidth: number;
  textSize: number;
  fontWeight: number;
  lineHeight: number;
  fontFamily: string;
  filled: ButtonVariantTokens;
  outline: ButtonOutlineTokens;
  text: ButtonVariantTokens;
  state: ButtonStateTokens;
}

export interface CardTokens {
  padding: number;
  gap: number;
  background: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius: number;
  elevation: number;
  headingSize: number;
  headingWeight: number;
  headingFontFamily: string;
  bodySize: number;
  bodyWeight: number;
  bodyFontFamily: string;
}

export interface ComponentTokens {
  button: ButtonTokens;
  card: CardTokens;
}

// ---------------------------------------------------------------------------
// Full theme
// ---------------------------------------------------------------------------

export type ThemeName = string;

export interface CastTheme {
  name: ThemeName;
  semantic: SemanticTokens;
  component: ComponentTokens;
}
