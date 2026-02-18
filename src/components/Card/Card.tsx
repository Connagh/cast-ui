import React from 'react';
import {
  View,
  Text,
  type ViewStyle,
  type TextStyle,
  type ViewProps,
} from 'react-native';
import { useTheme, resolveFont } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CardProps extends Omit<ViewProps, 'style'> {
  /** Card title text. */
  title: string;
  /** Optional subtitle displayed below the title. */
  subtitle?: string;
  /** Optional body text. */
  body?: string;
  /** Optional actions row (e.g. Button components). */
  actions?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Card container for grouping related content.
 *
 * Renders as a React Native `View` with `Text` children – works identically
 * on iOS, Android, and Web (via React Native Web).
 */
export function Card({
  title,
  subtitle,
  body,
  actions,
  ...viewProps
}: CardProps) {
  const theme = useTheme();
  const ct = theme.component.card;
  const sem = theme.semantic;

  // --- build styles ----------------------------------------------------------

  const containerStyle: ViewStyle = {
    padding: ct.padding,
    gap: ct.gap,
    borderRadius: ct.cornerRadius,
    backgroundColor: ct.background,
    borderWidth: ct.strokeWidth,
    borderColor: ct.stroke,
    elevation: ct.elevation,
    // Web shadow for elevation (React Native Web doesn't map elevation to CSS)
    ...(ct.elevation > 0
      ? ({ boxShadow: '0 1px 3px rgba(0,0,0,0.12)' } as Record<string, unknown>)
      : {}),
  };

  const titleStyle: TextStyle = {
    fontSize: ct.headingSize,
    lineHeight: sem.lineHeight.h3,
    letterSpacing: sem.letterSpacing.heading,
    color: ct.headingColor,
    ...resolveFont(ct.headingFontFamily, ct.headingWeight),
  };

  const subtitleStyle: TextStyle = {
    fontSize: sem.fontSize.small,
    lineHeight: sem.lineHeight.small,
    letterSpacing: sem.letterSpacing.body,
    color: ct.bodyColor,
    ...resolveFont(sem.fontFamily.interface, sem.fontWeight.body),
  };

  const bodyStyle: TextStyle = {
    fontSize: ct.bodySize,
    lineHeight: sem.lineHeight.body,
    letterSpacing: sem.letterSpacing.body,
    color: ct.bodyColor,
    ...resolveFont(ct.bodyFontFamily, ct.bodyWeight),
  };

  const actionsStyle: ViewStyle = {
    flexDirection: 'row',
    gap: ct.gap,
  };

  return (
    <View {...viewProps} style={containerStyle} accessibilityRole="summary">
      <Text style={titleStyle}>{title}</Text>
      {subtitle ? <Text style={subtitleStyle}>{subtitle}</Text> : null}
      {body ? <Text style={bodyStyle}>{body}</Text> : null}
      {actions ? <View style={actionsStyle}>{actions}</View> : null}
    </View>
  );
}
