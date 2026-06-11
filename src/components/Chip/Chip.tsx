/**
 * Chip — compact, interactive pill for filters, selections, and tokens.
 *
 * Maps to the Figma <Chip> component (node 307:3479):
 *   intent  → neutral | brand | danger
 *   variant → outline (bordered) | subtle (tinted)
 *   size    → small | default | large
 *   state   → default | hover | active | disabled (interaction-driven)
 *
 * Spacing/icon sizes come from the density theme's `chip` tokens (padding/gap
 * vary by size AND density; icon size tracks the `size` prop). Colours map
 * directly onto the semantic intent system:
 *   outline → intent default  (white/tinted bg + border)
 *   subtle  → intent subtle   (transparent bg/border)
 * The `selected` state renders the intent's active colours.
 */

import React, { useState, useCallback } from 'react';
import {
  Pressable,
  View,
  Text,
  type ViewStyle,
  type StyleProp,
  type GestureResponderEvent,
} from 'react-native';
import { useTheme } from '../../theme';
import {
  fontFamily,
  fontWeight,
  label,
  controlTokens,
} from '../../tokens';
import type { IntentName } from '../../tokens';
import { Icon } from '../Icon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ChipSize = 'small' | 'default' | 'large';
export type ChipVariant = 'outline' | 'subtle';

export type ChipProps = {
  /** The chip label text. */
  children: string;
  /** Semantic intent — drives the colour scheme. */
  intent?: IntentName;
  /** Surface treatment — outline (bordered) or subtle (tinted). */
  variant?: ChipVariant;
  /** Size variant — controls padding, gap, and typography scale. */
  size?: ChipSize;
  /** Selected state — renders the intent's active colours. */
  selected?: boolean;
  /** Disables interaction and applies muted styling. */
  disabled?: boolean;
  /** Leading icon — Material Symbols name string or a ReactNode. */
  leadingIcon?: string | React.ReactNode;
  /** Press handler — makes the chip selectable. */
  onPress?: (e: GestureResponderEvent) => void;
  /** Remove handler — renders a trailing close button when provided. */
  onRemove?: () => void;
  /** Outer style — use for positioning (margin, flex, alignSelf). */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label — falls back to the label text. */
  accessibilityLabel?: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maps chip size → label typography scale */
const LABEL_SCALE: Record<ChipSize, keyof typeof label> = {
  small: 'sm',
  default: 'md',
  large: 'lg',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Chip({
  children,
  intent = 'neutral',
  variant = 'outline',
  size = 'default',
  selected = false,
  disabled = false,
  leadingIcon,
  onPress,
  onRemove,
  style,
  accessibilityLabel,
}: ChipProps) {
  const { components, scheme } = useTheme();
  const intentColors = scheme.intents;
  const disabledColors = scheme.disabled;
  const sizeTokens = components.chip[size];
  const labelTokens = label[LABEL_SCALE[size]];

  const [isHovered, setIsHovered] = useState(false);

  const prominence = variant === 'outline' ? 'default' : 'subtle';

  // Resolve colours. Priority: disabled > selected/pressed > hover > default
  const resolveColors = useCallback(
    (pressed: boolean) => {
      if (disabled) return disabledColors;
      const states = intentColors[intent][prominence];
      if (selected || pressed) return states.active;
      if (isHovered) return states.hover;
      return states.default;
    },
    [disabled, intent, prominence, selected, isHovered, intentColors, disabledColors],
  );

  const isInteractive = !disabled && (onPress != null || onRemove != null);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || onPress == null}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={accessibilityLabel || children}
      accessibilityState={{ disabled, selected }}
      style={style}
    >
      {({ pressed }) => {
        const colors = resolveColors(pressed && isInteractive);
        const resolvedLeading =
          typeof leadingIcon === 'string' ? (
            <Icon name={leadingIcon} size={sizeTokens.iconSize} color={colors.fg} />
          ) : (
            leadingIcon
          );

        return (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'flex-start',
              gap: sizeTokens.gap,
              paddingHorizontal: sizeTokens.paddingX,
              paddingVertical: sizeTokens.paddingY,
              borderRadius: components.chip.borderRadius,
              borderWidth: controlTokens.borderWidth,
              borderColor: colors.border,
              backgroundColor: colors.bg,
            }}
          >
            {resolvedLeading ? (
              <View
                accessibilityElementsHidden
                importantForAccessibility="no"
                style={{ width: sizeTokens.iconSize, height: sizeTokens.iconSize }}
              >
                {resolvedLeading}
              </View>
            ) : null}

            <Text
              style={{
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.medium,
                fontSize: labelTokens.fontSize,
                lineHeight: labelTokens.lineHeight,
                letterSpacing: labelTokens.letterSpacing,
                color: colors.fg,
              }}
              selectable={false}
            >
              {children}
            </Text>

            {onRemove ? (
              <Pressable
                onPress={disabled ? undefined : onRemove}
                disabled={disabled}
                hitSlop={6}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${children}`}
                style={{ width: sizeTokens.iconSize, height: sizeTokens.iconSize }}
              >
                <Icon name="close" size={sizeTokens.iconSize} color={colors.fg} />
              </Pressable>
            ) : null}
          </View>
        );
      }}
    </Pressable>
  );
}
