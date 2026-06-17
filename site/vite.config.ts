import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Cast UI is a React Native library. On the web we render it through
 * react-native-web by aliasing every `react-native` import to it — the same
 * approach the library's own Storybook uses.
 *
 * `base` is the GitHub Pages project path. The site is served from
 * https://<user>.github.io/cast-ui/, so every built asset URL must be prefixed
 * with /cast-ui/. Change this if you move to a user/org page or a custom domain.
 */
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  return {
    base: '/cast-ui/',
    plugins: [react()],
    define: {
      // react-native-web references these globals at module scope.
      global: 'window',
      __DEV__: JSON.stringify(!isProd),
      'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
    },
    resolve: {
      alias: {
        'react-native': 'react-native-web',
      },
      // Prefer .web.* implementations, mirroring the Metro/Storybook resolver.
      extensions: [
        '.web.tsx',
        '.web.ts',
        '.web.jsx',
        '.web.js',
        '.tsx',
        '.ts',
        '.jsx',
        '.js',
      ],
      // Guarantee a single copy of React even though @castui/cast-ui declares
      // react / react-native as peers.
      dedupe: ['react', 'react-dom', 'react-native-web'],
    },
    optimizeDeps: {
      include: ['react-native-web', '@castui/cast-ui'],
      esbuildOptions: {
        resolveExtensions: ['.web.js', '.js', '.ts', '.jsx', '.tsx'],
        // Some React Native packages ship JSX inside .js files.
        loader: { '.js': 'jsx' },
      },
    },
  };
});
