/**
 * Theme type definitions for the Cast UI density system.
 *
 * The density axis controls spacing/sizing tokens only.
 * Colours and typography are constants — they don't change with density.
 */

export type DensityTheme = 'compact' | 'default' | 'comfortable';

/** Spacing/sizing tokens for a single button size variant */
export type ButtonSizeTokens = {
  gap: number;
  paddingX: number;
  paddingY: number;
  borderRadius: number;
};

/** All three button sizes */
export type ButtonThemeTokens = {
  small: ButtonSizeTokens;
  default: ButtonSizeTokens;
  large: ButtonSizeTokens;
};

/** Spacing/sizing tokens for a single dialog size variant */
export type DialogSizeTokens = {
  padding: number;
  gap: number;
  iconSize: number;
};

/** All three dialog sizes */
export type DialogThemeTokens = {
  small: DialogSizeTokens;
  default: DialogSizeTokens;
  large: DialogSizeTokens;
};

/** Spacing/sizing tokens for a single input size variant (used by Select trigger) */
export type InputSizeTokens = {
  gap: number;
  paddingX: number;
  paddingY: number;
  borderRadius: number;
};

/** All three input sizes + field gap */
export type InputThemeTokens = {
  fieldGap: number;
  small: InputSizeTokens;
  default: InputSizeTokens;
  large: InputSizeTokens;
};

/** Select dropdown content tokens */
export type SelectContentTokens = {
  paddingY: number;
};

/** Select option tokens */
export type SelectOptionTokens = {
  gap: number;
  paddingX: number;
  paddingY: number;
  borderRadius: number;
};

/** Select group tokens */
export type SelectGroupTokens = {
  paddingX: number;
  labelPaddingY: number;
};

/** Select separator tokens */
export type SelectSeparatorTokens = {
  marginY: number;
};

/** Combined select tokens */
export type SelectThemeTokens = {
  content: SelectContentTokens;
  option: SelectOptionTokens;
  group: SelectGroupTokens;
  separator: SelectSeparatorTokens;
};

/** List item tokens (icon size varies by density, unlike Button/Select) */
export type ListItemTokens = {
  gap: number;
  paddingX: number;
  paddingY: number;
  borderRadius: number;
  iconSize: number;
};

/** List subheader tokens */
export type ListSubheaderTokens = {
  paddingX: number;
  paddingY: number;
};

/** Combined list tokens */
export type ListThemeTokens = {
  sectionGap: number;
  item: ListItemTokens;
  subheader: ListSubheaderTokens;
};

/** Checkbox indicator/icon sizes for one size variant (constant across density) */
export type CheckboxSizeTokens = {
  indicatorSize: number;
  iconSize: number;
};

/** Checkbox tokens — gap varies by density; sizes vary by the `size` prop */
export type CheckboxThemeTokens = {
  gap: number;
  borderRadius: number;
  focusRingWidth: number;
  small: CheckboxSizeTokens;
  default: CheckboxSizeTokens;
  large: CheckboxSizeTokens;
};

/** Alert tokens for a single size variant (padding/gap vary by size AND density) */
export type AlertSizeTokens = {
  padding: number;
  gap: number;
  iconSize: number;
  closeSize: number;
};

/** All three alert sizes + constant radius */
export type AlertThemeTokens = {
  borderRadius: number;
  small: AlertSizeTokens;
  default: AlertSizeTokens;
  large: AlertSizeTokens;
};

/** Toggle track/thumb sizes for one size variant (constant across density) */
export type ToggleSizeTokens = {
  trackWidth: number;
  trackHeight: number;
  thumbSize: number;
};

/** Toggle tokens — gap varies by density; track sizes vary by the `size` prop */
export type ToggleThemeTokens = {
  gap: number;
  thumbOffset: number;
  focusRingWidth: number;
  small: ToggleSizeTokens;
  default: ToggleSizeTokens;
  large: ToggleSizeTokens;
};

/** Card tokens for one size variant (padding/gap vary by size AND density) */
export type CardSizeTokens = {
  padding: number;
  gap: number;
  iconSize: number;
  imageHeight: number;
};

/** All three card sizes + constant radius */
export type CardThemeTokens = {
  borderRadius: number;
  small: CardSizeTokens;
  default: CardSizeTokens;
  large: CardSizeTokens;
};

