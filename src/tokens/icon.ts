/**
 * Icon size scale — mirrors the Figma `icon/{xs,small,default,large}/size`
 * variables (component collection, aliasing the primitive size scale).
 * Standalone/decorative icons use this named scale; control-embedded icons are
 * sized by their host component's density tokens.
 */

export type IconSize = 'xs' | 'small' | 'default' | 'large';

export const iconSize: Record<IconSize, number> = {
  xs: 12,
  small: 16,
  default: 20,
  large: 24,
};
