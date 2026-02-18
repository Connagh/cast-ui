import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DividerProps {
  /** Orientation. @default 'horizontal' */
  direction?: 'horizontal' | 'vertical';
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Divider({ direction = 'horizontal' }: DividerProps) {
  const theme = useTheme();
  const dv = theme.component.divider;

  const style: ViewStyle =
    direction === 'horizontal'
      ? {
          height: dv.thickness,
          backgroundColor: dv.color,
          marginVertical: dv.margin,
          alignSelf: 'stretch',
        }
      : {
          width: dv.thickness,
          backgroundColor: dv.color,
          marginHorizontal: dv.margin,
          alignSelf: 'stretch',
        };

  return <View style={style} accessibilityRole="none" />;
}
