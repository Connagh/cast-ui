/**
 * Backdrop — a full-screen scrim that dims everything behind it.
 *
 * Maps to the Figma <Backdrop> component. Use it on its own (a loading veil) or
 * as the dimming layer behind a modal surface. It fills its parent, so place it
 * inside a full-screen container or a Modal. It fades in and out with `open` and
 * can centre a child (e.g. a Spinner).
 *
 * Colour: a black scrim at scheme.overlay.scrimOpacity, so it follows the active
 * colour mode. With `invisible`, the scrim is transparent but still catches
 * presses (matching a click-away layer). Backdrop introduces no new tokens — it
 * reuses the shared overlay scrim opacity.
 *
 * Press the scrim to dismiss when `onPress` is supplied.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  Platform,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type GestureResponderEvent,
} from 'react-native';
import { useTheme } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BackdropProps = {
  /** Controls visibility. */
  open: boolean;
  /** Called when the scrim is pressed. */
  onPress?: (e: GestureResponderEvent) => void;
  /** Transparent scrim that still catches presses. Defaults to false. */
  invisible?: boolean;
  /** Centred content (e.g. a Spinner). */
  children?: React.ReactNode;
  /** Style override for the scrim layer. */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label for the dismiss layer. */
  accessibilityLabel?: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Fade timing. */
const DURATION = 220;

/** react-native-web does not support the native animation driver. */
const USE_NATIVE_DRIVER = Platform.OS !== 'web';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Backdrop({
  open,
  onPress,
  invisible = false,
  children,
  style,
  accessibilityLabel,
}: BackdropProps) {
  const { scheme } = useTheme();
  const targetOpacity = invisible ? 0 : scheme.overlay.scrimOpacity;

  const fade = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      Animated.timing(fade, {
        toValue: 1,
        duration: DURATION,
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start();
    } else if (mounted) {
      Animated.timing(fade, {
        toValue: 0,
        duration: DURATION,
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!mounted) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        StyleSheet.absoluteFillObject,
        {
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
          opacity: fade.interpolate({
            inputRange: [0, 1],
            outputRange: [0, targetOpacity],
          }),
        },
        style,
      ]}
    >
      <Pressable
        style={StyleSheet.absoluteFillObject}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || 'Dismiss'}
      />
      {children}
    </Animated.View>
  );
}
