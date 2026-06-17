/**
 * SpeedDial — a floating action button that expands into a set of actions.
 *
 * Compound component. <SpeedDial> is the round FAB; <SpeedDialAction> is one
 * action that fans out when the FAB is pressed.
 *
 *   <SpeedDial icon="add">
 *     <SpeedDialAction icon="edit" label="Edit" onPress={edit} />
 *     <SpeedDialAction icon="share" label="Share" onPress={share} />
 *   </SpeedDial>
 *
 * Maps 1:1 to the Figma <Speed Dial> component:
 *   intent    → neutral | brand | danger   (FAB fill)
 *   size      → small | default | large     (FAB + action sizes)
 *   direction → up | down | left | right     (which way actions fan out)
 *
 * The FAB fills with the intent bold colour; actions are neutral surface
 * buttons with a tag-styled label. An optional scrim dims the background and
 * closes on press. open is controlled with open/onOpenChange or uncontrolled.
 *
 * Tokens: speed-dial/{size}/fab-size and action-size are constant per size;
 * speed-dial/{size}/gap is density-varying. The FAB icon and action icons use
 * the named Icon scale. Place the SpeedDial in a positioned container (e.g.
 * absolute bottom-right) so it floats. Fonts are consumer-loaded.
 *
 * Exports:
 *   SpeedDial        — the FAB + expanding actions
 *   SpeedDialAction  — one action button with a label
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
  Platform,
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import { controlTokens } from '../../tokens';
import type { IntentName } from '../../tokens';
import { Text } from '../Text';
import { Icon, type IconProps } from '../Icon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SpeedDialSize = 'small' | 'default' | 'large';
export type SpeedDialDirection = 'up' | 'down' | 'left' | 'right';

export type SpeedDialProps = {
  /** `<SpeedDialAction>` children. */
  children: React.ReactNode;
  /** FAB icon when closed. Defaults to "add". */
  icon?: string;
  /** FAB icon when open. Defaults to "close". */
  openIcon?: string;
  /** Controlled open state. */
  open?: boolean;
  /** Open-state change handler. */
  onOpenChange?: (open: boolean) => void;
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean;
  /** Which way actions fan out. Defaults to "up". */
  direction?: SpeedDialDirection;
  /** Semantic intent — drives the FAB fill. */
  intent?: IntentName;
  /** Size variant — FAB and action sizes. */
  size?: SpeedDialSize;
  /** Show a dimming scrim behind the open actions. Defaults to true. */
  backdrop?: boolean;
  /** Outer style for the FAB container (use for absolute positioning). */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label for the FAB. */
  accessibilityLabel?: string;
};

export type SpeedDialActionProps = {
  /** Action icon — Material Symbols name. */
  icon: string;
  /** Action label, shown as a tag chip beside the button. */
  label?: string;
  /** Press handler. */
  onPress?: () => void;
  /** Disables this action. */
  disabled?: boolean;
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type SpeedDialContextValue = {
  size: SpeedDialSize;
  gap: number;
  orientation: 'vertical' | 'horizontal';
  onClose: () => void;
};

const SpeedDialCtx = createContext<SpeedDialContextValue | null>(null);

function useSpeedDialContext(): SpeedDialContextValue {
  const ctx = useContext(SpeedDialCtx);
  if (!ctx) throw new Error('<SpeedDialAction> must be used within <SpeedDial>');
  return ctx;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FAB_ICON: Record<SpeedDialSize, IconProps['size']> = {
  small: 'default',
  default: 'large',
  large: 'large',
};
const ACTION_ICON: Record<SpeedDialSize, IconProps['size']> = {
  small: 'small',
  default: 'default',
  large: 'default',
};

const DURATION_IN = 160;
const DURATION_OUT = 140;
const USE_NATIVE_DRIVER = Platform.OS !== 'web';

const SHADOW_WEB = {
  boxShadow: '0px 4px 6px -1px rgba(0,0,0,0.12), 0px 2px 4px -2px rgba(0,0,0,0.1)',
};
const SHADOW_NATIVE: ViewStyle = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.18,
  shadowRadius: 6,
  elevation: 6,
};
const SHADOW = Platform.OS === 'web' ? SHADOW_WEB : SHADOW_NATIVE;

// ---------------------------------------------------------------------------
// SpeedDialAction
// ---------------------------------------------------------------------------

export function SpeedDialAction({ icon, label, onPress, disabled = false }: SpeedDialActionProps) {
  const { size, gap, orientation, onClose } = useSpeedDialContext();
  const { components, scheme } = useTheme();
  const actionSize = components.speedDial[size].actionSize;

  const button = (
    <Pressable
      onPress={() => {
        if (disabled) return;
        onPress?.();
        onClose();
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label || icon}
      style={{
        width: actionSize,
        height: actionSize,
        borderRadius: actionSize / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: scheme.surface.overlay.bg,
        borderWidth: controlTokens.borderWidth,
        borderColor: scheme.surface.overlay.border,
        ...SHADOW,
      }}
    >
      <Icon name={icon} size={ACTION_ICON[size]} color={disabled ? scheme.disabled.fg : scheme.text.primary} />
    </Pressable>
  );

  const labelChip = label ? (
    <View
      pointerEvents="none"
      style={{
        backgroundColor: scheme.tag.bg,
        borderRadius: scheme.tag.borderRadius,
        paddingHorizontal: scheme.tag.paddingX,
        paddingVertical: scheme.tag.paddingY,
      }}
    >
      <Text type="label-sm" color={scheme.tag.fg} selectable={false}>
        {label}
      </Text>
    </View>
  ) : null;

  if (orientation === 'vertical') {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap }}>
        {labelChip}
        {button}
      </View>
    );
  }
  return (
    <View style={{ alignItems: 'center', gap }}>
      {button}
      {labelChip}
    </View>
  );
}

