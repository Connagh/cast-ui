/**
 * useMotion — the single access point for animation in Cast UI.
 *
 * Returns the theme's motion tokens plus three runtime helpers:
 *   reduceMotion     true when the OS "reduce motion" setting is on.
 *   useNativeDriver  the Animated.timing native-driver flag (false on web).
 *   scale(ms)        a duration in ms, collapsed to 0 when reduceMotion is on.
 *
 * Components read a semantic role for the value and wrap durations in scale(),
 * so the whole library honours reduce-motion from one place:
 *
 *   const motion = useMotion();
 *   Animated.timing(v, {
 *     toValue: 1,
 *     duration: motion.scale(motion.transition.standard.duration),
 *     easing: motion.transition.standard.easing,
 *     useNativeDriver: motion.useNativeDriver,
 *   });
 *
 * For continuous loops (spinner, skeleton, progress), check reduceMotion and
 * skip starting the loop.
 */

import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import { useTheme } from './ThemeContext';
import type { MotionTokens } from '../tokens/motion';

export type Motion = MotionTokens & {
  /** True when the OS "reduce motion" accessibility setting is enabled. */
  reduceMotion: boolean;
  /** Animated useNativeDriver value. False on web (the web driver can't animate layout). */
  useNativeDriver: boolean;
  /** Returns the given duration, or 0 when reduce-motion is on. */
  scale: (ms: number) => number;
};

export function useMotion(): Motion {
  const { motion } = useTheme();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let active = true;
    const read = AccessibilityInfo.isReduceMotionEnabled;
    if (typeof read === 'function') {
      read()
        .then((value) => {
          if (active) setReduceMotion(!!value);
        })
        .catch(() => {});
    }
    const sub = AccessibilityInfo.addEventListener?.(
      'reduceMotionChanged',
      (value: boolean) => setReduceMotion(!!value),
    );
    return () => {
      active = false;
      sub?.remove?.();
    };
  }, []);

  return {
    ...motion,
    reduceMotion,
    useNativeDriver: Platform.OS !== 'web',
    scale: (ms: number) => (reduceMotion ? 0 : ms),
  };
}
