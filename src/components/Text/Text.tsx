/**
 * Text — the typographic primitive of Cast UI, rendering the full type ramp.
 *
 * Maps to the Figma <Text> component (node 769:2710):
 *   type → caption | label-sm/md/lg | body-sm/md/lg | title-sm/md/lg |
 *          heading-sm/md/lg | display-sm/md/lg
 *
 * Each `type` applies the matching Figma Text Style — Inter at the scale's
 * size/line-height/tracking, weighted per family: label and title render
 * medium (500), heading renders semibold (600), body, caption, and display
 * render regular (400).
 *
 * Colour defaults to the active scheme's text/primary variable (cool-grey/700
 * in light mode, cool-grey/200 in dark) so text follows `colorMode`
 * automatically; pass `color` to override. Typography is constant across
 * densities — Text reads no density tokens.
 *
 * Requires the Inter font to be loaded — see the README "Fonts" section.
 */

import React from 'react';
import { Text as RNText, type StyleProp, type TextStyle } from 'react-native';
import { useTheme } from '../../theme';
import {
  fontFamily,
  fontWeight,
  label,
  title,
  body,
  heading,
  display,
  caption,
} from '../../tokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TextType =
  | 'caption'
  | 'label-sm'
  | 'label-md'
  | 'label-lg'
  | 'body-sm'
  | 'body-md'
  | 'body-lg'
  | 'title-sm'
  | 'title-md'
  | 'title-lg'
  | 'heading-sm'
  | 'heading-md'
  | 'heading-lg'
  | 'display-sm'
  | 'display-md'
  | 'display-lg';

export type TextProps = {
  /** The text content. */
  children: string;
  /** Type ramp entry — mirrors the Figma `type` variant. Defaults to "body-md". */
  type?: TextType;
  /** Text colour. Defaults to the active scheme's text/primary. */
  color?: string;
  /** Truncate to this many lines with an ellipsis. */
  numberOfLines?: number;
  /** Whether the text can be selected/copied. Defaults to the platform default. */
  selectable?: boolean;
  /** Style overrides — applied after the type ramp styles. */
  style?: StyleProp<TextStyle>;
  /** Accessibility label — falls back to the text content. */
  accessibilityLabel?: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

type TypeStyle = {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  fontWeight: TextStyle['fontWeight'];
};

/** type → resolved scale + per-family weight (matches the Figma Text Styles) */
const TYPE_STYLES: Record<TextType, TypeStyle> = {
  caption: { ...caption, fontWeight: fontWeight.regular },
  'label-sm': { ...label.sm, fontWeight: fontWeight.medium },
  'label-md': { ...label.md, fontWeight: fontWeight.medium },
  'label-lg': { ...label.lg, fontWeight: fontWeight.medium },
  'body-sm': { ...body.sm, fontWeight: fontWeight.regular },
  'body-md': { ...body.md, fontWeight: fontWeight.regular },
  'body-lg': { ...body.lg, fontWeight: fontWeight.regular },
  'title-sm': { ...title.sm, fontWeight: fontWeight.medium },
  'title-md': { ...title.md, fontWeight: fontWeight.medium },
  'title-lg': { ...title.lg, fontWeight: fontWeight.medium },
  'heading-sm': { ...heading.sm, fontWeight: fontWeight.semibold },
  'heading-md': { ...heading.md, fontWeight: fontWeight.semibold },
  'heading-lg': { ...heading.lg, fontWeight: fontWeight.semibold },
  'display-sm': { ...display.sm, fontWeight: fontWeight.regular },
  'display-md': { ...display.md, fontWeight: fontWeight.regular },
  'display-lg': { ...display.lg, fontWeight: fontWeight.regular },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Text({
  children,
  type = 'body-md',
  color,
  numberOfLines,
  selectable,
  style,
  accessibilityLabel,
}: TextProps) {
  const { scheme } = useTheme();
  const typeStyle = TYPE_STYLES[type];

  return (
    <RNText
      numberOfLines={numberOfLines}
      selectable={selectable}
      accessibilityRole={type.startsWith('heading') ? 'header' : undefined}
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          fontFamily: fontFamily.sans,
          color: color ?? scheme.text.primary,
          ...typeStyle,
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
}
