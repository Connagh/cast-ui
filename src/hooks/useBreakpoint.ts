/**
 * Responsive hooks built on the breakpoint scale.
 *
 * These read the live window width via react-native's useWindowDimensions, so
 * they recompute on resize, rotation, and foldable changes, and they work the
 * same on web (react-native-web). Breakpoints are a standalone foundation: they
 * are not part of the theme and do not change with density.
 */
import { useWindowDimensions } from 'react-native';

import {
  breakpoints,
  breakpointOrder,
  resolveBreakpoint,
  resolveResponsiveValue,
  type Breakpoint,
  type BreakpointKey,
} from '../tokens/breakpoints';

/**
 * The active breakpoint tier for the current window width. Mobile-first:
 * 'base' below `sm`, then 'sm' | 'md' | 'lg' | 'xl' as the width grows.
 *
 *   const bp = useBreakpoint(); // 'base' | 'sm' | 'md' | 'lg' | 'xl'
 */
export function useBreakpoint(): BreakpointKey {
  const { width } = useWindowDimensions();
  return resolveBreakpoint(width);
}

/**
 * True when the window is at or above the given breakpoint.
 *
 *   const isWide = useMinWidth('lg'); // true from 1024dp up
 */
export function useMinWidth(breakpoint: Breakpoint): boolean {
  const { width } = useWindowDimensions();
  return width >= breakpoints[breakpoint];
}

/**
 * Pick a value for the current breakpoint, mobile-first. Supply values for any
 * subset of tiers; the value at the current tier wins, falling back to the
 * nearest defined tier below it.
 *
 *   const columns = useResponsiveValue({ base: 1, md: 2, xl: 4 });
 */
export function useResponsiveValue<T>(
  values: Partial<Record<BreakpointKey, T>>,
): T | undefined {
  const current = useBreakpoint();
  return resolveResponsiveValue(values, current);
}
