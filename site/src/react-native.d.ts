// On the web, `react-native` is aliased to `react-native-web` at bundle time
// (see vite.config.ts). We don't install @types/react-native, so declare the
// module as permissive here — enough to import View / StyleSheet / AppRegistry
// without type errors. The build (vite/esbuild) is transpile-only, so this has
// no effect on output; it only keeps the editor and `tsc --noEmit` quiet.
declare module 'react-native';
