/**
 * useFocusVisible — focus tracking that only shows the focus ring when focus
 * arrived from the keyboard. This mirrors the browser `:focus-visible` rule.
 *
 * Why: a focus ring on a button or chip should appear when you tab to it, not
 * when you click it with a mouse. Text fields are the exception. A field needs
 * a visible active state on any focus, so a field reads `isFocused`, and a
 * click target (Button, Chip, Link, Tabs, Checkbox, Radio, Toggle, Select
 * trigger) reads `isFocusVisible`.
 *
 * How: on web it watches the input modality. A key press (Tab, arrows) arms the
 * ring; a pointer press (mouse, touch) disarms it. On native there is no
 * pointer-versus-keyboard split, so any focus counts as visible.
 *
 * The ring itself is drawn with the web `outline` style props so it never
 * shifts layout. Use `focusRingStyle` for that, guarded to web.
 */

import { useCallback, useState } from 'react';
import { Platform, type ViewStyle } from 'react-native';
import { controlTokens } from '../tokens';

// Module-level input-modality tracker (web only). Starts "pointer" so a first
// mouse click never flashes a ring; the first key press arms it.
let hadKeyboardEvent = false;
let listenersAttached = false;

function attachModalityListeners(): void {
  if (listenersAttached) return;
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  listenersAttached = true;
  const onKeyDown = (e: KeyboardEvent): void => {
    // Ignore modifier-only combos (Cmd/Ctrl/Alt) so shortcuts don't arm the ring.
    if (e.metaKey || e.altKey || e.ctrlKey) return;
    hadKeyboardEvent = true;
  };
  const onPointer = (): void => {
    hadKeyboardEvent = false;
  };
  window.addEventListener('keydown', onKeyDown, true);
  window.addEventListener('mousedown', onPointer, true);
  window.addEventListener('pointerdown', onPointer, true);
  window.addEventListener('touchstart', onPointer, true);
}

// Attach as soon as the module loads on web so the very first Tab is caught.
attachModalityListeners();

export type FocusVisibleState = {
  /** True while the control is focused, from any input source. */
  isFocused: boolean;
  /** True while focused from the keyboard (web) or from any focus (native). */
  isFocusVisible: boolean;
  /** Spread onto a Pressable or focusable element. */
  focusProps: {
    onFocus: () => void;
    onBlur: () => void;
  };
};

export function useFocusVisible(): FocusVisibleState {
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  const onFocus = useCallback((): void => {
    attachModalityListeners();
    setIsFocused(true);
    setIsFocusVisible(Platform.OS === 'web' ? hadKeyboardEvent : true);
  }, []);

  const onBlur = useCallback((): void => {
    setIsFocused(false);
    setIsFocusVisible(false);
  }, []);

  return { isFocused, isFocusVisible, focusProps: { onFocus, onBlur } };
}

/**
 * A focus ring drawn as a web outline (no layout shift). Returns an empty
 * object off web or when not visible, so it is safe to spread into any style.
 *
 *   style={[base, focusRingStyle(isFocusVisible, scheme.focusRing.color)]}
 */
export function focusRingStyle(
  visible: boolean,
  color: string,
  width: number = controlTokens.focusRingWidth,
  offset: number = controlTokens.focusRingOffset,
): ViewStyle {
  if (!visible || Platform.OS !== 'web') return {} as ViewStyle;
  return {
    outlineStyle: 'solid',
    outlineColor: color,
    outlineWidth: width,
    outlineOffset: offset,
  } as unknown as ViewStyle;
}
