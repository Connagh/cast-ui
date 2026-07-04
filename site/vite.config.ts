import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

/**
 * Cast UI is a React Native library. On the web we render it through
 * react-native-web by aliasing every `react-native` import to it — the same
 * approach the library's own Storybook uses.
 *
 * `@castui/cast-ui` is aliased to the library SOURCE in ../src. The site is
 * the living documentation of this repo, so it always renders the code on
 * the current branch — no waiting for an npm publish, no version skew. The
 * install instructions shown to visitors still use the npm package.
 *
 * `base` is the GitHub Pages project path. The site is served from
 * https://<user>.github.io/cast-ui/, so every built asset URL must be
 * prefixed with /cast-ui/. Change this if you move to a custom domain.
 */
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  return {
    base: '/cast-ui/',
    plugins: [react()],
    define: {
      global: 'window',
      __DEV__: JSON.stringify(!isProd),
      'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
    },
    resolve: {
      alias: {
        'react-native': 'react-native-web',
        '@castui/cast-ui': path.resolve(__dirname, '../src/index.ts'),
      },
      extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
      dedupe: ['react', 'react-dom', 'react-native-web'],
    },
    server: {
      fs: { allow: ['..'] },
    },
    optimizeDeps: {
      include: ['react-native-web'],
      esbuildOptions: {
        resolveExtensions: ['.web.js', '.js', '.ts', '.jsx', '.tsx'],
        loader: { '.js': 'jsx' },
      },
    },
  };
});
