import React from 'react';
import { View, type ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SkeletonVariant = 'rectangle' | 'circle' | 'text';

export interface SkeletonProps {
  /** Shape type. @default 'rectangle' */
  variant?: SkeletonVariant;
  /** Width. @default '100%' */
  width?: number | string;
  /** Height. @default 16 */
  height?: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Skeleton({
  variant = 'rectangle',
  width = '100%',
  height = 16,
}: SkeletonProps) {
  const theme = useTheme();
  const sk = theme.component.skeleton;

  const baseStyle: ViewStyle = {
    backgroundColor: sk.background,
    overflow: 'hidden',
  };

  const variantStyle: ViewStyle =
    variant === 'circle'
      ? {
          width: sk.circleSize,
          height: sk.circleSize,
          borderRadius: sk.circleSize / 2,
        }
      : {
          width: width as number,
          height,
          borderRadius: variant === 'text' ? sk.cornerRadius / 2 : sk.cornerRadius,
        };

  return <View style={[baseStyle, variantStyle]} accessibilityRole="none" />;
}
