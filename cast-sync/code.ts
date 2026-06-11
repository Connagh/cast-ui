/**
 * cast-sync — exports the cast-ui-kit Figma file's design tokens as a theme
 * file for @castui/cast-ui.
 *
 * Theme file format v2. Exports four sections:
 *
 *   colors.{light|dark}   intent → prominence → state → { bg, fg, border },
 *                         matching ThemeProvider's `colors` prop (unchanged
 *                         from v1 — pass colors.light / colors.dark directly)
 *   text.{light|dark}     standalone text colours (text/primary, text/muted,
 *                         text/description) — Cast UI <Text> defaults
 *   typography            the Text Style ramp (caption, label, body, title,
 *                         heading, display). Values come from the semantic
 *                         typography variables the styles are bound to.
 *   shadows               elevation shadows from the shadow/* effect styles
 *
 * Colour values are read from the `semantic` variable collection (modes:
 * semantic-light / semantic-dark) with aliases resolved down to primitive
 * values.
 */

const INTENTS = ['neutral', 'brand', 'danger'] as const;
const PROMINENCES = ['default', 'bold', 'subtle'] as const;
const STATES = ['default', 'hover', 'active'] as const;
const SLOTS = ['bg', 'fg', 'border'] as const;

/** Standalone text colour variables exported under `text` */
const TEXT_COLOR_VARS = ['primary', 'muted', 'description'] as const;

/** intent → prominence → state → { bg, fg, border } */
type IntentColorMap = Record<string, Record<string, Record<string, Record<string, string>>>>;

type TextColorMap = Record<string, string>;

type TypographyStyle = {
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  lineHeight: number | null;
  letterSpacing: number;
};

type ShadowLayer = {
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
};

type ThemeFile = {
  name: string;
  description: string;
  generatedAt: string;
  version: 2;
  colors: Partial<Record<'light' | 'dark', IntentColorMap>>;
  text: Partial<Record<'light' | 'dark', TextColorMap>>;
  typography: Record<string, TypographyStyle>;
  shadows: Record<string, ShadowLayer[]>;
};

figma.showUI(__html__, { width: 520, height: 640, themeColors: true });

/** Convert a Figma RGBA to the CSS colour strings cast-ui uses. */
function toCssColor(color: RGBA): string {
  if (color.a <= 0.001) return 'transparent';
  const hexByte = (v: number) =>
    Math.round(Math.min(Math.max(v, 0), 1) * 255)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase();
  const hex = `#${hexByte(color.r)}${hexByte(color.g)}${hexByte(color.b)}`;
  return color.a >= 0.999 ? hex : `${hex}${hexByte(color.a)}`;
}

function isAlias(value: VariableValue): value is VariableAlias {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    (value as VariableAlias).type === 'VARIABLE_ALIAS'
  );
}

/**
 * Follow alias chains (semantic → primitive) until a concrete colour is
 * reached. When the target collection doesn't have the requested mode
 * (the primitive collection has a single mode), fall back to its default.
 */
async function resolveColor(value: VariableValue, modeId: string): Promise<RGBA | null> {
  let current: VariableValue = value;
  let depth = 0;
  while (isAlias(current)) {
    if (++depth > 10) return null;
    const target = await figma.variables.getVariableByIdAsync(current.id);
    if (!target) return null;
    const collection = await figma.variables.getVariableCollectionByIdAsync(
      target.variableCollectionId,
    );
    if (!collection) return null;
    const targetModeId = collection.modes.some((m) => m.modeId === modeId)
      ? modeId
      : collection.defaultModeId;
    current = target.valuesByMode[targetModeId];
  }
  if (typeof current === 'object' && current !== null && 'r' in current) {
    const c = current as RGB | RGBA;
    return { r: c.r, g: c.g, b: c.b, a: 'a' in c ? c.a : 1 };
  }
  return null;
}

/** Figma font style name → numeric weight (matches cast-ui's fontWeight tokens). */
const FONT_STYLE_WEIGHTS: Record<string, number> = {
  Thin: 100,
  'Extra Light': 200,
  Light: 300,
  Regular: 400,
  Medium: 500,
  'Semi Bold': 600,
  Bold: 700,
  'Extra Bold': 800,
  Black: 900,
};

function styleWeight(styleName: string): number {
  // Strip an "Italic" suffix so e.g. "Semi Bold Italic" still maps.
  const base = styleName.replace(/\s*Italic$/i, '').trim() || 'Regular';
  return FONT_STYLE_WEIGHTS[base] ?? 400;
}

/**
 * Export the Text Style ramp. The kit's text styles are fully bound to the
 * semantic typography variables, so the styles' resolved properties ARE the
 * variable values — reading them here keeps one code path for size,
 * line-height, tracking, family, and weight.
 */
async function buildTypography(warnings: string[]): Promise<ThemeFile['typography']> {
  const styles = await figma.getLocalTextStylesAsync();
  if (styles.length === 0) warnings.push('No local text styles found — typography not exported.');
  const typography: ThemeFile['typography'] = {};
  for (const style of styles) {
    typography[style.name] = {
      fontFamily: style.fontName.family,
      fontWeight: styleWeight(style.fontName.style),
      fontSize: style.fontSize,
      lineHeight: style.lineHeight.unit === 'PIXELS' ? style.lineHeight.value : null,
      letterSpacing: style.letterSpacing.unit === 'PIXELS' ? style.letterSpacing.value : 0,
    };
  }
  return typography;
}

