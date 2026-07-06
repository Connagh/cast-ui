/**
 * The theme gallery: a curated set of themes shown on the Themes page.
 *
 * Each theme is a whole product personality expressed as ONE object: a brand
 * colour ramp, a font pairing, a spacing rhythm (density), and a surface + text
 * palette that sets the temperature (warm paper, cool slate, near-black
 * terminal, tinted). Every theme is built into a real cast-theme.json, so the
 * live preview and the download are the same object, applied the same way with
 * applyCastTheme(file, mode).
 *
 * This is the point of the page: swap one file and the product looks like a
 * different company. Colour, type AND spacing all travel in the file. None of
 * it is a separate global setting.
 *
 * Fonts are CSS family stacks (this is a web build); they must be loaded in
 * index.html. makeBrandColors(seed, mode) builds a full, mode-correct brand
 * ramp, so every theme reads well in light and dark with no per-mode tuning.
 */

import {
  makeBrandColors,
  motionTokens,
  easingBezier,
  type BrandSeed,
  type CastThemeFile,
  type DensityTheme,
} from '@castui/cast-ui';

/** Surface + text palette for one colour mode. Maps onto the theme file's
 * `surface`, `text` and `focusRing` sections, which applyCastTheme feeds into
 * ThemeProvider's `scheme`. Omit a mode to fall back to the library default. */
export type ModeScheme = {
  /** Page background — scheme.surface.base. */
  base: string;
  /** Section/card wash — scheme.surface.subtle. */
  subtle: string;
  /** Raised surfaces (cards, sidebar, dialogs) — scheme.surface.overlay.bg. */
  overlayBg: string;
  /** Hairline on raised surfaces — scheme.surface.overlay.border. */
  overlayBorder: string;
  /** Primary text — scheme.text.primary. */
  primary: string;
  /** Secondary text — scheme.text.description. */
  description: string;
  /** Placeholder text — scheme.text.placeholder. */
  placeholder: string;
  /** Focus ring — scheme.focusRing.color. */
  focusRing: string;
};

export type GalleryTheme = {
  id: string;
  /** Display name, rendered in the theme's own display font on the card. */
  name: string;
  /** One-line personality. */
  tagline: string;
  /** The kind of product it suits, for the card. */
  suits: string;
  /** Short personality tags (font style, spacing, temperature). */
  tags: string[];
  /** Brand seed — base/hover/active (+ optional onBrand for light brand hues). */
  seed: BrandSeed;
  /** Base brand colour, for swatches. */
  swatch: string;
  /** CSS font stacks fed to the theme file's `fonts` block. */
  fonts: { display: string; sans: string; mono?: string };
  /** Human-readable font names, for the card. */
  fontLabel: { display: string; body: string };
  /** Spacing rhythm carried IN the theme file (not a global setting). */
  density: DensityTheme;
  /** Suggested preview mode. */
  mode: 'light' | 'dark';
  /** Per-mode surface + text palette. Omitted modes use the library default. */
  light?: ModeScheme;
  dark?: ModeScheme;
};

// A neutral cool default, shown when a theme leaves a mode untuned (Cast).
const FONT = {
  inter: 'Inter, system-ui, sans-serif',
  manrope: '"Manrope", Inter, sans-serif',
  playfair: '"Playfair Display", Georgia, serif',
  fraunces: '"Fraunces", Georgia, serif',
  space: '"Space Grotesk", Inter, sans-serif',
  sora: '"Sora", Inter, sans-serif',
  jetbrains: '"JetBrains Mono", ui-monospace, monospace',
  bricolage: '"Bricolage Grotesque", Inter, sans-serif',
};

