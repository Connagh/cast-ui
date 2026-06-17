/**
 * Slider — drag a thumb along a track to pick a number.
 *
 * Maps 1:1 to the Figma <Slider> component:
 *   intent → neutral | brand | danger   (filled portion + thumb ring)
 *   size   → small | default | large     (track thickness + thumb size)
 *   value  → min..max                     (single value)
 *
 * Drag the thumb or tap the track to set the value. Built on PanResponder, so
 * it works the same on web and native with zero dependencies. value is
 * controlled with value/onValueChange, or uncontrolled with defaultValue.
 *
 * Tokens: slider/{size}/track-height and slider/{size}/thumb-size are keyed by
 * the size prop and constant across density (like Progress's track-height);
 * slider/border-radius is the pill radius. The track background is the dedicated
 * control/slider/track/bg semantic (scheme.slider.track, cool-grey/200 light,
 * cool-grey/700 dark); the filled portion reuses the intent system
 * (colors[intent].bold.default.bg). No density-varying spacing.
 */

import React, { useRef, useState } from 'react';
import {
  PanResponder,
  Platform,
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

export type SliderSize = 'small' | 'default' | 'large';

export type SliderProps = {
  /** Current value (controlled). */
  value?: number;
  /** Initial value (uncontrolled). */
  defaultValue?: number;
  /** Called with the new value while dragging or on tap. */
  onValueChange?: (value: number) => void;
  /** Minimum value. Defaults to 0. */
  min?: number;
  /** Maximum value. Defaults to 100. */
  max?: number;
  /** Step increment. Defaults to 1. */
  step?: number;
  /** Semantic intent — drives the fill and thumb-ring colour. */
  intent?: IntentName;
  /** Size variant — track thickness and thumb size. */
  size?: SliderSize;
  /** Disables interaction and applies muted styling. */
  disabled?: boolean;
  /** Outer style — use for positioning (margin, width, alignSelf). */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label — describes what the slider controls. */
  accessibilityLabel?: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Thumb ring width. A small visual constant, not a spacing token. */
const THUMB_RING = 2;

const SHADOW_WEB = { boxShadow: '0px 1px 3px rgba(0,0,0,0.2)' };
const SHADOW_NATIVE: ViewStyle = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  elevation: 2,
};
const SHADOW = Platform.OS === 'web' ? SHADOW_WEB : SHADOW_NATIVE;

const clampFrac = (f: number) => Math.max(0, Math.min(1, f));

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Slider({
  value: controlledValue,
  defaultValue = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  intent = 'brand',
  size = 'default',
  disabled = false,
  style,
  accessibilityLabel,
}: SliderProps) {
  const { components, colors, scheme } = useTheme();
  const { trackHeight, thumbSize } = components.slider[size];
  const borderRadius = components.slider.borderRadius;

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = isControlled ? (controlledValue as number) : internalValue;

  const [trackWidth, setTrackWidth] = useState(0);

  // Live state for the PanResponder closures (created once).
  const live = useRef({
    trackWidth,
    disabled,
    min,
    max,
    step,
    isControlled,
    onValueChange,
  });
  live.current = { trackWidth, disabled, min, max, step, isControlled, onValueChange };

  const startFrac = useRef(0);

  const fracToValue = (f: number) => {
    const { min: lo, max: hi, step: st } = live.current;
    const raw = lo + clampFrac(f) * (hi - lo);
    const snapped = Math.round((raw - lo) / st) * st + lo;
    return Math.max(lo, Math.min(hi, snapped));
  };

  const commit = (v: number) => {
    if (!live.current.isControlled) setInternalValue(v);
    live.current.onValueChange?.(v);
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !live.current.disabled,
      onMoveShouldSetPanResponder: () => !live.current.disabled,
      onPanResponderGrant: (evt) => {
        const w = live.current.trackWidth;
        if (live.current.disabled || w === 0) return;
        const f = clampFrac(evt.nativeEvent.locationX / w);
        startFrac.current = f;
        commit(fracToValue(f));
      },
      onPanResponderMove: (_evt, g) => {
        const w = live.current.trackWidth;
        if (live.current.disabled || w === 0) return;
        const f = clampFrac(startFrac.current + g.dx / w);
        commit(fracToValue(f));
      },
    }),
  ).current;

  const range = max - min;
  const fraction = range > 0 ? clampFrac((value - min) / range) : 0;

  const onLayout = (e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width);

  const trackBg = disabled ? scheme.disabled.bg : scheme.slider.track;
  const fillColor = disabled ? scheme.disabled.fg : colors[intent].bold.default.bg;
  const thumbBorder = disabled ? scheme.disabled.border : colors[intent].bold.default.bg;

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min, max, now: Math.round(value) }}
      accessibilityState={{ disabled }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => {
        if (disabled) return;
        if (e.nativeEvent.actionName === 'increment') commit(fracToValue((value - min + step) / (range || 1)));
        if (e.nativeEvent.actionName === 'decrement') commit(fracToValue((value - min - step) / (range || 1)));
      }}
      style={[{ justifyContent: 'center', paddingHorizontal: thumbSize / 2 }, style]}
    >
      <View
        {...pan.panHandlers}
        onLayout={onLayout}
        style={{ height: thumbSize, justifyContent: 'center' }}
      >
        {/* Track */}
        <View
          style={{
            height: trackHeight,
            borderRadius,
            backgroundColor: trackBg,
            overflow: 'hidden',
          }}
        >
          {/* Fill */}
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: trackWidth * fraction,
              backgroundColor: fillColor,
              borderRadius,
            }}
          />
        </View>
        {/* Thumb */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: fraction * trackWidth - thumbSize / 2,
            width: thumbSize,
            height: thumbSize,
            borderRadius: thumbSize / 2,
            backgroundColor: scheme.surface.overlay.bg,
            borderWidth: THUMB_RING,
            borderColor: thumbBorder,
            ...SHADOW,
          }}
        />
      </View>
    </View>
  );
}
