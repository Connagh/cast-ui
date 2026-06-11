/**
 * List — vertical collection of items with optional section subheaders.
 *
 * Maps to the Figma <List> component (node 452:3401):
 *   List          — the container surface (white bg, 1px section gap)
 *   ListSubheader — muted caption label for a section ("Inbox", "Labels")
 *   ListItem      — icon + label + optional description, with
 *                   default / selected / disabled states
 *   ListDivider   — horizontal rule between sections
 *
 * Density (compact/default/comfortable) drives item padding, gap, and
 * icon size via the theme's `list` tokens. Colours come from the theme's
 * colour scheme (`scheme.list`, constant across densities).
 */

import React, { useState } from 'react';
import {
  Pressable,
  View,
  Text,
  type ViewStyle,
  type StyleProp,
  type GestureResponderEvent,
} from 'react-native';
import { useTheme } from '../../theme';
import { Icon } from '../Icon';
import {
  fontFamily,
  fontWeight,
  label,
  body,
  caption,
} from '../../tokens';

// ---------------------------------------------------------------------------
// List — container
// ---------------------------------------------------------------------------

export type ListProps = {
  /** ListItem / ListSubheader / ListDivider children. */
  children: React.ReactNode;
  /** Style override for the outer container. */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label for the list region. */
  accessibilityLabel?: string;
};

export function List({ children, style, accessibilityLabel }: ListProps) {
  const { components, scheme } = useTheme();
  const listColors = scheme.list;
  const tokens = components.list;

  return (
    <View
      accessibilityRole="list"
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          backgroundColor: listColors.containerBg,
          gap: tokens.sectionGap,
          alignSelf: 'stretch',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

// ---------------------------------------------------------------------------
// ListSubheader — section label
// ---------------------------------------------------------------------------

export type ListSubheaderProps = {
  /** Subheader label text. */
  children: string;
  /** Style override. */
  style?: StyleProp<ViewStyle>;
};

export function ListSubheader({ children, style }: ListSubheaderProps) {
  const { components, scheme } = useTheme();
  const listColors = scheme.list;
  const tokens = components.list.subheader;

  return (
    <View
      style={[
        {
          paddingHorizontal: tokens.paddingX,
          paddingVertical: tokens.paddingY,
        },
        style,
      ]}
    >
      <Text
        style={{
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.regular,
          fontSize: caption.fontSize,
          lineHeight: caption.lineHeight,
          letterSpacing: caption.letterSpacing,
          color: listColors.subheaderFg,
        }}
        selectable={false}
      >
        {children}
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// ListDivider — horizontal rule
// ---------------------------------------------------------------------------

export type ListDividerProps = {
  /** Style override for the divider line. */
  style?: StyleProp<ViewStyle>;
};

export function ListDivider({ style }: ListDividerProps) {
  const { scheme } = useTheme();
  const listColors = scheme.list;

  return (
    <View
      accessibilityRole="none"
      style={[
        {
          height: 1,
          backgroundColor: listColors.separator,
        },
        style,
      ]}
    />
  );
}

// ---------------------------------------------------------------------------
// ListItem — interactive row
// ---------------------------------------------------------------------------

export type ListItemProps = {
  /** Primary label text. */
  children: string;
  /** Supporting description text below the label. */
  description?: string;
  /** Leading icon — Material Symbols name string or a ReactNode. */
  icon?: string | React.ReactNode;
  /** Trailing icon — Material Symbols name string or a ReactNode. */
  trailingIcon?: string | React.ReactNode;
  /** Marks the item as selected (highlighted). */
  selected?: boolean;
  /** Disables interaction and applies muted styling. */
  disabled?: boolean;
  /** Press handler. */
  onPress?: (e: GestureResponderEvent) => void;
  /** Style override for the item row. */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label — falls back to the label text. */
  accessibilityLabel?: string;
};

export function ListItem({
  children,
  description,
  icon,
  trailingIcon,
  selected = false,
  disabled = false,
  onPress,
  style,
  accessibilityLabel,
}: ListItemProps) {
  const { components, scheme } = useTheme();
  const listColors = scheme.list;
  const tokens = components.list.item;
  const [isHovered, setIsHovered] = useState(false);

  // State priority: disabled > selected+hover > selected > hover > default
  const colors = disabled
    ? listColors.item.disabled
    : selected && isHovered
      ? listColors.item.selectedHover
      : selected
        ? listColors.item.selected
        : isHovered
          ? listColors.item.hover
          : listColors.item.default;

  const resolvedIcon =
    typeof icon === 'string' ? (
      <Icon name={icon} size={tokens.iconSize} color={colors.fg} />
    ) : (
      icon
    );

  const resolvedTrailing =
    typeof trailingIcon === 'string' ? (
      <Icon name={trailingIcon} size={tokens.iconSize} color={colors.fg} />
    ) : (
      trailingIcon
    );

  return (
    <Pressable
      onPress={(e) => {
        if (!disabled) onPress?.(e);
      }}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      disabled={disabled || !onPress}
      accessibilityRole="menuitem"
      accessibilityLabel={accessibilityLabel || children}
      accessibilityState={{ selected, disabled }}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: tokens.gap,
          paddingHorizontal: tokens.paddingX,
          paddingVertical: tokens.paddingY,
          borderRadius: tokens.borderRadius,
          backgroundColor: colors.bg,
        },
        style,
      ]}
    >
      {resolvedIcon ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={{ width: tokens.iconSize, height: tokens.iconSize }}
        >
          {resolvedIcon}
        </View>
      ) : null}

      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text
          style={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.medium,
            fontSize: label.md.fontSize,
            lineHeight: label.md.lineHeight,
            letterSpacing: label.md.letterSpacing,
            color: colors.fg,
          }}
          selectable={false}
        >
          {children}
        </Text>
        {description ? (
          <Text
            style={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.regular,
              fontSize: body.md.fontSize,
              lineHeight: body.md.lineHeight,
              letterSpacing: body.md.letterSpacing,
              color: disabled ? colors.fg : listColors.descriptionFg,
            }}
            selectable={false}
          >
            {description}
          </Text>
        ) : null}
      </View>

      {resolvedTrailing ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={{ width: tokens.iconSize, height: tokens.iconSize }}
        >
          {resolvedTrailing}
        </View>
      ) : null}
    </Pressable>
  );
}
