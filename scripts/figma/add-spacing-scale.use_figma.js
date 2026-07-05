/* STATUS: APPLIED to cast-ui-kit (JGtlpxLPJMZcwvQ3UZ9ZUl) on 2026-07-05.
   spacing/{xs,sm,md,lg,xl,xxl} created in the component collection; primitives
   space/14-16 already existed. Kept as an idempotent record (re-running aborts). */
/**
 * cast-ui-kit — create the density-aware layout spacing scale as Figma variables.
 *
 * Run this THROUGH the Figma MCP `use_figma` tool (load the `figma-use` skill
 * first). It is not a Node script. File key: JGtlpxLPJMZcwvQ3UZ9ZUl.
 *
 * What it creates, to mirror src/theme/themes.ts `spacingScales`:
 *   primitive collection:  space/14 = 48, space/15 = 64, space/16 = 80  (if missing)
 *   component collection:   spacing/{xs,sm,md,lg,xl,xxl}, one primitive alias per
 *                           density mode (compact / default / comfortable).
 *
 * Bindings (each step aliases the primitive `space/*` whose value matches):
 *   step  compact        default        comfortable
 *   xs    2  (space/2)    4  (space/3)    6  (space/4)
 *   sm    6  (space/4)    8  (space/5)    12 (space/7)
 *   md    12 (space/7)    16 (space/9)    20 (space/10)
 *   lg    20 (space/10)   24 (space/11)   32 (space/12)
 *   xl    32 (space/12)   40 (space/13)   48 (space/14*)
 *   xxl   48 (space/14*)  64 (space/15*)  80 (space/16*)   (* = new primitive)
 *
 * Idempotent: aborts if spacing/* already exists. Looks primitives up by value,
 * so it does not depend on exact primitive IDs. Scope: GAP (covers padding + gap).
 *
 * After it runs: re-export design-tokens/component/*.tokens.json via cast-sync,
 * regenerate token-reference.json, then record it in DESIGN-CHANGELOG.md and bump
 * the Figma library version.
 */

const cols = await figma.variables.getLocalVariableCollectionsAsync();
const primitive = cols.find((c) => c.name === 'primitive');
const component = cols.find((c) => c.name === 'component');
if (!primitive || !component) {
  return { error: 'collections not found', have: cols.map((c) => c.name) };
}

const modeByName = {};
for (const m of component.modes) modeByName[m.name] = m.modeId;
for (const d of ['compact', 'default', 'comfortable']) {
  if (!modeByName[d]) return { error: 'missing density mode: ' + d, modes: component.modes.map((m) => m.name) };
}

// Index primitive space/* variables by their resolved value.
const primMode = primitive.modes[0].modeId;
const spaceByValue = {};
for (const id of primitive.variableIds) {
  const v = await figma.variables.getVariableByIdAsync(id);
  if (v.resolvedType === 'FLOAT' && v.name.startsWith('space/')) {
    spaceByValue[v.valuesByMode[primMode]] = v;
  }
}

// Ensure the three new primitive steps exist.
const newPrims = { 48: 'space/14', 64: 'space/15', 80: 'space/16' };
for (const val of Object.keys(newPrims)) {
  if (!spaceByValue[val]) {
    const nv = figma.variables.createVariable(newPrims[val], primitive, 'FLOAT');
    nv.scopes = ['GAP'];
    nv.setValueForMode(primMode, Number(val));
    spaceByValue[val] = nv;
  }
}

// Idempotency guard.
for (const id of component.variableIds) {
  const v = await figma.variables.getVariableByIdAsync(id);
  if (v.name.startsWith('spacing/')) return { aborted: 'spacing/* already exists' };
}

// The scale (must match src/theme/themes.ts spacingScales).
const scale = {
  xs:  { compact: 2,  default: 4,  comfortable: 6  },
  sm:  { compact: 6,  default: 8,  comfortable: 12 },
  md:  { compact: 12, default: 16, comfortable: 20 },
  lg:  { compact: 20, default: 24, comfortable: 32 },
  xl:  { compact: 32, default: 40, comfortable: 48 },
  xxl: { compact: 48, default: 64, comfortable: 80 },
};

const created = [];
const missing = [];
for (const step of Object.keys(scale)) {
  const v = figma.variables.createVariable('spacing/' + step, component, 'FLOAT');
  v.scopes = ['GAP'];
  for (const density of ['compact', 'default', 'comfortable']) {
    const prim = spaceByValue[scale[step][density]];
    if (!prim) { missing.push(step + '/' + density + ' -> ' + scale[step][density]); continue; }
    v.setValueForMode(modeByName[density], figma.variables.createVariableAlias(prim));
  }
  created.push(v.name);
}

// Verify: re-resolve each new variable's aliases back to a primitive value.
const verify = {};
const allVars = await figma.variables.getLocalVariablesAsync();
for (const step of Object.keys(scale)) {
  const v = allVars.find((x) => x.name === 'spacing/' + step);
  if (!v) { verify[step] = 'MISSING'; continue; }
  const byMode = {};
  for (const density of ['compact', 'default', 'comfortable']) {
    const alias = v.valuesByMode[modeByName[density]];
    const target = alias && alias.id ? await figma.variables.getVariableByIdAsync(alias.id) : null;
    byMode[density] = target ? target.valuesByMode[primMode] : null;
  }
  verify[step] = byMode;
}

return { created, missing, verify, note: 'Re-export component-*.tokens.json via cast-sync, then bump the Figma library version.' };