export const galleryThemes: GalleryTheme[] = [
  {
    id: 'cast',
    name: 'Cast',
    tagline: 'The signature. Neutral, calm, product-ready.',
    suits: 'General product UI',
    tags: ['Grotesque', 'Balanced', 'Cool'],
    seed: { base: '#2563EB', hover: '#1D4ED8', active: '#1E40AF' },
    swatch: '#2563EB',
    fonts: { display: FONT.inter, sans: FONT.inter },
    fontLabel: { display: 'Inter', body: 'Inter' },
    density: 'default',
    mode: 'light',
    // No surface/text overrides — this is the library's own cool-neutral scheme.
  },
  {
    id: 'monolith',
    name: 'Monolith',
    tagline: 'Terminal-grade. Monospace everywhere, acid-lime accent.',
    suits: 'Developer tools',
    tags: ['Monospace', 'Compact', 'Terminal'],
    seed: { base: '#84CC16', hover: '#65A30D', active: '#4D7C0F', onBrand: '#0A0A0A' },
    swatch: '#84CC16',
    fonts: { display: FONT.jetbrains, sans: FONT.jetbrains, mono: FONT.jetbrains },
    fontLabel: { display: 'JetBrains Mono', body: 'JetBrains Mono' },
    density: 'compact',
    mode: 'dark',
    light: {
      base: '#FAFAF9', subtle: '#EFEFEC', overlayBg: '#FFFFFF', overlayBorder: '#E1E1DC',
      primary: '#18181B', description: '#52525B', placeholder: '#8A8A93', focusRing: '#65A30D',
    },
    dark: {
      base: '#0A0A0A', subtle: '#161616', overlayBg: '#121212', overlayBorder: '#292929',
      primary: '#EDEDED', description: '#A1A1AA', placeholder: '#6B6B72', focusRing: '#A3E635',
    },
  },
  {
    id: 'atelier',
    name: 'Atelier',
    tagline: 'Editorial luxury. High-contrast serif on warm paper.',
    suits: 'Fashion & publishing',
    tags: ['Serif', 'Comfortable', 'Warm'],
    seed: { base: '#A21B3D', hover: '#86142F', active: '#6B0F26' },
    swatch: '#A21B3D',
    fonts: { display: FONT.playfair, sans: FONT.inter },
    fontLabel: { display: 'Playfair Display', body: 'Inter' },
    density: 'comfortable',
    mode: 'light',
    light: {
      base: '#FBF6EF', subtle: '#F2E8DB', overlayBg: '#FFFDF9', overlayBorder: '#E7DAC8',
      primary: '#2E2622', description: '#6F5F53', placeholder: '#A9968A', focusRing: '#A21B3D',
    },
    dark: {
      base: '#1A1512', subtle: '#241C17', overlayBg: '#201812', overlayBorder: '#3A2E24',
      primary: '#F3EAE0', description: '#C3B2A3', placeholder: '#8A7A6C', focusRing: '#E8879E',
    },
  },
  {
    id: 'grove',
    name: 'Grove',
    tagline: 'Organic and calm. Soft serif on a green-tinted paper.',
    suits: 'Health & wellness',
    tags: ['Serif', 'Comfortable', 'Organic'],
    seed: { base: '#059669', hover: '#047857', active: '#065F46' },
    swatch: '#059669',
    fonts: { display: FONT.fraunces, sans: FONT.inter },
    fontLabel: { display: 'Fraunces', body: 'Inter' },
    density: 'comfortable',
    mode: 'light',
    light: {
      base: '#F5F8F3', subtle: '#E6F0E3', overlayBg: '#FFFFFF', overlayBorder: '#D7E4D2',
      primary: '#1F2E26', description: '#566B5F', placeholder: '#8AA096', focusRing: '#059669',
    },
    dark: {
      base: '#0C1512', subtle: '#14201B', overlayBg: '#101C17', overlayBorder: '#24352C',
      primary: '#E7F1EA', description: '#A8C1B2', placeholder: '#7A9384', focusRing: '#34D399',
    },
  },
  {
    id: 'synth',
    name: 'Synth',
    tagline: 'Late-night neon. Geometric type on saturated dark.',
    suits: 'AI & crypto',
    tags: ['Geometric', 'Compact', 'Neon'],
    seed: { base: '#A855F7', hover: '#9333EA', active: '#7E22CE' },
    swatch: '#A855F7',
    fonts: { display: FONT.space, sans: FONT.inter },
    fontLabel: { display: 'Space Grotesk', body: 'Inter' },
    density: 'compact',
    mode: 'dark',
    light: {
      base: '#FAF7FF', subtle: '#F1E9FE', overlayBg: '#FFFFFF', overlayBorder: '#E4D8F8',
      primary: '#241A38', description: '#6B5B8A', placeholder: '#9C8CC0', focusRing: '#A855F7',
    },
    dark: {
      base: '#0A0713', subtle: '#150E24', overlayBg: '#120C20', overlayBorder: '#2A1E45',
      primary: '#EDE9FE', description: '#B7A7E8', placeholder: '#7C6DA8', focusRing: '#C084FC',
    },
  },
  {
    id: 'ember',
    name: 'Ember',
    tagline: 'Warm and friendly. Rounded type, sunset orange.',
    suits: 'Consumer startups',
    tags: ['Rounded', 'Balanced', 'Warm'],
    seed: { base: '#EA580C', hover: '#C2410C', active: '#9A3412' },
    swatch: '#EA580C',
    fonts: { display: FONT.sora, sans: FONT.inter },
    fontLabel: { display: 'Sora', body: 'Inter' },
    density: 'default',
    mode: 'light',
    light: {
      base: '#FFF8F3', subtle: '#FDEBDF', overlayBg: '#FFFFFF', overlayBorder: '#F6DAC7',
      primary: '#3A281E', description: '#7C6152', placeholder: '#B29684', focusRing: '#EA580C',
    },
    dark: {
      base: '#17110D', subtle: '#221812', overlayBg: '#1D140E', overlayBorder: '#3A2A1E',
      primary: '#F7ECE4', description: '#CDB4A2', placeholder: '#977E6D', focusRing: '#FB923C',
    },
  },
  {
    id: 'frost',
    name: 'Frost',
    tagline: 'Nordic minimal. Clean humanist sans, cool light.',
    suits: 'Enterprise SaaS',
    tags: ['Clean sans', 'Comfortable', 'Cool'],
    seed: { base: '#0284C7', hover: '#0369A1', active: '#075985' },
    swatch: '#0284C7',
    fonts: { display: FONT.manrope, sans: FONT.manrope },
    fontLabel: { display: 'Manrope', body: 'Manrope' },
    density: 'comfortable',
    mode: 'light',
    light: {
      base: '#F4F8FC', subtle: '#E6EEF6', overlayBg: '#FFFFFF', overlayBorder: '#D5E2EE',
      primary: '#1B2A38', description: '#566676', placeholder: '#90A0B0', focusRing: '#0284C7',
    },
    dark: {
      base: '#0B1220', subtle: '#14202F', overlayBg: '#101B29', overlayBorder: '#23364A',
      primary: '#E7EFF7', description: '#A6BACA', placeholder: '#74889C', focusRing: '#38BDF8',
    },
  },
  {
    id: 'bloom',
    name: 'Bloom',
    tagline: 'Playful and bold. Editorial grotesque, bubblegum pink.',
    suits: 'Social & lifestyle',
    tags: ['Editorial', 'Comfortable', 'Playful'],
    seed: { base: '#EC4899', hover: '#DB2777', active: '#BE185D' },
    swatch: '#EC4899',
    fonts: { display: FONT.bricolage, sans: FONT.inter },
    fontLabel: { display: 'Bricolage Grotesque', body: 'Inter' },
    density: 'comfortable',
    mode: 'light',
    light: {
      base: '#FEF4F8', subtle: '#FCE2ED', overlayBg: '#FFFFFF', overlayBorder: '#F6CFE0',
      primary: '#3A2130', description: '#7C5568', placeholder: '#B98CA4', focusRing: '#EC4899',
    },
    dark: {
      base: '#171014', subtle: '#221720', overlayBg: '#1D131A', overlayBorder: '#3B2632',
      primary: '#FBEAF2', description: '#D6ACC1', placeholder: '#9E7286', focusRing: '#F472B6',
    },
  },
];

