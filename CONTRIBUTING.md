# Contributing to Cast UI

Thanks for your interest in contributing!

## Getting started

```bash
git clone https://github.com/Connagh/cast-ui.git
cd cast-ui
npm install
npm run storybook   # component workbench on http://localhost:6006
```

## Development workflow

1. **Branch** from `main`: `feature/{name}` for new components, `fix/{name}`
   for bug fixes, `chore/{name}` for maintenance.
2. **Make your change.** New components live in `src/components/{Name}/`
   and follow the Button pattern (component, stories, barrel export). Read
   spacing from `useTheme()`, colours from `src/tokens/colors.ts`.
3. **Check it passes:**
   ```bash
   npm test   # builds the library and smoke-tests the output
   ```
4. **Open a PR** against `main`. Chromatic runs visual regression on every
   push and is a blocking check — visual diffs must be reviewed and
   accepted before merge.

## What makes a good component PR

- Props mirror the Figma component properties (`intent`, `prominence`,
  `size`, `disabled`)
- Theme tokens added for all three densities in `src/theme/themes.ts`
- Stories include a Playground, variant showcases, and a density comparison
- Accessibility: `accessibilityRole`, `accessibilityState`, and a sensible
  `accessibilityLabel` fallback

## Releases

Releases are cut by bumping `version` in `package.json` and updating
`CHANGELOG.md` (Keep a Changelog format). Publishing to npm happens
automatically from CI when a version change lands on `main` — contributors
never publish manually.

## Reporting issues

- Bugs and feature requests: [GitHub issues](https://github.com/Connagh/cast-ui/issues)
- Security vulnerabilities: see [SECURITY.md](./SECURITY.md) — please do not
  open public issues for these
