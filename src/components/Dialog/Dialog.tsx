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

export interface DialogProps {
  /** Show/hide. @default false */
  visible?: boolean;
  /** Dialog title. */
  title: string;
  /** Dialog body. */
  children: React.ReactNode;
  /** Action buttons. */
  actions?: React.ReactNode;
  /** Dismiss handler. */
  onDismiss?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Dialog({
  visible = false,
  title,
  children,
  actions,
}: DialogProps) {
  const theme = useTheme();
  const dl = theme.component.dialog;

  if (!visible) return null;

  const containerStyle: ViewStyle = {
    padding: dl.padding,
    gap: dl.gap,
    borderRadius: dl.cornerRadius,
    backgroundColor: dl.background,
    elevation: dl.elevation,
    ...(dl.elevation > 0
      ? ({ boxShadow: `0 ${dl.elevation}px ${dl.elevation * 2}px rgba(0,0,0,0.2)` } as Record<string, unknown>)
      : {}),
  };

  const titleStyle: TextStyle = {
    fontSize: dl.titleSize,
    lineHeight: dl.titleLineHeight,
    color: dl.titleColor,
    ...resolveFont(dl.titleFontFamily, dl.titleFontWeight),
  };

  const bodyStyle: TextStyle = {
    fontSize: dl.bodySize,
    lineHeight: dl.bodyLineHeight,
    color: dl.bodyColor,
    ...resolveFont(dl.bodyFontFamily, dl.bodyFontWeight),
  };

  const actionsStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: dl.gap,
  };

  return (
    <View style={containerStyle} accessibilityRole="alert">
      <Text style={titleStyle}>{title}</Text>
      <Text style={bodyStyle}>{children}</Text>
      {actions ? <View style={actionsStyle}>{actions}</View> : null}
    </View>
  );
}
