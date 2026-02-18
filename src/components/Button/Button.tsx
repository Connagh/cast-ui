import React, { useState } from 'react';
import {
  Pressable,
  Text,
  type ViewStyle,
  type TextStyle,
  type PressableProps,
} from 'react-native';
import { useTheme, resolveFont } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ButtonVariant = 'filled' | 'outline' | 'text';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  /** Button label text. */
  label: string;
  /** Visual variant. @default 'filled' */
  variant?: ButtonVariant;
  /** Override background color. */
  backgroundColor?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Primary UI component for user interaction.
 *
 * Renders as a React Native `Pressable` with `Text` – works identically
 * on iOS, Android, and Web (via React Native Web).
 */
export function Button({
  label,
  variant = 'filled',
  backgroundColor,
  disabled = false,
  ...pressableProps
}: ButtonProps) {
  const theme = useTheme();
  const bt = theme.component.button;

  const [hovered, setHovered] = useState(false);

  // --- resolve colours per variant + state -----------------------------------
  const resolveBackground = (): string => {
    if (disabled) return bt.state.disabledBackground;
    if (backgroundColor) return backgroundColor;

    const variantTokens = bt[variant];
    const base = variantTokens.background;

    if (hovered) return bt.state.hoverBackground;
    return base;
  };

  const resolveContent = (): string => {
    if (disabled) return bt.state.disabledContent;
    return bt[variant].content;
  };

  const resolveBorder = (): string | undefined => {
    if (variant !== 'outline') return undefined;
    if (disabled) return bt.state.disabledContent;
    return bt.outline.border;
  };

  // --- build styles ----------------------------------------------------------
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: bt.gap,
    paddingHorizontal: bt.paddingHorizontal,
    paddingVertical: bt.paddingVertical,
    borderRadius: bt.cornerRadius,
    backgroundColor: resolveBackground(),
    ...(variant === 'outline' && {
      borderWidth: bt.borderWidth,
      borderColor: resolveBorder(),
    }),
    ...(variant === 'text' && {
      backgroundColor: 'transparent',
    }),
    opacity: disabled ? 0.6 : 1,
  };

  const textStyle: TextStyle = {
    color: resolveContent(),
    fontSize: bt.textSize,
    lineHeight: bt.lineHeight,
    ...resolveFont(bt.fontFamily, bt.fontWeight),
  };

  return (
    <Pressable
      {...pressableProps}
      disabled={disabled}
      style={containerStyle}
      // Web-only hover events (React Native Web supports these)
      {...({
        onHoverIn: () => setHovered(true),
        onHoverOut: () => setHovered(false),
      } as Record<string, unknown>)}
      accessibilityRole="button"
    >
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
}
