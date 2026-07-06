/**
 * ThemeProvider — wraps your app to enable density theming, light/dark colour
 * modes, and colour customisation.
 *
 * @example Basic usage — switch density
 * ```tsx
 * import { ThemeProvider } from '@castui/cast-ui';
 *
 * <ThemeProvider density="comfortable">
 *   <App />
 * </ThemeProvider>
 * ```
 *
 * @example Dark mode
 * ```tsx
 * <ThemeProvider colorMode="dark">
 *   <App />
 * </ThemeProvider>
 * ```
 *
 * @example Rebrand — override intent colours
 * ```tsx
 * <ThemeProvider
 *   density="default"
 *   colors={{
 *     brand: {
 *       bold: {
 *         default: { bg: '#7C3AED', fg: '#FFFFFF', border: '#7C3AED' },
 *         hover:   { bg: '#6D28D9', fg: '#FFFFFF', border: '#6D28D9' },
 *         active:  { bg: '#5B21B6', fg: '#FFFFFF', border: '#5B21B6' },
 *       },
 *     },
 *   }}
 * >
 *   <App />
 * </ThemeProvider>
 * ```
 */

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { themes, spacingScales } from './themes';
import {
  colorSchemes,
  deriveBrandDependents,
  intentColors as defaultIntentColors,
  makeBrandColors,
} from '../tokens/colors';
import type { BrandSeed, ColorMode, ColorScheme, IntentName } from '../tokens/colors';
import { motionTokens, resolveMotion } from '../tokens/motion';
import type { MotionTokens, MotionOverrides } from '../tokens/motion';
import { defaultFonts, type FontFamilyTokens } from '../tokens/typography';
import type { DensityTheme, ComponentTokens, DeepPartial, SpacingScale } from './types';

// ---------------------------------------------------------------------------
// Theme shape
// ---------------------------------------------------------------------------

type IntentColorMap = typeof defaultIntentColors;

export type Theme = {
  density: DensityTheme;
  components: ComponentTokens;
  /** Density-aware layout spacing scale (page gutters, section gaps,
   * stacks). Scales with density, like component spacing. */
  spacing: SpacingScale;
  /** Active colour mode — light or dark. */
  colorMode: ColorMode;
  /** Full resolved colour scheme for the active mode (overrides applied). */
  scheme: ColorScheme;
  /** Intent colours of the active scheme — kept for backwards compatibility. */
  colors: IntentColorMap;
  /** Disabled colours of the active scheme — kept for backwards compatibility. */
  disabledColors: ColorScheme['disabled'];
  /** Resolved font families (sans, mono, serif, display). Overridable via the `fonts` prop. */
  fonts: FontFamilyTokens;
  /** Motion tokens — animation durations, easings, springs. Constant across density and colour mode. */
  motion: MotionTokens;
};

// ---------------------------------------------------------------------------
// Deep merge utility (for partial colour overrides)
// ---------------------------------------------------------------------------

