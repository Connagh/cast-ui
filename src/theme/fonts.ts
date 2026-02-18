/**
 * Font-loading helpers.
 *
 * Provides utilities for loading custom fonts used by any Cast UI theme.
 *
 * **Web** – use `googleFontsUrl(theme)` to generate a `<link>` href:
 *
 * ```ts
 * import { googleFontsUrl } from '@castui/cast-ui';
 *
 * const url = googleFontsUrl(myTheme);
 * if (url) {
 *   const link = document.createElement('link');
 *   link.rel = 'stylesheet';
 *   link.href = url;
 *   document.head.appendChild(link);
 * }
 * ```
 *
 * **React Native / Expo** – use `getThemeFontFamilies(theme)` to discover
 * which font families need loading, then pass them to `expo-font`.
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
import type { CastTheme } from './types';

/**
 * Dynamically extract all non-`system-ui` font families from a theme object.
 *
 * Scans both the semantic `fontFamily` layer and component-level font
 * properties to discover every custom font the theme uses. Returns a
 * deduplicated array of family names suitable for loading via Google Fonts
 * or `expo-font`.
 *
 * @param theme – Any complete `CastTheme` object.
 * @returns Array of unique font family names (excluding `system-ui`).
 *
 * @example
 * ```ts
 * const families = getThemeFontFamilies(myTheme);
 * // → ['Poppins'] or ['Inter', 'Merriweather'] etc.
 * ```
 */
export function getThemeFontFamilies(theme: CastTheme): string[] {
  const families = new Set<string>();

  // Semantic font families
  const sf = theme.semantic.fontFamily;
  for (const key of Object.keys(sf) as (keyof typeof sf)[]) {
    const family = sf[key];
    if (family && family !== 'system-ui') {
      families.add(family);
    }
  }

  // Component-level font families
  const { button, card } = theme.component;
  if (button.fontFamily && button.fontFamily !== 'system-ui') {
    families.add(button.fontFamily);
  }
  if (card.headingFontFamily && card.headingFontFamily !== 'system-ui') {
    families.add(card.headingFontFamily);
  }
  if (card.bodyFontFamily && card.bodyFontFamily !== 'system-ui') {
    families.add(card.bodyFontFamily);
  }

  return Array.from(families);
}

/**
 * Google Fonts `<link>` href for a given theme.
 *
 * Dynamically inspects the theme to discover which font families are needed.
 * Returns `null` if the theme uses only system fonts.
 *
 * @param theme – Any complete `CastTheme` object.
 *
 * @example
 * ```ts
 * const url = googleFontsUrl(myTheme);
 * if (url) {
 *   const link = document.createElement('link');
 *   link.href = url;
 *   link.rel = 'stylesheet';
 *   document.head.appendChild(link);
 * }
 * ```
 */
export function googleFontsUrl(theme: CastTheme): string | null {
  const families = getThemeFontFamilies(theme);
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
