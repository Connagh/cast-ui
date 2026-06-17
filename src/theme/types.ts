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

/** Spacing/sizing tokens for a single tab size variant. `gap`, `paddingX`,
 * and `paddingY` vary by density; `indicatorHeight` is keyed by the `size`
 * prop and constant across density (like Toggle's track / Progress's
 * track-height — bound to a primitive `size/*`). */
export type TabsSizeTokens = {
  gap: number;
  paddingX: number;
  paddingY: number;
  indicatorHeight: number;
};

/** Tabs tokens — per-size tab spacing + the gap between tabs (`listGap`,
 * density-varying) and the pill `indicatorRadius` (constant). */
export type TabsThemeTokens = {
  listGap: number;
  indicatorRadius: number;
  small: TabsSizeTokens;
  default: TabsSizeTokens;
  large: TabsSizeTokens;
};

/** Spinner geometry for one size variant. Both values are keyed by the `size`
 * prop and constant across density (like Progress track-height / Tabs
 * indicator-height — bound to a primitive `size/*`). */
export type SpinnerSizeTokens = {
  diameter: number;
  stroke: number;
};

/** Spinner tokens — diameter + ring stroke vary by the `size` prop and are
 * constant across density. No density-varying spacing. */
export type SpinnerThemeTokens = {
  small: SpinnerSizeTokens;
  default: SpinnerSizeTokens;
  large: SpinnerSizeTokens;
};

/**
 * BottomSheet tokens. The sheet hugs its content up to a max height, so there
 * are no size variants. `padding` and `gap` vary by density. The top corner
 * radius and the drag handle dimensions are constant across density (handle
 * width/height are keyed to primitive `size/*`, the radius to a primitive
 * `radius/*`, the handle gap to `space/*`).
 */
export type BottomSheetThemeTokens = {
  /** Top-corner radius of the sheet. Constant. */
  borderRadius: number;
  /** Drag handle width. Constant. */
  handleWidth: number;
  /** Drag handle height. Constant. */
  handleHeight: number;
  /** Gap below the handle before the content. Constant. */
  handleGap: number;
  /** Content padding. Varies by density. */
  padding: number;
  /** Gap between stacked content sections. Varies by density. */
  gap: number;
};

/** Spacing tokens for one accordion size variant. gap, paddingX, and paddingY
 * all vary by density (bound to primitive space/*). The flush style has no
 * border-radius, and the chevron / leading icon use the named Icon scale keyed
 * by the `size` prop, so there are no constant dimension tokens. */
export type AccordionSizeTokens = {
  gap: number;
  paddingX: number;
  paddingY: number;
};

/** Accordion tokens — three size variants, each density-varying. */
export type AccordionThemeTokens = {
  small: AccordionSizeTokens;
  default: AccordionSizeTokens;
  large: AccordionSizeTokens;
};

/**
 * Component-level tokens that vary by density theme.
 * Extended as new components are added to the library.
 */
/** Link spacing tokens for one size variant (icon/label gap, varies by density). */
export type LinkSizeTokens = {
  gap: number;
};

/** Link tokens — gap varies by size and density. */
export type LinkThemeTokens = {
  small: LinkSizeTokens;
  default: LinkSizeTokens;
  large: LinkSizeTokens;
};

/** Breadcrumbs spacing tokens for one size variant (row + icon gap, density). */
export type BreadcrumbsSizeTokens = {
  gap: number;
};

/** Breadcrumbs tokens — gap varies by size and density. */
export type BreadcrumbsThemeTokens = {
  small: BreadcrumbsSizeTokens;
  default: BreadcrumbsSizeTokens;
  large: BreadcrumbsSizeTokens;
};

/** CodeBlock spacing tokens for one size variant (padding + gap, density). */
export type CodeBlockSizeTokens = {
  padding: number;
  gap: number;
};

