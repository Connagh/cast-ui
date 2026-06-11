/**
 * Radio — single-choice control, used individually or within a RadioGroup.
 *
 * Maps to the Figma <Radio> component (node 307:3477):
 *   checked → boolean
 *   size    → small | default | large
 *   state   → default | hover | focus | disabled (interaction-driven)
 *
 * Indicator + dot sizes come from the density theme's `radio` tokens (sizes
 * track the `size` prop; gap tracks density). Colours come from the active
 * theme scheme's `radio` set + the focus-ring colour.
 *
 * RadioGroup provides single-selection semantics: each child Radio with a
 * `value` reflects `group.value === value` and reports selection upward.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from 'react';
import {
  Pressable,
  View,
  Text,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { useTheme } from '../../theme';
import { fontFamily, fontWeight, label, controlTokens } from '../../tokens';

export type RadioSize = 'small' | 'default' | 'large';

export type RadioProps = {
  /** Identifier — required when used inside a RadioGroup. */
  value?: string;
  /** Selected state (standalone use / controlled). */
  checked?: boolean;
  /** Change handler — receives the next checked value (standalone use). */
  onChange?: (checked: boolean) => void;
  /** Optional label rendered beside the indicator. */
  children?: string;
  /** Size variant — controls indicator + dot size. Inherited from RadioGroup. */
  size?: RadioSize;
  /** Disables interaction and applies muted styling. */
  disabled?: boolean;
  /** Style override for the outer row. */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label — falls back to the label text. */
  accessibilityLabel?: string;
};

export type RadioGroupProps = {
  /** Selected value. */
  value?: string;
  /** Selection change handler. */
  onValueChange?: (value: string) => void;
  /** Default size applied to all child radios. */
  size?: RadioSize;
  /** Disables every radio in the group. */
  disabled?: boolean;
  /** Radio children. */
  children: React.ReactNode;
  /** Style override for the group container. */
  style?: StyleProp<ViewStyle>;
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type RadioGroupContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
  size: RadioSize;
  disabled: boolean;
};

const RadioGroupCtx = createContext<RadioGroupContextValue | null>(null);

/** Maps radio size → label typography scale */
const LABEL_SCALE: Record<RadioSize, keyof typeof label> = {
  small: 'sm',
  default: 'md',
  large: 'lg',
};

// ---------------------------------------------------------------------------
// RadioGroup
// ---------------------------------------------------------------------------

export function RadioGroup({
  value,
  onValueChange,
  size = 'default',
  disabled = false,
  children,
  style,
}: RadioGroupProps) {
  const { components } = useTheme();
  return (
    <RadioGroupCtx.Provider value={{ value, onValueChange, size, disabled }}>
      <View
        accessibilityRole="radiogroup"
        style={[{ gap: components.radio.gap }, style]}
      >
        {children}
      </View>
    </RadioGroupCtx.Provider>
  );
}

// ---------------------------------------------------------------------------
// Radio
// ---------------------------------------------------------------------------

export function Radio({
  value,
  checked,
  onChange,
  children,
  size,
  disabled,
  style,
  accessibilityLabel,
}: RadioProps) {
  const { components, scheme } = useTheme();
  const radioColors = scheme.radio;
  const group = useContext(RadioGroupCtx);

  const resolvedSize: RadioSize = size ?? group?.size ?? 'default';
  const resolvedDisabled = disabled ?? group?.disabled ?? false;
  const isChecked =
    group != null && value != null ? group.value === value : checked === true;

  const tokens = components.radio;
  const sizeTokens = tokens[resolvedSize];
  const labelTokens = label[LABEL_SCALE[resolvedSize]];

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handlePress = useCallback(() => {
    if (resolvedDisabled) return;
    if (group != null && value != null) {
      group.onValueChange?.(value);
    } else {
      onChange?.(!isChecked);
    }
  }, [resolvedDisabled, group, value, onChange, isChecked]);

  // Resolve indicator fill + border. Priority: disabled > focus > checked > hover > default
  let ringBg: string;
  let ringBorderColor: string;
  let ringBorderWidth: number;

  if (resolvedDisabled) {
    ringBg = radioColors.indicator.disabled.bg;
    ringBorderColor = radioColors.indicator.disabled.border;
    ringBorderWidth = controlTokens.borderWidth;
  } else if (isChecked) {
    ringBg = isHovered
      ? radioColors.indicator.checkedHover.bg
      : radioColors.indicator.checked.bg;
    ringBorderColor = isFocused
      ? scheme.focusRing.color
      : radioColors.indicator.checked.border;
    ringBorderWidth = isFocused ? tokens.focusRingWidth : 0;
  } else {
    ringBg = radioColors.indicator.uncheckedDefault.bg;
    if (isFocused) {
      ringBorderColor = scheme.focusRing.color;
      ringBorderWidth = tokens.focusRingWidth;
    } else if (isHovered) {
      ringBorderColor = radioColors.indicator.uncheckedHover.border;
      ringBorderWidth = controlTokens.borderWidth;
    } else {
      ringBorderColor = radioColors.indicator.uncheckedDefault.border;
      ringBorderWidth = controlTokens.borderWidth;
    }
  }

  const dotColor = resolvedDisabled
    ? radioColors.dot.disabled
    : radioColors.dot.default;

  return (
    <Pressable
      onPress={handlePress}
      disabled={resolvedDisabled}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      accessibilityRole="radio"
      accessibilityLabel={accessibilityLabel || children}
      accessibilityState={{ checked: isChecked, disabled: resolvedDisabled }}
      style={[
        { flexDirection: 'row', alignItems: 'flex-start', gap: tokens.gap },
        style,
      ]}
    >
      <View
        style={{
          width: sizeTokens.indicatorSize,
          height: sizeTokens.indicatorSize,
          borderRadius: tokens.borderRadius,
          backgroundColor: ringBg,
          borderWidth: ringBorderWidth,
          borderColor: ringBorderColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isChecked ? (
          <View
            style={{
              width: sizeTokens.dotSize,
              height: sizeTokens.dotSize,
              borderRadius: sizeTokens.dotSize / 2,
              backgroundColor: dotColor,
            }}
          />
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
            color: resolvedDisabled
              ? radioColors.label.disabled
              : radioColors.label.default,
          }}
          selectable={false}
        >
          {children}
        </Text>
      ) : null}
    </Pressable>
  );
}
