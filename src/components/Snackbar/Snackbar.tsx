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

export interface SnackbarProps {
  /** Snackbar text. */
  message: string;
  /** Action label. */
  action?: string;
  /** Action handler. */
  onAction?: () => void;
  /** Show/hide. @default false */
  visible?: boolean;
  /** Auto-dismiss ms. @default 4000 */
  duration?: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Snackbar({
  message,
  action,
  onAction,
  visible = false,
}: SnackbarProps) {
  const theme = useTheme();
  const sn = theme.component.snackbar;
  const sem = theme.semantic;

  if (!visible) return null;

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    padding: sn.padding,
    gap: sn.gap,
    borderRadius: sn.cornerRadius,
    backgroundColor: sn.background,
    elevation: sn.elevation,
    ...(sn.elevation > 0
      ? ({ boxShadow: `0 ${sn.elevation}px ${sn.elevation * 2}px rgba(0,0,0,0.15)` } as Record<string, unknown>)
      : {}),
  };

  const messageStyle: TextStyle = {
    flex: 1,
    fontSize: sn.textSize,
    lineHeight: sn.lineHeight,
    color: sn.contentColor,
    ...resolveFont(sn.fontFamily, sn.fontWeight),
  };

  const actionStyle: TextStyle = {
    fontSize: sem.fontSize.button,
    lineHeight: sem.lineHeight.button,
    color: sn.actionColor,
    ...resolveFont(sn.fontFamily, sem.fontWeight.button),
  };

  return (
    <View style={containerStyle} accessibilityRole="alert">
      <Text style={messageStyle}>{message}</Text>
      {action ? (
        <Pressable onPress={onAction} accessibilityRole="button">
          <Text style={actionStyle}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