/** Badge spacing/sizing tokens for one size variant (constant across density) */
export type BadgeSizeTokens = {
  gap: number;
  paddingX: number;
  paddingY: number;
  dotSize: number;
};

/** Badge tokens — spacing varies by the `size` prop; pill radius is constant */
export type BadgeThemeTokens = {
  borderRadius: number;
  small: BadgeSizeTokens;
  default: BadgeSizeTokens;
  large: BadgeSizeTokens;
};

/** Radio indicator/dot sizes for one size variant (constant across density) */
export type RadioSizeTokens = {
  indicatorSize: number;
  dotSize: number;
};

/** Radio tokens — gap varies by density; sizes vary by the `size` prop */
export type RadioThemeTokens = {
  gap: number;
  borderRadius: number;
  focusRingWidth: number;
  small: RadioSizeTokens;
  default: RadioSizeTokens;
  large: RadioSizeTokens;
};

/** Toast tokens for a single size variant (padding/gap vary by size AND density) */
export type ToastSizeTokens = {
  padding: number;
  gap: number;
  iconSize: number;
  closeSize: number;
};

/** All three toast sizes + constant radius and width bounds */
export type ToastThemeTokens = {
  borderRadius: number;
  minWidth: number;
  maxWidth: number;
  small: ToastSizeTokens;
  default: ToastSizeTokens;
  large: ToastSizeTokens;
};

/** Chip spacing/sizing tokens for one size variant (padding/gap vary by density) */
export type ChipSizeTokens = {
  gap: number;
  paddingX: number;
  paddingY: number;
  iconSize: number;
};

/** Chip tokens — spacing varies by size + density; pill radius is constant */
export type ChipThemeTokens = {
  borderRadius: number;
  small: ChipSizeTokens;
  default: ChipSizeTokens;
  large: ChipSizeTokens;
};

/** Avatar tokens for one size variant. `size` varies by density; `iconSize` is
 * constant across density (keyed by the `size` prop, like List/Checkbox). */
export type AvatarSizeTokens = {
  size: number;
  iconSize: number;
};

/** Avatar tokens — diameter varies by size AND density; pill radius is constant */
export type AvatarThemeTokens = {
  borderRadius: number;
  small: AvatarSizeTokens;
  default: AvatarSizeTokens;
  large: AvatarSizeTokens;
};

/** Popover tokens for one size variant (padding varies by size AND density) */
export type PopoverSizeTokens = {
  padding: number;
};

/** All three popover sizes + constant radius and arrow size */
export type PopoverThemeTokens = {
  borderRadius: number;
  arrowSize: number;
  small: PopoverSizeTokens;
  default: PopoverSizeTokens;
  large: PopoverSizeTokens;
};

/** Tooltip tokens for one size variant (padding varies by size AND density) */
export type TooltipSizeTokens = {
  paddingX: number;
  paddingY: number;
};

/** Tooltip sizes (small + default only) + constant radius and arrow size */
export type TooltipThemeTokens = {
  borderRadius: number;
  arrowSize: number;
  small: TooltipSizeTokens;
  default: TooltipSizeTokens;
};

/** Progress track thickness for one size variant (constant across density,
 * keyed by the `size` prop like Badge dot-size / Toggle track). */
export type ProgressSizeTokens = {
  trackHeight: number;
};

/** Progress tokens — track thickness varies by the `size` prop; the pill
 * radius is constant. No density-varying spacing. */
export type ProgressThemeTokens = {
  borderRadius: number;
  small: ProgressSizeTokens;
  default: ProgressSizeTokens;
  large: ProgressSizeTokens;
};

/**
 * Component-level tokens that vary by density theme.
 * Extended as new components are added to the library.
 */
export type ComponentTokens = {
  button: ButtonThemeTokens;
  dialog: DialogThemeTokens;
  input: InputThemeTokens;
  select: SelectThemeTokens;
  list: ListThemeTokens;
  checkbox: CheckboxThemeTokens;
  alert: AlertThemeTokens;
  toggle: ToggleThemeTokens;
  card: CardThemeTokens;
  badge: BadgeThemeTokens;
  radio: RadioThemeTokens;
  toast: ToastThemeTokens;
  chip: ChipThemeTokens;
  avatar: AvatarThemeTokens;
  popover: PopoverThemeTokens;
  tooltip: TooltipThemeTokens;
  progress: ProgressThemeTokens;
};

/** Utility type for partial overrides at any depth */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
