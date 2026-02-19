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

export interface SwitchProps {
  /** On/off state. @default false */
  value?: boolean;
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

export function Switch({
  value = false,
  onValueChange,
  label,
  disabled = false,
}: SwitchProps) {
  const theme = useTheme();
  const sw = theme.component.switch;

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sw.gap,
    opacity: disabled ? theme.semantic.opacity.disabled / 100 : 1,
  };

  const trackStyle: ViewStyle = {
    width: sw.trackWidth,
    height: sw.trackHeight,
    borderRadius: sw.trackCornerRadius,
    backgroundColor: value ? sw.trackOnBackground : sw.trackOffBackground,
    paddingHorizontal: sw.thumbOffset,
    justifyContent: 'center',
  };

  const thumbStyle: ViewStyle = {
    width: sw.thumbSize,
    height: sw.thumbSize,
    borderRadius: sw.thumbCornerRadius,
    backgroundColor: value ? sw.thumbOnBackground : sw.thumbOffBackground,
    alignSelf: value ? 'flex-end' : 'flex-start',
  };

  const labelStyle: TextStyle = {
    fontSize: sw.labelSize,
    lineHeight: sw.labelLineHeight,
    color: sw.labelColour,
    ...resolveFont(sw.labelFontFamily, sw.labelFontWeight),
  };

  return (
    <Pressable
      onPress={() => !disabled && onValueChange?.(!value)}
      style={containerStyle}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
    >
      <View style={trackStyle}>
        <View style={thumbStyle} />
      </View>
      {label ? <Text style={labelStyle}>{label}</Text> : null}
    </Pressable>
  );
}
