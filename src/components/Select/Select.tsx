import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useTheme, resolveFont } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  /** Option list. */
  options: SelectOption[];
  /** Selected value. */
  value?: string;
  /** Selection handler. */
  onSelect?: (value: string) => void;
  /** Field label. */
  label?: string;
  /** Placeholder. */
  placeholder?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Select({
  options,
  value,
  onSelect,
  label,
  placeholder,
}: SelectProps) {
  const theme = useTheme();
  const sl = theme.component.select;
  const tf = theme.component.textField;

  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((o) => o.value === value);

  // --- styles (trigger uses textField tokens) --------------------------------

  const containerStyle: ViewStyle = {
    gap: 4,
  };

  const labelStyle: TextStyle = {
    fontSize: tf.labelSize,
    lineHeight: tf.labelLineHeight,
    color: tf.labelColor,
    ...resolveFont(tf.labelFontFamily, tf.labelFontWeight),
  };

  const triggerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tf.paddingHorizontal,
    paddingVertical: tf.paddingVertical,
    borderRadius: tf.cornerRadius,
    borderWidth: tf.borderWidth,
    backgroundColor: tf.background,
    borderColor: isOpen ? tf.focusBorderColor : tf.borderColor,
  };

  const triggerTextStyle: TextStyle = {
    fontSize: tf.textSize,
    lineHeight: tf.textLineHeight,
    color: selectedOption ? tf.textColor : tf.placeholderColor,
    flex: 1,
    ...resolveFont(tf.fontFamily, tf.textFontWeight),
  };

  const indicatorStyle: TextStyle = {
    color: sl.indicatorColor,
    fontSize: 12,
  };

  // --- styles (dropdown uses select tokens) ----------------------------------

  const dropdownStyle: ViewStyle = {
    backgroundColor: sl.dropdownBackground,
    borderRadius: sl.dropdownCornerRadius,
    elevation: sl.dropdownElevation,
    ...(sl.dropdownElevation > 0
      ? ({ boxShadow: `0 2px ${sl.dropdownElevation * 2}px rgba(0,0,0,0.15)` } as Record<string, unknown>)
      : {}),
    marginTop: 4,
  };

  const optionStyle = (optValue: string): ViewStyle => ({
    paddingHorizontal: sl.optionPaddingHorizontal,
    paddingVertical: sl.optionPaddingVertical,
    backgroundColor:
      optValue === value ? sl.selectedOptionBackground : 'transparent',
  });

  const optionTextStyle: TextStyle = {
    fontSize: sl.optionTextSize,
    lineHeight: sl.optionLineHeight,
    color: sl.optionTextColor,
    ...resolveFont(sl.fontFamily, sl.optionFontWeight),
  };

  return (
    <View style={containerStyle}>
      {label ? <Text style={labelStyle}>{label}</Text> : null}
      <Pressable style={triggerStyle} onPress={() => setIsOpen(!isOpen)}>
        <Text style={triggerTextStyle}>
          {selectedOption?.label ?? placeholder ?? ''}
        </Text>
        <Text style={indicatorStyle}>{isOpen ? '\u25B2' : '\u25BC'}</Text>
      </Pressable>
      {isOpen ? (
        <View style={dropdownStyle}>
          {options.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => {
                onSelect?.(opt.value);
                setIsOpen(false);
              }}
              style={optionStyle(opt.value)}
            >
              <Text style={optionTextStyle}>{opt.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
