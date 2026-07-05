#!/usr/bin/env node
/**
 * Build the architecture graph data from the committed token exports.
 *
 * Reads ../design-tokens/*.tokens.json and emits src/data/graph.json:
 *   nodes  every token (primitive / semantic / component / motion), one node
 *          per component grouping its tokens, and the ecosystem tools.
 *   links  alias edges between tokens, containment edges from components to
 *          their tokens, and flow edges between ecosystem pieces.
 *
 * Run it whenever design-tokens/ changes:  node scripts/build-graph.mjs
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const tokensDir = join(here, '..', '..', 'design-tokens');
const outFile = join(here, '..', 'src', 'data', 'graph.json');

const nodes = new Map();
const links = [];

function addNode(id, label, kind, extra = {}) {
  if (!nodes.has(id)) nodes.set(id, { id, label, kind, ...extra });
  return nodes.get(id);
}

function addLink(source, target, kind) {
  if (source === target) return;
  links.push({ source, target, kind });
}

/** Walk a DTCG tree, calling fn(path, token) for every $type leaf. */
function walk(obj, path, fn) {
  if (!obj || typeof obj !== 'object') return;
  if (obj.$type !== undefined) {
    fn(path, obj);
    return;
  }
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$') || key.startsWith('_')) continue;
    walk(value, path ? `${path}/${key}` : key, fn);
  }
}

function load(file) {
  return JSON.parse(readFileSync(join(tokensDir, file), 'utf8'));
}

// --- Token layers -----------------------------------------------------------

const collections = [
  { file: 'primitive.tokens.json', set: 'primitive', kind: 'primitive' },
  { file: 'semantic.tokens.json', set: 'semantic', kind: 'semantic' },
  { file: 'component/component-default.tokens.json', set: 'component', kind: 'component-token' },
  { file: 'motion.tokens.json', set: 'motion', kind: 'motion' },
];

const aliasEdges = [];

for (const { file, set, kind } of collections) {
  let data;
  try {
    data = load(file);
  } catch {
    console.warn(`skip ${file} (not found)`);
    continue;
  }
  walk(data, '', (path, token) => {
    const id = `${set}:${path}`;
    const raw = token.$value;
    // Colours are DTCG objects that carry a `hex`; keep it so the graph can
    // show the real value. Other primitives (numbers, strings) pass straight
    // through; anything else object-shaped has no single value.
    const value =
      raw && typeof raw === 'object'
        ? typeof raw.hex === 'string'
          ? raw.hex
          : undefined
        : raw;
    addNode(id, path, kind, {
      set,
      value,
      type: token.$type,
    });
    const alias = token.$extensions?.['com.figma.aliasData'];
    if (alias?.targetVariableName) {
      const targetSet = alias.targetVariableSetName ?? 'primitive';
      aliasEdges.push([id, `${targetSet}:${alias.targetVariableName}`]);
    }
  });
}

const SETS = ['primitive', 'semantic', 'component', 'motion'];
for (const [source, target] of aliasEdges) {
  if (nodes.has(target)) {
    addLink(source, target, 'alias');
    continue;
  }
  // The export sometimes omits or mislabels the target set. Try the others.
  const name = target.split(':').slice(1).join(':');
  const found = SETS.map((s) => `${s}:${name}`).find((id) => nodes.has(id));
  if (found) addLink(source, found, 'alias');
}

// --- Component grouping -----------------------------------------------------

const componentTokens = [...nodes.values()].filter((n) => n.kind === 'component-token');
const componentNames = new Set(componentTokens.map((n) => n.label.split('/')[0]));
for (const name of componentNames) {
  addNode(`comp:${name}`, name, 'component', { set: 'components' });
}
for (const token of componentTokens) {
  addLink(`comp:${token.label.split('/')[0]}`, token.id, 'contains');
}

// Motion roles consumed by components (mirrors src/tokens/motion usage).
const MOTION_USE = {
  drawer: ['motion:transition/standard/duration', 'motion:spring/overlay/damping'],
  bottomSheet: ['motion:transition/standard/duration', 'motion:spring/overlay/damping'],
  spinner: ['motion:loop/spin/duration'],
  skeleton: ['motion:loop/pulse/duration'],
  progress: ['motion:loop/indeterminate/duration'],
  speedDial: ['motion:transition/enter/duration', 'motion:transition/exit/duration'],
  accordion: ['motion:transition/expand/duration'],
};
for (const [comp, targets] of Object.entries(MOTION_USE)) {
  if (!nodes.has(`comp:${comp}`)) continue;
  for (const target of targets) {
    if (nodes.has(target)) addLink(`comp:${comp}`, target, 'alias');
  }
}

// --- Ecosystem layer ---------------------------------------------------------

const eco = [
  ['eco:figma-kit', 'Figma kit'],
  ['eco:variables', 'Kit variables'],
  ['eco:cast-sync', 'cast-sync plugin'],
  ['eco:cast-theme', 'cast-theme.json'],
  ['eco:design-tokens', 'design-tokens/'],
  ['eco:package', '@castui/cast-ui'],
  ['eco:theme-provider', 'ThemeProvider'],
  ['eco:npm', 'npm registry'],
  ['eco:storybook', 'Storybook'],
  ['eco:chromatic', 'Chromatic'],
  ['eco:actions', 'GitHub Actions'],
  ['eco:site', 'Docs site'],
  ['eco:skills', 'Agent skills'],
  ['eco:mcp', 'Figma MCP'],
  ['eco:agents', 'Coding agents'],
  ['eco:snack', 'Expo Snack'],
  ['eco:apps', 'Your apps'],
];
for (const [id, label] of eco) addNode(id, label, 'ecosystem', { set: 'ecosystem' });

const flows = [
  ['eco:figma-kit', 'eco:variables'],
  ['eco:variables', 'eco:cast-sync'],
  ['eco:cast-sync', 'eco:cast-theme'],
  ['eco:cast-theme', 'eco:theme-provider'],
  ['eco:variables', 'eco:design-tokens'],
  ['eco:design-tokens', 'eco:package'],
  ['eco:package', 'eco:theme-provider'],
  ['eco:package', 'eco:storybook'],
  ['eco:storybook', 'eco:chromatic'],
  ['eco:actions', 'eco:chromatic'],
  ['eco:actions', 'eco:npm'],
  ['eco:actions', 'eco:site'],
  ['eco:package', 'eco:npm'],
  ['eco:npm', 'eco:apps'],
  ['eco:npm', 'eco:snack'],
  ['eco:site', 'eco:snack'],
  ['eco:package', 'eco:skills'],
  ['eco:skills', 'eco:agents'],
  ['eco:figma-kit', 'eco:mcp'],
  ['eco:mcp', 'eco:agents'],
  ['eco:agents', 'eco:apps'],
  ['eco:theme-provider', 'eco:apps'],
];
for (const [a, b] of flows) addLink(a, b, 'flow');

// Bridge the layers: the kit's variables are the four collections; the
// package carries the components.
addLink('eco:variables', 'primitive:colours/white', 'bridge');
for (const name of componentNames) addLink('eco:package', `comp:${name}`, 'bridge');

const out = {
  generatedAt: new Date().toISOString(),
  counts: {
    nodes: nodes.size,
    links: links.length,
  },
  nodes: [...nodes.values()],
  links,
};

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(out));
console.log(`graph.json: ${nodes.size} nodes, ${links.length} links`);
