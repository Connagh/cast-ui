# Cast UI

A cross-platform component library for React Native (iOS, Android, Web).

> Components are currently being built. Check back soon.

## Installation

```bash
npm install @castui/cast-ui
```

**Peer dependencies:** `react` (>=18), `react-native` (>=0.72)

## Development

### Prerequisites

- Node.js >= 18
- npm

### Install Dependencies

```bash
npm install
```

### Start Storybook

```bash
npm run storybook
```

Opens at `http://localhost:6006`.

### Build

```bash
npm run build
```

## Scripts

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
| Publish to npm | Push to `main` | Builds and publishes package to npm (only if version changed) |

## License

MIT
