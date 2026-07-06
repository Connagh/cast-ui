/**
 * BottomSheet — modal surface that slides up from the bottom edge.
 *
 * Maps to the Figma <BottomSheet> component. The sheet hugs its content up to a
 * max height (~90% of the screen), then the content scrolls. There are no size
 * variants. Spacing (padding, gap) comes from the density theme. The top corner
 * radius and the drag handle dimensions are constant across density.
 *
 * Interaction model: the sheet slides up on open and down on close, the scrim
 * fades with it. There is no finger-dragging, so it behaves the same on web and
 * native. Dismiss by pressing the scrim (when enabled) or by calling onClose.
 *
 * Structure: scrim backdrop -> sheet (drag handle + optional title + content).
 * Surface styling reuses the shared overlay tokens (bg, border). The drag handle
 * is the one bespoke colour, scheme.bottomSheet.handle.
 *
 * Fonts are consumer-loaded (Inter via the typography tokens).
 *
 * Exports:
 *   BottomSheet         — full modal (scrim + animated sheet)
 *   BottomSheetContent  — just the sheet card, for inline use or static stories
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
import { useMotion, useTheme } from '../../theme';
import { fontFamily, fontWeight, title, controlTokens } from '../../tokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BottomSheetContentProps = {
  /** Heading shown above the content. Optional. */
  title?: string;
  /** Show the drag handle pill at the top of the sheet. Defaults to true. */
  showHandle?: boolean;
  /** Sheet content. */
  children?: React.ReactNode;
  /** Style override for the sheet card. */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label. Falls back to the title. */
  accessibilityLabel?: string;
};

export type BottomSheetProps = BottomSheetContentProps & {
  /** Controls visibility. */
  open: boolean;
  /** Called when the scrim is pressed or the sheet requests close. */
  onClose?: () => void;
  /** Dismiss when the scrim is pressed. Defaults to true. */
  closeOnBackdropPress?: boolean;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** The sheet never grows past this share of the screen height. */
const MAX_HEIGHT_RATIO = 0.9;


/** Upward shadow for web (matches Figma shadow/lg, cast above the sheet). */
const SHADOW_WEB = {
  boxShadow: '0px -4px 6px rgba(0,0,0,0.04), 0px -10px 15px rgba(0,0,0,0.08)',
};

/** Upward shadow for native. */
const SHADOW_NATIVE: ViewStyle = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: -8 },
  shadowOpacity: 0.08,
  shadowRadius: 15,
  elevation: 16,
};

// ---------------------------------------------------------------------------
// BottomSheetContent — the sheet card, without modal/scrim/animation
// ---------------------------------------------------------------------------

/**
 * The sheet card rendered inline. No modal, no scrim, no animation. Use this for
 * static display (Storybook visual stories) or custom overlay implementations.
 */
export function BottomSheetContent({
  title: titleText,
  showHandle = true,
  children,
  style,
  accessibilityLabel,
}: BottomSheetContentProps) {
  const { components, scheme, fonts } = useTheme();
  const tokens = components.bottomSheet;
  const surface = scheme.surface;
  const textTokens = scheme.text;
  const titleTokens = title.md;

  return (
    <View
      accessibilityViewIsModal
      accessibilityLabel={accessibilityLabel || titleText}
      style={[
        {
          width: '100%',
          maxHeight: '100%',
          backgroundColor: surface.overlay.bg,
          borderTopLeftRadius: tokens.borderRadius,
          borderTopRightRadius: tokens.borderRadius,
          borderWidth: controlTokens.borderWidth,
          borderColor: surface.overlay.border,
          paddingHorizontal: tokens.padding,
          paddingBottom: tokens.padding,
          paddingTop: tokens.handleGap,
          ...(Platform.OS === 'web' ? SHADOW_WEB : SHADOW_NATIVE),
        },
        style,
      ]}
    >
      {showHandle ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={{ alignItems: 'center', marginBottom: tokens.handleGap }}
        >
          <View
            style={{
              width: tokens.handleWidth,
              height: tokens.handleHeight,
              borderRadius: tokens.handleHeight / 2,
              backgroundColor: scheme.bottomSheet.handle,
            }}
          />
        </View>
      ) : null}

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
              fontFamily: fonts.sans,
              fontWeight: fontWeight.medium,
              fontSize: titleTokens.fontSize,
              lineHeight: titleTokens.lineHeight,
              letterSpacing: titleTokens.letterSpacing,
              color: textTokens.primary,
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
// BottomSheet — full modal with scrim and slide animation
// ---------------------------------------------------------------------------

export function BottomSheet({
  open,
  onClose,
  closeOnBackdropPress = true,
  ...contentProps
}: BottomSheetProps) {
  const { scheme, fonts } = useTheme();
  const motion = useMotion();
  const scrimOpacity = scheme.overlay.scrimOpacity;

  const screenHeight = Dimensions.get('window').height;
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const backdrop = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 1,
          duration: motion.scale(motion.transition.standard.duration),
          easing: motion.transition.standard.easing,
          useNativeDriver: motion.useNativeDriver,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          ...motion.spring.overlay,
          useNativeDriver: motion.useNativeDriver,
        }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 0,
          duration: motion.scale(motion.transition.standard.duration),
          easing: motion.transition.standard.easing,
          useNativeDriver: motion.useNativeDriver,
        }),
        Animated.timing(translateY, {
          toValue: screenHeight,
          duration: motion.scale(motion.transition.standard.duration),
          easing: motion.transition.standard.easing,
          useNativeDriver: motion.useNativeDriver,
        }),
      ]).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!mounted) return null;

  return (
    <Modal
      visible={mounted}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
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
            accessibilityLabel="Close sheet"
          />
        </Animated.View>

        {/* Sheet */}
        <Animated.View
          style={{
            maxHeight: `${MAX_HEIGHT_RATIO * 100}%`,
            transform: [{ translateY }],
          }}
        >
          <BottomSheetContent {...contentProps} />
        </Animated.View>
      </View>
    </Modal>
  );
}
