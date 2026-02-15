# Cast UI

A cross-platform design system for React Native (iOS, Android, Web) with multi-theme support. Components are built with vanilla React Native primitives and themed via design tokens exported from Figma.

## Architecture

```
Figma Variables (JSON)
        |
   Token Build Script          src/tokens/build.ts
        |
   TypeScript Theme Objects    src/tokens/generated/*.ts
        |
   ThemeProvider               React Context (src/theme/)
        |
   RN Components               Pressable, View, Text (src/components/)
        |
   +-----------+-----------+
   |           |           |
  iOS      Android       Web (via React Native Web)
```

**Token tiers** follow a three-layer alias chain. Changing a value at any tier cascades automatically:

```
Primitive  -->  Semantic  -->  Component

Example:
  Primitive.Colour.Blue-600
    --> Semantic.Colour.Primary
      --> Component.Button.Filled.Background
```

See [`design-tokens/DESIGN-TOKENS-SUMMARY.md`](design-tokens/DESIGN-TOKENS-SUMMARY.md) for the full token reference.

## Project Structure

```
cast-ui/
  src/
    components/
      Button/
        Button.tsx              RN Pressable + Text, theme-aware
        Button.stories.tsx      Storybook stories
    theme/
      types.ts                  CastTheme TypeScript interface
      ThemeProvider.tsx          React Context provider + useTheme hook
      fonts.ts                  Per-theme font family helpers
      index.ts                  Barrel export
    tokens/
      build.ts                  Reads Figma JSON, generates TS theme objects
      generated/                Auto-generated (gitignored)
        white-label.ts
        consumer.ts
        corporate.ts
        luxury.ts
        index.ts
    index.ts                    Public API
  design-tokens/                Source of truth (Figma export)
    White label.tokens.json     Default theme (system-ui, slate neutrals)
    Consumer.tokens.json        Vibrant violet, Poppins
    Corporate.tokens.json       Professional blue, Merriweather + Inter
    Luxury.tokens.json          Dark gold, Playfair Display + Cormorant Garamond
    DESIGN-TOKENS-SUMMARY.md    Complete token reference
  .storybook/
    main.ts                     Webpack config with react-native-web alias
    preview.ts                  Theme switcher toolbar + decorator
    preview-head.html           Google Fonts <link> tags
  .github/workflows/
    chromatic.yml               Visual regression testing on push
    adoption.yml                Zeroheight adoption tracking on push to main
    publish.yml                 Publish to npm on push to main
  dist/                         Build output (gitignored)
  tsconfig.json                 Development TypeScript config
  tsconfig.build.json           Library build config (excludes stories)
```

## Getting Started

### Prerequisites

- Node.js >= 18
- npm

### Install Dependencies

```bash
npm install
```

### Build Tokens

Generates TypeScript theme objects from the Figma JSON files in `design-tokens/`:

```bash
npm run build:tokens
```

This writes to `src/tokens/generated/` (gitignored). Runs automatically before Storybook and library builds.

### Start Storybook

```bash
npm run storybook
```

Opens at `http://localhost:6006`. Use the paintbrush icon in the toolbar to switch between all four themes.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build:tokens` | Generate TypeScript theme files from Figma token JSON |
| `npm run storybook` | Start Storybook dev server (auto-runs `build:tokens`) |
| `npm run build-storybook` | Build static Storybook (auto-runs `build:tokens`) |
| `npm run build` | Full library build: tokens + TypeScript compilation to `dist/` |
| `npm publish` | Publish to npm (auto-runs `build` via `prepublishOnly`) |
| `npm run zh:track-package` | Register/update package info with Zeroheight (runs automatically via CI) |

## Themes

Four themes share the same component API but produce completely different visual identities:

| Theme | Primary Colour | Typography | Border Radius | Character |
|-------|---------------|------------|---------------|-----------|
| **White Label** (default) | Slate-900 | system-ui | Moderate (8px buttons) | Neutral, adaptable |
| **Consumer** | Violet-600 | Poppins | Rounded (24px pill buttons) | Vibrant, friendly |
| **Corporate** | Blue-600 | Merriweather + Inter | Crisp (4px buttons) | Professional, structured |
| **Luxury** | Gold-400 on Black | Playfair Display + Cormorant Garamond | Zero (sharp edges) | Premium, elegant |

When themes switch, **all of the following change simultaneously**: colour palette, font families, border radius, spacing rhythm, elevation, font weight, paragraph spacing, and paragraph indent.

## Theme System

### ThemeProvider

Wrap your app in `CastThemeProvider`. Defaults to White Label:

```tsx
import { CastThemeProvider, consumer } from '@castui/cast-ui';

