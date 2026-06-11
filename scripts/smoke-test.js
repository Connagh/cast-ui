#!/usr/bin/env node
/**
 * Smoke test for the built package.
 *
 * Guards against the failure mode where dist/ is emitted as ESM while
 * package.json declares CommonJS (which makes the package unloadable in
 * Node, Jest, and SSR). Loads dist/index.js with require() and checks
 * that the public API surface is present.
 *
 * react-native ships untranspiled Flow source that plain Node cannot
 * parse, so it is stubbed; everything else loads for real.
 */

const Module = require('module');
const path = require('path');
const assert = require('assert');

const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === 'react-native') {
    return new Proxy(
      {},
      {
        get: (target, prop) => {
          if (prop === 'StyleSheet') {
            return { create: (styles) => styles, hairlineWidth: 1, flatten: (s) => s };
          }
          if (prop === 'Platform') {
            return { OS: 'web', select: (spec) => spec.web ?? spec.default };
          }
          // Components (Pressable, View, Text, …) just need to be defined.
          return () => null;
        },
      },
    );
  }
  return originalLoad.call(this, request, parent, isMain);
};

const distPath = path.resolve(__dirname, '..', 'dist', 'index.js');
const lib = require(distPath);

const expectedExports = [
  // Components
  'Alert',
  'Avatar',
  'Badge',
  'Button',
  'Card',
  'Checkbox',
  'Chip',
  'Dialog',
  'Divider',
  'Icon',
  'Input',
  'List',
  'ListItem',
  'Popover',
  'Radio',
  'RadioGroup',
  'Select',
  'Skeleton',
  'Text',
  'Toast',
  'Toggle',
  'Tooltip',
  // Theme
  'ThemeProvider',
  'useTheme',
  'themes',
  // Tokens
  'intentColors',
  'lightColors',
  'darkColors',
  'fontFamily',
  'label',
  'heading',
  'display',
];

const missing = expectedExports.filter((name) => lib[name] === undefined);
assert.deepStrictEqual(
  missing,
  [],
  `dist/index.js is missing expected exports: ${missing.join(', ')}`,
);

assert.strictEqual(typeof lib.ThemeProvider, 'function', 'ThemeProvider should be a function');
assert.strictEqual(typeof lib.Button, 'function', 'Button should be a function');
assert.strictEqual(typeof lib.themes, 'object', 'themes should be an object');
assert.ok(lib.themes.compact && lib.themes.default && lib.themes.comfortable, 'themes should contain all 3 densities');

console.log(`smoke-test: OK — dist/index.js loads via require() and exports ${expectedExports.length} checked symbols`);
