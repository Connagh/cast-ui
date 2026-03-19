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
  focusRingWidth: number;
  focusRingOffset: number;
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

/**
 * Component-level tokens that vary by density theme.
 * Extended as new components are added to the library.
 */
export type ComponentTokens = {
  button: ButtonThemeTokens;
  dialog: DialogThemeTokens;
};

/** Utility type for partial overrides at any depth */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
