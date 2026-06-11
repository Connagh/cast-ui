/**
 * Checkbox — binary (or tri-state) choice control.
 *
 * Maps to the Figma <Checkbox> component (node 275:5919):
 *   checked → false | true | indeterminate
 *   size    → small | default | large
 *   state   → default | hover | focus | disabled (interaction-driven)
 *
 * Indicator and icon sizes come from the density theme's `checkbox` tokens
 * (sizes track the `size` prop; gap tracks density). Colours come from the
 * active theme scheme's `checkbox` set + the focus-ring colour.
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
import { Icon } from '../Icon';
import {
  fontFamily,
  fontWeight,
  label,
  controlTokens,
} from '../../tokens';

export type CheckboxSize = 'small' | 'default' | 'large';
export type CheckboxChecked = boolean | 'indeterminate';

export type CheckboxProps = {
  /** Checked state — true, false, or 'indeterminate'. */
  checked?: CheckboxChecked;
  /** Change handler — receives the next boolean checked value. */
  onChange?: (checked: boolean) => void;
  /** Optional label rendered beside the indicator. */
  children?: string;
  /** Size variant — controls indicator + icon size. */
  size?: CheckboxSize;
  /** Disables interaction and applies muted styling. */
  disabled?: boolean;
  /** Style override for the outer row. */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label — falls back to the label text. */
  accessibilityLabel?: string;
};

/** Maps checkbox size → label typography scale */
const LABEL_SCALE: Record<CheckboxSize, keyof typeof label> = {
  small: 'sm',
  default: 'md',
  large: 'lg',
};

export function Checkbox({
  checked = false,
  onChange,
  children,
  size = 'default',
  disabled = false,
  style,
  accessibilityLabel,
}: CheckboxProps) {
  const { components, scheme } = useTheme();
  const checkboxColors = scheme.checkbox;
  const tokens = components.checkbox;
  const sizeTokens = tokens[size];
  const labelTokens = label[LABEL_SCALE[size]];

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isIndeterminate = checked === 'indeterminate';
  const isChecked = checked === true;
  const isOn = isChecked || isIndeterminate;

  const handlePress = useCallback(() => {
    if (!disabled) onChange?.(!isChecked);
  }, [disabled, onChange, isChecked]);

  // Resolve indicator fill + border based on state.
  // Priority: disabled > focus > (checked) > hover > default
  let boxBg: string;
  let boxBorderColor: string;
  let boxBorderWidth: number;

  if (disabled) {
    boxBg = checkboxColors.box.disabled.bg;
    boxBorderColor = checkboxColors.box.disabled.border;
    boxBorderWidth = controlTokens.borderWidth;
  } else if (isOn) {
    boxBg = checkboxColors.box.checked.bg;
    boxBorderColor = isFocused
      ? scheme.focusRing.color
      : checkboxColors.box.checked.border;
    boxBorderWidth = isFocused ? tokens.focusRingWidth : 0;
  } else {
    boxBg = checkboxColors.box.uncheckedDefault.bg;
    if (isFocused) {
      boxBorderColor = scheme.focusRing.color;
      boxBorderWidth = tokens.focusRingWidth;
    } else if (isHovered) {
      boxBorderColor = checkboxColors.box.uncheckedHover.border;
      boxBorderWidth = controlTokens.borderWidth;
    } else {
      boxBorderColor = checkboxColors.box.uncheckedDefault.border;
      boxBorderWidth = controlTokens.borderWidth;
    }
  }

  const glyphColor = disabled
    ? checkboxColors.icon.disabled
    : checkboxColors.icon.default;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel || children}
      accessibilityState={{
        checked: isIndeterminate ? 'mixed' : isChecked,
        disabled,
      }}
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
          width: sizeTokens.indicatorSize,
          height: sizeTokens.indicatorSize,
          borderRadius: tokens.borderRadius,
          backgroundColor: boxBg,
          borderWidth: boxBorderWidth,
          borderColor: boxBorderColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isChecked ? (
          <Icon name="check" size={sizeTokens.iconSize} color={glyphColor} />
        ) : isIndeterminate ? (
          <Icon name="remove" size={sizeTokens.iconSize} color={glyphColor} />
        ) : null}
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
              ? checkboxColors.label.disabled
              : checkboxColors.label.default,
          }}
          selectable={false}
        >
          {children}
        </Text>
      ) : null}
    </Pressable>
  );
}