/** Export the shadow/* effect styles as ordered drop-shadow layer lists. */
async function buildShadows(warnings: string[]): Promise<ThemeFile['shadows']> {
  const styles = await figma.getLocalEffectStylesAsync();
  const shadows: ThemeFile['shadows'] = {};
  for (const style of styles) {
    const layers = style.effects
      .filter((e): e is DropShadowEffect => e.type === 'DROP_SHADOW' && e.visible !== false)
      .map((e) => ({
        color: toCssColor(e.color),
        offsetX: e.offset.x,
        offsetY: e.offset.y,
        blur: e.radius,
        spread: e.spread ?? 0,
      }));
    if (layers.length === 0) {
      warnings.push(`Effect style "${style.name}" has no drop shadows — skipped.`);
      continue;
    }
    // shadow/sm → sm; styles outside the shadow/* convention keep their full name
    const key = style.name.startsWith('shadow/') ? style.name.slice('shadow/'.length) : style.name;
    shadows[key] = layers;
  }
  return shadows;
}

async function buildTheme(): Promise<{ theme: ThemeFile; warnings: string[] }> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const semantic = collections.find((c) => c.name === 'semantic');
  if (!semantic) {
    throw new Error(
      'No "semantic" variable collection found. Run cast-sync inside the cast-ui-kit file.',
    );
  }

  const lightMode =
    semantic.modes.find((m) => /light/i.test(m.name)) ??
    semantic.modes.find((m) => m.modeId === semantic.defaultModeId) ??
    semantic.modes[0];
  const darkMode = semantic.modes.find((m) => /dark/i.test(m.name));

  const variables = (
    await Promise.all(
      semantic.variableIds.map((id) => figma.variables.getVariableByIdAsync(id)),
    )
  ).filter((v): v is Variable => v !== null);
  const byName = new Map(variables.map((v) => [v.name, v]));

  const warnings: string[] = [];
  const modeList: { key: 'light' | 'dark'; modeId: string }[] = [
    { key: 'light', modeId: lightMode.modeId },
  ];
  if (darkMode) modeList.push({ key: 'dark', modeId: darkMode.modeId });
  else warnings.push('No dark mode found on the semantic collection — exported light only.');

  const colors: ThemeFile['colors'] = {};
  const text: ThemeFile['text'] = {};
  for (const { key, modeId } of modeList) {
    const intentMap: IntentColorMap = {};
    for (const intent of INTENTS) {
      for (const prominence of PROMINENCES) {
        for (const state of STATES) {
          for (const slot of SLOTS) {
            const name = `intent/${intent}/${prominence}/${state}/${slot}`;
            const variable = byName.get(name);
            if (!variable || variable.resolvedType !== 'COLOR') {
              if (key === 'light') warnings.push(`Missing variable: ${name}`);
              continue;
            }
            const rgba = await resolveColor(variable.valuesByMode[modeId], modeId);
            if (!rgba) {
              warnings.push(`Could not resolve ${name} (${key})`);
              continue;
            }
            const prominences = (intentMap[intent] ??= {});
            const states = (prominences[prominence] ??= {});
            const slots = (states[state] ??= {});
            slots[slot] = toCssColor(rgba);
          }
        }
      }
    }
    colors[key] = intentMap;

    const textMap: TextColorMap = {};
    for (const slot of TEXT_COLOR_VARS) {
      const name = `text/${slot}`;
      const variable = byName.get(name);
      if (!variable || variable.resolvedType !== 'COLOR') {
        if (key === 'light') warnings.push(`Missing variable: ${name}`);
        continue;
      }
      const rgba = await resolveColor(variable.valuesByMode[modeId], modeId);
      if (!rgba) {
        warnings.push(`Could not resolve ${name} (${key})`);
        continue;
      }
      textMap[slot] = toCssColor(rgba);
    }
    text[key] = textMap;
  }

  const theme: ThemeFile = {
    name: figma.root.name,
    description:
      'Cast UI theme generated by cast-sync. Pass colors.light or colors.dark ' +
      "to ThemeProvider's `colors` prop. text/typography/shadows mirror the " +
      'kit Text Styles, text colours, and shadow effect styles.',
    generatedAt: new Date().toISOString(),
    version: 2,
    colors,
    text,
    typography: await buildTypography(warnings),
    shadows: await buildShadows(warnings),
  };
  return { theme, warnings };
}

figma.ui.onmessage = (msg: { type: string }) => {
  if (msg.type === 'downloaded') {
    figma.notify('cast-theme.json downloaded');
  }
};

buildTheme()
  .then(({ theme, warnings }) => {
    figma.ui.postMessage({
      type: 'theme',
      json: JSON.stringify(theme, null, 2),
      warnings,
    });
  })
  .catch((error: unknown) => {
    figma.ui.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : String(error),
    });
  });
