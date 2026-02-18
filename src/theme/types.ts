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

  overlay: string;
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
  full: number;
}

export interface SemanticSpacing {
  xs: number;   // 4
  sm: number;   // 8
  md: number;   // 12
  lg: number;   // 16
  xl: number;   // 24
}

export interface SemanticBorderWidth {
  thin: number;   // 1
  medium: number;  // 2
}

export interface SemanticElevation {
  none: number;  // 0
  xs: number;    // 1
  sm: number;    // 2
  md: number;    // 3
  lg: number;    // 4
  xl: number;    // 6
}

export interface SemanticSize {
  xs: number;    // 2
  sm: number;    // 4
  md: number;    // 16
  lg: number;    // 24
  xl: number;    // 32
  xxl: number;   // 48
  xxxl: number;  // 64
}

export interface SemanticOpacity {
  disabled: number;  // 0.4
  overlay: number;   // 0.5
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
  spacing: SemanticSpacing;
  borderWidth: SemanticBorderWidth;
  elevation: SemanticElevation;
  size: SemanticSize;
  opacity: SemanticOpacity;
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
  headingColor: string;
  bodySize: number;
  bodyWeight: number;
  bodyFontFamily: string;
  bodyColor: string;
}

export interface TextFieldTokens {
  paddingHorizontal: number;
  paddingVertical: number;
  cornerRadius: number;
  borderWidth: number;
  background: string;
  borderColor: string;
  focusBorderColor: string;
  errorBorderColor: string;
  textColor: string;
  placeholderColor: string;
  textSize: number;
  fontFamily: string;
  labelColor: string;
  labelSize: number;
  helperColor: string;
  helperSize: number;
  errorColor: string;
}

export interface CheckboxTokens {
  size: number;
  cornerRadius: number;
  borderWidth: number;
  gap: number;
  borderColor: string;
  checkedBackground: string;
  checkedIconColor: string;
  labelColor: string;
  labelSize: number;
  labelFontFamily: string;
  disabledOpacity: number;
}

export interface FABTokens {
  size: number;
  cornerRadius: number;
  background: string;
  iconColor: string;
  iconSize: number;
  hoverBackground: string;
  pressedBackground: string;
  elevation: number;
  extendedPaddingHorizontal: number;
  extendedGap: number;
}

export interface AutocompleteTokens {
  dropdownBackground: string;
  dropdownCornerRadius: number;
  dropdownElevation: number;
  optionHoverBackground: string;
  optionTextColor: string;
  optionTextSize: number;
  optionPaddingHorizontal: number;
  optionPaddingVertical: number;
  fontFamily: string;
}

export interface SelectTokens {
  dropdownBackground: string;
  dropdownCornerRadius: number;
  dropdownElevation: number;
  optionHoverBackground: string;
  indicatorColor: string;
  optionTextColor: string;
  optionTextSize: number;
  optionPaddingHorizontal: number;
  optionPaddingVertical: number;
  fontFamily: string;
  selectedOptionBackground: string;
}

export interface SwitchTokens {
  trackWidth: number;
  trackHeight: number;
  trackCornerRadius: number;
  trackOffBackground: string;
  trackOnBackground: string;
  thumbSize: number;
  thumbCornerRadius: number;
  thumbOffBackground: string;
  thumbOnBackground: string;
  thumbOffset: number;
  labelColor: string;
  labelSize: number;
  labelFontFamily: string;
  gap: number;
}

export interface BadgeTokens {
  minSize: number;
  paddingHorizontal: number;
  cornerRadius: number;
  background: string;
  contentColor: string;
  textSize: number;
  fontWeight: number;
  fontFamily: string;
}

export interface ChipTokens {
  paddingHorizontal: number;
  paddingVertical: number;
  gap: number;
  cornerRadius: number;
  background: string;
  contentColor: string;
  selectedBackground: string;
  selectedContentColor: string;
  borderWidth: number;
  borderColor: string;
  textSize: number;
  fontFamily: string;
}

export interface DividerTokens {
  color: string;
  thickness: number;
  margin: number;
}

export interface IconTokens {
  sizeSmall: number;
  sizeMedium: number;
  sizeLarge: number;
}

export interface TableTokens {
  headerBackground: string;
  headerTextColor: string;
  headerFontWeight: number;
  headerTextSize: number;
  cellTextColor: string;
  cellTextSize: number;
  cellPaddingHorizontal: number;
  cellPaddingVertical: number;
  rowBorderColor: string;
  rowBorderWidth: number;
  rowHoverBackground: string;
  cornerRadius: number;
  fontFamily: string;
}

export interface AlertTokens {
  padding: number;
  gap: number;
  cornerRadius: number;
  borderWidth: number;
  background: string;
  borderColor: string;
  titleColor: string;
  bodyColor: string;
  iconColor: string;
  fontFamily: string;
  iconSize: number;
  titleSize: number;
  titleFontWeight: number;
  bodySize: number;
}

export interface BackdropTokens {
  color: string;
  opacity: number;
}

export interface SkeletonTokens {
  background: string;
  highlight: string;
  cornerRadius: number;
  circleSize: number;
}

export interface SnackbarTokens {
  background: string;
  contentColor: string;
  actionColor: string;
  padding: number;
  gap: number;
  cornerRadius: number;
  elevation: number;
  textSize: number;
  fontWeight: number;
  fontFamily: string;
}

export interface DialogTokens {
  background: string;
  cornerRadius: number;
  padding: number;
  gap: number;
  elevation: number;
  titleSize: number;
  titleFontWeight: number;
  titleFontFamily: string;
  titleColor: string;
  bodySize: number;
  bodyFontFamily: string;
  bodyColor: string;
}

export interface AppBarTokens {
  height: number;
  paddingHorizontal: number;
  background: string;
  titleColor: string;
  titleSize: number;
  titleFontWeight: number;
  titleFontFamily: string;
  iconColor: string;
  borderColor: string;
  elevation: number;
}

export interface LinkTokens {
  color: string;
  hoverColor: string;
  visitedColor: string;
  underlineOffset: number;
  fontWeight: number;
}

export interface SpeedDialTokens {
  actionSize: number;
  actionBackground: string;
  actionIconColor: string;
  actionIconSize: number;
  actionCornerRadius: number;
  gap: number;
  actionElevation: number;
}

export interface ComponentTokens {
  button: ButtonTokens;
  card: CardTokens;
  textField: TextFieldTokens;
  checkbox: CheckboxTokens;
  fab: FABTokens;
  autocomplete: AutocompleteTokens;
  select: SelectTokens;
  switch: SwitchTokens;
  badge: BadgeTokens;
  chip: ChipTokens;
  divider: DividerTokens;
  icon: IconTokens;
  table: TableTokens;
  alert: AlertTokens;
  backdrop: BackdropTokens;
  skeleton: SkeletonTokens;
  snackbar: SnackbarTokens;
  dialog: DialogTokens;
  appBar: AppBarTokens;
  link: LinkTokens;
  speedDial: SpeedDialTokens;
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
