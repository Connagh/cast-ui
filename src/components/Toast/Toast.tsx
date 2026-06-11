/**
 * Toast — transient notification surface with title, description, and dismiss.
 *
 * Maps to the Figma <Toast> component (node 307:3478):
 *   intent → neutral | brand | danger   (colours the icon + text)
 *   size   → small | default | large
 *
 * Padding/gap come from the density theme's `toast` tokens (vary by size AND
 * density); icon/close sizes track the `size` prop. The surface uses the
 * overlay tokens (white bg, subtle border, 8px radius); the intent system
 * colours the leading icon, title, description, and close affordance.
 */

import React from 'react';
import {
  View,
  Text,
  Pressable,
  Platform,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { useTheme } from '../../theme';
import { Icon } from '../Icon';
import {
  fontFamily,
  fontWeight,
  title as titleScale,
  body,
  controlTokens,
} from '../../tokens';
import type { IntentName } from '../../tokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ToastSize = 'small' | 'default' | 'large';

export type ToastProps = {
  /** Heading text. */
  title: string;
  /** Supporting description text below the title. */
  children?: string;
  /** Semantic intent — colours the icon and text. */
  intent?: IntentName;
  /** Size variant — controls padding, gap, and typography scale. */
  size?: ToastSize;
  /** Leading icon — Material Symbols name string or a ReactNode. */
  icon?: string | React.ReactNode;
  /** Dismiss handler — renders a close button when provided. */
  onClose?: () => void;
  /** Style override for the outer surface. */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label — falls back to the title text. */
  accessibilityLabel?: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maps toast size → title typography scale */
const TITLE_SCALE: Record<ToastSize, keyof typeof titleScale> = {
  small: 'sm',
  default: 'md',
  large: 'lg',
};

/** Maps toast size → body typography scale (description) */
const BODY_SCALE: Record<ToastSize, keyof typeof body> = {
  small: 'sm',
  default: 'md',
  large: 'lg',
};

/** Shadow for web — matches Figma shadow/md */
const SHADOW_WEB = {
  boxShadow:
    '0px 2px 4px -2px rgba(0,0,0,0.05), 0px 4px 6px -1px rgba(0,0,0,0.07)',
};

/** Shadow for native */
const SHADOW_NATIVE: ViewStyle = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 6,
  elevation: 4,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Toast({
  title,
  children,
  intent = 'neutral',
  size = 'default',
  icon,
  onClose,
  style,
  accessibilityLabel,
}: ToastProps) {
  const { components, scheme } = useTheme();
  const intentColors = scheme.intents;
  const surfaceTokens = scheme.surface;
  const tokens = components.toast;
  const sizeTokens = tokens[size];
  const titleTokens = titleScale[TITLE_SCALE[size]];
  const bodyTokens = body[BODY_SCALE[size]];

  const fg = intentColors[intent].default.default.fg;

  const resolvedIcon =
    typeof icon === 'string' ? (
      <Icon name={icon} size={sizeTokens.iconSize} color={fg} />
    ) : (
      icon
    );

  return (
    <View
      accessibilityRole="alert"
      accessibilityLabel={accessibilityLabel || title}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: sizeTokens.gap,
          padding: sizeTokens.padding,
          minWidth: tokens.minWidth,
          maxWidth: tokens.maxWidth,
          borderRadius: tokens.borderRadius,
          borderWidth: controlTokens.borderWidth,
          borderColor: surfaceTokens.overlay.border,
          backgroundColor: surfaceTokens.overlay.bg,
          ...(Platform.OS === 'web' ? SHADOW_WEB : SHADOW_NATIVE),
        },
        style,
      ]}
    >
      {resolvedIcon ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={{ width: sizeTokens.iconSize, height: sizeTokens.iconSize }}
        >
          {resolvedIcon}
        </View>
      ) : null}

      <View style={{ flex: 1 }}>
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
          {title}
        </Text>
        {children ? (
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
            {children}
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
