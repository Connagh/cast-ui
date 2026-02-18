import React from 'react';
import {
  View,
  Text,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useTheme, resolveFont } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AppBarProps {
  /** AppBar title. */
  title: string;
  /** Leading icon/button. */
  leading?: React.ReactNode;
  /** Trailing icons. */
  trailing?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AppBar({ title, leading, trailing }: AppBarProps) {
  const theme = useTheme();
  const ab = theme.component.appBar;

  const containerStyle: ViewStyle = {
    height: ab.height,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ab.paddingHorizontal,
    backgroundColor: ab.background,
    borderBottomWidth: 1,
    borderBottomColor: ab.borderColor,
    elevation: ab.elevation,
    ...(ab.elevation > 0
      ? ({ boxShadow: `0 1px ${ab.elevation}px rgba(0,0,0,0.1)` } as Record<string, unknown>)
      : {}),
  };

  const titleStyle: TextStyle = {
    flex: 1,
    fontSize: ab.titleSize,
    color: ab.titleColor,
    ...resolveFont(ab.titleFontFamily, ab.titleFontWeight),
  };

  return (
    <View style={containerStyle} accessibilityRole="header">
      {leading ?? null}
      <Text style={titleStyle}>{title}</Text>
      {trailing ?? null}
    </View>
  );
}
