# Cast UI — documentation site

The public documentation / showcase site for `@castui/cast-ui`, deployed to
GitHub Pages at **https://connagh.github.io/cast-ui/**.

It is a separate, self-contained app that lives inside the library repo but does
**not** import the library source. It consumes the published package from npm,
exactly like any other consumer would. That keeps the site honest: it can only
show what is actually shipped.

## How it works

Cast UI is a React Native component library. To render React Native components in
a browser, the site uses [`react-native-web`](https://necolas.github.io/react-native-web/)
and a Vite build that aliases every `react-native` import to `react-native-web`
(see `vite.config.ts`). This is the same trick the library's own Storybook uses.

The whole site is plain Vite + React, so it builds to static files that GitHub
Pages can host directly. No server, no framework lock-in.

```
site/
  index.html          Entry HTML. Loads Inter + Material Symbols fonts (required
                      by Cast UI, or icons render as their literal name).
  vite.config.ts      base path + the react-native-web alias.
  src/
    main.tsx          Mounts the app via react-native-web's AppRegistry.
    App.tsx           The page. Built from real @castui/cast-ui components.
    react-native.d.ts Ambient shim so `import ... from 'react-native'` type-checks.
  public/
    .nojekyll         Stops GitHub Pages from running Jekyll over the output.
    404.html          SPA fallback for unknown paths.
```

## The package dependency

The site depends on the published package, pinned by range in `package.json`:

```json
"@castui/cast-ui": "^4.7.0"
```

To move the site to a newer published version, bump that range and refresh the
lockfile so CI (`npm ci`) picks it up:

```bash
cd site
npm install @castui/cast-ui@latest
```

`.npmrc` sets `legacy-peer-deps=true`. Cast UI lists `react-native` as a peer
dependency; on the web that peer is satisfied by `react-native-web` through the
bundler alias, so the real `react-native` package is never installed. The flag
stops npm from trying to install it or erroring on the unmet peer.

## Local development

```bash
cd site
npm install
npm run dev        # local dev server with hot reload
npm run build      # production build -> site/dist
npm run preview    # serve the production build locally
```

> Note on `npm run preview`: it serves under the `/cast-ui/` base path, so open
> the `/cast-ui/` URL it prints, not the bare root.

## Deployment

Deployment is automated by `.github/workflows/pages.yml`. On every push to `main`
that touches `site/`, GitHub Actions installs the site, builds it, and publishes
`site/dist` to Pages. You can also run it manually from the **Actions** tab.

**One-time setup** (only needed once, by a repo admin):
Settings → Pages → Build and deployment → Source → **GitHub Actions**.

## Notes

- **Base path.** `base: '/cast-ui/'` in `vite.config.ts` is the GitHub Pages
  project path. If the repo is renamed, or you move to a custom domain or a
  `connagh.github.io` user page, update `base` to match (a user page would use
  `/`).
- **Adding to the page.** The current page is a faithful build of the Figma
  mockup. As the full design lands, add sections inside `<View style={page}>` in
  `App.tsx`, or split into routed pages (add a router and point `404.html` at the
  same entry).
- **Fonts.** Both fonts load from Google Fonts in `index.html`. If text or icons
  look wrong, that is almost always the font links.
