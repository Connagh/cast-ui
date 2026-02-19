import React from 'react';
import { Pressable, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BackdropProps {
  /** Show/hide. @default false */
  visible?: boolean;
  /** Press to dismiss. */
  onPress?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Backdrop({ visible = false, onPress }: BackdropProps) {
  const theme = useTheme();
  const bk = theme.component.backdrop;

  if (!visible) return null;

  const style: ViewStyle = {
    ...({
      position: 'fixed',
    } as Record<string, unknown>),
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: bk.colour,
    opacity: bk.opacity / 100,
  };

  return <Pressable style={style} onPress={onPress} accessibilityRole="none" />;
}
