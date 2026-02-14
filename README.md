# Atlas Design System

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
atlas-design-system/
  src/
    components/
      Button/
        Button.tsx              RN Pressable + Text, theme-aware
        Button.stories.tsx      Storybook stories
    theme/
      types.ts                  AtlasTheme TypeScript interface
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

Wrap your app in `AtlasThemeProvider`. Defaults to White Label:

```tsx
import { AtlasThemeProvider, consumer } from 'atlas-design-system';

export default function App() {
  return (
    <AtlasThemeProvider theme={consumer}>
      {/* components here */}
    </AtlasThemeProvider>
  );
}
```

### useTheme

Access the current theme inside any component:

```tsx
import { useTheme } from 'atlas-design-system';

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

Every theme conforms to the `AtlasTheme` interface (see `src/theme/types.ts`):

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
import { Button } from 'atlas-design-system';

<Button label="Get started" variant="filled" size="medium" />
<Button label="Learn more" variant="outline" size="small" />
<Button label="Cancel" variant="text" disabled />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Button text |
| `variant` | `'filled' \| 'outline' \| 'text'` | `'filled'` | Visual variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Scales padding and font |
| `disabled` | `boolean` | `false` | Disabled state |
| `backgroundColor` | `string` | - | Override background colour |

## Font Handling

Components reference font families from the theme tokens. Font **loading** is the consumer's responsibility.

### Web

Load fonts via a `<link>` tag or use the helper:

```ts
import { googleFontsUrl } from 'atlas-design-system';

const url = googleFontsUrl('luxury');
// "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700&family=Cormorant+Garamond:wght@400;500;700&display=swap"
```

### React Native / Expo

Load fonts with `expo-font` before rendering:

```ts
import { useFonts } from 'expo-font';
import { THEME_FONT_FAMILIES } from 'atlas-design-system';
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
npm install atlas-design-system
```

Peer dependencies: `react` (>=18), `react-native` (>=0.72).

```tsx
import {
  AtlasThemeProvider,
  useTheme,
  Button,
  whiteLabel,
  consumer,
  corporate,
  luxury,
} from 'atlas-design-system';
```

## Storybook

Storybook runs React Native components in the browser via React Native Web. The webpack config in `.storybook/main.ts` aliases `react-native` to `react-native-web`.

### Theme Switcher

The toolbar provides a paintbrush dropdown to switch between all four themes live. This is configured via `globalTypes` and a decorator in `.storybook/preview.ts` that wraps every story in `AtlasThemeProvider`.

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

## npm Publishing

The package is configured for public npm publishing:

- **Entry point:** `dist/index.js` (CJS) with `dist/index.d.ts` type declarations
- **Included files:** `dist/`, `README.md`, `LICENSE`
- **Peer dependencies:** `react` (>=18), `react-native` (>=0.72)
- **License:** MIT

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

**Required secrets:** `CHROMATIC_PROJECT_TOKEN` (repository secret).

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
