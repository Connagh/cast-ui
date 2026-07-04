# Cast UI — Agent Knowledge Document

## What this project is

Cast UI (`@castui/cast-ui`) is a cross-platform React Native design system component library targeting iOS, Android, and Web (via react-native-web). 37 components, all built. It uses a design token system exported from Figma (3 alias layers plus a motion collection) and supports runtime density, colour, and motion theming. The documentation site in `site/` deploys to GitHub Pages and renders itself with the library.

## Conventions

- **Component references use angle brackets.** Across this codebase and its docs, refer to a component by its name in angle brackets, e.g. `<Spinner>`, `<Button>`, `<Tabs>`. Write a private sub-component with its underscore form, e.g. `_<Tab>`.

## Tech stack

- **Language:** TypeScript 5.9 (strict mode)
- **Core:** React 19, React Native 0.84, react-native-web 0.21
- **Documentation:** Storybook 10 (React Webpack5, `@storybook/addon-docs`)
- **Visual testing:** Chromatic
- **Build:** `tsc` → `dist/` (CommonJS)
- **Icons:** Material Symbols Outlined (font-based, ligature rendering)
- **Fonts:** Inter (body/label), JetBrains Mono (mono), Noto Serif (serif)

## Project structure

```
src/
  tokens/              Shared design tokens (all components use these)
    colors.ts            Intent colour system: intent → prominence → state → {bg, fg, border}
    typography.ts        Platform-aware font families + label/body/heading scales
    motion.ts            Motion tokens: durations/cycles/beziers/springs + transition/feedback/loop roles, resolveMotion()
    breakpoints.ts       Responsive width tiers (sm/md/lg/xl) + resolvers
    icon.ts              Icon size scale
    index.ts
  theme/               Density theming infrastructure
    types.ts             DensityTheme, ComponentTokens, per-component token shapes
    themes.ts            compact/default/comfortable resolved values from Figma JSON
    ThemeContext.tsx      ThemeProvider (density + colour + motion overrides) + useTheme hook
    useMotion.ts          useMotion hook: motion tokens + reduceMotion + scale()
    applyCastTheme.ts     cast-theme.json → ThemeProvider props (colours, scheme, motion)
    index.ts
  components/
    Button/              Reference component — follow this pattern for all new components
      Button.tsx
      Button.stories.tsx
      index.ts
    Dialog/              Modal overlay for confirmations, alerts, and focused tasks
      Dialog.tsx
      Dialog.stories.tsx
      index.ts
    Icon/                Material Symbols Outlined icon via font ligatures
      Icon.tsx
      Icon.stories.tsx
      index.ts
  docs/
    Customisation.mdx    Storybook docs page for end-user customisation guide
  index.ts               Public API barrel export

site/                    Documentation site (Vite + react-native-web + React Router) → GitHub Pages
  src/data/registry/       Component docs registry: 37 entries drive the component pages
  scripts/build-graph.mjs  design-tokens → architecture graph data
  scripts/ssrSmoke.tsx     renders every route + evaluates every live example

skills/                  Agent skills shipped in the npm package
  cast-ui-usage/           Consumer guide: building apps with the library
  cast-ui-component/       Maintainer playbook: extending the library + kit
  cast-ui-docs-site/       Extending the documentation site

cast-sync/               Figma plugin — exports semantic colour variables (and the motion collection, v4) as cast-theme.json
  manifest.json            Plugin manifest (ui: ui.html, networkAccess: none)
  code.ts                  Main thread: reads `semantic` collection, resolves aliases, builds theme
  ui.html                  Plugin UI: JSON preview with colour swatches + download button
  README.md                Theme file format + usage with ThemeProvider

design-tokens/           Figma-exported raw JSON (DTCG format with Figma extensions)
  primitive.tokens.json    298 tokens: colours, space, size, radius, opacity, typography
  semantic.tokens.json     Intent colours, control sizing, typography scales, surfaces
  component/
    component-compact.tokens.json
    component-default.tokens.json
    component-comfortable.tokens.json
  token-reference.json     Navigation map for all tokens (created for agent use)

.storybook/
  main.ts                Webpack config: aliases react-native → react-native-web
  preview.ts             Controls config
  preview-head.html      Loads Material Symbols Outlined + Inter from Google Fonts CDN
```

## Design token system

Three layers, each referencing the one below:

```
Component (31 component token groups × 3 density themes)
    ↓ references
Semantic (intent colours, control sizing, typography scales; light + dark modes)
    ↓ references
Primitive (colour palettes, spacing scale, radius, font specs)

Motion (separate collection: durations, cycles, easing beziers, springs,
        and transition/feedback/loop roles — constant across density and mode)
```

**What changes with density:** Only padding, gap, and spacing tokens (~25%).
**What stays constant:** Colours, border-radius, focus rings, icon sizes, typography.

The raw JSON files in `design-tokens/` are the Figma sync target. The TypeScript modules in `src/tokens/` and `src/theme/themes.ts` are the lean runtime representation. When Figma tokens change, update the TS files to match (or build a script to automate this).

## Component patterns — follow these when building new components

### Props mirror Figma properties
- `intent`: `'neutral' | 'brand' | 'danger'` — drives colour scheme
- `prominence`: `'default' | 'bold' | 'subtle'` — visual weight
- `size`: `'small' | 'default' | 'large'` — controls spacing + typography
- `disabled`: boolean — shared disabled colours across all intents

### Token consumption
- **Colours:** Import `intentColors` from `src/tokens/colors.ts` (static, constant across densities)
- **Spacing:** Read from `useTheme().components.{componentName}.{size}` (varies by density)
- **Typography:** Import `label`/`fontFamily`/`fontWeight` from `src/tokens/typography.ts`
- **Constants:** Import `controlTokens` (borderWidth: 1) from `src/tokens/colors.ts`

