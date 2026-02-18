import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useTheme, resolveFont } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AutocompleteOption {
  label: string;
  value: string;
}

export interface AutocompleteProps {
  /** Option list. */
  options: AutocompleteOption[];
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

export function Autocomplete({
  options,
  value,
  onSelect,
  label,
  placeholder,
}: AutocompleteProps) {
  const theme = useTheme();
  const ac = theme.component.autocomplete;
  const tf = theme.component.textField;
  const sem = theme.semantic;

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((o) => o.value === value);
  const displayValue = query || selectedOption?.label || '';

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelect = (opt: AutocompleteOption) => {
    onSelect?.(opt.value);
    setQuery('');
    setIsOpen(false);
  };

  // --- styles (input uses textField tokens) ----------------------------------

  const containerStyle: ViewStyle = {
    gap: 4,
  };

  const labelStyle: TextStyle = {
    fontSize: tf.labelSize,
    color: tf.labelColor,
    ...resolveFont(tf.fontFamily, sem.fontWeight.button),
  };

  const inputContainerStyle: ViewStyle = {
    paddingHorizontal: tf.paddingHorizontal,
    paddingVertical: tf.paddingVertical,
    borderRadius: tf.cornerRadius,
    borderWidth: tf.borderWidth,
    backgroundColor: tf.background,
    borderColor: isOpen ? tf.focusBorderColor : tf.borderColor,
  };

  const inputStyle: TextStyle = {
    fontSize: tf.textSize,
    color: tf.textColor,
    padding: 0,
    ...resolveFont(tf.fontFamily, sem.fontWeight.body),
  };

  // --- styles (dropdown uses autocomplete tokens) ----------------------------

  const dropdownStyle: ViewStyle = {
    backgroundColor: ac.dropdownBackground,
    borderRadius: ac.dropdownCornerRadius,
    elevation: ac.dropdownElevation,
    ...(ac.dropdownElevation > 0
      ? ({ boxShadow: `0 2px ${ac.dropdownElevation * 2}px rgba(0,0,0,0.15)` } as Record<string, unknown>)
      : {}),
    marginTop: 4,
  };

  const optionStyle: ViewStyle = {
    paddingHorizontal: ac.optionPaddingHorizontal,
    paddingVertical: ac.optionPaddingVertical,
  };

  const optionTextStyle: TextStyle = {
    fontSize: ac.optionTextSize,
    color: ac.optionTextColor,
    ...resolveFont(ac.fontFamily, sem.fontWeight.body),
  };

  return (
    <View style={containerStyle}>
      {label ? <Text style={labelStyle}>{label}</Text> : null}
      <View style={inputContainerStyle}>
        <TextInput
          value={displayValue}
          onChangeText={(text) => {
            setQuery(text);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          placeholderTextColor={tf.placeholderColor}
          style={inputStyle}
        />
      </View>
      {isOpen && filtered.length > 0 ? (
        <View style={dropdownStyle}>
          {filtered.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => handleSelect(opt)}
              style={optionStyle}
            >
              <Text style={optionTextStyle}>{opt.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
