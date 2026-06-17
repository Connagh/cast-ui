import { AppRegistry } from 'react-native';
import { App } from './App';

// react-native-web's canonical web entry point. AppRegistry.runApplication
// mounts the app and applies the full-window flexbox reset the components
// expect, so layout behaves the same as it does on native.
AppRegistry.registerComponent('CastUISite', () => App);
AppRegistry.runApplication('CastUISite', {
  rootTag: document.getElementById('root'),
});
