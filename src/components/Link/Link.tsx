/**
 * Link — an inline or standalone text link.
 *
 * Maps 1:1 to the Figma <Link> component:
 *   intent     → neutral | brand | danger   (link colour)
 *   prominence is fixed to the subtle scheme (coloured text, no fill)
 *   size       → small | default | large    (typography + icon size + gap)
 *   underline  → none | hover | always
 *
 * Colours come from the intent system's subtle prominence fg
 * (colors[intent].subtle.{state}.fg). Brand is the default, so a link reads
 * blue by default and the darker blue on hover; disabled uses the shared
 * disabled fg. The gap between an icon and the label is the one spacing token
 * (link/{size}/gap), density-varying. Typography is the label scale matched to
 * size; the icon size follows the named Icon scale 1:1 (small→16, default→20,
 * large→24), like Button.
 *
 * Links navigate. On web, passing `href` renders a real anchor through
 * react-native-web; on native it is informational and `onPress` drives
 * navigation. Fonts are consumer-loaded (Geist).
 */

import React, { useState } from 'react';
import {
  Pressable,
  Text,
  View,
  type ViewStyle,
  type StyleProp,
  type GestureResponderEvent,
} from 'react-native';
import { useTheme } from '../../theme';
import { useFocusVisible, focusRingStyle } from '../../hooks';
import { fontFamily, fontWeight, label } from '../../tokens';
import type { IntentName } from '../../tokens';
import { Icon } from '../Icon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LinkSize = 'small' | 'default' | 'large';
export type LinkUnderline = 'none' | 'hover' | 'always';

export type LinkProps = {
  /** The link text. */
  children: string;
  /** Semantic intent — drives the link colour. Defaults to brand. */
  intent?: IntentName;
  /** Size variant — controls typography scale, icon size, and gap. */
  size?: LinkSize;
  /** When the underline shows. Defaults to "hover". */
  underline?: LinkUnderline;
  /** Disables interaction and applies muted styling. */
  disabled?: boolean;
  /** Icon before the label — Material Symbols name string or a ReactNode. */
  leadingIcon?: string | React.ReactNode;
  /** Icon after the label — Material Symbols name string or a ReactNode. */
  trailingIcon?: string | React.ReactNode;
  /** Destination URL. Renders a real anchor on web; informational on native. */
  href?: string;
  /** Press handler. */
  onPress?: (e: GestureResponderEvent) => void;
  /** Outer style — use for positioning (margin, flex, alignSelf). */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label — falls back to the link text. */
  accessibilityLabel?: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maps link size → label typography scale. */
const LABEL_SCALE: Record<LinkSize, keyof typeof label> = {
  small: 'sm',
  default: 'md',
  large: 'lg',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Link({
  children,
  intent = 'brand',
  size = 'default',
  underline = 'hover',
  disabled = false,
  leadingIcon,
  trailingIcon,
  href,
  onPress,
  style,
  accessibilityLabel,
}: LinkProps) {
  const { components, colors, scheme, fonts } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  // Keyboard-only focus ring (focus-visible).
  const { isFocusVisible, focusProps } = useFocusVisible();

  const { gap } = components.link[size];
  const labelTokens = label[LABEL_SCALE[size]];
  const subtle = colors[intent].subtle;

  const fg = disabled
    ? scheme.disabled.fg
    : isHovered
      ? subtle.hover.fg
      : subtle.default.fg;

  const showUnderline =
    underline === 'always' || (underline === 'hover' && isHovered && !disabled);

  const resolvedLeading =
    typeof leadingIcon === 'string' ? (
      <Icon name={leadingIcon} size={size} color={fg} />
    ) : (
      leadingIcon
    );
  const resolvedTrailing =
    typeof trailingIcon === 'string' ? (
      <Icon name={trailingIcon} size={size} color={fg} />
    ) : (
      trailingIcon
    );

  // react-native-web forwards `href` to render an <a>; native ignores it.
  const hrefProps = href ? ({ href } as any) : {};

  return (
    <Pressable
      {...hrefProps}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onFocus={focusProps.onFocus}
      onBlur={focusProps.onBlur}
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel || children}
      accessibilityState={{ disabled }}
      style={style}
    >
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            gap,
          },
          focusRingStyle(isFocusVisible, scheme.focusRing.color),
        ]}
      >
        {resolvedLeading}
        <Text
          selectable={false}
          style={{
            fontFamily: fonts.sans,
            fontWeight: fontWeight.medium,
            fontSize: labelTokens.fontSize,
            lineHeight: labelTokens.lineHeight,
            letterSpacing: labelTokens.letterSpacing,
            color: fg,
            textDecorationLine: showUnderline ? 'underline' : 'none',
          }}
        >
          {children}
        </Text>
        {resolvedTrailing}
      </View>
    </Pressable>
  );
}