export default function App() {
  return (
    <CastThemeProvider theme={consumer}>
      {/* components here */}
    </CastThemeProvider>
  );
}
```

### useTheme

Access the current theme inside any component:

```tsx
import { useTheme } from '@castui/cast-ui';

function MyComponent() {
  const theme = useTheme();

  return (
    <View style={{ backgroundColor: theme.semantic.color.surface }}>
      <Text style={{
        color: theme.semantic.color.onSurface,
        fontSize: theme.semantic.fontSize.body,
      }}>
        Themed text
      </Text>
    </View>
  );
}
```

### Theme Object Shape

Every theme conforms to the `CastTheme` interface (see `src/theme/types.ts`):

```
theme.name                          'white-label' | 'consumer' | 'corporate' | 'luxury'
theme.semantic.color.*              30 semantic colours (surface, primary, error, etc.)
theme.semantic.fontFamily.*         brand, interface, data
theme.semantic.fontSize.*           display, h1, h2, h3, body, small, button
theme.semantic.fontWeight.*         heading, body, button
theme.semantic.lineHeight.*         heading, body, uiLabel
theme.semantic.letterSpacing.*      heading, body, label
theme.semantic.paragraphSpacing.*   body, editorial
theme.semantic.paragraphIndent.*    editorial
theme.semantic.borderRadius.*       small, medium, large
theme.component.button.*            All button tokens (padding, colours, variants, states)
```

## Components

### Button

React Native `Pressable` + `Text`. Consumes all tokens from `theme.component.button`.

```tsx
import { Button } from '@castui/cast-ui';

<Button label="Get started" variant="filled" />
<Button label="Learn more" variant="outline" />
<Button label="Cancel" variant="text" disabled />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Button text |
| `variant` | `'filled' \| 'outline' \| 'text'` | `'filled'` | Visual variant |
| `disabled` | `boolean` | `false` | Disabled state |
| `backgroundColor` | `string` | - | Override background colour |

## Font Handling

Components reference font families from the theme tokens. Font **loading** is the consumer's responsibility.

### Web

Load fonts via a `<link>` tag or use the helper:

```ts
import { googleFontsUrl } from '@castui/cast-ui';

const url = googleFontsUrl('luxury');
// "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=Cormorant+Garamond:wght@400;500;700&display=swap"
```

### React Native / Expo

Load fonts with `expo-font` before rendering:

```ts
import { useFonts } from 'expo-font';
import { THEME_FONT_FAMILIES } from '@castui/cast-ui';
// THEME_FONT_FAMILIES.luxury = ['Playfair Display', 'Cormorant Garamond']
```

The **White Label** theme uses `system-ui` (platform default) and requires no font loading.

| Theme | Fonts to Load |
|-------|---------------|
| White Label | None (system default) |
| Consumer | Poppins |
| Corporate | Inter, Merriweather |
| Luxury | Playfair Display, Cormorant Garamond |

## Consumer Installation

```bash
npm install @castui/cast-ui
```

Peer dependencies: `react` (>=18), `react-native` (>=0.72).

```tsx
import {
  CastThemeProvider,
  useTheme,
  Button,
  whiteLabel,
  consumer,
  corporate,
  luxury,
} from '@castui/cast-ui';
```

## Storybook

Storybook runs React Native components in the browser via React Native Web. The webpack config in `.storybook/main.ts` aliases `react-native` to `react-native-web`.

### Theme Switcher

The toolbar provides a paintbrush dropdown to switch between all four themes live. This is configured via `globalTypes` and a decorator in `.storybook/preview.ts` that wraps every story in `CastThemeProvider`.

### Chromatic

Visual regression testing runs on every push via the GitHub Actions workflow at `.github/workflows/chromatic.yml`. Requires a `CHROMATIC_PROJECT_TOKEN` repository secret.

## Token Build Pipeline

The build script (`src/tokens/build.ts`) reads Figma-exported JSON from `design-tokens/` and generates fully-resolved TypeScript theme objects.

**What it does:**

