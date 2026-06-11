import React from 'react';
import type { Preview } from '@storybook/react-webpack5';
import type { Decorator } from '@storybook/react';
import { ThemeProvider, type DensityTheme } from '../src/theme';
import { colorSchemes, type ColorMode } from '../src/tokens';
import { castTheme } from './theme';

/**
 * Wraps every story in a ThemeProvider driven by the toolbar globals, on a
 * surface.base background so dark mode is legible. Stories that pin their
 * own ThemeProvider (density/colour-mode comparison panels) nest inside and
 * override it, as designed.
 */
const withCastTheme: Decorator = (Story, context) => {
  const colorMode = context.globals.colorMode as ColorMode;
  const density = context.globals.density as DensityTheme;
  const scheme = colorSchemes[colorMode];
  // In the canvas, bleed over Storybook's 1rem padding so the surface fills
  // the viewport; in docs, stay inside the story block's frame.
  const fill: React.CSSProperties =
    context.viewMode === 'docs'
      ? { padding: '1rem', borderRadius: 4 }
      : { margin: '-1rem', padding: '1rem', minHeight: 'calc(100vh - 2rem)' };

  return (
    <ThemeProvider colorMode={colorMode} density={density}>
      <div style={{ background: scheme.surface.base, ...fill }}>
        <Story />
      </div>
    </ThemeProvider>
  );
};

const preview: Preview = {
  globalTypes: {
    colorMode: {
      description: 'Cast UI colour mode',
      toolbar: {
        title: 'Mode',
        icon: 'contrast',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    density: {
      description: 'Cast UI spacing density',
      toolbar: {
        title: 'Density',
        icon: 'grow',
        items: [
          { value: 'compact', title: 'Compact' },
          { value: 'default', title: 'Default' },
          { value: 'comfortable', title: 'Comfortable' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    colorMode: 'light',
    density: 'default',
  },
  decorators: [withCastTheme],
  parameters: {
    docs: {
      theme: castTheme,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
