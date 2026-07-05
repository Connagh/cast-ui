/**
 * Accordion — a stack of expandable sections, flush/divided style.
 *
 * Compound component. `<Accordion>` owns which items are open and how they
 * coordinate; `<AccordionItem>` is one section with a header and collapsible
 * content. They communicate through context, so a consumer writes:
 *
 *   <Accordion type="single" defaultValue="shipping">
 *     <AccordionItem value="shipping" title="Shipping">
 *       Free delivery on orders over £50.
 *     </AccordionItem>
 *     <AccordionItem value="returns" title="Returns" leadingIcon="undo">
 *       Return any item within 30 days.
 *     </AccordionItem>
 *     <AccordionItem value="legacy" title="Archived" disabled>
 *       Hidden content.
 *     </AccordionItem>
 *   </Accordion>
 *
 * Maps 1:1 to the Figma <Accordion> component:
 *   type  → single | multiple   (single opens one section at a time)
 *   size  → small | default | large   (header padding, gap, typography)
 *   AccordionItem state=open → expanded; state=disabled → disabled;
 *   state=hover → runtime onHoverIn (not a prop)
 *
 * Accordion is neutral only. The header label uses scheme.text.primary (disabled
 * uses scheme.disabled.fg). The chevron (chevron_right, rotated 90deg when open)
 * and the optional leadingIcon render through <Icon> at the named size keyed by
 * the `size` prop and take the same colour as the label. The header hover and
 * press backgrounds reuse the neutral subtle intent. The divider between items is
 * the overlay border colour (like <Divider>) at the control border width.
 *
 * Tokens: `gap` / `paddingX` / `paddingY` are density spacing from
 * `components.accordion[size]`. No new colour tokens.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useMotion, useTheme } from '../../theme';
import { controlTokens } from '../../tokens';
import { Text, type TextType } from '../Text';
import { Icon } from '../Icon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AccordionSize = 'small' | 'default' | 'large';
export type AccordionType = 'single' | 'multiple';

export type AccordionProps = {
  /** 'single' opens one section at a time; 'multiple' opens any number. */
  type?: AccordionType;
  /**
   * Controlled open value(s). A string for `type="single"`, a string array for
   * `type="multiple"`. Provide with `onValueChange` for a controlled accordion.
   */
  value?: string | string[];
  /** Uncontrolled initial open value(s). Same shape rules as `value`. */
  defaultValue?: string | string[];
  /** Called with the next open value(s) when a section toggles. */
  onValueChange?: (value: string | string[]) => void;
  /** Size variant — header padding, gap, and typography. */
  size?: AccordionSize;
  /** For `type="single"`, allow closing the open section. Defaults to true. */
  collapsible?: boolean;
  /** `<AccordionItem>` children. */
  children: React.ReactNode;
  /** Outer style — use for positioning (margin, width, alignSelf). */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label for the group. */
  accessibilityLabel?: string;
};

export type AccordionItemProps = {
  /** Unique value identifying this section. */
  value: string;
  /** The header label text. */
  title: string;
  /** Icon before the title — Material Symbols name string or a ReactNode. */
  leadingIcon?: string | React.ReactNode;
  /** Disables interaction and applies muted styling. */
  disabled?: boolean;
  /** The collapsible content. A string is wrapped in <Text> automatically. */
  children: React.ReactNode;
  /** Outer style — applied to the item container. */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label — falls back to the title text. */
  accessibilityLabel?: string;
};

// ---------------------------------------------------------------------------
// Context — connects Accordion to its AccordionItem children
// ---------------------------------------------------------------------------

type AccordionContextValue = {
  openValues: string[];
  toggle: (value: string) => void;
  size: AccordionSize;
};

const AccordionCtx = createContext<AccordionContextValue | null>(null);

