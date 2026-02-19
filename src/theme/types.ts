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

export interface SemanticColours {
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
  subtitle: number;
  body: number;
  small: number;
  caption: number;
  overline: number;
  label: number;
  button: number;
}

export interface SemanticFontWeight {
  heading: number;
  body: number;
  button: number;
}

export interface SemanticLineHeight {
  display: number;
  h1: number;
  h2: number;
  h3: number;
  subtitle: number;
  body: number;
  small: number;
  caption: number;
  overline: number;
  label: number;
  button: number;
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
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface SemanticBorderWidth {
  thin: number;
  medium: number;
}

export interface SemanticElevation {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface SemanticSize {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

export interface SemanticOpacity {
  disabled: number;
  overlay: number;
}

export interface SemanticTokens {
  colour: SemanticColours;
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

// -- Button -----------------------------------------------------------------

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

// -- Card -------------------------------------------------------------------

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
  headingLineHeight: number;
  headingFontFamily: string;
  headingColour: string;
  bodySize: number;
  bodyWeight: number;
  bodyLineHeight: number;
  bodyFontFamily: string;
  bodyColour: string;
}

// -- TextField --------------------------------------------------------------

export interface TextFieldTokens {
  paddingHorizontal: number;
  paddingVertical: number;
  cornerRadius: number;
  borderWidth: number;
  background: string;
  borderColour: string;
  focusBorderColour: string;
  errorBorderColour: string;
  textColour: string;
  placeholderColour: string;
  textSize: number;
  textFontWeight: number;
  textLineHeight: number;
  fontFamily: string;
  labelColour: string;
  labelSize: number;
  labelFontWeight: number;
  labelLineHeight: number;
  labelFontFamily: string;
  helperColour: string;
  helperSize: number;
  helperFontWeight: number;
  helperLineHeight: number;
  helperFontFamily: string;
  errorColour: string;
}

// -- Checkbox ---------------------------------------------------------------

export interface CheckboxTokens {
  size: number;
  cornerRadius: number;
  borderWidth: number;
  gap: number;
  borderColour: string;
  checkedBackground: string;
  checkedIconColour: string;
  labelColour: string;
  labelSize: number;
  labelFontWeight: number;
  labelLineHeight: number;
  labelFontFamily: string;
  disabledOpacity: number;
}

// -- FAB --------------------------------------------------------------------

export interface FABTokens {
  size: number;
  cornerRadius: number;
  background: string;
  iconColour: string;
  iconSize: number;
  hoverBackground: string;
  pressedBackground: string;
  elevation: number;
  extendedPaddingHorizontal: number;
  extendedGap: number;
}

// -- Autocomplete -----------------------------------------------------------

export interface AutocompleteTokens {
  dropdownBackground: string;
  dropdownCornerRadius: number;
  dropdownElevation: number;
  optionHoverBackground: string;
  optionTextColour: string;
  optionTextSize: number;
  optionFontWeight: number;
  optionLineHeight: number;
  optionPaddingHorizontal: number;
  optionPaddingVertical: number;
  fontFamily: string;
}

// -- Select -----------------------------------------------------------------

export interface SelectTokens {
  dropdownBackground: string;
  dropdownCornerRadius: number;
  dropdownElevation: number;
  optionHoverBackground: string;
  indicatorColour: string;
  optionTextColour: string;
  optionTextSize: number;
  optionFontWeight: number;
  optionLineHeight: number;
  optionPaddingHorizontal: number;
  optionPaddingVertical: number;
  fontFamily: string;
  selectedOptionBackground: string;
}

// -- Switch -----------------------------------------------------------------

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
  labelColour: string;
  labelSize: number;
  labelFontWeight: number;
  labelLineHeight: number;
  labelFontFamily: string;
  gap: number;
}

// -- Badge ------------------------------------------------------------------

export interface BadgeTokens {
  minSize: number;
  paddingHorizontal: number;
  cornerRadius: number;
  background: string;
  contentColour: string;
  textSize: number;
  fontWeight: number;
  lineHeight: number;
  fontFamily: string;
}

// -- Chip -------------------------------------------------------------------

export interface ChipTokens {
  paddingHorizontal: number;
  paddingVertical: number;
  gap: number;
  cornerRadius: number;
  background: string;
  contentColour: string;
  selectedBackground: string;
  selectedContentColour: string;
  borderWidth: number;
  borderColour: string;
  textSize: number;
  fontWeight: number;
  lineHeight: number;
  fontFamily: string;
}

// -- Divider ----------------------------------------------------------------

export interface DividerTokens {
  colour: string;
  thickness: number;
  margin: number;
}

// -- Icon -------------------------------------------------------------------

export interface IconTokens {
  sizeSmall: number;
  sizeMedium: number;
  sizeLarge: number;
}

// -- Table ------------------------------------------------------------------

export interface TableTokens {
  headerBackground: string;
  headerTextColour: string;
  headerFontWeight: number;
  headerTextSize: number;
  headerLineHeight: number;
  cellTextColour: string;
  cellTextSize: number;
  cellFontWeight: number;
  cellLineHeight: number;
  cellPaddingHorizontal: number;
  cellPaddingVertical: number;
  rowBorderColour: string;
  rowBorderWidth: number;
  rowHoverBackground: string;
  cornerRadius: number;
  fontFamily: string;
}

// -- Alert ------------------------------------------------------------------

export interface AlertTokens {
  padding: number;
  gap: number;
  cornerRadius: number;
  borderWidth: number;
  background: string;
  borderColour: string;
  titleColour: string;
  bodyColour: string;
  iconColour: string;
  fontFamily: string;
  iconSize: number;
  titleSize: number;
  titleFontWeight: number;
  titleLineHeight: number;
  bodySize: number;
  bodyFontWeight: number;
  bodyLineHeight: number;
}

// -- Backdrop ---------------------------------------------------------------

export interface BackdropTokens {
  colour: string;
  opacity: number;
}

// -- Skeleton ---------------------------------------------------------------

export interface SkeletonTokens {
  background: string;
  highlight: string;
  cornerRadius: number;
  circleSize: number;
}

// -- Snackbar ---------------------------------------------------------------

export interface SnackbarTokens {
  background: string;
  contentColour: string;
  actionColour: string;
  padding: number;
  gap: number;
  cornerRadius: number;
  elevation: number;
  textSize: number;
  fontWeight: number;
  lineHeight: number;
  fontFamily: string;
}

// -- Dialog -----------------------------------------------------------------

export interface DialogTokens {
  background: string;
  cornerRadius: number;
  padding: number;
  gap: number;
  elevation: number;
  titleSize: number;
  titleFontWeight: number;
  titleLineHeight: number;
  titleFontFamily: string;
  titleColour: string;
  bodySize: number;
  bodyFontWeight: number;
  bodyLineHeight: number;
  bodyFontFamily: string;
  bodyColour: string;
}

// -- AppBar -----------------------------------------------------------------

export interface AppBarTokens {
  height: number;
  paddingHorizontal: number;
  background: string;
  titleColour: string;
  titleSize: number;
  titleFontWeight: number;
  titleLineHeight: number;
  titleFontFamily: string;
  iconColour: string;
  borderColour: string;
  elevation: number;
}

// -- Link -------------------------------------------------------------------

export interface LinkTokens {
  colour: string;
  hoverColour: string;
  visitedColour: string;
  underlineOffset: number;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  fontFamily: string;
}

// -- SpeedDial --------------------------------------------------------------

export interface SpeedDialTokens {
  actionSize: number;
  actionBackground: string;
  actionIconColour: string;
  actionIconSize: number;
  actionCornerRadius: number;
  gap: number;
  actionElevation: number;
}

// -- ComponentTokens (aggregate) --------------------------------------------

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
