import type { StorybookConfig } from '@storybook/react-webpack5';
import type { Configuration } from 'webpack';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    '@storybook/addon-onboarding',
  ],
  framework: '@storybook/react-webpack5',
  staticDirs: ['./public'],
  core: {
    disableTelemetry: true,
  },
  webpackFinal: async (config: Configuration) => {
    if (config.resolve) {
      // Alias react-native to react-native-web for browser rendering
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        'react-native$': 'react-native-web',
      };

      // Add web-specific extensions for platform resolution
      config.resolve.extensions = [
        '.web.tsx',
        '.web.ts',
        '.web.js',
        '.tsx',
        '.ts',
        '.js',
        ...(config.resolve.extensions || []),
      ];
    }
    return config;
  },
};

export default config;
