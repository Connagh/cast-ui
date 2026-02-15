import React from 'react';
import type { Preview } from '@storybook/react-webpack5';
import { CastThemeProvider } from '../src/theme';
import {
  whiteLabel,
  consumer,
  corporate,
  luxury,
} from '../src/tokens/generated';
import type { CastTheme } from '../src/theme/types';

// ---------------------------------------------------------------------------
// Theme map
// ---------------------------------------------------------------------------

const THEMES: Record<string, CastTheme> = {
  'white-label': whiteLabel,
  consumer,
  corporate,
  luxury,
};

// ---------------------------------------------------------------------------
// Global types (toolbar controls)
// ---------------------------------------------------------------------------

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Switch design system theme',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'white-label', title: 'White Label (Default)' },
          { value: 'consumer', title: 'Consumer' },
          { value: 'corporate', title: 'Corporate' },
          { value: 'luxury', title: 'Luxury' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    theme: 'white-label',
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
      const themeName = context.globals.theme || 'white-label';
      const theme = THEMES[themeName] || whiteLabel;

      // Apply surface background to the story container on web
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
