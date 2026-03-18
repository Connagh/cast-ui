# Changelog

All notable changes to `@castui/cast-ui` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.0] — 2026-03-18

### Added
- **Button component** — `intent` (neutral/brand/danger), `prominence` (default/bold/subtle), `size` (small/default/large), with hover, press, focus, and disabled states
- **Icon component** — Material Symbols Outlined via font ligature rendering, accepts name string + size + colour
- **Design token system** — 3-layer architecture (primitive → semantic → component) exported from Figma
- **ThemeProvider** — runtime density switching (compact/default/comfortable) and deep-merge colour overrides for rebranding
- **useTheme hook** — access current density tokens and intent colours from any component
- **Button icon shorthand** — pass a Material Symbols name string to `leadingIcon`/`trailingIcon` for auto-colour-matched icons
- **Storybook stories** — Playground, Intents, Prominences, Sizes, Disabled, WithIcons, DensityComparison, FullMatrix for Button; Playground, CommonIcons, Sizes for Icon
- **Customisation guide** — Storybook MDX docs page covering density themes, colour overrides, token usage, nested providers
- **CLAUDE.md** — project knowledge document for AI-assisted development
- **Token reference** — `design-tokens/token-reference.json` navigation map for all tokens

### Fixed
- Resolved all npm audit vulnerabilities in devDependencies

## [3.0.0] — 2026-03-02

### Changed
- **BREAKING:** Removed all existing components and theme system to start fresh
- Reset library to empty shell while preserving CI/CD infrastructure

[3.1.0]: https://github.com/Connagh/cast-ui/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/Connagh/cast-ui/compare/v2.0.0...v3.0.0
