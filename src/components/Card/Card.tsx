/**
 * Card — surface container for grouped content with optional media, header,
 * body, and actions.
 *
 * Maps to the Figma <Card> component (node 307:3346):
 *   size    → small | default | large   (drives padding, gap, type scale)
 *   variant → outline (1px border) | elevated (border + drop shadow)
 *
 * Each content slot mirrors a Figma boolean (hasImage / hasIcon / hasSubtitle
 * / hasBody / hasActions): the slot renders only when its prop is provided.
 * Padding + gap come from the density theme's `card` tokens (size × density).
 */

import React from 'react';
import {
  View,
  Text,
  Platform,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { useTheme } from '../../theme';
import { Icon } from '../Icon';
import {
  fontFamily,
  fontWeight,
  title,
  body,
} from '../../tokens';

export type CardSize = 'small' | 'default' | 'large';
export type CardVariant = 'outline' | 'elevated';

export type CardProps = {
  /** Size variant — controls padding, gap, and typography scale. */
  size?: CardSize;
  /** Visual style — outline (border) or elevated (border + shadow). */
  variant?: CardVariant;
  /** Media area rendered at the top (e.g. an <Image>). */
  image?: React.ReactNode;
  /** Header leading icon — Material Symbols name string or a ReactNode. */
  icon?: string | React.ReactNode;
  /** Card title. */
  title?: string;
  /** Supporting subtitle below the title. */
  subtitle?: string;
  /** Body description text. */
  body?: string;
  /** Action row content (e.g. Buttons), right-aligned at the bottom. */
  actions?: React.ReactNode;
  /** Additional custom content rendered in the body, after `body`. */
  children?: React.ReactNode;
  /** Style override for the outer container. */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label for the card. */
  accessibilityLabel?: string;
};

/** Maps card size → title typography scale */
const TITLE_SCALE: Record<CardSize, keyof typeof title> = {
  small: 'sm',
  default: 'md',
  large: 'lg',
};

/** Maps card size → body/subtitle typography scale */
const BODY_SCALE: Record<CardSize, keyof typeof body> = {
  small: 'sm',
  default: 'md',
  large: 'lg',
};

/** shadow/lg — elevated card drop shadow */
const SHADOW_WEB = {
  boxShadow:
    '0px 10px 15px -3px rgba(0,0,0,0.08), 0px 4px 6px -4px rgba(0,0,0,0.04)',
};
const SHADOW_NATIVE: ViewStyle = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.08,
  shadowRadius: 15,
  elevation: 8,
};

export function Card({
  size = 'default',
  variant = 'outline',
  image,
  icon,
  title: titleText,
  subtitle,
  body: bodyText,
  actions,
  children,
  style,
  accessibilityLabel,
}: CardProps) {
  const { components, scheme } = useTheme();
  const surfaceTokens = scheme.surface;
  const textTokens = scheme.text;
  const TITLE_FG = scheme.intents.neutral.default.default.fg;
  const tokens = components.card;
  const sizeTokens = tokens[size];
  const titleTokens = title[TITLE_SCALE[size]];
  const bodyTokens = body[BODY_SCALE[size]];

  const resolvedIcon =
    typeof icon === 'string' ? (
      <Icon name={icon} size={sizeTokens.iconSize} color={TITLE_FG} />
    ) : (
      icon
    );

  const hasHeader = !!(resolvedIcon || titleText || subtitle);

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          backgroundColor: surfaceTokens.overlay.bg,
          borderRadius: tokens.borderRadius,
          borderWidth: 1,
          borderColor: surfaceTokens.overlay.border,
          overflow: 'hidden',
          ...(variant === 'elevated'
            ? Platform.OS === 'web'
              ? SHADOW_WEB
              : SHADOW_NATIVE
            : {}),
        },
        style,
      ]}
    >
      {image ? (
        <View style={{ height: sizeTokens.imageHeight, width: '100%' }}>
          {image}
        </View>
      ) : null}

      <View style={{ padding: sizeTokens.padding, gap: sizeTokens.gap }}>
        {hasHeader ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: sizeTokens.gap,
            }}
          >
            {resolvedIcon ? (
              <View
                accessibilityElementsHidden
                importantForAccessibility="no"
                style={{
                  width: sizeTokens.iconSize,
                  height: sizeTokens.iconSize,
                }}
              >
                {resolvedIcon}
              </View>
            ) : null}

            {titleText || subtitle ? (
              <View style={{ flex: 1 }}>
                {titleText ? (
                  <Text
                    style={{
                      fontFamily: fontFamily.sans,
                      fontWeight: fontWeight.medium,
                      fontSize: titleTokens.fontSize,
                      lineHeight: titleTokens.lineHeight,
                      letterSpacing: titleTokens.letterSpacing,
                      color: TITLE_FG,
                    }}
                    selectable={false}
                  >
                    {titleText}
                  </Text>
                ) : null}
                {subtitle ? (
                  <Text
                    style={{
                      fontFamily: fontFamily.sans,
                      fontWeight: fontWeight.regular,
                      fontSize: bodyTokens.fontSize,
                      lineHeight: bodyTokens.lineHeight,
                      letterSpacing: bodyTokens.letterSpacing,
                      color: textTokens.description,
                    }}
                    selectable={false}
                  >
                    {subtitle}
                  </Text>
                ) : null}
              </View>
            ) : null}
          </View>
        ) : null}

        {bodyText ? (
          <Text
            style={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.regular,
              fontSize: bodyTokens.fontSize,
              lineHeight: bodyTokens.lineHeight,
              letterSpacing: bodyTokens.letterSpacing,
              color: textTokens.description,
            }}
            selectable={false}
          >
            {bodyText}
          </Text>
        ) : null}

        {children}

        {actions ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: sizeTokens.gap,
            }}
          >
            {actions}
          </View>
        ) : null}
      </View>
    </View>
  );
}
