/**
 * Popover — a floating surface that points at an anchor with an arrow.
 *
 * Maps to the Figma <Popover> component (node 307:4149):
 *   direction → top | bottom | left | right   (the edge the arrow sits on)
 *   size      → small | default | large        (drives content padding)
 *
 * This is the presentational bubble only: it renders the overlay surface
 * (white background, 8px radius, shadow/md) with a directional arrow and your
 * `children` inside. Positioning relative to a trigger is the caller's job —
 * wrap it in a positioned container or pass a `style` with absolute coords.
 *
 * Padding comes from the `popover` density theme (size × density); the radius
 * and arrow size are constant across densities.
 */

import React from 'react';
import {
  View,
  Platform,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { useTheme } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PopoverSize = 'small' | 'default' | 'large';
export type PopoverDirection = 'top' | 'bottom' | 'left' | 'right';

export type PopoverProps = {
  /** Content rendered inside the bubble. */
  children: React.ReactNode;
  /** The edge the arrow sits on (points away from the bubble). */
  direction?: PopoverDirection;
  /** Size variant — controls content padding. */
  size?: PopoverSize;
  /** Hide the directional arrow. */
  hideArrow?: boolean;
  /** Outer style — use for positioning (absolute coords, margin, width). */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label for the popover surface. */
  accessibilityLabel?: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** shadow/md — overlay drop shadow (two stacked layers). */
const SHADOW_WEB = {
  boxShadow:
    '0px 4px 6px -1px rgba(0,0,0,0.07), 0px 2px 4px -2px rgba(0,0,0,0.05)',
};
const SHADOW_NATIVE: ViewStyle = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 6,
  elevation: 4,
};
const SHADOW = Platform.OS === 'web' ? SHADOW_WEB : SHADOW_NATIVE;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/** Positions the rotated-square arrow on the requested edge, centred. */
function arrowStyle(
  direction: PopoverDirection,
  arrowSize: number,
  backgroundColor: string,
): ViewStyle {
  const half = arrowSize / 2;
  const base: ViewStyle = {
    position: 'absolute',
    width: arrowSize,
    height: arrowSize,
    backgroundColor,
    transform: [{ rotate: '45deg' }],
  };
  switch (direction) {
    case 'top':
      return { ...base, top: -half, left: '50%', marginLeft: -half };
    case 'left':
      return { ...base, left: -half, top: '50%', marginTop: -half };
    case 'right':
      return { ...base, right: -half, top: '50%', marginTop: -half };
    case 'bottom':
    default:
      return { ...base, bottom: -half, left: '50%', marginLeft: -half };
  }
}

export function Popover({
  children,
  direction = 'bottom',
  size = 'default',
  hideArrow = false,
  style,
  accessibilityLabel,
}: PopoverProps) {
  const { components, scheme } = useTheme();
  const surfaceTokens = scheme.surface;
  const tokens = components.popover;
  const sizeTokens = tokens[size];

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          alignSelf: 'flex-start',
          backgroundColor: surfaceTokens.overlay.bg,
          borderRadius: tokens.borderRadius,
          padding: sizeTokens.padding,
          ...SHADOW,
        },
        style,
      ]}
    >
      {!hideArrow ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={arrowStyle(direction, tokens.arrowSize, surfaceTokens.overlay.bg)}
        />
      ) : null}
      {children}
    </View>
  );
}
