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

export interface BadgeProps {
  /** Badge content (omit for dot variant). */
  content?: string | number;
  /** Show/hide badge. @default true */
  visible?: boolean;
  /** Element to badge. */
  children?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Badge({
  content,
  visible = true,
  children,
}: BadgeProps) {
  const theme = useTheme();
  const bd = theme.component.badge;

  const isDot = content === undefined || content === null;

  const wrapperStyle: ViewStyle = {
    alignSelf: 'flex-start',
  };

  const badgeStyle: ViewStyle = {
    position: children ? 'absolute' : 'relative',
    top: children ? -bd.minSize / 2 : 0,
    right: children ? -bd.minSize / 2 : 0,
    minWidth: bd.minSize,
    minHeight: bd.minSize,
    borderRadius: bd.cornerRadius,
    backgroundColor: bd.background,
    alignItems: 'center',
    justifyContent: 'center',
    ...(isDot
      ? { width: bd.minSize / 2, height: bd.minSize / 2 }
      : { paddingHorizontal: bd.paddingHorizontal }),
  };

  const textStyle: TextStyle = {
    fontSize: bd.textSize,
    lineHeight: bd.lineHeight,
    color: bd.contentColor,
    textAlign: 'center',
    ...resolveFont(bd.fontFamily, bd.fontWeight),
  };

  if (!visible) return children ? <View style={wrapperStyle}>{children}</View> : null;

  const badge = (
    <View style={badgeStyle}>
      {!isDot ? <Text style={textStyle}>{String(content)}</Text> : null}
    </View>
  );

  if (!children) return badge;

  return (
    <View style={wrapperStyle}>
      {children}
      {badge}
    </View>
  );
}