function deepMerge<T extends Record<string, unknown>>(
  base: T,
  overrides: Record<string, unknown>,
): T {
  const result: Record<string, unknown> = { ...base };
  for (const key of Object.keys(overrides)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
    const baseVal = base[key];
    const overVal = overrides[key];
    if (
      overVal &&
      typeof overVal === 'object' &&
      !Array.isArray(overVal) &&
      baseVal &&
      typeof baseVal === 'object'
    ) {
      result[key] = deepMerge(
        baseVal as Record<string, unknown>,
        overVal as Record<string, unknown>,
      );
    } else {
      result[key] = overVal;
    }
  }
  return result as T;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const defaultTheme: Theme = {
  density: 'default',
  components: themes.default,
  spacing: spacingScales.default,
  colorMode: 'light',
  scheme: colorSchemes.light,
  colors: colorSchemes.light.intents,
  disabledColors: colorSchemes.light.disabled,
  fonts: defaultFonts,
  motion: motionTokens,
};

const ThemeContext = createContext<Theme>(defaultTheme);

/** Families we've already warned about, so the dev warning fires once each. */
const warnedFonts = new Set<string>();

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export type ThemeProviderProps = {
  /** Density theme — controls spacing and padding across all components. */
  density?: DensityTheme;
  /** Colour mode — switches between the light and dark colour schemes. */
  colorMode?: ColorMode;
  /**
   * Brand seed — one colour (or a base/hover/active set). ThemeProvider builds
   * a full, mode-correct brand ramp from it for the active `colorMode`, so a
   * rebrand reads well in both light and dark with no per-mode tuning. Merged
   * before `colors`, so an explicit `colors.brand` override still wins. This is
   * the recommended way to rebrand; it avoids the low-contrast dark-mode trap a
   * hand-written light-only override causes.
   */
  brand?: BrandSeed | string;
  /**
   * Partial colour overrides — deep-merged with the active scheme's intent
   * colours. Only provide the values you want to change; everything else
   * stays default.
   */
  colors?: Partial<Record<IntentName, DeepPartial<IntentColorMap[IntentName]>>>;
  /**
   * Partial overrides for the rest of the colour scheme — surface, text,
   * focusRing, overlay, etc. Deep-merged into the active scheme after `colors`.
   * Forward-compatible: pass whatever sections a cast-theme file provides.
   * Usually you don't set this by hand — `applyCastTheme` builds it for you.
   */
  scheme?: DeepPartial<ColorScheme>;
  /**
   * Primitive-level motion overrides — durations, cycle lengths, easing
   * beziers, springs. Semantic roles (transition/feedback/loop) are rebuilt
   * from these, so one duration change flows into every role that uses it.
   * Usually you don't set this by hand — `applyCastTheme` maps a
   * cast-theme.json `motion` block onto it.
   */
  motion?: MotionOverrides;
  /**
   * Font-family overrides. `sans` reskins body and label text, `display` the
   * headings, `mono` code, `serif` any serif. Omit `display` and it follows
   * `sans`. The families must be loaded by the app; an unloaded one falls back
   * to the platform default (dev warning on web). Usually filled by
   * `applyCastTheme` from a cast-theme.json `fonts` block.
   */
  fonts?: Partial<FontFamilyTokens>;
  children: React.ReactNode;
};

export function ThemeProvider({
  density = 'default',
  colorMode = 'light',
  brand,
  colors,
  scheme: schemeOverride,
  motion: motionOverrides,
  fonts: fontsOverride,
  children,
}: ThemeProviderProps) {
  const theme = useMemo<Theme>(() => {
    const baseScheme = colorSchemes[colorMode];
    // A `brand` seed becomes a full ramp for THIS colour mode, so dark mode
    // gets light-on-dark subtle colours instead of the light-mode dark seed.
    const brandColors = brand ? makeBrandColors(brand, colorMode).brand : undefined;
    const hasColorInput = Boolean(brandColors || colors);
    const resolvedIntents = hasColorInput
      ? deepMerge(
          brandColors
            ? deepMerge(baseScheme.intents, { brand: brandColors } as Record<string, unknown>)
            : baseScheme.intents,
          (colors ?? {}) as Record<string, unknown>,
        )
      : baseScheme.intents;
    // Recompute brand-tinted surfaces (selection highlights, checked controls,
    // focus ring) from the resolved brand intent so a rebrand cascades. This
    // reproduces the default values when brand is unchanged.
    let scheme: ColorScheme = deriveBrandDependents(
      hasColorInput || schemeOverride
        ? { ...baseScheme, intents: resolvedIntents }
        : baseScheme,
    );
    if (schemeOverride) {
      scheme = deepMerge(
        scheme as unknown as Record<string, unknown>,
        schemeOverride as Record<string, unknown>,
      ) as unknown as ColorScheme;
    }

    const fonts: FontFamilyTokens = fontsOverride
      ? {
          sans: fontsOverride.sans ?? defaultFonts.sans,
          mono: fontsOverride.mono ?? defaultFonts.mono,
          serif: fontsOverride.serif ?? defaultFonts.serif,
          display: fontsOverride.display ?? fontsOverride.sans ?? defaultFonts.display,
        }
      : defaultFonts;

    return {
      density,
      components: themes[density],
      spacing: spacingScales[density],
      colorMode,
      scheme,
      colors: scheme.intents as IntentColorMap,
      disabledColors: scheme.disabled,
      fonts,
      motion: resolveMotion(motionOverrides),
    };
  }, [density, colorMode, brand, colors, schemeOverride, motionOverrides, fontsOverride]);

  // Dev-only, web-only: warn once if a themed font family is not actually
  // loaded, so a typo or missing <link> is visible instead of silently falling
  // back to the system font.
  useEffect(() => {
    const globals = globalThis as unknown as { process?: { env?: Record<string, string | undefined> } };
    if (globals.process?.env?.NODE_ENV === 'production') return;
    if (typeof document === 'undefined') return;
    const fontSet = (document as unknown as { fonts?: { ready: Promise<unknown>; check: (f: string) => boolean } }).fonts;
    if (!fontSet || typeof fontSet.check !== 'function') return;
    const generic = new Set([
      'system-ui', 'sans-serif', 'serif', 'monospace', 'ui-sans-serif',
      'ui-monospace', 'ui-serif', '-apple-system', 'inherit', 'cursive',
    ]);
    fontSet.ready
      .then(() => {
        const families = [theme.fonts.sans, theme.fonts.display, theme.fonts.serif, theme.fonts.mono];
        for (const stack of new Set(families)) {
          const first = String(stack).split(',')[0].trim().replace(/^["']|["']$/g, '');
          if (!first || generic.has(first.toLowerCase()) || warnedFonts.has(first)) continue;
          let ok = true;
          try { ok = fontSet.check(`16px "${first}"`); } catch { ok = true; }
          if (!ok) {
            warnedFonts.add(first);
            console.warn(
              `[cast-ui] Font "${first}" is not loaded, so text using it falls back to the platform default. Load it in your app. See the Fonts docs.`,
            );
          }
        }
      })
      .catch(() => {});
  }, [theme.fonts]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Access the current theme — density tokens, intent colours, and component tokens.
 * Must be called within a ThemeProvider; falls back to the "default" density if not.
 */
export function useTheme(): Theme {
  return useContext(ThemeContext);
}
