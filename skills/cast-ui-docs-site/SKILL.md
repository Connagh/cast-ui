---
name: cast-ui-docs-site
description: >-
  How the Cast UI documentation site (site/, deployed to GitHub Pages at
  connagh.github.io/cast-ui) is built and how to extend it. Use whenever
  adding or editing a component's documentation page, registry entry, live
  example, pattern, template, theme preset, motion demo, or docs guide;
  wiring a new component into the site after building it; changing the site
  shell, navigation, or the architecture graph; or debugging why the Pages
  deploy or the SSR smoke test fails. The site renders every page with
  @castui/cast-ui itself through react-native-web, so this also covers the
  conventions that keep the site a credible showcase of the library.
---

# The Cast UI docs site

The site lives in `site/` and deploys to GitHub Pages on every push to main
that touches `site/`, `src/`, or `design-tokens/` (`.github/workflows/pages.yml`).
It is a Vite + react-native-web single-page app. React Router drives real
URLs; `public/404.html` plus a restore script in `index.html` make deep links
work on Pages.

**The one big idea: the site consumes the library from source.**
`vite.config.ts` aliases `@castui/cast-ui` to `../src/index.ts`, so the site
always documents the code on the branch it was built from. There is no npm
version skew and no publish race. The install instructions shown to visitors
still say `npm install @castui/cast-ui`.

**The second big idea: the chrome is the demo.** The top bar, menus, footer,
tables, and code blocks are Cast UI components. The global theme controls
(colour mode, density, brand) restyle the whole site because everything sits
under one ThemeProvider (`src/theme/SiteTheme.tsx`). Before reaching for a
raw View with styles, check whether a library component can carry the job.

## Map

```
site/src/
  App.tsx                     routes (lazy-loaded) + shell
  theme/SiteTheme.tsx         global colour mode / density / brand presets
  shell/TopNav.tsx, Footer.tsx
  ui/                         Page, Section, LiveDemo, CodeSnippet,
                              PropsTable, snack.ts (Expo Snack hand-off),
                              scope.ts (everything live examples can use)
  data/registry/              THE component registry (one file per category)
  data/graph.json             generated — do not edit by hand
  pages/                      Landing, docs/, components/, patterns/,
                              templates/, themes/, motion/, playground/,
                              architecture/
scripts/
  build-graph.mjs             design-tokens/*.json → data/graph.json (prebuild)
  ssrSmoke.tsx                renders every route + evaluates every example
```

## Adding a component's documentation (the common job)

1. Add a `ComponentDoc` entry to the right category file in
   `site/src/data/registry/`. Copy a neighbour. Fields: slug (kebab-case),
   name, category, summary (one line), description (when to reach for it),
   importNames, props (real names, types, defaults — read the component's
   Props type, do not guess), subProps for compound children, examples,
   dos/donts, motionRole if it animates, related slugs.
2. Examples are strings of real code. Two shapes work: a bare JSX expression,
   or statements defining `Demo` (auto-rendered). Everything exported from
   the library plus React hooks, View, ScrollView, Animated, StyleSheet,
   Platform is in scope (`ui/scope.ts`). Keep examples honest: they run live
   on the page and get sent to Expo Snack verbatim.
3. Run the checks from `site/`:
   `npx tsc --noEmit && npm run build && npm run smoke`.
   The smoke renders all routes server-side and evaluates every example
   through the same transpile path react-live uses. An example that names a
   prop wrongly fails here, not in production.

The index page, detail page, search, related chips, and Snack links all
derive from the registry. No other file needs touching.

## Live examples and Snack

`ui/LiveDemo.tsx` renders preview + editable code (react-live). `ui/snack.ts`
wraps the same code in an App with ThemeProvider and the two fonts, and opens
snack.expo.dev with `@castui/cast-ui` as a dependency, so "Run on a device"
just works. If you add a wholly new global to examples, add it to
`ui/scope.ts` AND to the import template in `ui/snack.ts`.

## The graph

`scripts/build-graph.mjs` reads `design-tokens/*.tokens.json` and writes
`src/data/graph.json` (runs automatically as `prebuild`). Token changes flow
in on the next build. Ecosystem nodes and flow edges are declared in that
script; component→motion edges live in its `MOTION_USE` map — extend it when
a new component consumes a motion role.

## Conventions

- Copy is plain language: short sentences, no em dashes, no hype. Match the
  voice of the existing pages.
- Every page starts with `Page` + `PageHeader` from `ui/Page.tsx`.
- Colours come from `useTheme()` (`scheme.*`, `colors.*`) — never hex, or
  dark mode and brand presets break.
- Routes are lazy in `App.tsx`; a new top-level section needs its route,
  a `NAV_ITEMS` entry in `shell/TopNav.tsx`, and a smoke-test route in
  `scripts/ssrSmoke.tsx`.
- `Text` children are strings. Build labels with template literals, not JSX
  fragments inside Text.

## When deploys fail

- Pages build = `npm ci && npm run build && npm run smoke` in `site/` on
  Node 20. Reproduce locally the same way.
- The smoke failing on an example names the slug and example title. Fix the
  example (or the registry props that misled it), not the smoke.
- Blank page on Pages but fine locally: check `base: '/cast-ui/'` in
  vite.config.ts survived, and that new asset URLs go through
  `import.meta.env.BASE_URL`.
