---
name: cast-ui-component
description: The finalized playbook for adding or extending a component in @castui/cast-ui end to end. Design tokens, Figma component, React Native code, and the design↔code association (Figma component-description text, with Code Connect as an optional plan-gated upgrade). So design and production stay 1:1 and the cast-sync Figma plugin keeps working. Use whenever building/extending a component (Accordion, Heading, Progress, Spinner, Tabs, or any new one), creating or altering design tokens, adding icons, wiring a component into Figma via MCP, reconciling Figma ↔ code, or documenting the design↔code mapping. Covers token requirements, the Icon/slot architecture, density themes, cast-sync colour contract, where colours/sizes must live (sub-component vs component), the Figma description template, and the code package conventions.
---

# Cast UI Component Architecture Skill

Master reference for shipping a component into `@castui/cast-ui` without breaking
the design-token contract or the **cast-sync** Figma plugin. Work the phases in
order: **tokens → Figma → code → design↔code association**. That ordering is the
**build sequence** for a new component, not a hierarchy of truth: once built, the
Figma component and the code component are **co-equal, bidirectional mirrors**
kept in sync both ways (§5).

**What Cast UI is:** a cross-platform React Native library (iOS / Android / Web
via react-native-web), **zero runtime dependencies**, a 3-layer design-token
system exported from Figma, and runtime **density** theming. Reference component:
`src/components/Button/Button.tsx`. Copy its shape when unsure. Figma file key:
`JGtlpxLPJMZcwvQ3UZ9ZUl` (`cast-ui-kit`). Full node map: Appendix A.

State of the package: **37 components, all built and exported** (v4.10.0),
plus the motion token system (§M). There are no scaffolded-empty components.
The docs site (site/, deployed to GitHub Pages) documents every component
from a registry; a new component is not done until its registry entry exists
(see the cast-ui-docs-site skill).

---

## 0. Non-negotiable contracts

Every decision downstream is constrained by these.

1. **Three token layers, each aliasing the one below:** Component → Semantic →
   Primitive. **Bind to the right layer per category:** *colour* component
   bindings always go through the `semantic` intent layer; *typography* through
   the semantic type scales; *shared spacing* (gap/padding/border-radius) aliases
   the `semantic` `control-*` family **where one matches**; but a
   **component-specific *dimension*** with no shared semantic (track-height,
   dot-size, indicator-size) aliases a **primitive `size/`·`space/`·`radius/`
   token directly**. The real, verified file convention (Badge `dot-size`→
   `size/*`, Toggle `track-height`→`size/*`, Progress `track-height`→`size/*`,
   Tabs `indicator-height`→`size/*`). Never bind a raw literal. (§1)
2. **Density changes spacing only (~25% of tokens).** `compact | default |
   comfortable` vary padding / gap / spacing. Colours, border-radius, focus
   rings, icon sizes, and typography are **constant** across densities. This
   also covers the general layout spacing scale (`spacing/{xs..xxl}`, exposed as
   `theme.spacing`): a density-varying foundation in the `component` collection,
   each step aliasing a primitive `space/*`, for app layout that is not tied to
   one component. (§1)
3. **Colours stay in `intent → prominence → state → {bg, fg, border}`.** This is
   the exact shape cast-sync exports and `ThemeProvider` consumes. Anything
   outside it is silently dropped by the plugin. (§2)
4. **Icons are the slot-based `<Icon>` component, rendering Material Symbols
   Outlined.** Code renders by font ligature; Figma uses a slot. (§3)
5. **Fonts: Geist / JetBrains Mono / Noto Serif via `Platform.select`.**
   Typography is constant across densities. (§4)
6. **Props mirror Figma properties 1:1**. Same names, same values, both sides.
   (§5)
7. **Colours/sizes live at the lowest source**. In the sub-component if one
   exists, else in the component's own variants; **never as style overrides on a
   parent**. Fix at base-component level so instances inherit. (§6)
8. **Zero runtime dependencies.** Only `react` + `react-native` peer deps.

---

## Writing style (all documentation)

Everything this skill writes uses plain, simple language. This covers Figma
component descriptions, code header comments, story text, PR notes, and this
skill itself.

Rules:

1. No em dashes. Use a full stop, a comma, or a colon instead.
2. Short, direct sentences. One idea per sentence.
3. Plain words. Say what a thing does, not how clever it is.
4. No AI writing tells. Avoid "not just X but Y", "it's worth noting",
   "in order to" (write "to"), filler, and rule-of-three flourishes.
5. Dev, MCP, and agent notes may use the exact technical term when it is needed,
   and no more.
6. If a word can be cut and the meaning stays, cut it.
7. Refer to a component with angle brackets: <Button>, <Tabs>. Write a private
   sub-component with its underscore: _<Tab>.

## 1. Design tokens (build FIRST, via Figma MCP)

A component is only correct when its spacing resolves through the semantic layer.
Never hardcode padding/gap or invent numbers.

### 1.1 The three layers

```
Component   design-tokens/component/component-{compact,default,comfortable}.tokens.json
   ↓ aliases (com.figma.aliasData → targetVariableName in collection "semantic")
Semantic    design-tokens/semantic.tokens.json
   ↓ aliases
Primitive   design-tokens/primitive.tokens.json   (raw values: colour, space, size, radius, opacity, type)
```

DTCG format with Figma extensions. The JSON files are the Figma **sync target**;
the lean runtime copies are `src/tokens/` (constants) + `src/theme/themes.ts`
(density spacing). When Figma tokens change, update the TS to match.

