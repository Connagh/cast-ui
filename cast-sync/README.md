# cast-sync

A Figma plugin for the **cast-ui-kit** Figma file. It reads the file's
colour variables, text styles, and shadow styles, follows every variable to
its final value, and downloads a `cast-theme.json` theme file that plugs
straight into
[`@castui/cast-ui`](https://www.npmjs.com/package/@castui/cast-ui).

In short: restyle the variables in Figma, run the plugin, and your app's
theme is ready — no hand-typing hex codes.

The plugin shows a live preview of the theme (with colour swatches) and a
single **Download** button. Everything runs locally inside Figma — the
plugin has no network access at all.

## What the theme file looks like

```json
{
  "name": "cast-ui-kit",
  "description": "…",
  "generatedAt": "2026-06-11T12:00:00.000Z",
  "version": 2,
  "colors": {
    "light": {
      "brand": {
        "bold": {
          "default": { "bg": "#2563EB", "fg": "#FFFFFF", "border": "#2563EB" },
          "hover":   { "bg": "#1D4ED8", "fg": "#FFFFFF", "border": "#1D4ED8" },
          "active":  { "bg": "#1E40AF", "fg": "#FFFFFF", "border": "#1E40AF" }
        }
      }
    },
    "dark": { … }
  },
  "text": {
    "light": { "primary": "#374151", "muted": "#6B7280", "description": "#6B7280" },
    "dark":  { "primary": "#E5E7EB", "muted": "#9CA3AF", "description": "#9CA3AF" }
  },
  "typography": {
    "body/md":    { "fontFamily": "Inter", "fontWeight": 400, "fontSize": 14, "lineHeight": 20, "letterSpacing": 0 },
    "heading/lg": { "fontFamily": "Inter", "fontWeight": 600, "fontSize": 36, "lineHeight": 40, "letterSpacing": -0.25 }
  },
  "shadows": {
    "sm": [ { "color": "#0000000D", "offsetX": 0, "offsetY": 1, "blur": 2, "spread": 0 } ],
    "md": [ { "color": "#00000012", "offsetX": 0, "offsetY": 4, "blur": 6, "spread": -1 },
            { "color": "#0000000D", "offsetX": 0, "offsetY": 2, "blur": 4, "spread": -2 } ]
  }
}
```

`colors.light` and `colors.dark` each match the shape of `ThemeProvider`'s
`colors` prop exactly: **intent → prominence → state → { bg, fg, border }**.
That means you can pass them in with no conversion.

The other sections mirror the rest of the kit:

- **`text`** — the standalone text colours (`text/primary`, `text/muted`,
  `text/description`) per colour mode. `text.primary` is what the Cast UI
  `<Text>` component renders by default.
- **`typography`** — one entry per Text Style in the kit (`caption`,
  `label/{sm,md,lg}`, `body/…`, `title/…`, `heading/…`, `display/…`). The
  kit's text styles are bound to the semantic typography variables, so these
  are the resolved variable values.
- **`shadows`** — one entry per `shadow/*` effect style, as an ordered list
  of drop-shadow layers (for the upcoming elevation system).

ThemeProvider currently consumes `colors.*` directly; the `text`,
`typography`, and `shadows` sections are exported ahead of runtime support
so themes captured today keep working as the package's theming surface
widens.

## Using the theme in an app

```tsx
import { ThemeProvider } from '@castui/cast-ui';
import theme from './cast-theme.json';

export function App() {
  return (
    <ThemeProvider colorMode="light" colors={theme.colors.light}>
      {/* your app */}
    </ThemeProvider>
  );
}
```

For dark mode, pass `colorMode="dark"` and `theme.colors.dark` instead.

## Installing and building the plugin

```sh
npm install
npm run build      # compiles code.ts → code.js
npm run watch      # rebuild on save
npm run lint
```

Then, in the Figma **desktop** app: **Plugins → Development → Import plugin
from manifest…** and select this folder's `manifest.json`.

Run the plugin inside the cast-ui-kit file. It also works in any
other Figma file whose variables live in a collection named `semantic` and
follow the `intent/{intent}/{prominence}/{state}/{bg|fg|border}` naming.

## How it works

1. Finds the variable collection named `semantic` in the open file.
2. Picks the light mode (any mode with "light" in its name, or the
   collection's default mode) and, if there is one, the dark mode.
3. For every
   `intent/{neutral|brand|danger}/{default|bold|subtle}/{default|hover|active}/{bg|fg|border}`
   variable, follows any variable-to-variable references until it reaches a
   real colour, once per mode.
4. Writes colours the way cast-ui expects: `#RRGGBB`, `#RRGGBBAA` when
   partially transparent, or the word `transparent` when fully transparent.
5. Sends the result to the plugin window for preview and download. If a
   variable is missing or can't be resolved, it's listed as a warning — the
   export still succeeds.
