import React, { useState } from 'react';
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

export type FABVariant = 'standard' | 'extended';

export interface FABProps {
  /** Icon element. */
  icon: React.ReactNode;
  /** Extended label (renders extended variant). */
  label?: string;
  /** FAB type. @default 'standard' */
  variant?: FABVariant;
  /** Press handler. */
  onPress?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function FAB({
  icon,
  label,
  variant = 'standard',
  onPress,
}: FABProps) {
  const theme = useTheme();
  const ft = theme.component.fab;
  const sem = theme.semantic;

  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const resolveBackground = (): string => {
    if (pressed) return ft.pressedBackground;
    if (hovered) return ft.hoverBackground;
    return ft.background;
  };

  const isExtended = variant === 'extended' && label;

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: resolveBackground(),
    borderRadius: ft.cornerRadius,
    elevation: ft.elevation,
    ...(ft.elevation > 0
      ? ({ boxShadow: `0 ${ft.elevation}px ${ft.elevation * 2}px rgba(0,0,0,0.15)` } as Record<string, unknown>)
      : {}),
    ...(isExtended
      ? {
          paddingHorizontal: ft.extendedPaddingHorizontal,
          gap: ft.extendedGap,
          height: ft.size,
        }
      : {
          width: ft.size,
          height: ft.size,
        }),
  };

  const labelStyle: TextStyle = {
    fontSize: sem.fontSize.button,
    lineHeight: sem.lineHeight.button,
    letterSpacing: sem.letterSpacing.label,
    color: ft.iconColor,
    ...resolveFont(sem.fontFamily.interface, sem.fontWeight.button),
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={containerStyle}
      {...({
        onHoverIn: () => setHovered(true),
        onHoverOut: () => setHovered(false),
      } as Record<string, unknown>)}
      accessibilityRole="button"
    >
      {icon}
      {isExtended ? <Text style={labelStyle}>{label}</Text> : null}
    </Pressable>
  );
}
