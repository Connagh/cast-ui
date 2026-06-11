/**
 * cast-sync — exports the cast-ui-kit Figma file's semantic intent colour
 * variables as a theme file for @castui/cast-ui.
 *
 * Reads the `semantic` variable collection (modes: semantic-light /
 * semantic-dark), resolves aliases down to primitive colour values, and
 * produces a JSON theme whose `colors.light` / `colors.dark` objects match
 * the shape of ThemeProvider's `colors` prop:
 *
 *   intent → prominence → state → { bg, fg, border }
 */

const INTENTS = ['neutral', 'brand', 'danger'] as const;
const PROMINENCES = ['default', 'bold', 'subtle'] as const;
const STATES = ['default', 'hover', 'active'] as const;
const SLOTS = ['bg', 'fg', 'border'] as const;

/** intent → prominence → state → { bg, fg, border } */
type IntentColorMap = Record<string, Record<string, Record<string, Record<string, string>>>>;

type ThemeFile = {
  name: string;
  description: string;
  generatedAt: string;
  colors: Partial<Record<'light' | 'dark', IntentColorMap>>;
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
  }

  const theme: ThemeFile = {
    name: figma.root.name,
    description:
      'Cast UI theme generated by cast-sync. Pass colors.light or colors.dark ' +
      "to ThemeProvider's `colors` prop.",
    generatedAt: new Date().toISOString(),
    colors,
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
