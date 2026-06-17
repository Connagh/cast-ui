/**
 * AppBar — a top bar with a leading control, a title, and trailing actions.
 *
 * Maps 1:1 to the Figma <App Bar> component:
 *   intent     → neutral | brand | danger
 *   prominence → default | bold | subtle
 *   size       → small | default | large    (padding, gap, title scale)
 *   align      → start | center             (title alignment)
 *
 * Colour comes from the intent system, like Button. prominence picks the
 * surface: bold is a filled bar (intent bg, white text), default is a plain bar
 * with a bottom divider, subtle is transparent. The title and the leadingIcon
 * inherit the bar foreground; trailing actions are a free slot, so colour them
 * to match on a bold bar. The bar hugs its content height from the padding, so
 * there is no fixed height token. Spacing varies by density; the title scale by
 * size. Fonts are consumer-loaded.
 */

import React from 'react';
import {
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
  type GestureResponderEvent,
} from 'react-native';
import { useTheme } from '../../theme';
import { controlTokens } from '../../tokens';
import type { IntentName, ProminenceName } from '../../tokens';
import { Text, type TextType } from '../Text';
import { Icon, type IconProps } from '../Icon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AppBarSize = 'small' | 'default' | 'large';
export type AppBarAlign = 'start' | 'center';

export type AppBarProps = {
  /** The bar title. */
  title: string;
  /** Standard leading control icon (menu / back). Auto-coloured + pressable. */
  leadingIcon?: string;
  /** Press handler for the leading icon. */
  onLeadingPress?: (e: GestureResponderEvent) => void;
  /** Custom leading slot. Wins over leadingIcon. */
  leading?: React.ReactNode;
  /** Trailing actions slot. */
  trailing?: React.ReactNode;
  /** Semantic intent. */
  intent?: IntentName;
  /** Visual weight — bold (filled), default (divider), subtle (transparent). */
  prominence?: ProminenceName;
  /** Size variant — padding, gap, and title scale. */
  size?: AppBarSize;
  /** Title alignment. Defaults to start. */
  align?: AppBarAlign;
  /** Outer style. */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label — falls back to the title. */
  accessibilityLabel?: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maps size → title typography scale (Text component `type`). */
const TITLE_TYPE: Record<AppBarSize, TextType> = {
  small: 'title-sm',
  default: 'title-md',
  large: 'title-lg',
};

/** Maps size → named Icon scale for the leading control. */
const ICON_SIZE: Record<AppBarSize, IconProps['size']> = {
  small: 'default',
  default: 'large',
  large: 'large',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AppBar({
  title,
  leadingIcon,
  onLeadingPress,
  leading,
  trailing,
  intent = 'neutral',
  prominence = 'default',
  size = 'default',
  align = 'start',
  style,
  accessibilityLabel,
}: AppBarProps) {
  const { components, colors } = useTheme();
  const tokens = components.appBar[size];
  const barColors = colors[intent][prominence].default;

  const resolvedLeading =
    leading ??
    (leadingIcon ? (
      <Pressable
        onPress={onLeadingPress}
        accessibilityRole="button"
        accessibilityLabel="Navigation"
        hitSlop={8}
      >
        <Icon name={leadingIcon} size={ICON_SIZE[size]} color={barColors.fg} />
      </Pressable>
    ) : null);

  return (
    <View
      accessibilityRole="header"
      accessibilityLabel={accessibilityLabel || title}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: tokens.gap,
          paddingHorizontal: tokens.paddingX,
          paddingVertical: tokens.paddingY,
          backgroundColor: barColors.bg,
          borderBottomWidth: controlTokens.borderWidth,
          borderBottomColor: barColors.border,
        },
        style,
      ]}
    >
      {resolvedLeading}
      <Text
        type={TITLE_TYPE[size]}
        color={barColors.fg}
        numberOfLines={1}
        selectable={false}
        style={{ flex: 1, textAlign: align === 'center' ? 'center' : 'left' }}
      >
        {title}
      </Text>
      {trailing ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.gap }}>
          {trailing}
        </View>
      ) : null}
    </View>
  );
}
