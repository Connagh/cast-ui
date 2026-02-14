import React, { useState } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  type PressableProps,
} from 'react-native';
import { useTheme } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ButtonVariant = 'filled' | 'outline' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  /** Button label text. */
  label: string;
  /** Visual variant. @default 'filled' */
  variant?: ButtonVariant;
  /** Size preset.  Scales padding and font relative to token base. @default 'medium' */
  size?: ButtonSize;
  /** Override background color. */
  backgroundColor?: string;
}

// ---------------------------------------------------------------------------
// Size multipliers (relative to token base values)
// ---------------------------------------------------------------------------

const SIZE_SCALE: Record<ButtonSize, number> = {
  small: 0.75,
  medium: 1,
  large: 1.25,
};

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
  size = 'medium',
  backgroundColor,
  disabled = false,
  ...pressableProps
}: ButtonProps) {
  const theme = useTheme();
  const bt = theme.component.button;
  const scale = SIZE_SCALE[size];

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
    gap: bt.gap * scale,
    paddingHorizontal: bt.paddingHorizontal * scale,
    paddingVertical: bt.paddingVertical * scale,
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

  const fontFamily = bt.fontFamily === 'system-ui' ? undefined : bt.fontFamily;

  const textStyle: TextStyle = {
    color: resolveContent(),
    fontSize: bt.textSize * scale,
    fontWeight: String(bt.fontWeight) as TextStyle['fontWeight'],
    lineHeight: bt.textSize * scale * bt.lineHeight,
    ...(fontFamily ? { fontFamily } : {}),
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