function schemeSections(
  file: CastThemeFile,
  mode: 'light' | 'dark',
  s: ModeScheme | undefined,
): void {
  if (!s) return;
  (file.surface as Record<string, unknown>)[mode] = {
    base: s.base,
    subtle: s.subtle,
    overlay: { bg: s.overlayBg, border: s.overlayBorder },
  };
  (file.text as Record<string, unknown>)[mode] = {
    primary: s.primary,
    description: s.description,
    placeholder: s.placeholder,
  };
  (file.focusRing as Record<string, unknown>)[mode] = { color: s.focusRing };
}

/**
 * Build a cast-theme.json for a gallery theme. Same shape a cast-sync export
 * has, version 6: intent colours by mode, surface + text + focusRing by mode,
 * a fonts block, the spacing density, and motion tokens. Applied with
 * applyCastTheme(file, mode) in any app — colour, type and spacing in one file.
 */
export function buildThemeFile(theme: GalleryTheme): CastThemeFile {
  const fonts: Record<string, string> = {
    display: theme.fonts.display,
    sans: theme.fonts.sans,
  };
  if (theme.fonts.mono) fonts.mono = theme.fonts.mono;

  const file: CastThemeFile = {
    name: `Cast UI · ${theme.name}`,
    description: `${theme.tagline} Exported from the Cast UI theme gallery, shaped like a cast-sync export.`,
    generatedAt: new Date().toISOString(),
    version: 6,
    colors: {
      light: makeBrandColors(theme.seed, 'light'),
      dark: makeBrandColors(theme.seed, 'dark'),
    },
    surface: {},
    text: {},
    focusRing: {},
    fonts,
    density: theme.density,
    motion: {
      duration: motionTokens.duration,
      cycle: motionTokens.cycle,
      easing: easingBezier,
      spring: motionTokens.spring,
    },
  };

  schemeSections(file, 'light', theme.light);
  schemeSections(file, 'dark', theme.dark);
  return file;
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