/** CodeBlock tokens — padding/gap vary by size and density; radius is constant. */
export type CodeBlockThemeTokens = {
  borderRadius: number;
  small: CodeBlockSizeTokens;
  default: CodeBlockSizeTokens;
  large: CodeBlockSizeTokens;
};

/**
 * Drawer tokens. The panel hugs an edge with no size variants, like
 * BottomSheet. padding and gap vary by density; the panel is square (no radius
 * token), and the default width is a layout constant in code, not a token.
 */
export type DrawerThemeTokens = {
  padding: number;
  gap: number;
};

/** Menu item spacing tokens (density-varying). */
export type MenuItemTokens = {
  gap: number;
  paddingX: number;
  paddingY: number;
  borderRadius: number;
};

/** Menu group (section label) tokens. */
export type MenuGroupTokens = {
  paddingX: number;
  labelPaddingY: number;
};

/** Menu tokens. Mirrors the select shape, namespaced to menu. Item spacing
 * varies by density; the size prop drives typography. */
export type MenuThemeTokens = {
  item: MenuItemTokens;
  content: { paddingY: number };
  group: MenuGroupTokens;
  separator: { marginY: number };
};

/** Toggle button spacing tokens for one size variant (density-varying). */
export type ToggleButtonGroupSizeTokens = {
  paddingX: number;
  paddingY: number;
  gap: number;
};

/** Toggle button group tokens — padding/gap vary by size and density; the group
 * border-radius is constant. */
export type ToggleButtonGroupThemeTokens = {
  borderRadius: number;
  small: ToggleButtonGroupSizeTokens;
  default: ToggleButtonGroupSizeTokens;
  large: ToggleButtonGroupSizeTokens;
};

/** App bar spacing tokens for one size variant (density-varying). */
export type AppBarSizeTokens = {
  paddingX: number;
  paddingY: number;
  gap: number;
};

/** App bar tokens — padding/gap vary by size and density. The bar height comes
 * from the padding, so there is no height token. */
export type AppBarThemeTokens = {
  small: AppBarSizeTokens;
  default: AppBarSizeTokens;
  large: AppBarSizeTokens;
};

/** Slider geometry for one size variant (constant across density). */
export type SliderSizeTokens = {
  trackHeight: number;
  thumbSize: number;
};

/** Slider tokens — track thickness + thumb size keyed by the size prop; pill
 * radius constant. No density-varying spacing. */
export type SliderThemeTokens = {
  borderRadius: number;
  small: SliderSizeTokens;
  default: SliderSizeTokens;
  large: SliderSizeTokens;
};

/** Speed dial sizes for one size variant. fab/action sizes are constant per
 * size; gap varies by density. */
export type SpeedDialSizeTokens = {
  fabSize: number;
  actionSize: number;
  gap: number;
};

/** Speed dial tokens — three size variants. */
export type SpeedDialThemeTokens = {
  small: SpeedDialSizeTokens;
  default: SpeedDialSizeTokens;
  large: SpeedDialSizeTokens;
};

/** Table cell padding for one size variant (density-varying). */
export type TableSizeTokens = {
  cellPaddingX: number;
  cellPaddingY: number;
};

/** Table tokens — three size variants. */
export type TableThemeTokens = {
  small: TableSizeTokens;
  default: TableSizeTokens;
  large: TableSizeTokens;
};

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
  tabs: TabsThemeTokens;
  accordion: AccordionThemeTokens;
  spinner: SpinnerThemeTokens;
  bottomSheet: BottomSheetThemeTokens;
  link: LinkThemeTokens;
  breadcrumbs: BreadcrumbsThemeTokens;
  codeBlock: CodeBlockThemeTokens;
  drawer: DrawerThemeTokens;
  menu: MenuThemeTokens;
  toggleButtonGroup: ToggleButtonGroupThemeTokens;
  appBar: AppBarThemeTokens;
  slider: SliderThemeTokens;
  speedDial: SpeedDialThemeTokens;
  table: TableThemeTokens;
};

/** Utility type for partial overrides at any depth */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
