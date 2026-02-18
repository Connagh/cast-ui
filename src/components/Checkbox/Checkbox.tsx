import React from 'react';
import {
  Pressable,
  View,
  Text,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useTheme, resolveFont } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CheckboxProps {
  /** Checked state. @default false */
  checked?: boolean;
  /** Toggle handler. */
  onValueChange?: (value: boolean) => void;
  /** Label text. */
  label?: string;
  /** Disabled state. @default false */
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Checkbox({
  checked = false,
  onValueChange,
  label,
  disabled = false,
}: CheckboxProps) {
  const theme = useTheme();
  const cb = theme.component.checkbox;

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: cb.gap,
    opacity: disabled ? cb.disabledOpacity : 1,
  };

  const boxStyle: ViewStyle = {
    width: cb.size,
    height: cb.size,
    borderRadius: cb.cornerRadius,
    borderWidth: cb.borderWidth,
    borderColor: checked ? cb.checkedBackground : cb.borderColor,
    backgroundColor: checked ? cb.checkedBackground : 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const checkmarkStyle: TextStyle = {
    color: cb.checkedIconColor,
    fontSize: cb.size * 0.6,
    lineHeight: cb.size * 0.7,
  };

  const labelStyle: TextStyle = {
    fontSize: cb.labelSize,
    color: cb.labelColor,
    ...resolveFont(cb.labelFontFamily, theme.semantic.fontWeight.body),
  };

  return (
    <Pressable
      onPress={() => !disabled && onValueChange?.(!checked)}
      style={containerStyle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
    >
      <View style={boxStyle}>
        {checked ? <Text style={checkmarkStyle}>{'\u2713'}</Text> : null}
      </View>
      {label ? <Text style={labelStyle}>{label}</Text> : null}
    </Pressable>
  );
}