**Variable collections** (verify ids live via `get_variable_defs`):
`primitive`, `component` (3 modes: compact/default/comfortable), `semantic`
(2 modes: semantic-light / semantic-dark), and `motion` (1 mode — durations,
cycles, easing beziers as x1/y1/x2/y2 floats, springs, and semantic
transition/feedback/loop roles aliasing them). Motion is constant across
density and colour mode. Committed mirror: `design-tokens/motion.tokens.json`.

### 1.2 Reuse semantic tokens. Don't mint primitives

Component spacing aliases the shared **`control`** family in `semantic`, e.g.
Button `large/gap` → `control-lg/gap/default`, `border-radius` →
`control-lg/border-radius`, focus ring → `control/focus-ring-width`. The
`semantic` collection exposes: `control-sm`, `control-lg`, `control`, `intent`,
`overlay`, `display`, `heading`, `title`, `body`, `label`, `caption`, `text`,
`surface`, `neutral`.

**Rule:** for shared control *spacing* (gap, padding, border-radius) alias the
existing `control-*` semantic family **where one matches**. For a
**component-specific dimension** (track-height, dot-size, indicator-size) bind
the **primitive `size/`/`space/` scale directly**. Matching the verified
Badge/Toggle convention; do **not** mint a new semantic for a one-component
dimension. Mint a new semantic token only for a genuinely *shared, reusable* new
concept, and that semantic must itself alias a primitive, never a literal.
Primitive scale (for reference): `size/2`·`space/2`=2, `size/3`·`space/3`=4,
`4`=6, `5`=8, `6`=10, `7`=12, `8`=14, `9`=16, `10`=20, `11`=24, `12`=32, `13`=40;
pill radius = `radius/full` (9999).

**Spacing. Verify before you reuse.** "Alias `control-*` where one matches" means
*resolve the control-* values across all three density modes and compare*. If the
component's spacing is bespoke (tighter or looser than the standard control), the
control-* family will **not** match and the **primitive `space/N` binding is the
correct fallback**, not a violation. *Worked example. Tabs:* a tab runs tighter
than a button, so `tabs/{size}/{gap,padding-x,padding-y}` legitimately bind
`space/N` directly (e.g. `tabs/default/padding-x` = 6/7/9 ≠ `control/padding/x` =
6/8/10). Don't force a control-* alias that doesn't resolve to the same numbers.

*Worked example. Progress:* `progress/{small,default,large}/track-height` →
`size/{3,5,7}` (4/8/12), `progress/border-radius` → `radius/full`, identical
across all three density modes (track thickness is keyed by `size`, constant
across density). *Worked example. Tabs:* `tabs/{size}/indicator-height` →
`size/{2,2,3}` (2/2/4), `tabs/indicator-radius` → `radius/full`, both constant
across density; `tabs/list-gap` → `space/{5,9,11}` (8/16/24, density-varying).

### 1.3 Density rule

Only `gap` / `padding*` / spacing may differ across the three density blocks.
If a colour, radius, focus ring, or icon size differs by density, it's wrong.
Those are constant and live at the top level of the theme tokens, not inside the
per-size/per-density blocks.

### 1.4 Create the tokens as Figma variables (MANDATORY. Not optional)

**Writing the runtime TS (§1.5) is NOT a substitute for this step.** The runtime
copies and the Figma variables are two separate artifacts; a component is only
"tokenised" when the variables exist in the `cast-ui-kit` file **and** mirror the
TS. Skipping the Figma side leaves design with nothing to bind and silently
breaks the cast-sync round-trip. Create the variables via the Figma MCP
(`use_figma`, after loading the `figma-use` skill):

1. **Inspect first.** `get_variable_defs` on the closest existing analog
   (Progress↔Toggle/Badge for a track; reuse its exact naming + binding pattern).
   Collections: `primitive` (1 mode), `component` (3 density modes:
   compact/default/comfortable), `semantic` (semantic-light / semantic-dark).
