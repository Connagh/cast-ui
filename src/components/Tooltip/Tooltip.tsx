/**
 * Tooltip — a small dark label that points at an anchor with an arrow.
 *
 * Maps to the Figma <Tooltip> component (node 307:4225):
 *   direction → top | bottom | left | right   (the edge the arrow sits on)
 *   size      → small | default               (drives padding + type scale)
 *   hasArrow  → toggles the directional arrow
 *
 * This is the presentational bubble only: it renders the dark surface
 * (neutral/bold) with white text and an optional arrow. Positioning relative
 * to a trigger is the caller's job — wrap it in a positioned container or pass
 * a `style` with absolute coordinates.
 *
 * Padding comes from the `tooltip` density theme (size × density); the radius
 * and arrow size are constant across densities.
 */

import React from 'react';
import { View, Text, type ViewStyle, type StyleProp } from 'react-native';
import { useTheme } from '../../theme';
import { fontFamily, fontWeight, label } from '../../tokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TooltipSize = 'small' | 'default';
export type TooltipDirection = 'top' | 'bottom' | 'left' | 'right';

export type TooltipProps = {
  /** The tooltip label text. */
  children: string;
  /** The edge the arrow sits on (points away from the bubble). */
  direction?: TooltipDirection;
  /** Size variant — controls padding and typography scale. */
  size?: TooltipSize;
  /** Show the directional arrow. Defaults to true. */
  hasArrow?: boolean;
  /** Outer style — use for positioning (absolute coords, margin). */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label — falls back to the children text. */
  accessibilityLabel?: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maps tooltip size → label typography scale */
const LABEL_SCALE: Record<TooltipSize, keyof typeof label> = {
  small: 'sm',
  default: 'md',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/** Positions the rotated-square arrow on the requested edge, centred. */
function arrowStyle(
  direction: TooltipDirection,
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

export function Tooltip({
  children,
  direction = 'bottom',
  size = 'small',
  hasArrow = true,
  style,
  accessibilityLabel,
}: TooltipProps) {
  const { components, scheme } = useTheme();
  const tokens = components.tooltip;
  const sizeTokens = tokens[size];
  const labelTokens = label[LABEL_SCALE[size]];

  /** Surface = neutral/bold (dark) — bg #374151, fg #FFFFFF. */
  const SURFACE = scheme.intents.neutral.bold.default;

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel || children}
      style={[
        {
          alignSelf: 'flex-start',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: SURFACE.bg,
          borderRadius: tokens.borderRadius,
          paddingHorizontal: sizeTokens.paddingX,
          paddingVertical: sizeTokens.paddingY,
        },
        style,
      ]}
    >
      {hasArrow ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={arrowStyle(direction, tokens.arrowSize, SURFACE.bg)}
        />
      ) : null}
      <Text
        selectable={false}
        style={{
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.medium,
          fontSize: labelTokens.fontSize,
          lineHeight: labelTokens.lineHeight,
          letterSpacing: labelTokens.letterSpacing,
          color: SURFACE.fg,
        }}
      >
        {children}
      </Text>
    </View>
  );
}
