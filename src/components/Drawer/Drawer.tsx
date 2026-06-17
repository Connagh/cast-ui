/**
 * Drawer — a panel that slides in from an edge of the screen.
 *
 * Maps to the Figma <Drawer> component. Like BottomSheet, but anchored to any
 * edge: left and right give a vertical side panel (default 320 wide, full
 * height); top and bottom give a horizontal panel (full width, hugging content
 * up to ~90% of the screen). Spacing (padding, gap) comes from the density
 * theme. The panel is square (no corner radius), like a standard edge drawer,
 * with a single border and shadow on the inner edge.
 *
 * Interaction model matches BottomSheet: slide in on open, slide out on close,
 * the scrim fades with it. There is no finger dragging, so web and native behave
 * the same. Dismiss by pressing the scrim (when enabled) or calling onClose.
 *
 * Structure: scrim backdrop -> panel (optional title + scrolling content). The
 * panel surface reuses the shared overlay tokens; the scrim reuses
 * overlay.scrimOpacity. Fonts are consumer-loaded (Inter).
 *
 * Exports:
 *   Drawer        — full modal (scrim + animated panel)
 *   DrawerContent — just the panel, for inline use or static stories
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  Animated,
  ScrollView,
  View,
  Text,
  Platform,
  Dimensions,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { useTheme } from '../../theme';
import { fontFamily, fontWeight, title } from '../../tokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DrawerAnchor = 'left' | 'right' | 'top' | 'bottom';

export type DrawerContentProps = {
  /** Which edge the panel is anchored to. Defaults to "left". */
  anchor?: DrawerAnchor;
  /** Heading shown above the content. Optional. */
  title?: string;
  /** Panel content. */
  children?: React.ReactNode;
  /** Style override for the panel (e.g. set a custom width). */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label. Falls back to the title. */
  accessibilityLabel?: string;
};

export type DrawerProps = DrawerContentProps & {
  /** Controls visibility. */
  open: boolean;
  /** Called when the scrim is pressed or the panel requests close. */
  onClose?: () => void;
  /** Dismiss when the scrim is pressed. Defaults to true. */
  closeOnBackdropPress?: boolean;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Default width of a left/right panel. Override via `style`. */
const DEFAULT_WIDTH = 320;

/** Top/bottom panels never grow past this share of the screen height. */
const MAX_HEIGHT_RATIO = 0.9;

/** Animation timing. */
const DURATION = 240;

/** react-native-web does not support the native animation driver. */
const USE_NATIVE_DRIVER = Platform.OS !== 'web';

const SHADOW_WEB = {
  boxShadow: '0px 0px 6px rgba(0,0,0,0.04), 0px 0px 15px rgba(0,0,0,0.08)',
};

const SHADOW_NATIVE: ViewStyle = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.12,
  shadowRadius: 15,
  elevation: 16,
};

const isHorizontal = (a: DrawerAnchor) => a === 'left' || a === 'right';

// ---------------------------------------------------------------------------
// DrawerContent — the panel, without modal/scrim/animation
// ---------------------------------------------------------------------------

/**
 * The panel rendered inline. No modal, no scrim, no animation. Use this for
 * static display (Storybook visual stories) or custom overlay implementations.
 */
export function DrawerContent({
  anchor = 'left',
  title: titleText,
  children,
  style,
  accessibilityLabel,
}: DrawerContentProps) {
  const { components, scheme } = useTheme();
  const tokens = components.drawer;
  const surface = scheme.surface;
  const titleTokens = title.md;

  const horizontal = isHorizontal(anchor);

  // One border + shadow on the inner edge (the edge facing the content area).
  const edgeBorder: ViewStyle =
    anchor === 'left'
      ? { borderRightWidth: 1 }
      : anchor === 'right'
        ? { borderLeftWidth: 1 }
        : anchor === 'top'
          ? { borderBottomWidth: 1 }
          : { borderTopWidth: 1 };

  const sizing: ViewStyle = horizontal
    ? { width: DEFAULT_WIDTH, maxWidth: '100%', height: '100%' }
    : { width: '100%', maxHeight: `${MAX_HEIGHT_RATIO * 100}%` };

  return (
    <View
      accessibilityViewIsModal
      accessibilityLabel={accessibilityLabel || titleText}
      style={[
        {
          backgroundColor: surface.overlay.bg,
          borderColor: surface.overlay.border,
          ...edgeBorder,
          padding: tokens.padding,
          ...(Platform.OS === 'web' ? SHADOW_WEB : SHADOW_NATIVE),
        },
        sizing,
        style,
      ]}
    >
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: tokens.gap }}
        style={{ flexGrow: 0, flexShrink: 1 }}
      >
        {titleText ? (
          <Text
            accessibilityRole="header"
            style={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.medium,
              fontSize: titleTokens.fontSize,
              lineHeight: titleTokens.lineHeight,
              letterSpacing: titleTokens.letterSpacing,
              color: scheme.text.primary,
            }}
          >
            {titleText}
          </Text>
        ) : null}
        {children}
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Drawer — full modal with scrim and slide animation
// ---------------------------------------------------------------------------

export function Drawer({
  open,
  onClose,
  closeOnBackdropPress = true,
  anchor = 'left',
  ...contentProps
}: DrawerProps) {
  const { scheme } = useTheme();
  const scrimOpacity = scheme.overlay.scrimOpacity;

  const screen = Dimensions.get('window');
  const horizontal = isHorizontal(anchor);
  const distance = horizontal ? screen.width : screen.height;
  const sign = anchor === 'left' || anchor === 'top' ? -1 : 1;

  const offset = useRef(new Animated.Value(distance * sign)).current;
  const backdrop = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 1,
          duration: DURATION,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.spring(offset, {
          toValue: 0,
          damping: 24,
          stiffness: 240,
          mass: 0.9,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 0,
          duration: DURATION,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(offset, {
          toValue: distance * sign,
          duration: DURATION,
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!mounted) return null;

  const rootAlign: ViewStyle = horizontal
    ? { flexDirection: 'row', justifyContent: anchor === 'left' ? 'flex-start' : 'flex-end' }
    : { flexDirection: 'column', justifyContent: anchor === 'top' ? 'flex-start' : 'flex-end' };

  const transform = horizontal ? [{ translateX: offset }] : [{ translateY: offset }];

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose}>
      <View style={{ flex: 1, ...rootAlign }}>
        {/* Scrim */}
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#000000',
            opacity: backdrop.interpolate({
              inputRange: [0, 1],
              outputRange: [0, scrimOpacity],
            }),
          }}
        >
          <Pressable
            style={{ flex: 1 }}
            disabled={!closeOnBackdropPress}
            onPress={closeOnBackdropPress ? onClose : undefined}
            accessibilityRole="button"
            accessibilityLabel="Close drawer"
          />
        </Animated.View>

        {/* Panel */}
        <Animated.View
          style={{
            transform,
            ...(horizontal ? { height: '100%' } : { width: '100%' }),
          }}
        >
          <DrawerContent anchor={anchor} {...contentProps} />
        </Animated.View>
      </View>
    </Modal>
  );
}