2. **Create by token category. Bind to the right layer:**
   - **Spacing (gap/padding):** `component` var `{name}/{size}/{prop}` → alias the
     `control-*` semantic if its values match, else primitive `space/N`. Scope
     `GAP` (the GAP scope covers both itemSpacing and padding).
   - **Component dimension (track-height, indicator-size, dot-size):** `component`
     var → alias primitive `size/N` **directly** (Badge/Toggle/Tabs convention).
     Scope `WIDTH_HEIGHT`.
   - **Border-radius:** `component` var `{name}/border-radius` (or `{name}/
     indicator-radius` etc. where clearer) → primitive `radius/N` (pill =
     `radius/full`). Scope `CORNER_RADIUS`.
   - **Colour. Three cases, pick the right one:**
     - *Intent-driven* fills/text (a button bg, a progress **fill**, a badge, a
       selected tab's label + indicator) reuse the existing
       `intent/{intent}/{prominence}/{state}/{bg|fg|border}` semantics. Never mint
       a per-component variable for these. (A selected-tab label/indicator is a
       *text/line* colour → bind the **`fg`**, e.g.
       `intent/{intent}/default/default/fg`, not a `bg`.)
     - *A bespoke non-intent control surface* (a progress **track**, a toggle
       off-state, a **tabs baseline track**) gets its **own dedicated semantic**
       in the `control/{component}/...` namespace, aliasing a primitive grey.
       This is the verified convention (`control/toggle/off/bg`,
       `control/progress/track/bg`, `control/tabs/track/bg`, all → cool-grey/200
       light · cool-grey/700 dark). Do **not** reuse `surface/subtle` for this;
       mirror it in code as a `{component}Colors` slice on the scheme
       (`scheme.progress.track`, `scheme.tabs.track`, `scheme.toggle.track.off`).
     - *Generic* page/overlay/description colours use `surface/*`, `text/*` (a
       tab's unselected label = `text/muted`; hovered = `text/primary`).
     Extend the intent axis itself only for a genuinely new colour concept (§2).

     **Only bind the colours the component actually has.** A *fill-only* element
     (a progress bar, a track, a divider) has **no `fg`**. Don't invent one. A
     tab binds the intent `fg` (text + indicator line) and has no `bg`. And bind
     only the intent **states** the component can enter.
   - **Text:** apply the kit Text Styles (already bound to `semantic` typography
     vars); don't mint per-component type tokens.
3. **Set `scopes` explicitly** on every new variable (`GAP`, `WIDTH_HEIGHT`,
   `CORNER_RADIUS`, …). Never leave `ALL_SCOPES`.
4. **Provide all three density modes**; a constant takes the same alias in each.
5. **Verify** each created variable by re-resolving `valuesByMode` to the target
   name. Then **re-export** the three `component-*.tokens.json` via cast-sync so
   `design-tokens/component/` picks up the new `com.figma.aliasData`. Hand-editing
   those export JSONs is discouraged. Regenerate from Figma instead.

#### Worked recipe. Create aliased component variables via `use_figma`

```js
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const comp = cols.find(c => c.name === 'component');
const modeIds = comp.modes.map(m => m.modeId);   // compact, default, comfortable

// 1. Idempotency guard. Re-running double-creates otherwise.
for (const id of comp.variableIds) {
  const v = await figma.variables.getVariableByIdAsync(id);
  if (v.name.startsWith('progress/')) return { aborted: 'progress vars exist' };
}

// 2. Fetch the primitive target (size/5 = 8) by its id.
const sizePrim = await figma.variables.getVariableByIdAsync('VariableID:183:51');

// 3. Create the FLOAT var, set EXPLICIT scopes, bind the SAME alias to every mode.
const v = figma.variables.createVariable('progress/default/track-height', comp, 'FLOAT');
v.scopes = ['WIDTH_HEIGHT'];                          // never leave ALL_SCOPES
const alias = figma.variables.createVariableAlias(sizePrim); // takes the Variable OBJECT
for (const m of modeIds) v.setValueForMode(m, alias);        // constant ⇒ same alias per mode

// 4. Verify by re-resolving valuesByMode → target id/name before returning.
const chk = await figma.variables.getVariableByIdAsync(v.id);
return { id: v.id, ok: Object.values(chk.valuesByMode).every(x => x.id === sizePrim.id) };
```

`createVariable(name, collectionObject, 'FLOAT')` accepts the collection object;
`createVariableAlias(targetVar)` takes the **Variable object** (not an id);
a *constant-across-density* token binds the **same** alias in all three modes.
**Always re-resolve and verify** in the same call. Keep each creation script to
one logical batch (≤10 vars) per `use_figma` call.

### 1.5 Mirror into runtime TS

1. `src/theme/types.ts`. Add `{Component}SizeTokens` + `{Component}ThemeTokens`,
   add the field to `ComponentTokens`. Density-varying spacing goes inside the
   size variants; constants (radius, focus ring, icon size, indicator-height) at
   the top level or keyed by size.
2. `src/theme/themes.ts`. Resolved values for **all three densities**.
3. `design-tokens/token-reference.json`. Add the verified values (agent map).
4. Export new token types from `src/theme/index.ts` and `src/index.ts`.

---

## M. Motion contract

Motion is tokenized like colour. The layers:

- **Code:** `src/tokens/motion.ts` — primitives (`duration`, `cycle`,
  `easingBezier`, `spring`) and semantic roles (`transition`, `feedback`,
  `loop`), built by `resolveMotion(overrides?)`. `src/theme/useMotion.ts` is
  the only access point: it adds `reduceMotion` (live OS setting),
  `useNativeDriver` (false on web), and `scale(ms)` (0 under reduce-motion).
- **Figma:** the `motion` variable collection mirrors the same names
  (`duration/base`, `easing/standard/x1..y2`, `transition/standard/duration`
  as an alias, easing role names as STRING variables). The kit's Motion page
  carries keyframed spec cards using the exact beziers.
- **Theming:** `ThemeProvider` takes a `motion` prop of primitive overrides;
  `applyCastTheme` maps a cast-theme.json `motion` block onto it; cast-sync
  v4 exports the collection.

Rules when animating a component:

1. Never hardcode a duration, easing, or spring. Read a **semantic role**
   through `useMotion()` (e.g. `motion.transition.standard`,
   `motion.loop.spin`). If no role fits, extend the roles in
   `src/tokens/motion.ts` AND the Figma collection together.
2. Wrap every duration in `motion.scale()`, pass
   `motion.transition.*.easing` as the easing, and use
   `motion.useNativeDriver`. For loops, check `motion.reduceMotion` and skip
   starting the loop.
3. Add a `Motion:` line to the Figma component description naming the role.
4. Update the role table on the kit's Motion page and the site's Motion page
   if roles change.

## 2. cast-sync colour contract

`cast-sync/` (Figma plugin) reads the `semantic` collection (and, since v4,
the `motion` collection) and emits `cast-theme.json`, whose `colors.light` /
`colors.dark` match `ThemeProvider`'s `colors` prop **exactly**:

```
intent ∈ {neutral, brand, danger}
 → prominence ∈ {default, bold, subtle}
   → state ∈ {default, hover, active}
     → { bg, fg, border }   // "#RRGGBB" | "#RRGGBBAA" | literal "transparent"
```

- **Consume colour only via `useTheme().colors[intent][prominence][state]`** in
  code; never read raw hex except the shared disabled set (`disabledColors` in
  `src/tokens/colors.ts`).
- **Bind the right channel.** A solid filled control (button bg, progress fill)
  reads the **`bg`**; a *text + thin line* element (a selected tab's label and
  underline indicator) reads the **`fg`**. They share hex in light mode but
  diverge in dark, so the channel matters. Match whatever the Figma layer binds.
- **Don't add a new colour axis** unless you also extend the Figma `semantic`
  collection *and* the resolver in `cast-sync/code.ts`.
- **Non-intent colours** come from a generic `surface/*` / `text/*` / `neutral/*`
  semantic, OR a dedicated **`control/{component}/...`** semantic for a
  component's *own* bespoke control surface (toggle off-track, progress track,
  tabs baseline track), aliasing a primitive grey and mirrored as a
  `{component}Colors` slice on the scheme.
- After adding colour usage, run cast-sync in Figma and confirm light + dark
  render with no missing-variable warnings.

---

## 3. Icons (the slot architecture)

This is the most nuanced area; read it fully before adding any icon.

### 3.1 The `<Icon>` component

- **Figma:** the public `<Icon>` **component set** is `774:2875` (page `<Icon>`).
  It is **slot-based**: each size variant is a box containing a Figma *slot*; the
  designer drops any Material Symbol into the slot via the Material Symbols
  plugin. A deprecated standalone `<Icon>` (`182:8`) still exists. **never point
  new instances at it**; always use the set `774:2875`.
- **Code:** `src/components/Icon/Icon.tsx` renders the glyph by **font ligature**
  (the `name` string, e.g. `chevron_right`). Zero SVG packages.
- **Glyph coverage, axes, and styles:** the **entire** Material Symbols glyph set
  is available. **FILL, weight, grade, and optical-size are supported** via the
  Icon's props. Only the **Outlined style font** is loaded. Rounded/Sharp are
  separate fonts and a known gap.
- **Design↔code seam (incl. axes):** the slot holds a *vector* named after the
  symbol; code renders by *name*. A pulled design yields a vector, not
  `<Icon name="…">`, and the designer's **fill / weight choices live on the
  vector, not in a prop**. The design↔code bridge (§8) must cover both: slot
  layer name → `name`, AND the plugin's FILL / weight → the `fill` / `weight`
  props. Encoded in the component description (and a published Code Connect
  record, where a Dev seat exists). Otherwise Figma shows a filled glyph and
  code renders the outlined default.

### 3.2 Size scale + tokens

| Variant | Token | px | Primitive |
|---|---|---|---|
| `xs` | `icon/xs/size` | 12 | `size/7` |
| `small` | `icon/small/size` | 16 | `size/9` |
| `default` | `icon/default/size` | 20 | `size/10` |
| `large` | `icon/large/size` | 24 | `size/11` |

Code mirror: `src/tokens/icon.ts` exports `type IconSize = 'xs'|'small'|'default'|'large'`
and `iconSize: Record<IconSize, number>` (12/16/20/24), re-exported from
`src/index.ts`.

### 3.3 Sizing icons inside components

Never hardcode `const ICON_SIZE = 16`. Two equivalent host patterns:

- **Named-scale hosts** pass the host `size` straight through:
  `<Icon size={size} … />`. Use for Button, Input, Badge, Select trigger/option,
  **<Tab>** (a tab's `leadingIcon` follows the tab `size`).
- **Density-token hosts** read a per-size `iconSize` from the theme. Use for List,
  Card, Alert, Toast, Dialog, Chip, Checkbox, Avatar.

In Figma, every embedded icon is an instance of `774:2875` pinned to the matching
`size=` variant.

**Control glyphs can be sized to their container.** A Material Symbols glyph
carries ~30 % intrinsic padding, so sizing a checkbox tick to the indicator size
still leaves breathing room.

**The scale gap (important):** the `<Icon>` set covers 12/16/20/24 only. Decide a
component's icon sizes up front; if it needs an out-of-scale size, add a variant +
token or size that glyph by the host.

### 3.4 Colour binding

There is **no dedicated icon-colour token**. An icon's glyph fill binds to the
**same `intent/{intent}/{prominence}/{state}/fg` variable as its nearest label**,
so colour tracks the host automatically. In code: `<Icon name="…" color={fg} />`.
Never hardcode an icon hex. (Tab's `leadingIcon` is passed the same resolved `fg`
the label uses. Selected→intent fg, unselected→text muted, hover→text primary,
disabled→disabled fg.)

### 3.5 Code `<Icon>` API

```tsx
type IconProps = {
  name: string;                 // Material Symbols name (ligature)
  size?: IconSize | number;     // named scale OR explicit px (default 20)
  color?: string;               // pass the host's resolved fg
  fill?: boolean; weight?: 100..700; grade?: number; opticalSize?: number;
};
```
Icons are accessibility-hidden. Don't double-label.

### 3.6 Placing / migrating glyphs in Figma

Clone a reference `<Icon>` that already has the glyph in its slot, `insertChild`,
`setProperties({size})` by width, scale the glyph GROUP to the box, bind every
glyph VECTOR fill to the host fg variable, remove legacy nodes. **Always fix at
base-component level** so nested instances inherit.

### 3.7 Icon gotchas

- **Slot content doesn't auto-scale on variant change**. Fix with
  `stretchChildOnInsert=true` + glyph group `FILL` (applied to `774:2875`).
  Instances sized before that fix keep a stale slot override. `resetOverrides()`.
- **`resetOverrides()` reverts the glyph colour to `text/primary`**. Re-bind the
  fg after any reset.

---

## 4. Fonts & typography

- Import families from `src/tokens/typography.ts`: `fontFamily.sans` (Geist),
  `.mono` (JetBrains Mono), `.serif` (Noto Serif). Each is a `Platform.select`.
- Use the **typography scales**, never raw sizes: `label`, `title`, `body`,
  `heading`, `display` (each `sm/md/lg`) + `caption`. Map `size → scale` (Tabs
  uses `LABEL_TYPE`: small→`label-sm`, default→`label-md`, large→`label-lg`,
  rendered through the shared `<Text>` component so it inherits the ramp).
- Per-family weights: label & title = medium (500); heading = semibold (600);
  body, caption, display = regular (400).
- Typography is **constant across densities**.
- Fonts are consumer-loaded. Document this in the component header comment.

### Font strategy. Current state + target (direction, not yet built)

Today the three families are hardcoded in `src/tokens/typography.ts`. The
**target** is a themeable custom-font system: fonts become a `ThemeProvider`
concern (a `fonts` slice), pulled from Figma via cast-sync v2's
`typography[*].fontFamily`, with a dev-only `console.warn` fallback when a
referenced family isn't registered.

---

## 5. Props ⇄ Figma. A 2-way mirror

Figma component properties and code props are **co-equal, bidirectional
mirrors**. Design→code flows through the MCP (inferred from the naming/description
mirror, or a published Code Connect record); code→design flows through the
generate / sync path. Keep them in lockstep **both directions** with identical
names and values.

Standard vocabulary (use exactly when applicable):

- `intent`: `'neutral' | 'brand' | 'danger'`. Colour scheme.
- `prominence`: `'default' | 'bold' | 'subtle'`. Weight.
- `size`: `'small' | 'default' | 'large'`. Spacing + typography scale.
- `state`: interaction/selection variant (e.g. Tab `default | hover | selected |
  disabled`). Note: some `state` values are *runtime* in code (hover via
  `onHoverIn`/`onHoverOut`), not props. See §8.3.
- `disabled`: boolean. Shared muted styling.

Component-specifics (`Tabs.value/onValueChange`, `Tab.value`, `Progress.value`,
`Spinner.size`) sit on top but still match the Figma property names. Type text
`children` narrowly (`string`, not `ReactNode`).

### Variant props vs. content props. A global rule

- **Variant props** describe **style / structure**. `type`, `intent`,
  `prominence`, `size`, `state`. Figma VARIANT properties; code string-union props.
- **Content / value props** describe what a consumer puts **into** an instance.
  Text, a numeric `value`, an icon slot, a child element. **Not** variants.

For every content / value prop:

1. **Name it once, identically on both sides.** Text content is `children` (never
   `text`/`label`), a slot is `leadingIcon`, a numeric input is `value`.
2. **Code = single source of truth.**
3. **Figma = one shared property bound across *every* variant**, neutral
   placeholder default (e.g. `"Tab"`), bound via `componentPropertyReferences`.

**Never bake content into individual variants.** *Verified clean. `_<Tab>`:* the
label is a single shared `children` text property (placeholder `"Tab"`) bound
across all 18 variants, text fill bound to a variable, not a literal.

### Lean variant matrices. Don't enumerate redundant cross-products

When a variant axis only affects *some* states, model it leanly rather than
forcing a full cross-product of identical-looking variants. *Verified. `_<Tab>`:*
`intent` only changes the **selected** tab's colour, so intent carries the three
values on `state=selected` (9 variants) while `default`/`hover`/`disabled` are
intent-agnostic (`neutral`, 9 variants) = 18, **not** 3 intents × 4 states × 3
sizes = 36. Every variant still has a real intent value (no `"-"` sentinel), and
the lean model is documented so the code `intent` prop is understood as a no-op
unless selected. Use a real placeholder value (`neutral`), never a `"-"` sentinel,
for axes that don't apply in a given state.

---

## 6. Build in Figma. And where colours/sizes live

1. **Component set** named exactly as the code component (`Tabs`, `Spinner`, …;
   a private sub-component keeps its `_<X>` name, e.g. `_<Tab>`).
2. **Variant properties** matching §5 props. Names and values char-for-char.
3. **Bind every spacing value** to a component variable (§1). No detached numbers.
4. **Bind every colour** to `intent/...` semantic variables (or `surface`/`text`/
   `neutral`/`control/{component}` for non-intent).
5. **Icons:** instances of `774:2875` at the right `size=` variant, glyph fill
   bound to the host fg (§3.4).
6. **Text:** apply the kit Text Styles.
7. **All density modes** for any new spacing vars.
8. **Write the `descriptionMarkdown`** for the set (and sub-component) using the
   Overview-first template (§8.1): Overview, Do's and Don'ts (✅/❌), Useful
   links, then MCP context. This text drives the design↔code association.
9. **Publish** so consumers get the variables/styles.

### Where colours and sizes must live (avoid style overrides)

- **If the component has a private sub-component** (`<Select>` composes
  `_<SelectOptions>`; `<Tabs>` composes `_<Tab>`), the icon/label colour + size
  lives **in the sub-component's own variants**, and the parent inherits with
  **zero fill / colour overrides**. *Verified clean: `<Tabs>` has 0 colour
  overrides on its `_<Tab>` instances. Only content/layout overrides
  (text, size, width/height).*
- **If the component holds the icon directly** (Alert, Toast, Card, Avatar), the
  colour binding lives on the icon **within the component's intent variants**.
- **Never paint colour as an instance override on a parent.** To audit: walk a
  set's nested instances, check `instance.overrides[*].overriddenFields` for
  `fills`/`boundVariables` on an icon/label node. There should be none.
- **Legitimate per-instance overrides** are *content*: text labels, the slot
  glyph, per-row `size`, `width`/`height`.
- **Renaming variant option values keeps instances mapped.** Figma tracks
  instances by the underlying component node, so renaming a variant value (e.g.
  `state=active` → `state=default`, or killing an `intent="-"` option by renaming
  it to `neutral`) automatically remaps existing instances. Verify after, but no
  orphaning. When you add variants outside the set's current bounds (a new state
  row), **resize the component-set frame** to contain them or they render clipped.
- **Always make changes at the base-component level** so all instances inherit.

---

## 7. Code the component

Create `src/components/{Name}/` with `{Name}.tsx`, `{Name}.stories.tsx`,
`index.ts`. Follow Button:

- **`Pressable`** for interactives. `pressed` via render prop.
- **Hover** via `onHoverIn`/`onHoverOut` + `useState`. **Focus** via
  `onFocus`/`onBlur` + `useState`.
- **State priority `disabled > pressed > hovered > default`** (Tab resolves
  `disabled → selected → hovered → default` for its label/indicator fg).
- **Compound components** (Tabs/Tab) share selection through React context: the
  parent owns `value`/`onValueChange`/`intent`/`size`; the child derives
  `selected` from context and throws if rendered outside the parent.
- **Tokens:** spacing from `useTheme().components.{name}[size]`; colours from
  `useTheme().colors[intent][prominence][state]` (a selected tab reads
  `.default.default.fg`) and `scheme.*` for non-intent (track, muted/primary
  text, disabled); typography from the `<Text>` scales; icon sizes from
  `iconSize`/host tokens; `controlTokens.borderWidth`.
- **Accessibility:** `accessibilityRole` (`tablist` on the list, `tab` on each
  tab, `progressbar`, `header`, …), `accessibilityState`
  (`disabled`/`selected`/`busy`), label fallback to text.
- **Header doc comment** mapping the component to its Figma node + variant→prop
  table.

### Stories (required)

`{Name}.stories.tsx`: a **Playground** (`argTypes` for every prop), **variant
showcases**, a **density comparison** (each density via `ThemeProvider`), and a
**full matrix**. Chromatic snapshots every story.

### Verify the component live in Storybook (the live-example gate)

1. `npm run storybook`.
2. Open **Components/{Name}**.
3. Confirm: Playground drives every prop; variant/size showcases render the full
   matrix; density comparison differs only in spacing; animated/interactive
   states actually respond; nothing clipped/mis-coloured in light mode.
4. Fix anything off **at the token or component source**, not with a per-story
   patch.

### Export

`src/index.ts`: `export { {Name}, type {Name}Props, … } from './components/{Name}';`
(compound components export both: `Tabs, Tab, type TabsProps, type TabProps, …`).

---

## 8. Design ↔ code association (naming/descriptions first; Code Connect optional)

The goal: an MCP design inspection (`get_design_context`) on a Cast UI node yields
the **real** Cast UI component (`<Tabs intent=… size=… />`), not generic markup.
Two layers get you there. The first is mandatory, the second a plan-gated upgrade.

### 8.1 The association is primarily the architectural mirror (always do this)

The Figma MCP and Code Connect's own auto-suggestion key off the **identity of
names and the text in descriptions**. Because §5 keeps props and Figma properties
1:1, the association is mostly *earned* by building both sides to match:

- **Component name char-for-char**. The Figma set is named exactly as the code
  component (`Tabs`; `_<Tab>` ↔ exported `Tab`). A private sub-component keeps its
  `_<X>` name and maps to the exported code name.
- **Variant property names + values char-for-char**. `intent`/`size`/`state` and
  their options match the code union types exactly. This is what lets the matcher
  line a Figma variant up with a code prop value without a hand-written rule.
- **Descriptions carry the bridge**. Write the component description (and variant
  descriptions where they disambiguate) to state the code path and the property
  mapping, e.g. *"Maps to `src/components/Tabs/Tabs.tsx` (`Tab`). intent→intent,
  size→size, state=selected→selected tab, state=disabled→disabled, state=hover→
  runtime onHoverIn (not a prop), text→children, leadingIcon slot→leadingIcon."*
  The MCP reads these. They are how the agent (and Figma's suggestion engine)
  infers the right component when no published Code Connect record exists.

#### The Figma description template

Because the description text *is* the association on this plan, give every
component set (and its sub-component) a structured description. Write it to the
node's **`descriptionMarkdown`** (not plain `description`) so the formatting
renders in Figma.

Order the sections for the reader who opens it most, the designer, first:

1. **Overview** (plain language, no jargon): what the component is and what a
   designer keeps in sync. Where colour and states live, which part to edit to
   change a look, what a slot holds.
2. **Do's and Don'ts**: a short bulleted list. Lead each line with ✅ or ❌.
3. **Useful links**: the component in Storybook and the source file on GitHub,
   as markdown links.
4. **MCP context** (for the agent/dev): the code path, the prop list, and how
   each variant/property maps to a code prop. Flag any seam where a Figma variant
   is a *runtime* behaviour in code, not a prop. Technical only where needed.

Figma `descriptionMarkdown` supports **bold**, *italic*, links, and bulleted
lists only. No headings and no inline code, so use **bold** for section titles
and for component names. Keep every line plain and short (see Writing style).
Mapping arrows (`→`) are fine.

Example. `_<Tab>` (the `<Tabs>` container mirrors it):

```
**Overview**

One tab. All colours and states live here, not on **<Tabs>**.

**Do's and Don'ts**

- ✅ Edit a variant here to change how a state looks (hover, disabled, selected).
- ✅ Set the label text and the leading icon per instance. They are slots.
- ✅ Choose **intent** and **size** on the parent **<Tabs>**, not here.
- ❌ Don't restyle a tab's colour on a **<Tabs>** instance. Fix it here on the base.
- ❌ Don't expect **intent** to colour unselected tabs. Only the selected tab uses it.

**Useful links**

- [Tabs in Storybook](https://<storybook-host>/?path=/docs/components-tabs--docs)
- [Tabs.tsx on GitHub](https://github.com/<org>/cast-ui/blob/main/src/components/Tabs/Tabs.tsx)

**MCP context**

Code: src/components/Tabs/Tabs.tsx, exported as **<Tab>**. Props: value, children,
leadingIcon, disabled. Variant map: intent→intent (selected tab only), size→size,
state=selected→selected (the tab whose value === Tabs.value),
state=disabled→disabled, state=hover→runtime onHoverIn (not a prop). Label
text→children. leadingIcon slot→leadingIcon (Material Symbols name).
```

With the mirror clean and descriptions written, an agent inspecting the node has
everything it needs to emit correct Cast UI code **even without a published Code
Connect mapping**. This is the inferred/heuristic path. Reliable when the mirror
is exact, but not contractual. Keep names + descriptions in lockstep with code
whenever either side changes.

### 8.2 Code Connect. The deterministic upgrade (requires a Developer seat)

Code Connect turns the inferred association into a **published, deterministic**
one: `get_design_context` returns your exact snippet with prop mapping every time.
It is **gated**. The MCP Code Connect tools (`get_code_connect_map`,
`add_code_connect_map`, `send_code_connect_mappings`,
`get_context_for_code_connect`) and the `figma connect publish` CLI all require a
**Developer seat on an Organization or Enterprise plan**. On a Starter/Pro file
they return *"You need a Developer seat in an Organization or Enterprise plan to
access Code Connect."*. That is expected, not a bug; fall back to §8.1.

When a seat is available, two equivalent paths:

1. **MCP path**. `add_code_connect_map` / `send_code_connect_mappings` map the
   node → `src/components/{Name}/{Name}.tsx`, then verify with
   `get_code_connect_map` / `get_context_for_code_connect`.
2. **File path**. Author `src/components/{Name}/{Name}.figma.ts` with
   `@figma/code-connect` (`figma.connect(Component, url, { props, example })`) and
   `figma connect publish`. This artifact can live in the repo and be published
   later, the day the seat exists. (Note: it imports `@figma/code-connect`, so add
   it as a devDependency and keep `*.figma.ts` out of `tsconfig.build.json`'s
   compiled set if the package isn't installed yet.)

### 8.3 Property mapping (the 1:1 both layers express)

```
Figma intent          → prop intent       (neutral|brand|danger)
Figma size            → prop size          (small|default|large)
Figma state=selected  → selected tab       (Tabs.value === Tab.value)
Figma state=disabled  → prop disabled={true}
Figma state=hover     → runtime onHoverIn/onHoverOut  (NOT a code prop)
Figma text layer      → children
Figma icon slot       → leadingIcon         (Material Symbols name)
```

Note the asymmetry naming alone can't encode: a Figma **variant** like
`state=hover` is a *runtime* interaction in code, not a prop. The agent must know
(from the description / this skill) to render it via `onHoverIn`/`onHoverOut`.
Document those seams in the component description so the inference stays correct.

---

## 9. Ship checklist

1. `git checkout -b feature/{component-name}`.
2. Tokens in `design-tokens/` (3 density files) + `src/theme/types.ts` +
   `src/theme/themes.ts` (all densities) + `token-reference.json`.
3. Component built per Button, with full stories; **verified live in Storybook**
   (§7).
4. Exported from `src/index.ts` (+ token types from `src/theme/index.ts`).
5. Type-check: `node_modules/.bin/tsc --project tsconfig.build.json --noEmit`.
6. Build + smoke: `npm run build && node scripts/smoke-test.js`.
7. cast-sync round-trip verified in light + dark (no missing-variable warnings).
8. **Design↔code association in place:** Figma component name + variant values +
   component/variant descriptions mirror the code (§8.1, the mandatory layer);
   Code Connect published + verified **only if** a Developer seat is available
   (§8.2). A blocked Code Connect call on a non-Enterprise plan is expected. The
   §8.1 mirror is the association.
9. **Docs site registry entry** — add the component to
   `site/src/data/registry/` (props, live examples, dos/don'ts, motion role
   if any) and run `npm run smoke` in site/ (renders every page and
   evaluates every example). The cast-ui-docs-site skill covers this.
10. PR → pass the **blocking** Chromatic review → merge.
11. Release: bump `version` in `package.json` (**minor** for a new component) +
    `CHANGELOG.md` section; CI auto-publishes on merge to `main`.

### Environment gotchas
- Use `node_modules/.bin/tsc` directly. `npx tsc` resolves the wrong package.
- npm cache perms: `--cache /tmp/npm-cache-cast-ui`.
- **A fresh sandbox has no `node_modules`**. `npm install --cache
  /tmp/npm-cache-cast-ui --no-audit --no-fund` first.
- **Don't verify the build with a bare `node -e "require('./dist/index.js')"`**.
  Use `node scripts/smoke-test.js` or a static `grep` over `dist/`.
- File deletes/writes in this workspace can be gated. An `EPERM`/`Operation not
  permitted` from the file tools is sandboxing, not a code issue; use the shell
  (bash on the mounted path) to read/edit repo files when the file tools are
  blocked.
- Security: keep `deepMerge`'s prototype-pollution guards; render icon names via
  `<Text>`; type text `children` as `string`; no `eval` /
  `dangerouslySetInnerHTML` / dynamic code.

---

## Appendix A. Figma traversal map

File `JGtlpxLPJMZcwvQ3UZ9ZUl`. Link form:
`https://www.figma.com/design/JGtlpxLPJMZcwvQ3UZ9ZUl/cast-ui-kit?node-id={id-with-dash}`.
Pages: Components `163:892`, `<Icon>` `774:3112`.

| Component | id | Component | id |
|---|---|---|---|
| Button | `168:398` | Chip | `305:2967` |
| Input | `182:21` | Divider | `305:3931` |
| Select | `206:541` | Avatar | `305:4524` |
| Checkbox | `247:2575` | Tooltip | `306:3566` |
| Radio | `250:3322` | Dialog | `306:3327` |
| Toggle | `251:2792` | Popover | `306:3703` |
| Badge | `261:2839` | Skeleton | `306:3805` |
| Alert | `273:2814` | Text | `769:2710` |
| Toast | `277:2958` | Icon (set) | `774:2875` |
| Card | `301:2979` | Tabs | `891:4507` |
| Table | `1330:220` | SpeedDial | `1384:8770` |
| ToggleButtonGroup | `1275:7098` | AppBar | `1371:8169` |
| Menu | `1374:8493` | Autocomplete | `1391:9456` |
| Breadcrumbs | `1344:7484` | Accordion | `972:5116` |
| Drawer | `1366:13544` | CodeBlock | `1360:220` |
| Spinner | `914:52884` | Slider | `1345:7806` |
| Link | `1331:8288` | Backdrop | `1376:7975` |
| BottomSheet | `983:6519` | List | `452:3323` |
| Progress | `877:4491` | | |

Private sub-components: `_<SelectOptions>` `199:92`, `_<SelectGroupLabel>`
`203:99`, `_<SelectTag>` `205:34`, `_<ChoiceLabel>` `244:2530`, `_<ListItem>`
`452:3275`, `_<Tab>` `890:4446`. Deprecated standalone Icon: `182:8` (do not use).

---

## Appendix B. Architectural lessons (gotcha catalogue)

- **Slot content doesn't auto-scale on variant change**. `stretchChildOnInsert=true`
  + glyph group `FILL`.
- **`resetOverrides()` clears colour → `text/primary`**. Re-bind fg after.
- **Fix at the base component, not instances**. Instance edits create overrides.
- **Colour belongs at the source**. Sub-component variants if one exists (Tabs →
  `_<Tab>`), else the component's intent variants. Parent fill overrides = smell.
- **A selection colour is intent-driven, never a frozen copy**. An on / selected /
  checked fill (Toggle on, Radio/Checkbox checked, a selected List/Menu/Select
  option, a selected Table row) resolves from the live intent at render: solid
  fills read `colors.brand.bold.default.bg`, tinted selection surfaces read
  `colors.brand.subtle.hover`/`active` (bg + fg). Never bake a hex copy of the
  brand ramp into a `scheme.*` slice, and in Figma bind the layer to the
  `intent/brand/{bold,subtle}/…` variable, not a `neutral`/`control` token. A
  frozen copy silently stops tracking a brand override (the 1.2.2 selection fix).
- **Content overrides are fine**. Text, slot glyph, per-row size, width/height.
- **Material Symbols have intrinsic padding**. Don't over-shrink control glyphs.
- **The Icon scale (12/16/20/24) is not exhaustive**. Confirm sizes up front.
- **Renaming variant options remaps instances automatically** (Figma tracks the
  underlying node). But adding variant rows outside the set bounds clips them;
  resize the component-set frame.
- **Kill `"-"` sentinels on variant axes**. Use a real placeholder value
  (`neutral`) for an axis that doesn't apply in a given state, and model the
  matrix leanly (§5) rather than enumerating identical cross-products.
- **Bind the colour *channel* that matches the layer**. `bg` for a solid fill,
  `fg` for text + a thin line (selected-tab label/indicator). Same hex in light,
  divergent in dark.
- **Audit overrides** via `instance.overrides[*].overriddenFields`: `fills` /
  `boundVariables` on an icon/label = style (avoid on parents); `componentProperties`
  / `visible` / `width`/`height` = content/structure (expected).
- **Code Connect is plan-gated**. `"You need a Developer seat…"` is expected on
  non-Enterprise plans; the §8.1 naming/description mirror carries the association.

---

## Appendix C. Build history notes

Every component in `src/components/` is built, exported, and tokenised.
Progress and Tabs remain the reference builds; their worked notes encode the
verified conventions (lean variant matrices, `control/{component}` semantics,
primitive `size/N` bindings).

**Progress (code-first reference).** Tokens:
`progress/{small,default,large}/track-height` → `size/{3,5,7}` (4/8/12) and
`progress/border-radius` → `radius/full`, constant across density. Fill reuses
`intent/{intent}/bold/default/bg`; the track is `control/progress/track/bg`,
mirrored as `scheme.progress.track`.

**Tabs (Figma + code mirror reference).** `<Tabs>` (`891:4507`) owns
`value`/`onValueChange`/`intent`/`size` via context; `_<Tab>` (`890:4446`,
exported as `Tab`) carries all colour. Lean matrix: 18 variants, not 36.
`state=hover` is runtime `onHoverIn`, not a prop. Tokens
`tabs/{size}/{gap,padding-x,padding-y}` bind primitive `space/N` (bespoke,
tighter than `control-*`); `indicator-height` → `size/{2,2,3}`;
`tabs/list-gap` → `space/{5,9,11}`.

**Motion-consuming components** (all read roles through `useMotion()`):
Drawer + BottomSheet (`transition/standard` scrim + `spring/overlay` slide),
Backdrop (`transition/standard`), Spinner (`loop/spin`), Skeleton
(`loop/pulse`), Progress (`loop/indeterminate`), SpeedDial
(`transition/enter`/`exit`), Accordion (`transition/expand`).
