import React from 'react';
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

export interface SpeedDialAction {
  icon: React.ReactNode;
  label?: string;
  onPress: () => void;
}

export interface SpeedDialProps {
  /** Main FAB icon. */
  icon: React.ReactNode;
  /** Action items. */
  actions: SpeedDialAction[];
  /** Open state. @default false */
  open?: boolean;
  /** Open state change handler. */
  onOpenChange?: (open: boolean) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SpeedDial({
  icon,
  actions,
  open = false,
  onOpenChange,
}: SpeedDialProps) {
  const theme = useTheme();
  const sd = theme.component.speedDial;
  const ft = theme.component.fab;
  const sem = theme.semantic;

  const containerStyle: ViewStyle = {
    alignItems: 'center',
    gap: sd.gap,
  };

  const actionStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sd.gap,
  };

  const actionButtonStyle: ViewStyle = {
    width: sd.actionSize,
    height: sd.actionSize,
    borderRadius: sd.actionCornerRadius,
    backgroundColor: sd.actionBackground,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: sd.actionElevation,
    ...(sd.actionElevation > 0
      ? ({ boxShadow: `0 1px ${sd.actionElevation * 2}px rgba(0,0,0,0.15)` } as Record<string, unknown>)
      : {}),
  };

  const labelStyle: TextStyle = {
    fontSize: sem.fontSize.caption,
    lineHeight: sem.lineHeight.caption,
    color: sem.colour.onSurface,
    ...resolveFont(sem.fontFamily.interface, sem.fontWeight.body),
  };

  const mainButtonStyle: ViewStyle = {
    width: ft.size,
    height: ft.size,
    borderRadius: ft.cornerRadius,
    backgroundColor: ft.background,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: ft.elevation,
    ...(ft.elevation > 0
      ? ({ boxShadow: `0 ${ft.elevation}px ${ft.elevation * 2}px rgba(0,0,0,0.15)` } as Record<string, unknown>)
      : {}),
  };

  return (
    <View style={containerStyle}>
      {open
        ? actions.map((a, i) => (
            <View key={i} style={actionStyle}>
              {a.label ? <Text style={labelStyle}>{a.label}</Text> : null}
              <Pressable onPress={a.onPress} style={actionButtonStyle} accessibilityRole="button">
                {a.icon}
              </Pressable>
            </View>
          ))
        : null}
      <Pressable
        onPress={() => onOpenChange?.(!open)}
        style={mainButtonStyle}
        accessibilityRole="button"
      >
        {icon}
      </Pressable>
    </View>
  );
}
