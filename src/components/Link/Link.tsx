import React, { useState } from 'react';
import {
  Text,
  Pressable,
  type TextStyle,
} from 'react-native';
import { useTheme, resolveFont } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LinkProps {
  /** Link URL. */
  href?: string;
  /** Link text. */
  children: React.ReactNode;
  /** Press handler (overrides href navigation). */
  onPress?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Link({ href, children, onPress }: LinkProps) {
  const theme = useTheme();
  const lk = theme.component.link;

  const [hovered, setHovered] = useState(false);

  const textStyle: TextStyle = {
    fontSize: lk.fontSize,
    lineHeight: lk.lineHeight,
    color: hovered ? lk.hoverColor : lk.color,
    textDecorationLine: 'underline',
    ...({ textUnderlineOffset: lk.underlineOffset } as Record<string, unknown>),
    ...resolveFont(lk.fontFamily, lk.fontWeight),
  };

  return (
    <Pressable
      onPress={onPress}
      {...({
        onHoverIn: () => setHovered(true),
        onHoverOut: () => setHovered(false),
        ...(href && !onPress ? { href } : {}),
      } as Record<string, unknown>)}
      accessibilityRole="link"
    >
      <Text style={textStyle}>{children}</Text>
    </Pressable>
  );
}
