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

export type AlertSeverity = 'info' | 'success' | 'error' | 'warning';

export interface AlertProps {
  /** Alert type. @default 'info' */
  severity?: AlertSeverity;
  /** Alert title. */
  title?: string;
  /** Alert body. */
  children: React.ReactNode;
  /** Dismiss handler. */
  onDismiss?: () => void;
}

// ---------------------------------------------------------------------------
// Severity → icon mapping
// ---------------------------------------------------------------------------

const SEVERITY_ICON: Record<AlertSeverity, string> = {
  info: '\u2139',
  success: '\u2713',
  error: '\u2717',
  warning: '\u26A0',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Alert({
  severity = 'info',
  title,
  children,
  onDismiss,
}: AlertProps) {
  const theme = useTheme();
  const al = theme.component.alert;
  const sem = theme.semantic;

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    padding: al.padding,
    gap: al.gap,
    borderRadius: al.cornerRadius,
    borderWidth: al.borderWidth,
    backgroundColor: al.background,
    borderColor: al.borderColor,
    alignItems: 'flex-start',
  };

  const iconStyle: TextStyle = {
    fontSize: al.iconSize,
    lineHeight: al.iconSize * 1.2,
    color: al.iconColor,
  };

  const contentStyle: ViewStyle = {
    flex: 1,
    gap: 2,
  };

  const titleStyle: TextStyle = {
    fontSize: al.titleSize,
    color: al.titleColor,
    ...resolveFont(al.fontFamily, al.titleFontWeight),
  };

  const bodyStyle: TextStyle = {
    fontSize: al.bodySize,
    color: al.bodyColor,
    ...resolveFont(al.fontFamily, sem.fontWeight.body),
  };

  const dismissStyle: TextStyle = {
    fontSize: al.iconSize,
    lineHeight: al.iconSize * 1.2,
    color: al.iconColor,
  };

  return (
    <View style={containerStyle} accessibilityRole="alert">
      <Text style={iconStyle}>{SEVERITY_ICON[severity]}</Text>
      <View style={contentStyle}>
        {title ? <Text style={titleStyle}>{title}</Text> : null}
        <Text style={bodyStyle}>{children}</Text>
      </View>
      {onDismiss ? (
        <Pressable onPress={onDismiss} accessibilityRole="button" accessibilityLabel="Dismiss">
          <Text style={dismissStyle}>{'\u2715'}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
