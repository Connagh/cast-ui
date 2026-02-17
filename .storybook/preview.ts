import React from 'react';
import type { Preview } from '@storybook/react-webpack5';
import { CastThemeProvider } from '../src/theme';
import { defaultTheme } from '../src/tokens/generated';

// ---------------------------------------------------------------------------
// Preview configuration
// ---------------------------------------------------------------------------

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  decorators: [
    (Story) => {
      const surfaceStyle = {
        backgroundColor: defaultTheme.semantic.color.surface,
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
        { theme: defaultTheme, children: storyContent }
      );
    },
  ],
};

export default preview;
