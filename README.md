# Cast UI

A cross-platform design system for React Native (iOS, Android, Web) with custom theme support via `createTheme()`. Components are built with vanilla React Native primitives and themed via design tokens exported from Figma.

Ships a **Default base theme** that uses system fonts and neutral styling — ready for you to customise with your brand.

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

## Examples

For live examples showing Cast UI components with custom themes (Consumer, Corporate, Luxury), see the companion repo:

**[Connagh/cast-ui-examples](https://github.com/Connagh/cast-ui-examples)** — includes an Expo Snack demo showing `createTheme()` with custom themes running cross-platform (iOS, Android, Web).

## Project Structure

```
cast-ui/
  src/
    components/
      Button/
        Button.tsx              RN Pressable + Text, theme-aware
        Button.stories.tsx      Storybook stories
      Card/
        Card.tsx                RN View + Text, theme-aware
        Card.stories.tsx        Storybook stories
    theme/
      types.ts                  CastTheme TypeScript interface
      createTheme.ts            Deep-merge utility for custom themes
      ThemeProvider.tsx          React Context provider + useTheme hook
      fonts.ts                  Dynamic font family helpers
      index.ts                  Barrel export
    tokens/
      build.ts                  Reads Figma JSON, generates TS theme objects
      generated/                Auto-generated (gitignored)
        default.ts
        default.reference.json  Copy-paste starting point for custom themes
        index.ts
    index.ts                    Public API
  design-tokens/                Source of truth (Figma export)
    Default.tokens.json         Default theme (system-ui, slate neutrals)
    DESIGN-TOKENS-SUMMARY.md    Complete token reference
  .storybook/
    main.ts                     Webpack config with react-native-web alias
    preview.ts                  Decorator wrapping stories in default theme
    preview-head.html           (empty — default theme uses system fonts)
  .github/workflows/
    chromatic.yml               Visual regression testing on push
    adoption.yml                Zeroheight adoption tracking on push to main
    publish.yml                 Publish to npm on push to main
  dist/                         Build output (gitignored)
    default.reference.json      Shipped in package for consumers
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

Generates the TypeScript theme object and reference JSON from the Figma token file in `design-tokens/`:

```bash
npm run build:tokens
```

This writes to `src/tokens/generated/` (gitignored). Runs automatically before Storybook and library builds.

### Start Storybook

```bash
npm run storybook
```

Opens at `http://localhost:6006` showing components in the Default theme.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build:tokens` | Generate TypeScript theme files from Figma token JSON |
| `npm run storybook` | Start Storybook dev server (auto-runs `build:tokens`) |
| `npm run build-storybook` | Build static Storybook (auto-runs `build:tokens`) |
| `npm run build` | Full library build: tokens + TypeScript compilation + reference JSON to `dist/` |
| `npm publish` | Publish to npm (auto-runs `build` via `prepublishOnly`) |
| `npm run zh:track-package` | Register/update package info with Zeroheight (runs automatically via CI) |

## Creating a Custom Theme

Cast UI ships a **Default base theme** that uses system fonts, slate neutrals, and moderate border radii. Create your own branded theme in three steps:

### 1. Copy the reference JSON

The package includes `default.reference.json` — a complete snapshot of all theme values. Copy it into your project as a starting point:

```bash
cp node_modules/@castui/cast-ui/dist/default.reference.json ./my-brand-theme.json
```

### 2. Modify desired values

Edit `my-brand-theme.json` to change only the values you want. You only need to include the properties you're overriding — everything else inherits from the Default theme:

```json
{
  "name": "my-brand",
  "semantic": {
    "colour": {
      "primary": "#553C9A",
      "onPrimary": "#FFFFFF",
      "primaryHover": "#6B46C1",
      "primaryPressed": "#44337A"
    },
    "fontFamily": {
      "brand": "Poppins",
      "interface": "Poppins"
    },
    "borderRadius": {
      "small": 12,
      "medium": 16,
      "large": 24
    }
  }
}
```

### 3. Create the theme and provide it

```tsx
import { CastThemeProvider, createTheme, googleFontsUrl } from '@castui/cast-ui';
import overrides from './my-brand-theme.json';

const myTheme = createTheme(overrides);

// Load any custom fonts (web)
const fontUrl = googleFontsUrl(myTheme);
if (fontUrl) {
  const link = document.createElement('link');
  link.href = fontUrl;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

export default function App() {
  return (
    <CastThemeProvider theme={myTheme}>
      {/* your app */}
    </CastThemeProvider>
  );
}
```

`createTheme()` deep-merges your partial overrides with the Default theme, producing a complete `CastTheme` object. You can also pass a second argument to merge against a different base: `createTheme(overrides, otherBaseTheme)`.

## Theme System

### ThemeProvider

Wrap your app in `CastThemeProvider`. Defaults to the Default base theme:

```tsx
import { CastThemeProvider, defaultTheme, createTheme } from '@castui/cast-ui';

// Use the default theme as-is...
<CastThemeProvider theme={defaultTheme}>
  <App />
</CastThemeProvider>

// ...or create a custom theme
const myTheme = createTheme({ name: 'my-brand', semantic: { colour: { primary: '#FF0000' } } });
<CastThemeProvider theme={myTheme}>
  <App />
</CastThemeProvider>
```

### useTheme

Access the current theme inside any component:

```tsx
import { useTheme } from '@castui/cast-ui';

function MyComponent() {
  const theme = useTheme();

  return (
    <View style={{ backgroundColor: theme.semantic.colour.surface }}>
      <Text style={{
        color: theme.semantic.colour.onSurface,
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
theme.name                          string (e.g. 'default', 'my-brand')
theme.semantic.colour.*              30 semantic colours (surface, primary, error, etc.)
theme.semantic.fontFamily.*         brand, interface, data
theme.semantic.fontSize.*           display, h1, h2, h3, body, small, button
theme.semantic.fontWeight.*         heading, body, button
theme.semantic.lineHeight.*         display, h1, h2, h3, body, small, button (px)
theme.semantic.letterSpacing.*      heading, body, label
theme.semantic.paragraphSpacing.*   body, editorial
theme.semantic.paragraphIndent.*    editorial
theme.semantic.borderRadius.*       small, medium, large
theme.component.button.*            All button tokens (padding, colours, variants, states)
theme.component.card.*              All card tokens (padding, colours, typography, elevation)
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

### Card

React Native `View` + `Text`. Consumes tokens from `theme.component.card` and `theme.semantic`.

```tsx
import { Card, Button } from '@castui/cast-ui';

<Card
  title="Title"
  subtitle="Subtitle"
  body="Body"
  actions={
    <>
      <Button label="Action 1" variant="filled" />
      <Button label="Action 2" variant="outline" />
    </>
  }
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Card heading text |
| `subtitle` | `string` | - | Optional subtitle below the title |
| `body` | `string` | - | Optional body text |
| `actions` | `React.ReactNode` | - | Optional actions row (e.g. Button components) |

## Font Handling

Components reference font families from the theme tokens. Font **loading** is the consumer's responsibility.

### Web

Use `googleFontsUrl()` to generate a Google Fonts `<link>` href for any theme:

```ts
import { googleFontsUrl } from '@castui/cast-ui';

const url = googleFontsUrl(myTheme);
// Returns null for themes using only system-ui, or a Google Fonts URL for custom fonts
```

### Discovering theme fonts

Use `getThemeFontFamilies()` to dynamically extract all custom font families from any theme:

```ts
import { getThemeFontFamilies } from '@castui/cast-ui';

const families = getThemeFontFamilies(myTheme);
// → ['Poppins'] or ['Inter', 'Merriweather'] etc.
// → [] for the Default theme (system-ui only)
```

### React Native / Expo

Load fonts with `expo-font` before rendering. On **Android**, each weight must
be registered under a distinct name (the Expo Google Fonts convention) because
Android cannot combine a generic `fontFamily` with a numeric `fontWeight` for
custom fonts.

```ts
import { useFonts } from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

const [loaded] = useFonts({
  Poppins: Poppins_400Regular,           // weight 400 → bare name
  Poppins_500Medium: Poppins_500Medium,  // weight 500
  Poppins_700Bold: Poppins_700Bold,      // weight 700
});
```

The naming convention is:

| Weight | Registration Key |
|--------|-----------------|
| 400 | `"FontName"` |
| 500 | `"FontName_500Medium"` |
| 700 | `"FontName_700Bold"` |

Components use `resolveFont()` internally so the correct font name is selected
automatically on each platform:

- **iOS / Web** — `{ fontFamily, fontWeight }` passed through unchanged.
- **Android** — maps to the weight-specific registered name (e.g. `"Poppins_700Bold"`) and sets `fontWeight: 'normal'`.
- **system-ui** — omits `fontFamily` (platform default) on all platforms.

The **Default** theme uses `system-ui` (platform default) and requires no font loading.

> **Custom Themes:** The convention works for any font — register each weight
> under `FontName`, `FontName_500Medium`, and `FontName_700Bold` and
> `resolveFont()` will handle the rest. The `ANDROID_WEIGHT_SUFFIX` map is
> exported if you need to build registration keys programmatically.

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
  Card,
  defaultTheme,
  createTheme,
  googleFontsUrl,
  getThemeFontFamilies,
  resolveFont,
  ANDROID_WEIGHT_SUFFIX,
} from '@castui/cast-ui';