1. Reads each `*.tokens.json` file
2. Recursively resolves all `{Primitive.Colour.Slate-900}` style alias references through the three-tier chain
3. Extracts hex values from Figma's colour object format (`{ colorSpace, components, hex }`)
4. Outputs typed TypeScript files to `src/tokens/generated/`

**When to re-run:** After updating any `design-tokens/*.tokens.json` file. The script runs automatically before Storybook and library builds.

**Adding a new theme:** Add a new `.tokens.json` file to `design-tokens/`, add an entry to the `THEMES` array in `src/tokens/build.ts`, add the theme name to the `ThemeName` union in `src/theme/types.ts`, and update the toolbar items in `.storybook/preview.ts`.

## Adding a New Component

1. Create `src/components/ComponentName/ComponentName.tsx`
2. Import `useTheme` and consume tokens from the theme object
3. Use only React Native primitives (`View`, `Text`, `Pressable`, `ScrollView`, etc.)
4. Create `ComponentName.stories.tsx` alongside the component
5. Export the component and its types from `src/index.ts`
6. If the component needs new design tokens, add them to all four `*.tokens.json` files and update `src/theme/types.ts`

## Adoption Tracking

Design system adoption is measured via [Zeroheight](https://zeroheight.com/). There are two sides to the setup: **this design system repo** and the **consumer app repos** that install it.

### This repo (design system)

The only command relevant here is `track-package`. It registers `@castui/cast-ui` and its current version with Zeroheight so the dashboard knows what the latest release is.

This runs automatically on every push to `main` via the GitHub Actions workflow at `.github/workflows/adoption.yml`. You can also run it locally:

```bash
npm run zh:track-package
```

### Consumer app repos

The adoption CLI is designed to be run **in the repositories that consume this design system**. These are the commands consumers (or their CI pipelines) should run:

| Command | What it measures |
|---------|-----------------|
| `npx @zeroheight/adoption-cli analyze --component-usage` | Which Cast UI components are imported and how their props are used |
| `npx @zeroheight/adoption-cli analyze --color-usage` | Hardcoded color values (`#hex`, `rgb()`, etc.) that should be replaced with theme tokens |
| `npx @zeroheight/adoption-cli monitor-repo` | Which version of `@castui/cast-ui` the consumer app is on |

**How color tracking works:** The `--color-usage` flag scans for *non-token* color values — raw hex, rgb, or hsl strings that a developer hardcoded instead of using `theme.semantic.color.*`. A high count means developers are bypassing the design system; a count trending to zero means strong token adoption. Running this in the design system repo itself correctly returns zero results because components only reference theme tokens, never hardcoded colours.

### Consumer CI example

Consumer teams can automate adoption reporting by adding a workflow to their repos:

```yaml
# .github/workflows/design-system-adoption.yml
name: "Design System Adoption"

on:
  push:
    branches: [main]

jobs:
  adoption:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v6
        with:
          node-version: 20
      - run: npm ci
      - name: Report adoption to Zeroheight
        env:
          ZEROHEIGHT_CLIENT_ID: ${{ secrets.ZEROHEIGHT_CLIENT_ID }}
          ZEROHEIGHT_ACCESS_TOKEN: ${{ secrets.ZEROHEIGHT_ACCESS_TOKEN }}
        run: |
          npx @zeroheight/adoption-cli analyze --component-usage --interactive false -r "${{ github.repository }}"
          npx @zeroheight/adoption-cli analyze --color-usage --interactive false -r "${{ github.repository }}"
          npx @zeroheight/adoption-cli monitor-repo --interactive false
```

### Required secrets

All Zeroheight CLI commands in CI require two repository secrets:

| Secret | Description |
|--------|-------------|
| `ZEROHEIGHT_CLIENT_ID` | OAuth client ID from your Zeroheight account |
| `ZEROHEIGHT_ACCESS_TOKEN` | Access token from your Zeroheight account |

Generate these at **Zeroheight > Account Settings > Access Tokens**.

## npm Publishing

The publish workflow (`.github/workflows/publish.yml`) runs on every push to `main`. It **automatically checks** whether the `version` in `package.json` has changed compared to what's already on npm. If the version is the same, the workflow skips silently — no build, no publish. If the version is new, it builds and publishes.

This means merging a PR to `main` does **not** automatically publish to npm. Only PRs that include a version bump in `package.json` will trigger a release.

**To publish a new version:**

1. Create a feature branch and make your changes
2. Update the `version` field in `package.json` (e.g. `0.1.0` → `0.1.1`)
3. Push the branch and open a PR to `main`
4. Chromatic runs and creates status checks on the PR
5. Review and accept any visual changes in the Chromatic UI
6. Once Chromatic checks pass, merge the PR
7. The publish workflow detects the new version, builds tokens + TypeScript, and publishes to npm

**If you don't bump the version:** The PR merges normally, Chromatic still runs, but the publish step is skipped. Your code is on `main` but no new npm version is created. This is useful for documentation changes, CI updates, or batching multiple changes before a release.

**If Chromatic changes are rejected:** Fix the code on your feature branch, push again. Chromatic re-runs with the new changes. Repeat until the visuals are right, then accept and merge.

**Version numbering guide:**

| Change type | Bump | Example |
|-------------|------|---------|
| Bug fix or minor tweak | Patch | `0.1.0` → `0.1.1` |
| New component or feature | Minor | `0.1.0` → `0.2.0` |
| Breaking API change | Major | `0.1.0` → `1.0.0` |

**Package details:**

- **Entry point:** `dist/index.js` (CJS) with `dist/index.d.ts` type declarations
- **Included files:** `dist/`, `README.md`, `LICENSE`
- **Peer dependencies:** `react` (>=18), `react-native` (>=0.72)
- **License:** MIT

You can still publish manually if needed:

```bash
npm login
npm publish
```

The `prepublishOnly` hook runs the full build automatically.

## Security

This repository uses a **whitelist-based `.gitignore`**. Everything is ignored by default (`*`), and only explicitly allowed paths are tracked. This prevents accidental exposure of secrets, logs, or environment files.

**Never tracked:** `.env`, `.env.*`, `*.log`, `*.local`, `.DS_Store`, `dist/`, `src/tokens/generated/`, `storybook-static/`.

When adding new top-level files or directories, you must add a `!path` entry to `.gitignore` for them to be tracked by git.

## CI/CD

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| Chromatic (`.github/workflows/chromatic.yml`) | Every push | Visual regression testing via Storybook snapshots |
| Adoption Tracking (`.github/workflows/adoption.yml`) | Push to `main` | Registers package version with Zeroheight |
| Publish to npm (`.github/workflows/publish.yml`) | Push to `main` | Builds and publishes package to npm |

**Required secrets:**

| Secret | Used by |
|--------|---------|
| `CHROMATIC_PROJECT_TOKEN` | Chromatic workflow |
| `ZEROHEIGHT_CLIENT_ID` | Adoption Tracking workflow |
| `ZEROHEIGHT_ACCESS_TOKEN` | Adoption Tracking workflow |

The Publish workflow authenticates to npm via **OpenID Connect (OIDC)** using npm's Trusted Publishers feature — no `NPM_TOKEN` secret is needed. The trust relationship is configured at [npmjs.com](https://www.npmjs.com/) under **Package Settings → Trusted Publishers**. The `--provenance` flag attaches a verified build attestation to each published version.

### Branch Protection

Branch protection on `main` ensures that **no code is merged without passing Chromatic visual checks**. This is what prevents unreviewed visual changes from being published to npm.

**To set up (one-time, on GitHub):**

1. Go to **Settings → Branches** in your repository
2. Click **Add branch protection rule**
3. Set **Branch name pattern** to `main`
4. Enable **Require a pull request before merging**
5. Enable **Require status checks to pass before merging**
6. Search for and add **Run Chromatic** (GitHub Actions) and **UI Tests** (any source) as required checks
7. Click **Save changes**

Once enabled, you can no longer push directly to `main`. All changes go through feature branches and PRs, with Chromatic as a mandatory gate.

## Dependencies

### Runtime (peer)

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | >=18 | React core |
| `react-native` | >=0.72 | Cross-platform UI primitives |

### Development only

| Package | Purpose |
|---------|---------|
| `react-native-web` | Renders RN components in browser for Storybook |
| `@storybook/react-webpack5` | Storybook framework |
| `chromatic` | Visual regression testing |
| `style-dictionary` | Installed for future token transforms (current build uses custom script) |
| `ts-node` | Runs the TypeScript token build script |
| `typescript` | Type checking and compilation |

None of the dev dependencies ship to consumers.
