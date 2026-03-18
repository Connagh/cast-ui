/**
 * Icon — renders a Material Symbols Outlined icon by name.
 *
 * Uses the Material Symbols font with ligature rendering.
 * The `name` prop matches Material Symbols names exactly
 * (e.g., "star", "close", "chevron_right", "add").
 *
 * Requires the MaterialSymbolsOutlined font to be loaded:
 *   - Web: Google Fonts CSS import
 *   - Expo: expo-font
 *   - Bare RN: font asset linking
 */

import React from 'react';
import { Text, Platform, type TextStyle, type StyleProp } from 'react-native';

export type IconProps = {
  /** Material Symbols icon name (e.g., "star", "close", "settings"). */
  name: string;
  /** Icon size in pixels. Defaults to 20. */
  size?: number;
  /** Icon colour. Defaults to "#374151" (neutral fg). */
  color?: string;
  /** Additional style overrides. */
  style?: StyleProp<TextStyle>;
};

const FONT_FAMILY = Platform.select({
  web: '"Material Symbols Outlined", sans-serif',
  default: 'MaterialSymbolsOutlined',
});

export function Icon({ name, size = 20, color = '#374151', style }: IconProps) {
  return (
    <Text
      selectable={false}
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[
        {
          fontFamily: FONT_FAMILY,
          fontSize: size,
          lineHeight: size,
          color,
          // Prevent ligature text from taking extra space
          width: size,
          height: size,
          textAlign: 'center',
          // Reset any inherited text styles
          fontWeight: '400',
          fontStyle: 'normal',
          letterSpacing: 0,
          textTransform: 'none',
          textDecorationLine: 'none',
        },
        style,
      ]}
    >
      {name}
    </Text>
  );
}
