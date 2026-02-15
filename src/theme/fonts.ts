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
 */

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
