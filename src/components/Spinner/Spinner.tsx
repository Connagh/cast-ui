/**
 * Spinner — indeterminate circular loading indicator.
 *
 * Maps 1:1 to the Figma <Spinner> component:
 *   intent → neutral | brand | danger   (arc colour)
 *   size   → small | default | large    (diameter + ring stroke)
 *
 * A Spinner is always indeterminate: it shows that work is happening, not how
 * much is left. For a known percentage use <Progress> instead.
 *
 * Geometry. The diameter and ring stroke are the two tokens this component
 * introduces (`spinner/{size}/diameter`, `spinner/{size}/stroke`). Both are
 * keyed by the `size` prop and constant across the three densities, like
 * <Progress> track-height. So Spinner reads no density-varying spacing. The
 * ring radius is half the diameter, computed here.
 *
 * The ring is drawn with borders: all four sides take the faint track colour,
 * then the top border takes the intent colour to form one visible arc. The
 * whole ring rotates, so the arc sweeps around. This needs no SVG and keeps the
 * zero-dependency contract.
 *
 * Colours. The arc binds to the intent system
 * (`colors[intent].bold.default.bg`) so it tracks the host intent and any
 * ThemeProvider colour overrides. The track ring is the dedicated
 * `control/spinner/track/bg` semantic (cool-grey/200 light, cool-grey/700
 * dark, matching the <Progress> track), mirrored as `scheme.spinner.track`, so
 * it follows light/dark colour mode.
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import type { IntentName } from '../../tokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SpinnerSize = 'small' | 'default' | 'large';

export type SpinnerProps = {
  /** Semantic intent — drives the arc colour. */
  intent?: IntentName;
  /** Size variant — controls diameter and ring stroke. */
  size?: SpinnerSize;
  /** Outer style — use for positioning (margin, alignSelf). */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label — describes what is loading. */
  accessibilityLabel?: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** One full rotation, in milliseconds. */
const ROTATION_DURATION = 800;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Spinner({
  intent = 'brand',
  size = 'default',
  style,
  accessibilityLabel = 'Loading',
}: SpinnerProps) {
  const { components, colors, scheme } = useTheme();

  const { diameter, stroke } = components.spinner[size];
  const arc = colors[intent].bold.default.bg;
  const trackColor = scheme.spinner.track;

  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    spin.setValue(0);
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: ROTATION_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ busy: true }}
      style={[
        {
          width: diameter,
          height: diameter,
          borderRadius: diameter / 2,
          borderWidth: stroke,
          borderColor: trackColor,
          borderTopColor: arc,
          transform: [{ rotate }],
        },
        style,
      ]}
    />
  );
}