import type { CastTheme, DeepPartial } from '@castui/cast-ui';
```

## Storybook

Storybook runs React Native components in the browser via React Native Web. The webpack config in `.storybook/main.ts` aliases `react-native` to `react-native-web`.

The built-in Storybook shows components in the **Default theme**. For a cross-platform demo with custom themes, see the [Expo Snack](https://github.com/Connagh/cast-ui-examples/tree/main/expo-snack) in the examples repo.

### Chromatic

Visual regression testing runs on every push via the GitHub Actions workflow at `.github/workflows/chromatic.yml`. Requires a `CHROMATIC_PROJECT_TOKEN` repository secret.

## Token Build Pipeline

The build script (`src/tokens/build.ts`) reads the Figma-exported JSON from `design-tokens/` and generates a fully-resolved TypeScript theme object plus a reference JSON.

**What it does:**

1. Reads `Default.tokens.json`
2. Recursively resolves all `{Primitive.Colour.Slate-900}` style alias references through the three-tier chain
3. Extracts hex values from Figma's colour object format (`{ colorSpace, components, hex }`)
4. Outputs `default.ts` (typed theme object) and `default.reference.json` (copy-paste starting point) to `src/tokens/generated/`

**When to re-run:** After updating `design-tokens/Default.tokens.json`. The script runs automatically before Storybook and library builds.

**Creating a custom theme:** Copy `default.reference.json` from the published package, modify the values you want, and pass the overrides to `createTheme()`. See [Creating a Custom Theme](#creating-a-custom-theme) above.

## Adding a New Component

1. Create `src/components/ComponentName/ComponentName.tsx`
2. Import `useTheme` and consume tokens from the theme object
3. Use only React Native primitives (`View`, `Text`, `Pressable`, `ScrollView`, etc.)
4. Create `ComponentName.stories.tsx` alongside the component
5. Export the component and its types from `src/index.ts`
6. If the component needs new design tokens, add them to `Default.tokens.json` and update `src/theme/types.ts`

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

**How color tracking works:** The `--color-usage` flag scans for *non-token* color values — raw hex, rgb, or hsl strings that a developer hardcoded instead of using `theme.semantic.colour.*`. A high count means developers are bypassing the design system; a count trending to zero means strong token adoption. Running this in the design system repo itself correctly returns zero results because components only reference theme tokens, never hardcoded colours.

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
2. Update the `version` field in `package.json` (e.g. `0.3.0` → `0.4.0`)
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
| Bug fix or minor tweak | Patch | `0.3.0` → `0.3.1` |
| New component or feature | Minor | `0.3.0` → `0.4.0` |
| Breaking API change | Major | `0.9.0` → `1.0.0` |

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
