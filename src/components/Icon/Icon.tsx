/**
 * Icon — renders a Material Symbols Outlined icon by name.
 *
 * Why Material Symbols Outlined?
 *   - It's the icon set the Cast UI Figma uses (star, check, close,
 *     keyboard_arrow_down, …), so names map 1:1 to the design with zero drift.
 *   - Apache-2.0 licensed and free for commercial use.
 *   - It's a single *variable* font, so one asset covers every icon plus the
 *     fill / weight / grade / optical-size axes — keeping Cast UI's zero
 *     runtime dependencies (no per-icon SVG packages, no vector-icons dep).
 *
 * Rendering uses font ligatures: the `name` text (e.g. "chevron_right") is
 * shaped into the glyph by the font. Requires the font to be loaded — on web
 * both the `MaterialSymbolsOutlined` and `Material Symbols Outlined` family
 * names are accepted, so any one of these paths works:
 *   - Web: Google Fonts CSS import (see .storybook/preview-head.html), or
 *     self-host the same `Material Symbols Outlined` family.
 *   - Expo (iOS, Android, and web): load `MaterialSymbolsOutlined` via
 *     expo-font / useFonts — one registration covers all three platforms.
 *   - Bare RN: link the .ttf as a font asset (react-native.config.js / Xcode).
 *
 * The fill / weight / grade / opticalSize axes are applied via CSS
 * `fontVariationSettings` and therefore take effect on web (where the variable
 * font is loaded). On native they require a matching static/variable font cut.
 */

import React from 'react';
import { Text, Platform, type TextStyle, type StyleProp } from 'react-native';
import { iconSize, type IconSize } from '../../tokens';

export type IconProps = {
  /** Material Symbols icon name (e.g., "star", "close", "settings"). */
  name: string;
  /** Icon size — a named scale ('xs' | 'small' | 'default' | 'large' = 12/16/20/24) or an explicit pixel number. Defaults to 20. */
  size?: IconSize | number;
  /** Icon colour. Defaults to "#374151" (neutral fg). */
  color?: string;
  /** Filled vs outlined glyph (FILL axis, 0–1). Defaults to false (outlined). */
  fill?: boolean;
  /** Stroke weight (wght axis, 100–700). Defaults to 400. */
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  /** Emphasis grade (GRAD axis, -25–200). Defaults to 0. */
  grade?: number;
  /** Optical size (opsz axis, 20–48). Defaults to the icon `size`. */
  opticalSize?: number;
  /** Additional style overrides. */
  style?: StyleProp<TextStyle>;
};

// Web accepts both family names so the Google-Fonts CSS path (spaced name)
// and the expo-font/useFonts path (unspaced key) work without consumer
// configuration. Fonts registered via expo-font on web keep their object key
// as the family name.
const FONT_FAMILY = Platform.select({
  web: 'MaterialSymbolsOutlined, "Material Symbols Outlined", sans-serif',
  default: 'MaterialSymbolsOutlined',
});

export function Icon({
  name,
  size = 20,
  color = '#374151',
  fill = false,
  weight = 400,
  grade = 0,
  opticalSize,
  style,
}: IconProps) {
  const px = typeof size === 'number' ? size : iconSize[size];
  // Material Symbols variable-font axes — applied on web via fontVariationSettings.
  const opsz = Math.min(48, Math.max(20, opticalSize ?? px));
  const variationStyle =
    Platform.OS === 'web'
      ? ({
          fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opsz}`,
        } as unknown as TextStyle)
      : null;

  return (
    <Text
      selectable={false}
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[
        {
          fontFamily: FONT_FAMILY,
          fontSize: px,
          lineHeight: px,
          color,
          // Prevent ligature text from taking extra space
          width: px,
          height: px,
          textAlign: 'center',
          // Reset any inherited text styles
          fontWeight: '400',
          fontStyle: 'normal',
          letterSpacing: 0,
          textTransform: 'none',
          textDecorationLine: 'none',
        },
        variationStyle,
        style,
      ]}
    >
      {name}
    </Text>
  );
}