function useAccordionContext(component: string): AccordionContextValue {
  const ctx = useContext(AccordionCtx);
  if (!ctx) {
    throw new Error(`<${component}> must be used within <Accordion>`);
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Header label typography scale (medium weight title). */
const HEADER_TYPE: Record<AccordionSize, TextType> = {
  small: 'title-sm',
  default: 'title-md',
  large: 'title-lg',
};

/** Content body typography scale. */
const CONTENT_TYPE: Record<AccordionSize, TextType> = {
  small: 'body-sm',
  default: 'body-md',
  large: 'body-lg',
};

/** Normalise a value/defaultValue prop into an array of open values. */
function toOpenArray(
  v: string | string[] | undefined,
  type: AccordionType,
): string[] {
  if (v === undefined || v === null) return [];
  const arr = Array.isArray(v) ? v : [v];
  const cleaned = arr.filter((x) => x !== '');
  return type === 'single' ? cleaned.slice(0, 1) : cleaned;
}

// ---------------------------------------------------------------------------
// AccordionItem
// ---------------------------------------------------------------------------

export function AccordionItem({
  value,
  title,
  leadingIcon,
  disabled = false,
  children,
  style,
  accessibilityLabel,
}: AccordionItemProps) {
  const { openValues, toggle, size } = useAccordionContext('AccordionItem');
  const { components, colors, scheme } = useTheme();
  const motion = useMotion();
  const [isHovered, setIsHovered] = useState(false);

  const sizeTokens = components.accordion[size];
  const isOpen = openValues.includes(value);

  // Chevron rotation: chevron_right (0deg) rotates to point down (90deg) when open.
  const spin = useRef(new Animated.Value(isOpen ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(spin, {
      toValue: isOpen ? 1 : 0,
      duration: motion.scale(motion.transition.expand.duration),
      easing: motion.transition.expand.easing,
      useNativeDriver: true,
    }).start();
  }, [isOpen, spin, motion]);
  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  const labelFg = disabled ? scheme.disabled.fg : scheme.text.primary;

  const resolvedLeading =
    typeof leadingIcon === 'string' ? (
      <Icon name={leadingIcon} size={size} color={labelFg} />
    ) : (
      leadingIcon ?? null
    );

  const content =
    typeof children === 'string' ? (
      <Text type={CONTENT_TYPE[size]} color={scheme.text.description}>
        {children}
      </Text>
    ) : (
      children
    );

  return (
    <View
      style={[
        {
          borderBottomWidth: controlTokens.borderWidth,
          borderBottomColor: scheme.surface.overlay.border,
        },
        style,
      ]}
    >
      <Pressable
        onPress={() => {
          if (!disabled) toggle(value);
        }}
        disabled={disabled}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityState={{ expanded: isOpen, disabled }}
      >
        {({ pressed }) => {
          const headerBg = disabled
            ? 'transparent'
            : pressed
              ? colors.neutral.subtle.active.bg
              : isHovered
                ? colors.neutral.subtle.hover.bg
                : 'transparent';
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: sizeTokens.gap,
                paddingHorizontal: sizeTokens.paddingX,
                paddingVertical: sizeTokens.paddingY,
                backgroundColor: headerBg,
              }}
            >
              {resolvedLeading}
              <Text
                type={HEADER_TYPE[size]}
                color={labelFg}
                selectable={false}
                style={{ flex: 1 }}
              >
                {title}
              </Text>
              <Animated.View
                pointerEvents="none"
                style={{ transform: [{ rotate }] }}
              >
                <Icon name="chevron_right" size={size} color={labelFg} />
              </Animated.View>
            </View>
          );
        }}
      </Pressable>
      {isOpen ? (
        <View
          style={{
            paddingHorizontal: sizeTokens.paddingX,
            paddingBottom: sizeTokens.paddingY,
          }}
        >
          {content}
        </View>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Accordion
// ---------------------------------------------------------------------------

export function Accordion({
  type = 'single',
  value,
  defaultValue,
  onValueChange,
  size = 'default',
  collapsible = true,
  children,
  style,
  accessibilityLabel,
}: AccordionProps) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<string[]>(() =>
    toOpenArray(defaultValue, type),
  );
  const openValues = toOpenArray(isControlled ? value : internal, type);

  const toggle = (item: string) => {
    let next: string[];
    if (type === 'multiple') {
      next = openValues.includes(item)
        ? openValues.filter((x) => x !== item)
        : [...openValues, item];
    } else {
      const isOpen = openValues.includes(item);
      next = isOpen ? (collapsible ? [] : openValues) : [item];
    }
    if (!isControlled) setInternal(next);
    onValueChange?.(type === 'multiple' ? next : (next[0] ?? ''));
  };

  return (
    <AccordionCtx.Provider value={{ openValues, toggle, size }}>
      <View
        accessibilityRole="none"
        accessibilityLabel={accessibilityLabel}
        style={[{ alignSelf: 'stretch' }, style]}
      >
        {children}
      </View>
    </AccordionCtx.Provider>
  );
}
