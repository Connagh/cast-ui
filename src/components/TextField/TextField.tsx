import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  type ViewStyle,
  type TextStyle,
  type TextInputProps,
} from 'react-native';
import { useTheme, resolveFont } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  /** Input value. */
  value?: string;
  /** Change handler. */
  onChangeText?: (text: string) => void;
  /** Field label displayed above the input. */
  label?: string;
  /** Placeholder text. */
  placeholder?: string;
  /** Helper or error message displayed below the input. */
  helperText?: string;
  /** Error state. @default false */
  error?: boolean;
  /** Disabled state. @default false */
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TextField({
  value,
  onChangeText,
  label,
  placeholder,
  helperText,
  error = false,
  disabled = false,
  ...inputProps
}: TextFieldProps) {
  const theme = useTheme();
  const tf = theme.component.textField;
  const sem = theme.semantic;

  const [focused, setFocused] = useState(false);

  const resolveBorderColor = (): string => {
    if (error) return tf.errorBorderColor;
    if (focused) return tf.focusBorderColor;
    return tf.borderColor;
  };

  // --- styles ----------------------------------------------------------------

  const containerStyle: ViewStyle = {
    gap: 4,
    opacity: disabled ? sem.opacity.disabled : 1,
  };

  const labelStyle: TextStyle = {
    fontSize: tf.labelSize,
    lineHeight: tf.labelLineHeight,
    color: tf.labelColor,
    ...resolveFont(tf.labelFontFamily, tf.labelFontWeight),
  };

  const inputContainerStyle: ViewStyle = {
    paddingHorizontal: tf.paddingHorizontal,
    paddingVertical: tf.paddingVertical,
    borderRadius: tf.cornerRadius,
    borderWidth: tf.borderWidth,
    backgroundColor: tf.background,
    borderColor: resolveBorderColor(),
  };

  const inputStyle: TextStyle = {
    fontSize: tf.textSize,
    lineHeight: tf.textLineHeight,
    color: tf.textColor,
    padding: 0,
    ...resolveFont(tf.fontFamily, tf.textFontWeight),
  };

  const helperStyle: TextStyle = {
    fontSize: tf.helperSize,
    lineHeight: tf.helperLineHeight,
    color: error ? tf.errorColor : tf.helperColor,
    ...resolveFont(tf.helperFontFamily, tf.helperFontWeight),
  };

  return (
    <View style={containerStyle}>
      {label ? <Text style={labelStyle}>{label}</Text> : null}
      <View style={inputContainerStyle}>
        <TextInput
          {...inputProps}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={tf.placeholderColor}
          editable={!disabled}
          onFocus={(e) => {
            setFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            inputProps.onBlur?.(e);
          }}
          style={inputStyle}
        />
      </View>
      {helperText ? <Text style={helperStyle}>{helperText}</Text> : null}
    </View>
  );
}