### Interaction states
- Use `Pressable` (not TouchableOpacity) — gives access to pressed state via render prop
- Track hover via `onHoverIn`/`onHoverOut` + `useState` (not Pressable's `hovered` — it's not in RN 0.84 types)
- Track focus via `onFocus`/`onBlur` + `useState`
- Focus ring: web-only via CSS outline properties, no native focus ring (standard mobile UX)
- State priority: disabled > pressed > hovered > default

### Icon integration
- Icon props accept `string | ReactNode`
- String = Material Symbols name, rendered as `<Icon>` with auto-matched `fg` colour
- ReactNode = user-supplied custom icon, rendered as-is
- Icon size fixed at 16px for buttons (per Figma spec)

### Accessibility
- Set `accessibilityRole` appropriately
- Fall back `accessibilityLabel` to text content
- Set `accessibilityState={{ disabled }}` when applicable
- Icons use `accessibilityElementsHidden` + `importantForAccessibility="no"`

## Development workflow

Every change follows this pipeline:

### 1. Branch
```
git checkout -b feature/{component-name}
```
Use `feature/` prefix for new components, `fix/` for bug fixes, `chore/` for maintenance.

### 2. Build the change
For a new component, follow the steps in "Adding a new component" below. For edits to existing components, make changes and ensure type-checking passes:
```
node_modules/.bin/tsc --project tsconfig.build.json --noEmit
```

### 3. Push and open PR
```
git push -u origin feature/{component-name}
gh pr create --base main
```

### 4. Chromatic visual review (blocking)
- Chromatic runs automatically on every push (via `chromatic.yml`)
- Visual snapshots are generated from all Storybook stories
- **This is a blocking check** — changes must be accepted in Chromatic before the PR can merge
- Review visual diffs at the Chromatic URL in the PR checks
- Accept or deny changes in the Chromatic UI

### 5. Merge to main
- Once Chromatic changes are accepted, merge the PR to `main`
- Storybook is updated automatically via Chromatic hosting

### 6. npm publish (automatic, version-gated)
- The `publish.yml` workflow runs on every push to `main`
- It compares `package.json` version against the published npm version
- **If the version is the same** → skips (no publish)
- **If the version is new** → builds and publishes to npm with provenance
- To trigger a publish: bump the version in `package.json` and update `CHANGELOG.md`
- Follow semver: patch for fixes, minor for new components, major for breaking changes

### Version bump checklist
1. Update `version` in `package.json`
2. Add a new section to `CHANGELOG.md` following Keep a Changelog format
3. Add the comparison link at the bottom of `CHANGELOG.md`

## Adding a new component

1. **Read the Figma**: Use MCP tools (`get_design_context`, `get_variable_defs`) to inspect the component
2. **Extract token values**: Read the component section from all 3 component JSON files in `design-tokens/component/`
3. **Add theme tokens**: Add the component's type to `src/theme/types.ts` → `ComponentTokens`, add values to `src/theme/themes.ts` for all 3 densities
4. **Build the component**: Create `src/components/{Name}/` following the Button pattern
5. **Write stories**: Include Playground (with argTypes), variant showcases, density comparison, full matrix
6. **Export**: Add to `src/index.ts`
7. **Update token-reference.json**: Add verified values for the new component
8. **Set up MCP Code Connect**: Use `add_code_connect_map` or `send_code_connect_mappings` to map the Figma component to the codebase so future MCP inspections return real Cast UI code

## cast-sync Figma plugin

- Lives in `cast-sync/` (tracked in git; its built `code.js` and `node_modules` are not)
- Exports the UI kit's `semantic` collection (`intent/{intent}/{prominence}/{state}/{bg|fg|border}`,
  modes `semantic-light`/`semantic-dark`) as `cast-theme.json`
- `theme.colors.light` / `theme.colors.dark` match ThemeProvider's `colors` prop shape exactly
- Colour serialisation: `#RRGGBB`, `#RRGGBBAA` for partial alpha, literal `transparent` for alpha 0
- Build: `cd cast-sync && npm install && npm run build` (compiles code.ts → code.js)
- No network access (`networkAccess.allowedDomains: ["none"]`); download happens via Blob in the UI iframe

## Storybook

- Stories excluded from npm build via `tsconfig.build.json`
- MDX imports use `@storybook/addon-docs/blocks` (not `@storybook/blocks` — that's Storybook 8)
- `preview-head.html` loads Google Fonts for web rendering
- Storybook telemetry is disabled everywhere
- Run: `npm run storybook` (port 6006)
- Build: `npm run build-storybook`

## npm publishing

- `files` field restricts package to `dist/`, `README.md`, `LICENSE` only
- `prepublishOnly` runs `npm run build` automatically
- Version change detection in CI triggers auto-publish
- Zero runtime dependencies — only peer deps (react, react-native)

## Known environment issues

- npm cache has permission issues on this machine — use `--cache /tmp/npm-cache-cast-ui` as workaround
- `npx tsc` resolves to wrong package — use `node_modules/.bin/tsc` directly

## CI/CD

- **chromatic.yml**: Visual regression on every push
- **publish.yml**: Auto-publish to npm on `main` when version changes

## Security notes

- `deepMerge` in ThemeContext.tsx has prototype pollution guards (`__proto__`, `constructor`, `prototype`)
- Button `children` typed as `string` only (not ReactNode) — prevents injection
- Icon `name` rendered as text content via `<Text>`, not HTML — no injection risk
- No `eval`, `dangerouslySetInnerHTML`, or dynamic code execution anywhere
