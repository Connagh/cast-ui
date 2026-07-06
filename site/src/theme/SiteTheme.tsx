/**
 * Site-wide theme state. One provider drives every Cast UI component on the
 * page, including the site chrome itself: the docs site is rendered with the
 * library it documents.
 *
 * Three axes, matching ThemeProvider's controls:
 *   colorMode  light | dark
 *   density    compact | default | comfortable
 *   brand      a preset brand seed, fed to ThemeProvider's `brand` prop
 *
 * The brand presets carry a *seed* (base/hover/active), not a precomputed
 * colour ramp. ThemeProvider's `brand` prop builds the correct ramp for the
 * active colour mode, so a preset reads well in light AND dark. This is what
 * keeps the violet/emerald/amber/rose presets legible in dark mode: their
 * selected list items and subtle text get light-on-dark colours, not the
 * light-mode dark seed that used to fail contrast.
 */

import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider, type BrandSeed } from '@castui/cast-ui';

type ColorMode = 'light' | 'dark';
type Density = 'compact' | 'default' | 'comfortable';

export type BrandPreset = {
  id: string;
  label: string;
  /** Swatch colour shown in the picker. */
  swatch: string;
  /** Brand seed for ThemeProvider's `brand` prop, or undefined for built-in blue. */
  seed?: BrandSeed;
};

export const brandPresets: BrandPreset[] = [
  { id: 'cast', label: 'Cast blue', swatch: '#2563EB' },
  { id: 'violet', label: 'Violet', swatch: '#7C3AED', seed: { base: '#7C3AED', hover: '#6D28D9', active: '#5B21B6' } },
  { id: 'emerald', label: 'Emerald', swatch: '#059669', seed: { base: '#059669', hover: '#047857', active: '#065F46' } },
  { id: 'amber', label: 'Amber', swatch: '#D97706', seed: { base: '#D97706', hover: '#B45309', active: '#92400E' } },
  { id: 'rose', label: 'Rose', swatch: '#E11D48', seed: { base: '#E11D48', hover: '#BE123C', active: '#9F1239' } },
];

type SiteThemeState = {
  colorMode: ColorMode;
  density: Density;
  brandId: string;
  setColorMode: (mode: ColorMode) => void;
  setDensity: (density: Density) => void;
  setBrandId: (id: string) => void;
};

const SiteThemeContext = createContext<SiteThemeState | null>(null);

export function useSiteTheme(): SiteThemeState {
  const ctx = useContext(SiteThemeContext);
  if (!ctx) throw new Error('useSiteTheme must be used inside <SiteThemeRoot>');
  return ctx;
}

export function SiteThemeRoot({ children }: { children: React.ReactNode }) {
  const [colorMode, setColorMode] = useState<ColorMode>('light');
  const [density, setDensity] = useState<Density>('default');
  const [brandId, setBrandId] = useState('cast');

  const state = useMemo(
    () => ({ colorMode, density, brandId, setColorMode, setDensity, setBrandId }),
    [colorMode, density, brandId],
  );
  const brand = brandPresets.find((p) => p.id === brandId) ?? brandPresets[0];

  return (
    <SiteThemeContext.Provider value={state}>
      <ThemeProvider colorMode={colorMode} density={density} brand={brand.seed}>
        {children}
      </ThemeProvider>
    </SiteThemeContext.Provider>
  );
}
