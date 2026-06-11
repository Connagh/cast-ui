/**
 * Input — single-line text field with label and helper/error text.
 *
 * Maps to the Figma <Input> component (node 307:3476):
 *   size  → small | default | large
 *   state → default | hover | focus | error | disabled
 *
 * `error` and `disabled` are props; `hover` and `focus` are interaction-driven.
 * Field spacing comes from the density theme's `input` tokens (shared with the
 * Select trigger). Colours come from the semantic intent system (neutral):
 *   default → neutral/default/default      hover → neutral/default/hover
 *   focus   → focus-ring border (2px)      error → danger border + red helper
 *   disabled→ shared disabled colours
 * Label uses the label scale, the value/placeholder the body scale (both
 * matched to size); helper text uses the caption scale.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Platform,
  type ViewStyle,
  type StyleProp,
  type KeyboardTypeOptions,
  type ReturnKeyTypeOptions,
} from 'react-native';
import { useTheme } from '../../theme';
import { Icon } from '../Icon';
import {
  fontFamily,
  fontWeight,
  label,
  body,
  caption,
  controlTokens,
} from '../../tokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type InputSize = 'small' | 'default' | 'large';

export type InputProps = {
  /** Form label above the field. */
  label?: string;
  /** Helper text below the field — turns red when `error` is set. */
  helperText?: string;
  /** Placeholder shown when the field is empty. */
  placeholder?: string;
  /** Controlled value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Change handler — receives the new text. */
  onChangeText?: (text: string) => void;
  /** Size variant — controls padding, gap, and typography scale. */
  size?: InputSize;
  /** Error state — danger border and red helper text. */
  error?: boolean;
  /** Disables interaction and applies muted styling. */
  disabled?: boolean;
  /** Leading icon — Material Symbols name string or a ReactNode. */
  leadingIcon?: string | React.ReactNode;
  /** Trailing icon — Material Symbols name string or a ReactNode. */
  trailingIcon?: string | React.ReactNode;
  /** Masks the text (passwords). */
  secureTextEntry?: boolean;
  /** Keyboard type for native platforms. */
  keyboardType?: KeyboardTypeOptions;
  /** Auto-capitalisation behaviour. */
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  /** Return key label for native platforms. */
  returnKeyType?: ReturnKeyTypeOptions;
  /** Submit (return key) handler. */
  onSubmitEditing?: () => void;
  /** Focus handler. */
  onFocus?: () => void;
  /** Blur handler. */
  onBlur?: () => void;
  /** Style override for the outer container. */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label — falls back to the label prop. */
  accessibilityLabel?: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ICON_SIZE = 16;

/** Maps input size → label typography scale (form label text) */
const LABEL_SCALE: Record<InputSize, keyof typeof label> = {
  small: 'sm',
  default: 'md',
  large: 'lg',
};

/** Maps input size → body typography scale (value + placeholder text) */
const BODY_SCALE: Record<InputSize, keyof typeof body> = {
  small: 'sm',
  default: 'md',
  large: 'lg',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Input({
  label: formLabel,
  helperText,
  placeholder,
  value,
  defaultValue,
  onChangeText,
  size = 'default',
  error = false,
  disabled = false,
  leadingIcon,
  trailingIcon,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  returnKeyType,
  onSubmitEditing,
  onFocus,
  onBlur,
  style,
  accessibilityLabel,
}: InputProps) {
  const { components, scheme } = useTheme();
  const sizeTokens = components.input[size];
  const labelTypo = label[LABEL_SCALE[size]];
  const bodyTypo = body[BODY_SCALE[size]];

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const disabledColors = scheme.disabled;
  const errorTokens = scheme.error;
  const textTokens = scheme.text;
  const neutral = scheme.intents.neutral.default;

  // Resolve field colours — state priority: disabled > error > focus > hover > default
  let bg: string;
  let borderColor: string;
  let borderWidth: number;
  if (disabled) {
    bg = disabledColors.bg;
    borderColor = disabledColors.border;
    borderWidth = controlTokens.borderWidth;
  } else if (isFocused) {
    bg = neutral.default.bg;
    borderColor = scheme.focusRing.color;
    borderWidth = controlTokens.focusRingWidth;
  } else if (error) {
    bg = neutral.default.bg;
    borderColor = errorTokens.border;
    borderWidth = controlTokens.borderWidth;
  } else if (isHovered) {
    bg = neutral.hover.bg;
    borderColor = neutral.hover.border;
    borderWidth = controlTokens.borderWidth;
  } else {
    bg = neutral.default.bg;
    borderColor = neutral.default.border;
    borderWidth = controlTokens.borderWidth;
  }

  const textColor = disabled ? disabledColors.fg : neutral.default.fg;
  const labelColor = disabled ? disabledColors.fg : neutral.default.fg;
  const helperColor = disabled
    ? disabledColors.fg
    : error
      ? errorTokens.fg
      : textTokens.description;
  const iconColor = disabled ? disabledColors.fg : neutral.default.fg;

  const resolvedLeading =
    typeof leadingIcon === 'string' ? (
      <Icon name={leadingIcon} size={ICON_SIZE} color={iconColor} />
    ) : (
      leadingIcon
    );
  const resolvedTrailing =
    typeof trailingIcon === 'string' ? (
      <Icon name={trailingIcon} size={ICON_SIZE} color={iconColor} />
    ) : (
      trailingIcon
    );

  return (
    <View
      style={[
        { alignSelf: 'stretch', gap: components.input.fieldGap },
        style,
      ]}
    >
      {formLabel ? (
        <Text
          style={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.medium,
            fontSize: labelTypo.fontSize,
            lineHeight: labelTypo.lineHeight,
            letterSpacing: labelTypo.letterSpacing,
            color: labelColor,
          }}
          selectable={false}
        >
          {formLabel}
        </Text>
      ) : null}

      <View
        onPointerEnter={disabled ? undefined : () => setIsHovered(true)}
        onPointerLeave={disabled ? undefined : () => setIsHovered(false)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: sizeTokens.gap,
          paddingHorizontal: sizeTokens.paddingX,
          paddingVertical: sizeTokens.paddingY,
          borderRadius: sizeTokens.borderRadius,
          borderWidth,
          borderColor,
          backgroundColor: bg,
        }}
      >
        {resolvedLeading ? (
          <View
            accessibilityElementsHidden
            importantForAccessibility="no"
            style={{ width: ICON_SIZE, height: ICON_SIZE }}
          >
            {resolvedLeading}
          </View>
        ) : null}

        <TextInput
          value={value}
          defaultValue={defaultValue}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={textTokens.placeholder}
          editable={!disabled}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          accessibilityLabel={accessibilityLabel || formLabel}
          style={{
            flex: 1,
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.regular,
            fontSize: bodyTypo.fontSize,
            lineHeight: bodyTypo.lineHeight,
            letterSpacing: bodyTypo.letterSpacing,
            color: textColor,
            padding: 0,
            ...(Platform.OS === 'web'
              ? ({ outlineWidth: 0 } as unknown as ViewStyle)
              : {}),
          }}
        />

        {resolvedTrailing ? (
          <View
            accessibilityElementsHidden
            importantForAccessibility="no"
            style={{ width: ICON_SIZE, height: ICON_SIZE }}
          >
            {resolvedTrailing}
          </View>
        ) : null}
      </View>

      {helperText ? (
        <Text
          style={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.regular,
            fontSize: caption.fontSize,
            lineHeight: caption.lineHeight,
            letterSpacing: caption.letterSpacing,
            color: helperColor,
          }}
          selectable={false}
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}
