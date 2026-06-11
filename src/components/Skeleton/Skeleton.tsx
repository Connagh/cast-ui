/**
 * Skeleton — a placeholder block shown while content loads.
 *
 * Maps to the Figma <Skeleton> component (node 307:4191):
 *   shape → text | circle | rectangle
 *
 * Each shape sets a sensible default size and corner radius (text: 12×120,
 * 4px radius; circle: 40×40, full radius; rectangle: 80×120, 8px radius). Pass
 * `width`/`height`/`radius` to override. The fill is the cool-grey/100 surface;
 * a subtle opacity pulse runs by default and can be disabled with `animated`.
 *
 * Sizing is intentionally constant across densities — skeletons mirror the
 * layout of the real content they stand in for.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, type ViewStyle, type StyleProp, type DimensionValue } from 'react-native';
import { useTheme } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SkeletonShape = 'text' | 'circle' | 'rectangle';

export type SkeletonProps = {
  /** Shape preset — sets default size and corner radius. */
  shape?: SkeletonShape;
  /** Width override (number of px or a percentage string). */
  width?: DimensionValue;
  /** Height override (number of px or a percentage string). */
  height?: DimensionValue;
  /** Corner radius override. */
  radius?: number;
  /** Run the opacity pulse animation. Defaults to true. */
  animated?: boolean;
  /** Outer style — use for positioning (margin, flex, alignSelf). */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label. Defaults to "Loading". */
  accessibilityLabel?: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

type ShapeDefaults = { width: DimensionValue; height: DimensionValue; radius: number };

/** Default size + corner radius per shape (radius/2, surface/overlay/radius, radius/full). */
const SHAPE_DEFAULTS: Record<SkeletonShape, ShapeDefaults> = {
  text: { width: 120, height: 12, radius: 4 },
  circle: { width: 40, height: 40, radius: 9999 },
  rectangle: { width: 120, height: 80, radius: 8 },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Skeleton({
  shape = 'text',
  width,
  height,
  radius,
  animated = true,
  style,
  accessibilityLabel = 'Loading',
}: SkeletonProps) {
  const { scheme } = useTheme();
  const skeletonColors = scheme.skeleton;
  const defaults = SHAPE_DEFAULTS[shape];
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animated) {
      opacity.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [animated, opacity]);

  return (
    <Animated.View
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          width: width ?? defaults.width,
          height: height ?? defaults.height,
          borderRadius: radius ?? defaults.radius,
          backgroundColor: skeletonColors.bg,
          opacity,
        },
        style,
      ]}
    />
  );
}
