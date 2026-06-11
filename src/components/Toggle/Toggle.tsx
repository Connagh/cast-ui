/**
 * Toggle — on/off switch control.
 *
 * Maps to the Figma <Toggle> component (node 275:9974):
 *   checked → boolean
 *   size    → small | default | large
 *   state   → default | hover | focus | disabled (interaction-driven)
 *
 * Track/thumb sizes come from the density theme's `toggle` tokens (sizes track
 * the `size` prop; gap tracks density). Colours come from the theme's colour
 * scheme (`scheme.toggle` + `scheme.focusRing`).
 */

import React, { useState, useCallback } from 'react';
import {
  Pressable,
  View,
  Text,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { useTheme } from '../../theme';
import { fontFamily, fontWeight, label } from '../../tokens';

export type ToggleSize = 'small' | 'default' | 'large';

export type ToggleProps = {
  /** On/off state. */
  checked?: boolean;
  /** Change handler — receives the next checked value. */
  onChange?: (checked: boolean) => void;
  /** Optional label rendered beside the switch. */
  children?: string;
  /** Size variant — controls track + thumb size. */
  size?: ToggleSize;
  /** Disables interaction and applies muted styling. */
  disabled?: boolean;
  /** Style override for the outer row. */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label — falls back to the label text. */
  accessibilityLabel?: string;
};

/** Maps toggle size → label typography scale */
const LABEL_SCALE: Record<ToggleSize, keyof typeof label> = {
  small: 'sm',
  default: 'md',
  large: 'lg',
};

export function Toggle({
  checked = false,
  onChange,
  children,
  size = 'default',
  disabled = false,
  style,
  accessibilityLabel,
}: ToggleProps) {
  const { components, scheme } = useTheme();
  const toggleColors = scheme.toggle;
  const tokens = components.toggle;
  const sizeTokens = tokens[size];
  const labelTokens = label[LABEL_SCALE[size]];

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handlePress = useCallback(() => {
    if (!disabled) onChange?.(!checked);
  }, [disabled, onChange, checked]);

  // Resolve track fill.
  let trackBg: string;
  if (disabled) {
    trackBg = checked
      ? toggleColors.track.disabledOn
      : toggleColors.track.disabledOff;
  } else if (checked) {
    trackBg = isHovered ? toggleColors.track.onHover : toggleColors.track.on;
  } else {
    trackBg =
      isHovered || isFocused
        ? toggleColors.track.offHover
        : toggleColors.track.off;
  }

  const showFocusRing = isFocused && !disabled;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel || children}
      accessibilityState={{ checked, disabled }}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: tokens.gap,
        },
        style,
      ]}
    >
      <View
        style={{
          width: sizeTokens.trackWidth,
          height: sizeTokens.trackHeight,
          borderRadius: sizeTokens.trackHeight / 2,
          backgroundColor: trackBg,
          padding: tokens.thumbOffset,
          flexDirection: 'row',
          justifyContent: checked ? 'flex-end' : 'flex-start',
          alignItems: 'center',
          borderWidth: showFocusRing ? tokens.focusRingWidth : 0,
          borderColor: showFocusRing
            ? scheme.focusRing.color
            : 'transparent',
        }}
      >
        <View
          style={{
            width: sizeTokens.thumbSize,
            height: sizeTokens.thumbSize,
            borderRadius: sizeTokens.thumbSize / 2,
            backgroundColor: toggleColors.thumb,
          }}
        />
      </View>

      {children ? (
        <Text
          style={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.medium,
            fontSize: labelTokens.fontSize,
            lineHeight: labelTokens.lineHeight,
            letterSpacing: labelTokens.letterSpacing,
            color: disabled
              ? toggleColors.label.disabled
              : toggleColors.label.default,
          }}
          selectable={false}
        >
          {children}
        </Text>
      ) : null}
    </Pressable>
  );
}
