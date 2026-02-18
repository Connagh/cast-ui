import React from 'react';
import { Text, type TextStyle } from 'react-native';
import { useTheme } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type IconSize = 'small' | 'medium' | 'large';

export interface IconProps {
  /** Icon identifier (rendered as text for now; swap with icon library). */
  name: string;
  /** Icon size. @default 'medium' */
  size?: IconSize;
  /** Icon color. */
  color?: string;
}

// ---------------------------------------------------------------------------
// Size → token key mapping
// ---------------------------------------------------------------------------

const SIZE_MAP: Record<IconSize, 'sizeSmall' | 'sizeMedium' | 'sizeLarge'> = {
  small: 'sizeSmall',
  medium: 'sizeMedium',
  large: 'sizeLarge',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Icon({
  name,
  size = 'medium',
  color,
}: IconProps) {
  const theme = useTheme();
  const ic = theme.component.icon;
  const resolved = ic[SIZE_MAP[size]];

  const style: TextStyle = {
    fontSize: resolved,
    lineHeight: resolved,
    width: resolved,
    height: resolved,
    textAlign: 'center',
    color: color ?? theme.semantic.color.onSurface,
  };

  return (
    <Text style={style} accessibilityRole="image" accessibilityLabel={name}>
      {name}
    </Text>
  );
}
