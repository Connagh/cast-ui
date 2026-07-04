/**
 * Build an Expo Snack from an example, so any snippet on the site can run
 * on a real iOS or Android device. The Snack wraps the example with
 * ThemeProvider and loads the two fonts the library needs.
 */

import { castExportNames } from './scope';

const CAST_VERSION = '4.10.0';

const INTER_URL = 'https://cdn.jsdelivr.net/gh/rsms/inter@v4.1/docs/font-files/InterVariable.ttf';
const SYMBOLS_URL =
  'https://cdn.jsdelivr.net/gh/google/material-design-icons@master/variablefont/MaterialSymbolsOutlined%5BFILL%2CGRAD%2Copsz%2Cwght%5D.ttf';

/** Names of library exports actually used by a code snippet. */
function usedCastExports(code: string): string[] {
  const used = new Set<string>();
  for (const name of castExportNames) {
    const pattern = new RegExp(`\\b${name}\\b`);
    if (name !== 'ThemeProvider' && pattern.test(code)) used.add(name);
  }
  return ['ThemeProvider', ...Array.from(used).sort()];
}

export function buildSnackCode(example: string): string {
  const definesDemo = /(function|const)\s+Demo\b/.test(example);
  const body = definesDemo
    ? example
    : `function Demo() {\n  return (\n    ${example
        .trim()
        .split('\n')
        .join('\n    ')}\n  );\n}`;

  return `import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { View, ScrollView, Image, Pressable, StyleSheet, Platform, Animated, Easing } from 'react-native';
import { useFonts } from 'expo-font';
import {
  ${usedCastExports(example).join(',\n  ')},
} from '@castui/cast-ui';

${body}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter: '${INTER_URL}',
    MaterialSymbolsOutlined: '${SYMBOLS_URL}',
  });
  if (!fontsLoaded) return null;
  return (
    <ThemeProvider>
      <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F8FA' }}>
        <Demo />
      </View>
    </ThemeProvider>
  );
}
`;
}

export function snackUrl(example: string, name?: string): string {
  const params = new URLSearchParams({
    name: name ? `cast-ui · ${name}` : 'cast-ui example',
    description: 'Live example from the Cast UI documentation site.',
    platform: 'web',
    supportedPlatforms: 'ios,android,web',
    dependencies: `@castui/cast-ui@${CAST_VERSION},expo-font@*`,
    code: buildSnackCode(example),
  });
  return `https://snack.expo.dev/?${params.toString()}`;
}

export function openInSnack(example: string, name?: string): void {
  window.open(snackUrl(example, name), '_blank', 'noopener');
}
