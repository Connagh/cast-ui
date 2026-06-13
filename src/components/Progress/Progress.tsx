/**
 * Progress — linear progress indicator (determinate + indeterminate).
 *
 * Maps 1:1 to the Figma <Progress> component:
 *   intent → neutral | brand | danger   (fill colour)
 *   size   → small | default | large    (track thickness)
 *   value  → 0–100                       (determinate fill; omit for indeterminate)
 *
 * The track thickness is the one genuinely new token this component introduces
 * (`progress/{size}/track-height`): it is keyed by the `size` prop and is
 * constant across the three densities — like Badge's dot-size or Toggle's
 * track. The pill radius is constant. Progress therefore reads no
 * density-varying spacing.
 *
 * Colours: the fill binds to the intent system
 * (`colors[intent].bold.default.bg`) so it tracks the host intent and any
 * ThemeProvider colour overrides; the track background is the dedicated
 * `control/progress/track/bg` semantic (cool-grey/200 light, cool-grey/700
 * dark, matching the Toggle off-track), so it follows light/dark colour mode.
 *
 * When `value` is omitted (or null) the bar renders an indeterminate sweep.
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import type { IntentName } from '../../tokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ProgressSize = 'small' | 'default' | 'large';

export type ProgressProps = {
  /**
   * Completion percentage (0–100). Omit (or pass null) for an indeterminate
   * animated sweep.
   */
  value?: number | null;
  /** Semantic intent — drives the fill colour. */
  intent?: IntentName;
  /** Size variant — controls track thickness. */
  size?: ProgressSize;
  /** Outer style — use for positioning (margin, width, alignSelf). */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label — describes what is loading. */
  accessibilityLabel?: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Fraction of the track the indeterminate sweep bar occupies. */
const INDETERMINATE_BAR_FRACTION = 0.4;

const clamp = (n: number) => Math.max(0, Math.min(100, n));

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Progress({
  value,
  intent = 'brand',
  size = 'default',
  style,
  accessibilityLabel = 'Loading',
}: ProgressProps) {
  const { components, colors, scheme } = useTheme();

  const { trackHeight } = components.progress[size];
  const borderRadius = components.progress.borderRadius;
  const fill = colors[intent].bold.default.bg;
  const trackBg = scheme.progress.track;

  const isIndeterminate = value === undefined || value === null;
  const pct = isIndeterminate ? 0 : clamp(value as number);

  // Track width is needed to drive the indeterminate translateX in px
  // (useNativeDriver can't animate a percentage width).
  const [trackWidth, setTrackWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) =>
    setTrackWidth(e.nativeEvent.layout.width);

  const slide = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!isIndeterminate || trackWidth === 0) return;
    slide.setValue(0);
    const loop = Animated.loop(
      Animated.timing(slide, {
        toValue: 1,
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [isIndeterminate, trackWidth, slide]);

  const barWidth = trackWidth * INDETERMINATE_BAR_FRACTION;
  const translateX = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [-barWidth, trackWidth],
  });

  return (
    <View
      onLayout={onLayout}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={
        isIndeterminate ? undefined : { min: 0, max: 100, now: Math.round(pct) }
      }
      accessibilityState={isIndeterminate ? { busy: true } : undefined}
      style={[
        {
          width: '100%',
          height: trackHeight,
          borderRadius,
          backgroundColor: trackBg,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {isIndeterminate ? (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: barWidth,
            borderRadius,
            backgroundColor: fill,
            transform: [{ translateX }],
          }}
        />
      ) : (
        <View
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius,
            backgroundColor: fill,
          }}
        />
      )}
    </View>
  );
}
