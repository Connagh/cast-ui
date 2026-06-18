/**
 * Breakpoint scale — named min-width thresholds in density-independent pixels.
 *
 * Mirrors the Figma `breakpoint/{sm,md,lg,xl}` primitive variables. This is a
 * foundation reference scale, not a runtime theme value. The numbers do not
 * change with density, they are not part of the ThemeProvider theme, and
 * cast-sync does not export them. Read them with the useBreakpoint /
 * useResponsiveValue hooks, which watch the live window width.
 *
 * Values follow Material 3 window size classes, which are derived from real
 * device-width data across the whole spectrum. The scale is mobile-first: a
 * width is "at" a breakpoint when it is greater than or equal to that
 * breakpoint's value, and anything below `sm` is the implicit `base` tier.
 *
 * Device mapping (width in dp):
 *
 *   base  < 600   Watches, and every phone in portrait. iPhone SE 320,
 *                 iPhone 15 390, Pro Max 430, Pixel 7 412, Apple Watch
 *                 136-205. This is your default, design-here-first layout.
 *   sm    >= 600  Large phones in landscape, foldables unfolded, small
 *                 tablets in portrait.
 *   md    >= 840  Tablets. iPad portrait ~768-834 (sits at the top of sm),
 *                 iPad landscape and larger tablets land here and up.
 *   lg    >= 1200 Laptops and desktops.
 *   xl    >= 1600 Large desktops and TVs.
 *
 * React Native has no CSS media queries, so a breakpoint here is a width
 * threshold you compare the window against at runtime. It does not restyle
 * anything on its own. Small-vs-large phone differences belong to fluid layout
 * (flex, percentages, maxWidth), not breakpoints. A watch is its own surface,
 * not a tier: it falls into `base` and shares the default layout, which is the
 * safe behaviour for a kit that does not target watchOS.
 */

/** The named breakpoint tiers. */
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';

/** A breakpoint tier including the implicit below-`sm` base tier. */
export type BreakpointKey = 'base' | Breakpoint;

/** Min-width thresholds in dp (Material 3 window size classes). */
export const breakpoints: Record<Breakpoint, number> = {
  sm: 600,
  md: 840,
  lg: 1200,
  xl: 1600,
};

/** Tiers ordered smallest to largest, base first. */
export const breakpointOrder: readonly BreakpointKey[] = [
  'base',
  'sm',
  'md',
  'lg',
  'xl',
] as const;

/**
 * Resolve a raw window width (dp) to its active breakpoint tier. Mobile-first:
 * returns the largest tier whose threshold the width has reached, or `base`
 * below `sm`.
 */
export function resolveBreakpoint(width: number): BreakpointKey {
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'base';
}

/**
 * Pick a value for a tier, mobile-first. Supply values for any subset of tiers.
 * The chosen value is the one at the current tier or, if that tier has none,
 * the nearest defined tier below it. If nothing is defined at or below the
 * current tier, the smallest defined tier above is used. Returns undefined when
 * `values` is empty.
 *
 *   resolveResponsiveValue({ base: 1, md: 2, xl: 4 }, 'lg') // => 2
 */
export function resolveResponsiveValue<T>(
  values: Partial<Record<BreakpointKey, T>>,
  current: BreakpointKey,
): T | undefined {
  const idx = breakpointOrder.indexOf(current);
  for (let i = idx; i >= 0; i--) {
    const v = values[breakpointOrder[i]];
    if (v !== undefined) return v;
  }
  for (let i = idx + 1; i < breakpointOrder.length; i++) {
    const v = values[breakpointOrder[i]];
    if (v !== undefined) return v;
  }
  return undefined;
}
