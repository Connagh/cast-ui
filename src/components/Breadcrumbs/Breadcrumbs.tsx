/**
 * Breadcrumbs — a trail showing where the user is in a hierarchy.
 *
 * Compound component. <Breadcrumbs> lays out the row and draws a separator
 * between items; <Breadcrumb> is one entry. The last item (or any item with
 * `current`) renders as plain text; the rest are pressable links.
 *
 *   <Breadcrumbs>
 *     <Breadcrumb onPress={goHome}>Home</Breadcrumb>
 *     <Breadcrumb onPress={goLibrary}>Library</Breadcrumb>
 *     <Breadcrumb current>This page</Breadcrumb>
 *   </Breadcrumbs>
 *
 * Maps 1:1 to the Figma <Breadcrumbs> component:
 *   size → small | default | large   (typography + icon size + gap)
 *   separator → the glyph or string drawn between items (default chevron_right)
 *
 * Colours: link items use the brand subtle fg and text/primary on hover; the
 * current item uses text/primary; separators use text/description; disabled
 * uses the shared disabled fg. The one spacing token is breadcrumbs/{size}/gap
 * (density-varying), used as the row gap between every item and separator, and
 * as the gap between a leading icon and its label. Labels render through the
 * shared <Text> component, so Breadcrumbs inherits the type ramp.
 */

import React, { createContext, useContext, useState } from 'react';
import {
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
  type GestureResponderEvent,
} from 'react-native';
import { useTheme } from '../../theme';
import { Text, type TextType } from '../Text';
import { Icon, type IconProps } from '../Icon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BreadcrumbsSize = 'small' | 'default' | 'large';

export type BreadcrumbsProps = {
  /** `<Breadcrumb>` children. */
  children: React.ReactNode;
  /**
   * Separator between items. A Material Symbols name (e.g. "chevron_right") is
   * drawn as an icon; any other string (e.g. "/") is drawn as text. A ReactNode
   * is rendered as-is. Defaults to "chevron_right".
   */
  separator?: string | React.ReactNode;
  /** Size variant — typography scale, icon size, and gap. */
  size?: BreadcrumbsSize;
  /** Outer style. */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label for the trail. */
  accessibilityLabel?: string;
};

export type BreadcrumbProps = {
  /** The item text. */
  children: string;
  /** Press handler — omit on the current item. */
  onPress?: (e: GestureResponderEvent) => void;
  /** Marks this as the current page — renders as plain text, not a link. */
  current?: boolean;
  /** Disables the link. */
  disabled?: boolean;
  /** Icon before the label — Material Symbols name string or a ReactNode. */
  leadingIcon?: string | React.ReactNode;
  /** Destination URL. Renders a real anchor on web; informational on native. */
  href?: string;
  /** Accessibility label — falls back to the item text. */
  accessibilityLabel?: string;
  /** Internal: set by <Breadcrumbs> on the final item. */
  __isLast?: boolean;
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type BreadcrumbsContextValue = { size: BreadcrumbsSize; gap: number };

const BreadcrumbsCtx = createContext<BreadcrumbsContextValue | null>(null);

function useBreadcrumbsContext(component: string): BreadcrumbsContextValue {
  const ctx = useContext(BreadcrumbsCtx);
  if (!ctx) {
    throw new Error(`<${component}> must be used within <Breadcrumbs>`);
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maps size → label typography scale (Text component `type`). */
const LABEL_TYPE: Record<BreadcrumbsSize, TextType> = {
  small: 'body-sm',
  default: 'body-md',
  large: 'body-lg',
};

/** Maps size → named Icon scale for separators and leading icons. */
const ICON_SIZE: Record<BreadcrumbsSize, IconProps['size']> = {
  small: 'xs',
  default: 'small',
  large: 'default',
};

/** A bare lowercase/underscore token is treated as a Material Symbols name. */
const isSymbolName = (s: string) => /^[a-z0-9_]+$/.test(s);

// ---------------------------------------------------------------------------
// Breadcrumb
// ---------------------------------------------------------------------------

export function Breadcrumb({
  children,
  onPress,
  current = false,
  disabled = false,
  leadingIcon,
  href,
  accessibilityLabel,
  __isLast = false,
}: BreadcrumbProps) {
  const { size, gap } = useBreadcrumbsContext('Breadcrumb');
  const { colors, scheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const isCurrent = current || __isLast;
  const linkFg = colors.brand.subtle.default.fg;

  const fg = disabled
    ? scheme.disabled.fg
    : isCurrent
      ? scheme.text.primary
      : isHovered
        ? scheme.text.primary
        : linkFg;

  const showUnderline = !isCurrent && !disabled && isHovered;

  const resolvedIcon =
    typeof leadingIcon === 'string' ? (
      <Icon name={leadingIcon} size={ICON_SIZE[size]} color={fg} />
    ) : (
      leadingIcon
    );

  const content = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap }}>
      {resolvedIcon}
      <Text
        type={LABEL_TYPE[size]}
        color={fg}
        selectable={false}
        style={{ textDecorationLine: showUnderline ? 'underline' : 'none' }}
      >
        {children}
      </Text>
    </View>
  );

  if (isCurrent) {
    return (
      <View
        accessibilityRole="text"
        accessibilityState={{ selected: true }}
        accessibilityLabel={accessibilityLabel || children}
        {...({ 'aria-current': 'page' } as any)}
      >
        {content}
      </View>
    );
  }

  const hrefProps = href ? ({ href } as any) : {};

  return (
    <Pressable
      {...hrefProps}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel || children}
      accessibilityState={{ disabled }}
    >
      {content}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Breadcrumbs
// ---------------------------------------------------------------------------

export function Breadcrumbs({
  children,
  separator = 'chevron_right',
  size = 'default',
  style,
  accessibilityLabel,
}: BreadcrumbsProps) {
  const { components, scheme } = useTheme();
  const { gap } = components.breadcrumbs[size];

  const items = React.Children.toArray(children).filter(Boolean);
  const lastIndex = items.length - 1;

  const separatorNode =
    typeof separator === 'string' ? (
      isSymbolName(separator) ? (
        <Icon name={separator} size={ICON_SIZE[size]} color={scheme.text.description} />
      ) : (
        <Text type={LABEL_TYPE[size]} color={scheme.text.description} selectable={false}>
          {separator}
        </Text>
      )
    ) : (
      separator
    );

  const rendered: React.ReactNode[] = [];
  items.forEach((child, i) => {
    rendered.push(
      React.cloneElement(
        child as React.ReactElement<BreadcrumbProps>,
        { key: `item-${i}`, __isLast: i === lastIndex },
      ),
    );
    if (i < lastIndex) {
      rendered.push(
        <View
          key={`sep-${i}`}
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {separatorNode}
        </View>,
      );
    }
  });

  return (
    <BreadcrumbsCtx.Provider value={{ size, gap }}>
      <View
        accessibilityLabel={accessibilityLabel || 'Breadcrumb'}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap,
          },
          style,
        ]}
      >
        {rendered}
      </View>
    </BreadcrumbsCtx.Provider>
  );
}
