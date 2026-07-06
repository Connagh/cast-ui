/**
 * The theme gallery: a curated set of themes shown on the Themes page. Each one
 * is a brand seed plus a font pairing, applied live to the preview template
 * through ThemeProvider's `brand` and `fonts` props, and downloadable as a
 * cast-theme.json shaped exactly like a cast-sync export.
 *
 * Fonts are CSS family stacks (this is a web build). They must be loaded in
 * index.html. `makeBrandColors(seed, mode)` builds a full, mode-correct ramp,
 * so every theme reads well in light and dark with no per-mode tuning.
 */

import {
  makeBrandColors,
  motionTokens,
  easingBezier,
  type BrandSeed,
  type CastThemeFile,
} from '@castui/cast-ui';

export type GalleryTheme = {
  id: string;
  /** Display name, rendered in the theme's own display font on the card. */
  name: string;
  /** One-line personality. */
  tagline: string;
  /** Brand seed — base/hover/active. */
  seed: BrandSeed;
  /** Base brand colour, for swatches. */
  swatch: string;
  /** CSS font stacks fed to the ThemeProvider `fonts` prop. */
  fonts: { display: string; sans: string; mono?: string };
  /** Human-readable font names, for the card. */
  fontLabel: { display: string; body: string };
  /** Suggested preview mode. */
  mode: 'light' | 'dark';
};

export const galleryThemes: GalleryTheme[] = [
  {
    id: 'cast',
    name: 'Cast',
    tagline: 'The signature. Neutral, calm, product-ready.',
    seed: { base: '#2563EB', hover: '#1D4ED8', active: '#1E40AF' },
    swatch: '#2563EB',
    fonts: { display: 'Inter, system-ui, sans-serif', sans: 'Inter, system-ui, sans-serif' },
    fontLabel: { display: 'Inter', body: 'Inter' },
    mode: 'light',
  },
  {
    id: 'nebula',
    name: 'Nebula',
    tagline: 'Deep violet with a geometric display face.',
    seed: { base: '#7C3AED', hover: '#6D28D9', active: '#5B21B6' },
    swatch: '#7C3AED',
    fonts: { display: '"Space Grotesk", Inter, sans-serif', sans: 'Inter, system-ui, sans-serif' },
    fontLabel: { display: 'Space Grotesk', body: 'Inter' },
    mode: 'dark',
  },
  {
    id: 'ember',
    name: 'Ember',
    tagline: 'Warm amber, friendly and open.',
    seed: { base: '#D97706', hover: '#B45309', active: '#92400E' },
    swatch: '#D97706',
    fonts: { display: 'Sora, Inter, sans-serif', sans: 'Inter, system-ui, sans-serif' },
    fontLabel: { display: 'Sora', body: 'Inter' },
    mode: 'light',
  },
  {
    id: 'bloom',
    name: 'Bloom',
    tagline: 'Editorial rose with a serif headline.',
    seed: { base: '#E11D48', hover: '#BE123C', active: '#9F1239' },
    swatch: '#E11D48',
    fonts: { display: '"Playfair Display", Georgia, serif', sans: 'Inter, system-ui, sans-serif' },
    fontLabel: { display: 'Playfair Display', body: 'Inter' },
    mode: 'light',
  },
  {
    id: 'grove',
    name: 'Grove',
    tagline: 'Organic emerald, modern serif display.',
    seed: { base: '#059669', hover: '#047857', active: '#065F46' },
    swatch: '#059669',
    fonts: { display: 'Fraunces, Georgia, serif', sans: 'Inter, system-ui, sans-serif' },
    fontLabel: { display: 'Fraunces', body: 'Inter' },
    mode: 'light',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    tagline: 'Sleek indigo, tuned for the dark.',
    seed: { base: '#6366F1', hover: '#4F46E5', active: '#4338CA' },
    swatch: '#6366F1',
    fonts: { display: 'Manrope, Inter, sans-serif', sans: 'Manrope, Inter, sans-serif' },
    fontLabel: { display: 'Manrope', body: 'Manrope' },
    mode: 'dark',
  },
  {
    id: 'lagoon',
    name: 'Lagoon',
    tagline: 'Calm teal for a modern SaaS.',
    seed: { base: '#0D9488', hover: '#0F766E', active: '#115E59' },
    swatch: '#0D9488',
    fonts: {
      display: '"Plus Jakarta Sans", Inter, sans-serif',
      sans: '"Plus Jakarta Sans", Inter, sans-serif',
    },
    fontLabel: { display: 'Plus Jakarta Sans', body: 'Plus Jakarta Sans' },
    mode: 'light',
  },
  {
    id: 'carbon',
    name: 'Carbon',
    tagline: 'Developer-grade. Mono display, cool sky accent.',
    seed: { base: '#0EA5E9', hover: '#0284C7', active: '#0369A1' },
    swatch: '#0EA5E9',
    fonts: {
      display: '"IBM Plex Mono", "JetBrains Mono", monospace',
      sans: '"IBM Plex Sans", Inter, sans-serif',
      mono: '"IBM Plex Mono", "JetBrains Mono", monospace',
    },
    fontLabel: { display: 'IBM Plex Mono', body: 'IBM Plex Sans' },
    mode: 'dark',
  },
];

/**
 * Build a cast-theme.json for a gallery theme. Same shape a cast-sync export
 * has: intent colours by mode, a fonts block, and the motion tokens. Applied
 * with `applyCastTheme(file, mode)` in any app.
 */
export function buildThemeFile(theme: GalleryTheme): CastThemeFile {
  const fonts: Record<string, string> = {
    display: theme.fonts.display,
    sans: theme.fonts.sans,
  };
  if (theme.fonts.mono) fonts.mono = theme.fonts.mono;

  return {
    name: `Cast UI · ${theme.name}`,
    description: `${theme.tagline} Exported from the Cast UI theme gallery, shaped like a cast-sync export.`,
    generatedAt: new Date().toISOString(),
    version: 5,
    colors: {
      light: makeBrandColors(theme.seed, 'light'),
      dark: makeBrandColors(theme.seed, 'dark'),
    },
    fonts,
    motion: {
      duration: motionTokens.duration,
      cycle: motionTokens.cycle,
      easing: easingBezier,
      spring: motionTokens.spring,
    },
  };
}

/** Trigger a JSON file download in the browser. */
export function downloadThemeFile(theme: GalleryTheme): void {
  const blob = new Blob([JSON.stringify(buildThemeFile(theme), null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cast-theme-${theme.id}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
