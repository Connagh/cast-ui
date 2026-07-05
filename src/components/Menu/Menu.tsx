/**
 * Menu — a transient overlay of actions, anchored to a trigger.
 *
 * Compound component. <Menu> owns the open state and the anchored overlay;
 * <MenuItem> is one action row; <MenuDivider> separates groups; <MenuLabel> is
 * a section heading.
 *
 *   <Menu trigger={<Icon name="more_vert" />}>
 *     <MenuItem leadingIcon="edit" onPress={edit}>Edit</MenuItem>
 *     <MenuItem leadingIcon="content_copy" onPress={dupe}>Duplicate</MenuItem>
 *     <MenuDivider />
 *     <MenuItem leadingIcon="delete" intent="danger" onPress={remove}>Delete</MenuItem>
 *   </Menu>
 *
 * Maps 1:1 to the Figma <Menu> component:
 *   size  → small | default | large   (item typography + icon size)
 *   item state → default | hover | selected | disabled
 *
 * A Menu is not a Select. It fires actions; it does not hold a form value. So it
 * has its own dedicated tokens (menu/*) and its own colour slice
 * (scheme.menu.item), mirroring the select shape but namespaced to menu, so the
 * Figma <Menu> set binds to menu variables, not select ones. Item spacing varies
 * by density; the size prop drives typography (like Select). Surface reuses the
 * shared overlay tokens. Fonts are consumer-loaded.
 *
 * Exports:
 *   Menu        — trigger + anchored overlay
 *   MenuItem    — one action row
 *   MenuDivider — a separator line
 *   MenuLabel   — a section heading
 *   MenuContent — the floating card, for custom overlay/anchoring
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Pressable,
  ScrollView,
  View,
  Platform,
  type ViewStyle,
  type StyleProp,
  type GestureResponderEvent,
} from 'react-native';
import { useTheme } from '../../theme';
import { controlTokens } from '../../tokens';
import type { IntentName } from '../../tokens';
import { Text, type TextType } from '../Text';
import { Icon } from '../Icon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MenuSize = 'small' | 'default' | 'large';
export type MenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

export type MenuProps = {
  /** The element that opens the menu. Menu owns the press. */
  trigger: React.ReactNode;
  /** Menu rows (MenuItem / MenuDivider / MenuLabel). */
  children: React.ReactNode;
  /** Size variant — item typography and icon size. */
  size?: MenuSize;
  /** Where the overlay opens relative to the trigger. */
  placement?: MenuPlacement;
  /** Controlled open state. Omit for uncontrolled. */
  open?: boolean;
  /** Open-state change handler. */
  onOpenChange?: (open: boolean) => void;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Close the menu when an item is pressed. Defaults to true. */
  closeOnSelect?: boolean;
  /** Outer style for the anchor wrapper. */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label for the trigger. */
  accessibilityLabel?: string;
};

export type MenuItemProps = {
  /** The item label. */
  children: string;
  /** Press handler. */
  onPress?: (e: GestureResponderEvent) => void;
  /** Leading icon — Material Symbols name string or a ReactNode. */
  leadingIcon?: string | React.ReactNode;
  /** Trailing icon — Material Symbols name string or a ReactNode. */
  trailingIcon?: string | React.ReactNode;
  /** Keyboard shortcut hint shown at the end of the row. */
  shortcut?: string;
  /** Marks the item as active. Shows the selected colours and a check. */
  selected?: boolean;
  /** Intent — neutral (default) or danger for destructive actions. */
  intent?: Extract<IntentName, 'neutral' | 'danger'>;
  /** Disables the item. */
  disabled?: boolean;
  /** Accessibility label — falls back to the label text. */
  accessibilityLabel?: string;
};

export type MenuLabelProps = { children: string };

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type MenuContextValue = {
  size: MenuSize;
  onClose: () => void;
  closeOnSelect: boolean;
};

const MenuCtx = createContext<MenuContextValue | null>(null);

function useMenuContext(component: string): MenuContextValue {
  const ctx = useContext(MenuCtx);
  if (!ctx) throw new Error(`<${component}> must be used within <Menu>`);
  return ctx;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maps menu size → label typography scale (Text component `type`). */
const LABEL_TYPE: Record<MenuSize, TextType> = {
  small: 'label-sm',
  default: 'label-md',
  large: 'label-lg',
};

/** Minimum width of the floating card. Layout default, not a token. */
const MIN_WIDTH = 180;

/** The card never grows past this height before it scrolls. */
const CONTENT_MAX_HEIGHT = 320;

const SHADOW_WEB = {
  boxShadow:
    '0px 2px 4px -2px rgba(0,0,0,0.05), 0px 4px 6px -1px rgba(0,0,0,0.07)',
};
const SHADOW_NATIVE: ViewStyle = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 6,
  elevation: 4,
};

// ---------------------------------------------------------------------------
// MenuItem
// ---------------------------------------------------------------------------

