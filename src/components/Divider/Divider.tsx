/**
 * Divider — a thin rule separating content, horizontally or vertically.
 *
 * Maps to the Figma <Divider> component (node 307:3571):
 *   orientation → horizontal | vertical
 *
 * The line uses the overlay border colour (surface/overlay/border) at the
 * control border width (1px) — both constant across densities. A horizontal
 * divider stretches to its container's width; a vertical divider stretches to
 * its container's height (give the parent a defined cross-axis size).
 */

import React from 'react';
import { View, type ViewStyle, type StyleProp } from 'react-native';
import { useTheme } from '../../theme';
import { controlTokens } from '../../tokens';

export type DividerOrientation = 'horizontal' | 'vertical';

export type DividerProps = {
  /** Line direction. */
  orientation?: DividerOrientation;
  /** Line colour — defaults to the overlay border token. */
  color?: string;
  /** Style override — e.g. margins or an explicit length. */
  style?: StyleProp<ViewStyle>;
};

export function Divider({
  orientation = 'horizontal',
  color,
  style,
}: DividerProps) {
  const { scheme } = useTheme();
  const resolvedColor = color ?? scheme.surface.overlay.border;
  const isVertical = orientation === 'vertical';

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        isVertical
          ? { alignSelf: 'stretch', width: controlTokens.borderWidth }
          : { alignSelf: 'stretch', height: controlTokens.borderWidth },
        { backgroundColor: resolvedColor },
        style,
      ]}
    />
  );
}
