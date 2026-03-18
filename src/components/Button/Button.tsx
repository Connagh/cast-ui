/**
 * Button — the foundational interactive component of Cast UI.
 *
 * Maps 1:1 to the Figma <Button> component:
 *   intent     → neutral | brand | danger
 *   prominence → default | bold | subtle
 *   size       → small | default | large
 *
 * Spacing tokens come from the density theme (compact/default/comfortable).
 * Colours come from the semantic intent system (constant across densities).
 * Typography uses the label scale (sm/md/lg) matched to the button size.
 */

import React, { useState, useCallback } from 'react';
import {
  Pressable,
  Text,
  View,
  Platform,
  type ViewStyle,
  type StyleProp,
  type GestureResponderEvent,
} from 'react-native';
import { useTheme } from '../../theme';
import { fontFamily, fontWeight, label, controlTokens } from '../../tokens';
import type { IntentName, ProminenceName } from '../../tokens';
import { Icon } from '../Icon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ButtonSize = 'small' | 'default' | 'large';

export type ButtonProps = {
  /** The button label text. */
  children: string;
  /** Semantic intent — drives the colour scheme. */
  intent?: IntentName;
  /** Visual weight — default (outlined), bold (filled), or subtle (ghost). */
  prominence?: ProminenceName;
  /** Size variant — controls padding, gap, and typography scale. */
  size?: ButtonSize;
  /** Disables interaction and applies muted styling. */
  disabled?: boolean;
  /** Icon before the label — Material Symbols name string or a ReactNode. */
  leadingIcon?: string | React.ReactNode;
  /** Icon after the label — Material Symbols name string or a ReactNode. */
  trailingIcon?: string | React.ReactNode;
  /** Press handler. */
  onPress?: (e: GestureResponderEvent) => void;
  /** Outer style — use for positioning (margin, flex, alignSelf). */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label — falls back to children text if not provided. */
  accessibilityLabel?: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maps button size → label typography scale */
const LABEL_SCALE: Record<ButtonSize, keyof typeof label> = {
  small: 'sm',
  default: 'md',
  large: 'lg',
};

/** Icon size — fixed at 16px per Figma spec, all button sizes. */
const ICON_SIZE = 16;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Button({
  children,
  intent = 'neutral',
  prominence = 'default',
  size = 'default',
  disabled = false,
  leadingIcon,
  trailingIcon,
  onPress,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const { components, colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Resolve tokens for current size + density
  const sizeTokens = components.button[size];
  const labelTokens = label[LABEL_SCALE[size]];
  const intentClrs = colors[intent];

  // Resolve colours based on interaction state
  const getStateColors = useCallback(
    (pressed: boolean, hovered: boolean) => {
      if (disabled) {
        return {
          bg: '#F3F4F6',
          fg: '#9CA3AF',
          border: '#E5E7EB',
        };
      }
      if (pressed) return intentClrs[prominence].active;
      if (hovered) return intentClrs[prominence].hover;
      return intentClrs[prominence].default;
    },
    [disabled, intentClrs, prominence],
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || children}
      accessibilityState={{ disabled }}
      style={style}
    >
      {({ pressed }) => {
        const stateColors = getStateColors(pressed, isHovered);

        const containerStyle: ViewStyle = {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'flex-start',
          gap: sizeTokens.gap,
          paddingHorizontal: sizeTokens.paddingX,
          paddingVertical: sizeTokens.paddingY,
          borderRadius: sizeTokens.borderRadius,
          borderWidth: controlTokens.borderWidth,
          borderColor: stateColors.border,
          backgroundColor: stateColors.bg,
        };

        // Web-only: focus ring via CSS outline
        const focusStyle: ViewStyle | Record<string, unknown> =
          isFocused && !disabled && Platform.OS === 'web'
            ? {
                outlineWidth: sizeTokens.focusRingWidth,
                outlineColor: intentClrs.ringColour,
                outlineStyle: 'solid',
                outlineOffset: sizeTokens.focusRingOffset,
              }
            : {};

        // Resolve icon props — strings become <Icon> with auto-matched colour
        const resolvedLeading =
          typeof leadingIcon === 'string' ? (
            <Icon name={leadingIcon} size={ICON_SIZE} color={stateColors.fg} />
          ) : (
            leadingIcon
          );
        const resolvedTrailing =
          typeof trailingIcon === 'string' ? (
            <Icon name={trailingIcon} size={ICON_SIZE} color={stateColors.fg} />
          ) : (
            trailingIcon
          );

        return (
          <View style={[containerStyle, focusStyle as ViewStyle]}>
            {resolvedLeading}
            <Text
              style={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.medium,
                fontSize: labelTokens.fontSize,
                lineHeight: labelTokens.lineHeight,
                letterSpacing: labelTokens.letterSpacing,
                color: stateColors.fg,
              }}
              selectable={false}
            >
              {children}
            </Text>
            {resolvedTrailing}
          </View>
        );
      }}
    </Pressable>
  );
}