// ---------------------------------------------------------------------------
// SpeedDial
// ---------------------------------------------------------------------------

export function SpeedDial({
  children,
  icon = 'add',
  openIcon = 'close',
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  direction = 'up',
  intent = 'brand',
  size = 'default',
  backdrop = true,
  style,
  accessibilityLabel,
}: SpeedDialProps) {
  const { components, colors, scheme } = useTheme();
  const { fabSize, actionSize, gap } = components.speedDial[size];
  const fabColors = colors[intent].bold.default;

  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const orientation = direction === 'up' || direction === 'down' ? 'vertical' : 'horizontal';

  // Mount + animate the actions group.
  const anim = useRef(new Animated.Value(open ? 1 : 0)).current;
  const [actionsMounted, setActionsMounted] = useState(open);
  useEffect(() => {
    if (open) {
      setActionsMounted(true);
      Animated.timing(anim, { toValue: 1, duration: DURATION_IN, useNativeDriver: USE_NATIVE_DRIVER }).start();
    } else if (actionsMounted) {
      Animated.timing(anim, { toValue: 0, duration: DURATION_OUT, useNativeDriver: USE_NATIVE_DRIVER }).start(({ finished }) => {
        if (finished) setActionsMounted(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const inset = (fabSize - actionSize) / 2;
  const groupBase: ViewStyle = { position: 'absolute', gap };
  const groupStyle: ViewStyle =
    direction === 'up'
      ? { ...groupBase, bottom: '100%', right: inset, marginBottom: gap, alignItems: 'flex-end' }
      : direction === 'down'
        ? { ...groupBase, top: '100%', right: inset, marginTop: gap, alignItems: 'flex-end' }
        : direction === 'left'
          ? { ...groupBase, right: '100%', top: inset, marginRight: gap, alignItems: 'center' }
          : { ...groupBase, left: '100%', top: inset, marginLeft: gap, alignItems: 'center' };
  const groupFlex: ViewStyle['flexDirection'] =
    direction === 'up' ? 'column-reverse' : direction === 'down' ? 'column' : direction === 'left' ? 'row-reverse' : 'row';

  return (
    <View style={[{ alignSelf: 'flex-start', position: 'relative', zIndex: open ? 1000 : 0 }, style]}>
      {/* Scrim */}
      {open && backdrop ? (
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
              backgroundColor: '#000000',
              opacity: scheme.overlay.scrimOpacity,
              zIndex: 0,
            } as ViewStyle,
            default: {
              position: 'absolute',
              top: -9999,
              left: -9999,
              width: 99999,
              height: 99999,
              backgroundColor: '#000000',
              opacity: scheme.overlay.scrimOpacity,
            } as ViewStyle,
          })}
        />
      ) : null}

      {/* Actions */}
      {actionsMounted ? (
        <Animated.View
          style={[
            groupStyle,
            {
              flexDirection: groupFlex,
              zIndex: 1,
              opacity: anim,
              transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
            },
          ]}
        >
          <SpeedDialCtx.Provider value={{ size, gap, orientation, onClose: () => setOpen(false) }}>
            {children}
          </SpeedDialCtx.Provider>
        </Animated.View>
      ) : null}

      {/* FAB */}
      <Pressable
        onPress={() => setOpen(!open)}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || 'Actions'}
        accessibilityState={{ expanded: open }}
        style={{
          width: fabSize,
          height: fabSize,
          borderRadius: fabSize / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: fabColors.bg,
          zIndex: 2,
          ...SHADOW,
        }}
      >
        <Icon name={open ? openIcon : icon} size={FAB_ICON[size]} color={fabColors.fg} />
      </Pressable>
    </View>
  );
}
