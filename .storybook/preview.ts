import React from 'react';
import type { Preview } from '@storybook/react-webpack5';
import { CastThemeProvider, createTheme } from '../src/theme';
import { defaultTheme } from '../src/tokens/generated';
import type { CastTheme } from '../src/theme';

import consumerOverrides from './themes/consumer.json';
import corporateOverrides from './themes/corporate.json';
import luxuryOverrides from './themes/luxury.json';

// ---------------------------------------------------------------------------
// Example themes — NOT official themes. These demonstrate what's possible
// with createTheme() and partial JSON overrides. They are not part of the
// published package and exist only to showcase Cast UI's customisation
// capabilities during development and Chromatic visual testing.
// ---------------------------------------------------------------------------

const consumerTheme = createTheme(consumerOverrides);
const corporateTheme = createTheme(corporateOverrides);
const luxuryTheme = createTheme(luxuryOverrides);

const THEMES: Record<string, CastTheme> = {
  default: defaultTheme,
  consumer: consumerTheme,
  corporate: corporateTheme,
  luxury: luxuryTheme,
};

// ---------------------------------------------------------------------------
// Preview configuration with theme switcher
// ---------------------------------------------------------------------------

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Switch theme — examples show customisation possibilities',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Default (Base Theme)' },
          { value: 'consumer', title: 'Consumer (Example)' },
          { value: 'corporate', title: 'Corporate (Example)' },
          { value: 'luxury', title: 'Luxury (Example)' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    theme: 'default',
  },

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const themeName = context.globals.theme || 'default';
      const theme = THEMES[themeName] || defaultTheme;

      const surfaceStyle = {
        backgroundColor: theme.semantic.color.surface,
        padding: 24,
        minHeight: '100%',
      };

      const storyContent = React.createElement(
        'div',
        { style: surfaceStyle },
        React.createElement(Story)
      );

      return React.createElement(
        CastThemeProvider,
        { theme, children: storyContent }
      );
    },
  ],
};

export default preview;