export function MenuItem({
  children,
  onPress,
  leadingIcon,
  trailingIcon,
  shortcut,
  selected = false,
  intent = 'neutral',
  disabled = false,
  accessibilityLabel,
}: MenuItemProps) {
  const { size, onClose, closeOnSelect } = useMenuContext('MenuItem');
  const { components, colors, scheme } = useTheme();
  const tokens = components.menu.item;
  const [isHovered, setIsHovered] = useState(false);

  // Danger items use the intent system; neutral items use scheme.menu.item.
  const danger = intent === 'danger';
  const state = disabled
    ? scheme.menu.item.disabled
    : selected && isHovered
      ? scheme.menu.item.selectedHover
      : selected
        ? scheme.menu.item.selected
        : isHovered
          ? scheme.menu.item.hover
          : scheme.menu.item.default;

  const fg = disabled
    ? scheme.menu.item.disabled.fg
    : danger
      ? isHovered
        ? colors.danger.subtle.hover.fg
        : colors.danger.subtle.default.fg
      : state.fg;

  const bg = danger && isHovered && !disabled ? colors.danger.subtle.hover.bg : state.bg;

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

  const handlePress = (e: GestureResponderEvent) => {
    if (disabled) return;
    onPress?.(e);
    if (closeOnSelect) onClose();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      accessibilityRole="menuitem"
      accessibilityLabel={accessibilityLabel || children}
      accessibilityState={{ disabled, selected }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: tokens.gap,
        paddingHorizontal: tokens.paddingX,
        paddingVertical: tokens.paddingY,
        borderRadius: tokens.borderRadius,
        backgroundColor: bg,
      }}
    >
      {resolvedLeading}
      <Text type={LABEL_TYPE[size]} color={fg} selectable={false} style={{ flex: 1 }}>
        {children}
      </Text>
      {shortcut ? (
        <Text type="caption" color={scheme.text.description} selectable={false}>
          {shortcut}
        </Text>
      ) : null}
      {selected && !disabled ? <Icon name="check" size={size} color={fg} /> : resolvedTrailing}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// MenuLabel + MenuDivider
// ---------------------------------------------------------------------------

export function MenuLabel({ children }: MenuLabelProps) {
  const { components, scheme } = useTheme();
  const tokens = components.menu.group;
  return (
    <View style={{ paddingHorizontal: tokens.paddingX, paddingVertical: tokens.labelPaddingY }}>
      <Text
        type="caption"
        color={scheme.text.description}
        selectable={false}
        style={{ textTransform: 'uppercase' }}
      >
        {children}
      </Text>
    </View>
  );
}

export function MenuDivider() {
  const { components, scheme } = useTheme();
  const tokens = components.menu.separator;
  return (
    <View style={{ paddingVertical: tokens.marginY }}>
      <View style={{ height: 1, backgroundColor: scheme.menu.separator }} />
    </View>
  );
}

// ---------------------------------------------------------------------------
// MenuContent — the floating card
// ---------------------------------------------------------------------------

export type MenuContentProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function MenuContent({ children, style }: MenuContentProps) {
  const { components, scheme } = useTheme();
  const tokens = components.menu.content;
  const surface = scheme.surface;

  return (
    <View
      style={[
        {
          minWidth: MIN_WIDTH,
          backgroundColor: surface.overlay.bg,
          borderWidth: controlTokens.borderWidth,
          borderColor: surface.overlay.border,
          borderRadius: surface.overlay.borderRadius,
          paddingVertical: tokens.paddingY,
          maxHeight: CONTENT_MAX_HEIGHT,
          ...(Platform.OS === 'web' ? SHADOW_WEB : SHADOW_NATIVE),
        },
        style,
      ]}
    >
      <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Menu — trigger + anchored overlay
// ---------------------------------------------------------------------------

/** Absolute-position styles for the four placements. */
function placementStyle(placement: MenuPlacement): ViewStyle {
  switch (placement) {
    case 'bottom-end':
      return { position: 'absolute', top: '100%', right: 0, paddingTop: 4 };
    case 'top-start':
      return { position: 'absolute', bottom: '100%', left: 0, paddingBottom: 4 };
    case 'top-end':
      return { position: 'absolute', bottom: '100%', right: 0, paddingBottom: 4 };
    case 'bottom-start':
    default:
      return { position: 'absolute', top: '100%', left: 0, paddingTop: 4 };
  }
}

export function Menu({
  trigger,
  children,
  size = 'default',
  placement = 'bottom-start',
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  closeOnSelect = true,
  style,
  accessibilityLabel,
}: MenuProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  // Escape closes the menu on web.
  useEffect(() => {
    if (!open || Platform.OS !== 'web') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // The trigger owns the press. When the trigger is itself interactive (a
  // Button is a Pressable), a wrapping Pressable would swallow the tap: React
  // Native grants a press to a single responder and the inner element wins. So
  // inject the open-toggle onto the trigger. A passive trigger (a bare Icon)
  // ignores onPress, so the surrounding Pressable still handles the tap.
  let triggerNode: React.ReactNode = trigger;
  if (React.isValidElement(trigger)) {
    const el = trigger as React.ReactElement<{
      onPress?: (e: GestureResponderEvent) => void;
    }>;
    triggerNode = React.cloneElement(el, {
      onPress: (e: GestureResponderEvent) => {
        el.props.onPress?.(e);
        setOpen(!open);
      },
    });
  }

  return (
    <View style={[{ alignSelf: 'flex-start', position: 'relative', zIndex: open ? 1000 : 0 }, style]}>
      <Pressable
        onPress={() => setOpen(!open)}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || 'Open menu'}
        accessibilityState={{ expanded: open }}
      >
        {triggerNode}
      </Pressable>

      {/* Click-outside layer */}
      {open ? (
        <Pressable
          onPress={() => setOpen(false)}
          accessibilityRole="button"
          accessibilityLabel="Close menu"
          style={Platform.select({
            web: {
              position: 'fixed' as ViewStyle['position'],
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 0,
            } as ViewStyle,
            default: {
              position: 'absolute',
              top: -9999,
              left: -9999,
              width: 99999,
              height: 99999,
            } as ViewStyle,
          })}
        />
      ) : null}

      {/* Overlay */}
      {open ? (
        <View style={[placementStyle(placement), { zIndex: 1 }]}>
          <MenuCtx.Provider value={{ size, onClose: () => setOpen(false), closeOnSelect }}>
            <MenuContent>{children}</MenuContent>
          </MenuCtx.Provider>
        </View>
      ) : null}
    </View>
  );
}
