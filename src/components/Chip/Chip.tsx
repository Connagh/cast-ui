import React from 'react';
import {
  Pressable,
  Text,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useTheme, resolveFont } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChipProps {
  /** Chip text. */
  label: string;
  /** Selected state. @default false */
  selected?: boolean;
  /** Press handler. */
  onPress?: () => void;
  /** Leading icon. */
  icon?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Chip({
  label,
  selected = false,
  onPress,
  icon,
}: ChipProps) {
  const theme = useTheme();
  const ch = theme.component.chip;

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ch.gap,
    paddingHorizontal: ch.paddingHorizontal,
    paddingVertical: ch.paddingVertical,
    borderRadius: ch.cornerRadius,
    backgroundColor: selected ? ch.selectedBackground : ch.background,
    borderWidth: ch.borderWidth,
    borderColor: ch.borderColor,
  };

  const textStyle: TextStyle = {
    fontSize: ch.textSize,
    lineHeight: ch.lineHeight,
    color: selected ? ch.selectedContentColor : ch.contentColor,
    ...resolveFont(ch.fontFamily, ch.fontWeight),
  };

  return (
    <Pressable
      onPress={onPress}
      style={containerStyle}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      {icon ?? null}
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
}
