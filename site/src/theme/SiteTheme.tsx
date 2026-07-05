/**
 * Site-wide theme state. One provider drives every Cast UI component on the
 * page, including the site chrome itself: the docs site is rendered with the
 * library it documents.
 *
 * Three axes, matching ThemeProvider's controls:
 *   colorMode  light | dark
 *   density    compact | default | comfortable
 *   brand      a preset colour override (the same shape cast-theme.json uses)
 */

import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider, withAlpha, type ThemeProviderProps } from '@castui/cast-ui';

type ColorMode = 'light' | 'dark';
type Density = 'compact' | 'default' | 'comfortable';

export type BrandPreset = {
  id: string;
  label: string;
  /** Swatch colour shown in the picker. */
  swatch: string;
  /** ThemeProvider `colors` override, or undefined for the built-in blue. */
  colors?: ThemeProviderProps['colors'];
};

function makeBrand(base: string, hover: string, active: string): ThemeProviderProps['colors'] {
  return {
    brand: {
      bold: {
        default: { bg: base, fg: '#FFFFFF', border: base },
        hover: { bg: hover, fg: '#FFFFFF', border: hover },
        active: { bg: active, fg: '#FFFFFF', border: active },
      },
      default: {
        default: { fg: base, border: base },
        hover: { fg: hover, border: hover },
        active: { fg: active, border: active },
      },
      subtle: {
        default: { bg: 'transparent', fg: base },
        hover: { bg: withAlpha(base, '14'), fg: hover },
        active: { bg: withAlpha(base, '29'), fg: active },
      },
    },
  };
}

export const brandPresets: BrandPreset[] = [
  { id: 'cast', label: 'Cast blue', swatch: '#2563EB' },
  { id: 'violet', label: 'Violet', swatch: '#7C3AED', colors: makeBrand('#7C3AED', '#6D28D9', '#5B21B6') },
  { id: 'emerald', label: 'Emerald', swatch: '#059669', colors: makeBrand('#059669', '#047857', '#065F46') },
  { id: 'amber', label: 'Amber', swatch: '#D97706', colors: makeBrand('#D97706', '#B45309', '#92400E') },
  { id: 'rose', label: 'Rose', swatch: '#E11D48', colors: makeBrand('#E11D48', '#BE123C', '#9F1239') },
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
      <ThemeProvider colorMode={colorMode} density={density} colors={brand.colors}>
        {children}
      </ThemeProvider>
    </SiteThemeContext.Provider>
  );
}
