/**
 * Font-loading helpers.
 *
 * Each theme may require custom fonts.  This module exports a map of
 * font-family names to `require()`-able assets (for Expo) or Google Fonts
 * URLs (for web).
 *
 * **React Native / Expo consumers** – use `expo-font` to load fonts before
 * rendering themed components:
 *
 * ```ts
 * import { useFonts } from 'expo-font';
 * import { THEME_FONTS } from '@castui/cast-ui/theme/fonts';
 *
 * const [loaded] = useFonts(THEME_FONTS.consumer);
 * ```
 *
 * **Web / Storybook** – fonts are loaded via `<link>` tags in
 * `.storybook/preview-head.html`.  No runtime font loading is needed.
 *
 * ### Android font registration convention
 *
 * Android cannot combine a generic `fontFamily` with a numeric `fontWeight`
 * for custom fonts — it silently falls back to the system font.  Instead,
 * each weight must be registered under a distinct name that matches the Expo
 * Google Fonts convention:
 *
 * | Weight | Registration key             |
 * |--------|------------------------------|
 * | 400    | `"FontName"`                 |
 * | 500    | `"FontName_500Medium"`       |
 * | 700    | `"FontName_700Bold"`         |
 *
 * Use {@link resolveFont} in component styles to transparently handle this.
 */

import { Platform, type TextStyle } from 'react-native';
import type { ThemeName } from './types';

/**
 * Map of Google Fonts family names used by each theme.
 * The `system-ui` entry means "use the platform default" and requires
 * no explicit loading.
 */
export const THEME_FONT_FAMILIES: Record<ThemeName, string[]> = {
  'white-label': [],                                             // system-ui only
  consumer: ['Poppins'],                                         // geometric sans
  corporate: ['Inter', 'Merriweather'],                          // sans + humanist serif
  luxury: ['Playfair Display', 'Cormorant Garamond'],            // serif + display
};

/**
 * Google Fonts `<link>` href for a given theme.
 * Useful if you need to programmatically inject font links on the web.
 */
export function googleFontsUrl(themeName: ThemeName): string | null {
  const families = THEME_FONT_FAMILIES[themeName];
  if (families.length === 0) return null;

  const params = families
    .map((f) => `family=${encodeURIComponent(f)}:wght@400;500;700`)
    .join('&');

  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

// ---------------------------------------------------------------------------
// Android font-weight resolution
// ---------------------------------------------------------------------------

/**
 * Suffix appended to a font family name on Android to select a specific
 * weight.  Matches the Expo Google Fonts registration convention.
 *
 * Weight 400 maps to the bare family name (empty suffix).
 */
export const ANDROID_WEIGHT_SUFFIX: Record<number, string> = {
  400: '',
  500: '_500Medium',
  700: '_700Bold',
};

/**
 * Return the correct `fontFamily` / `fontWeight` style props for the
 * current platform.
 *
 * - **iOS / Web** — returns `{ fontFamily, fontWeight }` unchanged.
 * - **Android** — maps to a weight-specific registered font name
 *   (e.g. `"Poppins_700Bold"`) and resets `fontWeight` to `'normal'`.
 * - **system-ui** — omits `fontFamily` entirely (platform default)
 *   and passes `fontWeight` through on all platforms.
 */
export function resolveFont(
  fontFamily: string,
  fontWeight: number,
): Pick<TextStyle, 'fontFamily' | 'fontWeight'> {
  const weight = String(fontWeight) as TextStyle['fontWeight'];

  // system-ui → platform default; just pass through fontWeight
  if (fontFamily === 'system-ui') {
    return { fontWeight: weight };
  }

  // Android needs a weight-specific registered name
  if (Platform.OS === 'android') {
    const suffix = ANDROID_WEIGHT_SUFFIX[fontWeight] ?? '';
    return {
      fontFamily: `${fontFamily}${suffix}`,
      fontWeight: 'normal',
    };
  }

  // iOS / Web – pass through unchanged
  return { fontFamily, fontWeight: weight };
}
