/**
 * Cast UI Storybook theme — the workshop chrome and docs pages are styled
 * from the design system's own colour tokens, so a Figma recolour synced
 * into src/tokens/colors.ts re-brands the Storybook too.
 *
 * Imported by manager.ts (chrome) and preview.tsx (docs pages). The manager
 * bundle has no react-native-web alias, so only the pure-data colour module
 * can be imported here — ../src/tokens/typography (or the tokens barrel,
 * which re-exports it) pulls in react-native's Platform and would break the
 * manager build. Font families are therefore written out by hand.
 */

import { create } from 'storybook/theming/create';
import { lightColors } from '../src/tokens/colors';

const neutral = lightColors.intents.neutral.default;
const brandBold = lightColors.intents.brand.bold;

export const castTheme = create({
  base: 'light',

  brandTitle: 'Cast UI',
  // Served from .storybook/public (canonical copy lives at the repo root)
  brandImage: './logo.png',
  brandUrl: 'https://github.com/Connagh/cast-ui',
  brandTarget: '_blank',

  colorPrimary: brandBold.default.bg,
  colorSecondary: brandBold.default.bg,

  // App chrome
  appBg: lightColors.surface.base,
  appContentBg: lightColors.surface.overlay.bg,
  appPreviewBg: lightColors.surface.overlay.bg,
  appBorderColor: lightColors.surface.overlay.border,
  appBorderRadius: lightColors.surface.overlay.borderRadius,

  // Typography (loaded via manager-head.html)
  fontBase: '"Inter", system-ui, sans-serif',
  fontCode: '"JetBrains Mono", ui-monospace, monospace',

  // Text
  textColor: lightColors.text.primary,
  textInverseColor: lightColors.intents.neutral.bold.default.fg,
  textMutedColor: lightColors.text.description,

  // Toolbar
  barBg: lightColors.surface.overlay.bg,
  barTextColor: lightColors.text.description,
  barHoverColor: brandBold.hover.bg,
  barSelectedColor: brandBold.default.bg,

  // Form controls (addons panel, search)
  inputBg: neutral.default.bg,
  inputBorder: neutral.default.border,
  inputTextColor: lightColors.text.primary,
  inputBorderRadius: 6,

  buttonBg: lightColors.surface.subtle,
  buttonBorder: neutral.default.border,
  booleanBg: lightColors.surface.subtle,
  booleanSelectedBg: lightColors.surface.overlay.bg,
});
