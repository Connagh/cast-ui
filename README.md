# Cast UI

A cross-platform component library for React Native. One set of components
that works on iOS, Android, and the web.

Every colour, size, and spacing value in Cast UI comes from design tokens
kept in sync with the
[cast-ui-kit Figma file](https://www.figma.com/design/JGtlpxLPJMZcwvQ3UZ9ZUl/cast-ui-kit),
so what designers see in Figma is what ships in the app. Every component
supports light and dark mode, three spacing densities, and your own brand
colours — all switchable while the app is running, with no rebuild.

Browse every component live in the
[hosted Storybook](https://main--6990f00d7b8682c18d2ed5f3.chromatic.com).

## Installation

```bash
npm install @castui/cast-ui
```

**Peer dependencies:** `react` (>=18) and `react-native` (>=0.72). Nothing
else is installed alongside the package.

```tsx
import { ThemeProvider, Button } from '@castui/cast-ui';

export function App() {
  return (
    <ThemeProvider>
      <Button intent="brand" prominence="bold" onPress={save}>
        Save changes
      </Button>
    </ThemeProvider>
  );
}
```

## Fonts

Cast UI ships no font files. Typography asks for **Inter** and the Icon
component asks for **Material Symbols Outlined** — if a font isn't loaded
there is no error: text quietly falls back to the system font, and icons
render as their literal names ("star" instead of the glyph). Load both once
at app start-up.

**Expo (iOS, Android, and web)** — one `useFonts` call covers all three
platforms:

```tsx
import { useFonts } from 'expo-font';

const [fontsLoaded] = useFonts({
  Inter: require('./assets/Inter.ttf'),
  MaterialSymbolsOutlined: require('./assets/MaterialSymbolsOutlined.ttf'),
});
```

**Plain web** — add the Google Fonts stylesheets to your HTML head:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
```

**Bare React Native** — link the `.ttf` files as font assets
(`react-native.config.js` + `npx react-native-asset`), keeping the family
names `Inter` and `MaterialSymbolsOutlined`.

Download both from Google Fonts:
[Inter](https://fonts.google.com/specimen/Inter) and
[Material Symbols](https://fonts.google.com/icons). The Material Symbols
variable font is ~10 MB — fine for web, where it's served from a CDN and
cached, but worth slimming for production native builds by subsetting it to
the icons you use (e.g. `pyftsubset` from
[fonttools](https://github.com/fonttools/fonttools)).

## Components

| Component | Description |
|-----------|-------------|
| **Alert** | Inline message with neutral, brand, and danger intents, an intent-matched icon, and optional close button |
| **Avatar** | User representation as an image, initials, or icon |
| **Badge** | Compact pill for labels, counts, and status, with optional status dot |
| **Button** | Action button with three intents, three prominences, and icon support |
| **Card** | Content container with optional image, icon, and actions |
| **Checkbox** | Form control with checked, unchecked, and indeterminate states |
| **Chip** | Compact element for filters, selections, and tags |
| **Dialog** | Modal overlay for confirmations, alerts, and focused tasks |
| **Divider** | Horizontal or vertical separator line |
| **Icon** | Material Symbols Outlined icon, rendered via font ligatures |
| **Input** | Single-line text field with label, helper text, and error state |
| **List** | Item list with selection, icons, subheaders, and dividers |
| **Popover** | Anchored floating panel for contextual content |
| **Radio** | Single-choice control, with `RadioGroup` for managing a set |
| **Select** | Dropdown with single, multi (tag pills), and combobox (search) modes |
| **Skeleton** | Loading placeholder in text, circle, and rectangle shapes |
| **Toast** | Brief notification with icon and optional close button |
| **Toggle** | On/off switch with label |
| **Tooltip** | Short hint shown on hover or focus |

Components share a common prop vocabulary, mirrored from the Figma kit:

- `intent` — what it means: `neutral`, `brand`, or `danger`
- `prominence` — how visually heavy it is: `default` (outlined), `bold`
  (filled), or `subtle` (ghost)
- `size` — `small`, `default`, or `large`

## Customising

Wrap your app in `ThemeProvider`. It controls three independent settings:

**Density** — how tight or roomy spacing feels: `compact`, `default`, or
`comfortable`. Changing it scales padding and spacing across every component
at once. Colours and typography never change with density, so your brand
looks the same at any setting.

```tsx
<ThemeProvider density="compact">
```

**Colour mode** — `light` or `dark`. Switches every colour in the library:
buttons, surfaces, text, and form controls.

```tsx
import { useColorScheme } from 'react-native';

const scheme = useColorScheme();
<ThemeProvider colorMode={scheme === 'dark' ? 'dark' : 'light'}>
```

**Colour overrides** — pass a `colors` prop to use your own brand colours.
You only write the colours you want to change; everything else keeps its
default:

```tsx
<ThemeProvider
  colors={{
    brand: {
      bold: {
        default: { bg: '#7C3AED', fg: '#FFFFFF', border: '#7C3AED' },
      },
    },
  }}
>
```

ThemeProviders can be nested — for example, a compact data table inside a
comfortable app. Your own components can read the active theme with the
`useTheme` hook, and all the underlying values (colours, typography scales,
density spacing) are exported for direct use.

The full guide lives in the
[hosted Storybook](https://main--6990f00d7b8682c18d2ed5f3.chromatic.com)
under **Guides → Customisation**.

## Theming from Figma — the cast-sync plugin

[`cast-sync/`](./cast-sync) is a Figma plugin that turns the Figma file's
colour variables into a theme file for this package. Run it inside the Cast
Design System file and it shows a preview, then downloads a
`cast-theme.json` you pass straight to `ThemeProvider`:

```tsx
import theme from './cast-theme.json';

<ThemeProvider colorMode="light" colors={theme.colors.light}>
```

The workflow: recolour the variables in Figma → run the plugin → swap in the
new file. No code changes. Setup instructions are in
[cast-sync/README.md](./cast-sync/README.md).

## How the tokens work

Cast UI's values come from three layers of design tokens:

```
Component tokens     button.default.paddingX = 14      → changes with density
Semantic tokens      intent/brand/bold/default/bg      → changes with colour mode
Primitive tokens     blue/600 = #2563EB                → the raw palette
```

The raw token JSON exported from Figma lives in
[`design-tokens/`](./design-tokens). The library ships a lean TypeScript
version of the same values, so nothing is parsed at runtime.

## Development

Requires Node.js >= 18.

```bash
npm install
npm run storybook    # component workshop at http://localhost:6006
npm run build        # compile to dist/
```

| Script | Description |
|--------|-------------|
| `npm run storybook` | Start Storybook dev server |
| `npm run build-storybook` | Build static Storybook |
| `npm run build` | TypeScript compilation to `dist/` |

## CI/CD

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| Chromatic | Every push | Visual regression testing via Storybook snapshots |
| Adoption Tracking | Push to `main` | Registers package version with Zeroheight |
| Publish to npm | Push to `main` | Builds and publishes to npm (only when the version changes) |

## License

MIT
