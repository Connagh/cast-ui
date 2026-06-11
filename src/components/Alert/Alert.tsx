/**
 * Alert — inline message banner for notes, info, and errors.
 *
 * Maps to the Figma <Alert> component (node 307:3283):
 *   intent  → neutral | brand | danger  (drives colour)
 *   size    → small | default | large   (drives padding, gap, type scale)
 *   variant → subtle (no fill/border) | outline (white fill + intent border)
 *
 * Padding + gap come from the density theme's `alert` tokens (size × density).
 * Icon/close sizes track the `size` prop. Colours reuse the intent system.
 */

import React from 'react';
import {
  Pressable,
  View,
  Text,
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
  controlTokens,
} from '../../tokens';
import type { IntentName } from '../../tokens';

export type AlertSize = 'small' | 'default' | 'large';
export type AlertVariant = 'subtle' | 'outline';

export type AlertProps = {
  /** Semantic intent — drives colour scheme. */
  intent?: IntentName;
  /** Size variant — controls padding, gap, and typography scale. */
  size?: AlertSize;
  /** Visual style — subtle (no fill) or outline (white fill + border). */
  variant?: AlertVariant;
  /** Bold title line. */
  title?: string;
  /** Supporting description text. */
  description?: string;
  /**
   * Leading icon — Material Symbols name string or a ReactNode.
   * Pass `null` to hide. Defaults to an intent-appropriate symbol.
   */
  icon?: string | React.ReactNode | null;
  /** When provided, renders a close button that calls this handler. */
  onClose?: () => void;
  /** Style override for the outer container. */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label — falls back to the title text. */
  accessibilityLabel?: string;
};

/** Maps alert size → title typography scale */
const TITLE_SCALE: Record<AlertSize, keyof typeof title> = {
  small: 'sm',
  default: 'md',
  large: 'lg',
};

/** Maps alert size → body (description) typography scale */
const BODY_SCALE: Record<AlertSize, keyof typeof body> = {
  small: 'sm',
  default: 'md',
  large: 'lg',
};

/** Default leading icon per intent */
const DEFAULT_ICON: Record<IntentName, string> = {
  neutral: 'info',
  brand: 'info',
  danger: 'error',
};

export function Alert({
  intent = 'neutral',
  size = 'default',
  variant = 'subtle',
  title: titleText,
  description,
  icon,
  onClose,
  style,
  accessibilityLabel,
}: AlertProps) {
  const { components, scheme } = useTheme();
  const intentColors = scheme.intents;
  const tokens = components.alert;
  const sizeTokens = tokens[size];
  const titleTokens = title[TITLE_SCALE[size]];
  const bodyTokens = body[BODY_SCALE[size]];

  // Colours derive from the intent system. Outline uses the white fill +
  // intent border; subtle is transparent. Foreground is the intent fg.
  const intentClr = intentColors[intent].default.default;
  const bg = variant === 'outline' ? intentClr.bg : 'transparent';
  const borderColor = variant === 'outline' ? intentClr.border : 'transparent';
  const fg = intentClr.fg;

  // Resolve leading icon — undefined uses the intent default, null hides it.
  const iconNode =
    icon === null
      ? null
      : icon === undefined ? (
          <Icon name={DEFAULT_ICON[intent]} size={sizeTokens.iconSize} color={fg} />
        ) : typeof icon === 'string' ? (
          <Icon name={icon} size={sizeTokens.iconSize} color={fg} />
        ) : (
          icon
        );

  return (
    <View
      accessibilityRole="alert"
      accessibilityLabel={accessibilityLabel || titleText}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: sizeTokens.gap,
          padding: sizeTokens.padding,
          borderRadius: tokens.borderRadius,
          borderWidth: controlTokens.borderWidth,
          borderColor,
          backgroundColor: bg,
        },
        style,
      ]}
    >
      {iconNode ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={{ width: sizeTokens.iconSize, height: sizeTokens.iconSize }}
        >
          {iconNode}
        </View>
      ) : null}

      <View style={{ flex: 1 }}>
        {titleText ? (
          <Text
            style={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.medium,
              fontSize: titleTokens.fontSize,
              lineHeight: titleTokens.lineHeight,
              letterSpacing: titleTokens.letterSpacing,
              color: fg,
            }}
            selectable={false}
          >
            {titleText}
          </Text>
        ) : null}
        {description ? (
          <Text
            style={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.regular,
              fontSize: bodyTokens.fontSize,
              lineHeight: bodyTokens.lineHeight,
              letterSpacing: bodyTokens.letterSpacing,
              color: fg,
            }}
            selectable={false}
          >
            {description}
          </Text>
        ) : null}
      </View>

      {onClose ? (
        <Pressable
          onPress={onClose}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          style={{ width: sizeTokens.closeSize, height: sizeTokens.closeSize }}
        >
          <Icon name="close" size={sizeTokens.closeSize} color={fg} />
        </Pressable>
      ) : null}
    </View>
  );
}
