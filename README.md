<p align="center">
  <img src="https://raw.githubusercontent.com/Connagh/cast-ui/main/logo.png" alt="Cast UI" width="300" />
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@castui/cast-ui"><img src="https://img.shields.io/npm/v/@castui/cast-ui.svg" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@castui/cast-ui"><img src="https://img.shields.io/npm/dm/@castui/cast-ui.svg" alt="npm downloads" /></a>
  <a href="https://github.com/Connagh/cast-ui/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@castui/cast-ui.svg" alt="license" /></a>
</p>

A cross-platform component library for React Native. One set of components
that works on iOS, Android, and the web.

Every colour, size, and spacing value in Cast UI comes from design tokens
kept in sync with the
[cast-ui-kit Figma file](https://www.figma.com/design/JGtlpxLPJMZcwvQ3UZ9ZUl/cast-ui-kit),
so what designers see in Figma is what ships in the app. Every component
supports light and dark mode, three spacing densities, and your own brand
colours. You can switch any of these while the app runs, with no rebuild.

The documentation site has live examples, patterns, templates, themes, and
motion, and shows how it all fits together:
**https://connagh.github.io/cast-ui/**

Browse every component live in the
[hosted Storybook](https://main--6990f00d7b8682c18d2ed5f3.chromatic.com),
or grab the open source
[Figma kit](https://www.figma.com/community/file/1648821010844688421/cast-ui-kit-for-react-native).

Motion is part of the token system too. Durations, easing curves, and springs
live in the kit's `motion` variable collection, ship as `theme.motion`, honour
the OS reduce-motion setting, and can be retimed at runtime like any colour.

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

Cast UI ships no font files. Typography asks for **Geist** and the Icon
component asks for **Material Symbols Outlined**. If a font isn't loaded there
is no error: text falls back to the system font, and icons render as their
literal names ("star" instead of the glyph). Load both once at app start-up.

**Expo (iOS, Android, and web).** One `useFonts` call covers all three
platforms:

```tsx
import { useFonts } from 'expo-font';

const [fontsLoaded] = useFonts({
  Geist: require('./assets/Geist.ttf'),
  MaterialSymbolsOutlined: require('./assets/MaterialSymbolsOutlined.ttf'),
});
```

**Plain web.** Add the Google Fonts stylesheets to your HTML head:

```html
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
```

**Bare React Native.** Link the `.ttf` files as font assets
(`react-native.config.js` + `npx react-native-asset`), keeping the family
names `Geist` and `MaterialSymbolsOutlined`.

Download both from Google Fonts:
[Geist](https://fonts.google.com/specimen/Geist) and
[Material Symbols](https://fonts.google.com/icons). The Material Symbols
variable font is about 10 MB. That's fine for web, where a CDN serves and
caches it. For production native builds, slim it down by subsetting it to the
icons you use (for example `pyftsubset` from
[fonttools](https://github.com/fonttools/fonttools)).

## Components

| Component | Description |
|-----------|-------------|
| **Accordion** | Stack of expandable sections, in a flush or divided style |
| **Alert** | Inline message with neutral, brand, and danger intents, an intent-matched icon, and optional close button |
| **AppBar** | Top bar with a leading control, a title, and trailing actions |
| **Autocomplete** | Text field that filters a list of options as you type |
| **Avatar** | User representation as an image, initials, or icon |
| **Backdrop** | Full-screen scrim that dims everything behind it |
| **Badge** | Compact pill for labels, counts, and status, with optional status dot |
| **BottomSheet** | Modal surface that slides up from the bottom edge |
| **Breadcrumbs** | Trail showing where the user is in a hierarchy |
| **Button** | Action button with three intents, three prominences, and icon support |
| **Card** | Content container with optional image, icon, and actions |
| **Checkbox** | Form control with checked, unchecked, and indeterminate states |
| **Chip** | Compact element for filters, selections, and tags |
| **CodeBlock** | Block of monospaced code on a subtle surface |
| **Dialog** | Modal overlay for confirmations, alerts, and focused tasks |
| **Divider** | Horizontal or vertical separator line |
| **Drawer** | Panel that slides in from an edge of the screen |
| **Icon** | Material Symbols Outlined icon, rendered via font ligatures |
| **Input** | Single-line text field with label, helper text, and error state |
| **Link** | Inline or standalone text link |
| **List** | Item list with selection, icons, subheaders, and dividers |
| **Menu** | Transient overlay of actions, anchored to a trigger |
| **Popover** | Anchored floating panel for contextual content |
| **Progress** | Linear progress bar, determinate or indeterminate |
| **Radio** | Single-choice control, with `RadioGroup` for managing a set |
| **Select** | Dropdown with single, multi (tag pills), and combobox (search) modes |
| **Skeleton** | Loading placeholder in text, circle, and rectangle shapes |
| **Slider** | Drag a thumb along a track to pick a number |
| **SpeedDial** | Floating action button that expands into a set of actions |
| **Spinner** | Indeterminate circular loading indicator |
| **Table** | Rows and columns of data, built as compound parts |
| **Tabs** | Underline-style tab bar for switching between views |
| **Text** | Typographic primitive rendering the full type ramp, from caption to display |
| **Toast** | Brief notification with icon and optional close button |
| **Toggle** | On/off switch with label |
| **ToggleButtonGroup** | Segmented row of buttons for picking one or more values |
| **Tooltip** | Short hint shown on hover or focus |

Components share a common prop vocabulary, mirrored from the Figma kit:

- `intent` sets what it means: `neutral`, `brand`, or `danger`
- `prominence` sets how visually heavy it is: `default` (outlined), `bold`
  (filled), or `subtle` (ghost)
- `size` is `small`, `default`, or `large`

## Customising

Wrap your app in `ThemeProvider`. It controls three independent settings.

**Density.** How tight or roomy spacing feels: `compact`, `default`, or
`comfortable`. Changing it scales padding and spacing across every component
at once. Colours and typography never change with density, so your brand
looks the same at any setting.

```tsx
<ThemeProvider density="compact">
```

**Colour mode.** `light` or `dark`. Switches every colour in the library:
buttons, surfaces, text, and form controls.

```tsx
import { useColorScheme } from 'react-native';

const scheme = useColorScheme();
<ThemeProvider colorMode={scheme === 'dark' ? 'dark' : 'light'}>
```

**Colour overrides.** Pass a `colors` prop to use your own brand colours. You
only write the colours you want to change, and everything else keeps its
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

You can nest ThemeProviders, for example a compact data table inside a
comfortable app. Your own components can read the active theme with the
`useTheme` hook, and all the underlying values (colours, typography scales,
density spacing) are exported for direct use.

The full guide lives in the
[hosted Storybook](https://main--6990f00d7b8682c18d2ed5f3.chromatic.com)
under **Guides > Customisation**.

## Responsive layout

Cast UI ships a set of breakpoints and hooks for building layouts that adapt
across phones, tablets, and desktops. The values follow the Material 3 window
size classes, so the same numbers hold up across watches, phones, foldables,
tablets, and large screens.

| Tier | Range (dp) | Typical devices |
|------|-----------|-----------------|
| `base` | `< 600` | Watches and every phone in portrait. Your default layout. |
| `sm` | `>= 600` | Large phones in landscape, foldables unfolded, small tablets |
| `md` | `>= 840` | Tablets |
| `lg` | `>= 1200` | Laptops and desktops |
| `xl` | `>= 1600` | Large desktops and TVs |

The hooks read the live window width, so they update on resize, rotation, and
foldables, and they behave the same on the web. The most common one picks a
value per tier:

```tsx
import { useResponsiveValue, useBreakpoint, useMinWidth } from '@castui/cast-ui';

function Gallery() {
  const columns = useResponsiveValue({ base: 1, md: 2, xl: 4 });
  // 1 column on phones, 2 on tablets, 4 on large desktops
  ...
}
```

`useResponsiveValue` is mobile-first: a tier with no value falls back to the
nearest one below it, so `{ base: 1, md: 2 }` gives 1 up to `md` and 2 from
`md` on. The other two hooks cover the rest:

```tsx
const tier = useBreakpoint();     // 'base' | 'sm' | 'md' | 'lg' | 'xl'
const isWide = useMinWidth('lg'); // true from 1200dp up
```

The raw thresholds are also exported as `breakpoints` if you need a number
directly.

A few things to know. React Native has no CSS media queries, so a breakpoint
here is a width threshold you compare against, not automatic restyling. `base`
is the mobile-first default: you write the phone layout with no breakpoint,
then add overrides for larger screens. The gap between a small and a large
phone is better handled with flexible layout (flex, percentages, `maxWidth`)
than with a breakpoint.

Breakpoints are a fixed foundation, which sets them apart from the rest of the
theme. They are not part of `ThemeProvider`: they do not change with density,
they are not touched by brand colour overrides, and they are not carried in
`cast-theme.json`. The scale stays identical in every app, so layouts stay
predictable. The same values live as the `breakpoint/*` primitive variables in
the [cast-ui-kit Figma file](https://www.figma.com/design/JGtlpxLPJMZcwvQ3UZ9ZUl/cast-ui-kit).

## Theming from Figma with the cast-sync plugin

[`cast-sync/`](./cast-sync) is a Figma plugin that turns the Figma file's
colour variables into a theme file for this package. Run it inside the Cast
Design System file and it shows a preview, then downloads a
`cast-theme.json` you pass straight to `ThemeProvider`:

```tsx
import theme from './cast-theme.json';

<ThemeProvider colorMode="light" colors={theme.colors.light}>
```

The workflow: recolour the variables in Figma, run the plugin, then swap in
the new file. No code changes. Setup instructions are in
[cast-sync/README.md](./cast-sync/README.md).

## How the tokens work

Cast UI's values come from three layers of design tokens:

```
Component tokens     button.default.paddingX = 14      changes with density
Semantic tokens      intent/brand/bold/default/bg      changes with colour mode
Primitive tokens     blue/600 = #2563EB                the raw palette
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

### Documentation site

```bash
cd site
npm install
npm run dev     # local dev server
npm run smoke   # render every route + evaluate every live example
```

The site aliases `@castui/cast-ui` to `../src`, so it always documents the
code in your working tree.

## CI/CD

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| Chromatic | Every push | Visual regression testing via Storybook snapshots |
| Publish to npm | Push to `main` | Builds and publishes to npm (only when the version changes) |

## License

MIT
