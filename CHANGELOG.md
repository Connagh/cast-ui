# Changelog

All notable changes to `@castui/cast-ui` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] — 2026-02-19

### Changed
- **BREAKING:** Renamed all `color`/`Color` token keys to `colour`/`Colour` across the theme to align with the cast-sync Figma plugin's British English output
  - Semantic layer: `theme.semantic.color.*` → `theme.semantic.colour.*`
  - Component tokens: `headingColor` → `headingColour`, `borderColor` → `borderColour`, `textColor` → `textColour`, etc.
  - Type definitions: `SemanticColors` → `SemanticColours`
- Updated all component files, theme types, and documentation to use the new `colour` naming

### Migration
- Find and replace `semantic.color.` → `semantic.colour.` in your theme overrides and component code
- Find and replace `Color` → `Colour` (capital C) in any custom theme JSON property names
- Update any type imports: `SemanticColors` → `SemanticColours`

## [1.1.0] — 2026-02-19

### Added
- Font weight and line-height component tokens across all 15 components
- Component text style definitions for Figma (21 composite text styles replace individual typography variables)

### Changed
- Updated COMPONENT-SPEC.md and DESIGN-TOKENS-SUMMARY.md to reflect text style approach
- Removed `button` variant from Typography component (use `Cast/Button/Label` text style in Figma instead)

## [1.0.0] — 2026-02-18

### Added
- 19 new components: Alert, AppBar, Autocomplete, Backdrop, Badge, Checkbox, Chip, Dialog, Divider, FAB, Icon, Link, Select, Skeleton, Snackbar, SpeedDial, Switch, Table, TextField
- Typography component with 10 variants (display, h1–h3, subtitle, body, small, caption, overline, label)
- Comprehensive component token types in theme (`component.*` paths for all 21 components)
- Storybook stories for every component

### Changed
- Expanded `CastTheme` type with full component token definitions
- Updated example themes (Consumer, Corporate, Luxury) with component tokens

## [0.5.0] — 2026-02-18

### Added
- Comprehensive three-tier design token architecture (primitive → semantic → component)
- Resolved default theme (`Default.tokens.json`) with full alias chain
- Generated `default.ts` theme from token build pipeline
- Component-level token aliases (`_aliases` section) for all components
- Semantic colour, spacing, typography, elevation, and border-radius tokens

### Changed
- Restructured token build pipeline (`build.ts`) for alias resolution
- Updated Storybook example themes with expanded token sets

## [0.4.1] — 2026-02-17

### Added
- Default base theme and `createTheme()` API for deriving custom themes
- Storybook theme switcher with Consumer, Corporate, and Luxury example themes
- `ThemeProvider` integration with example themes in Storybook preview

### Changed
- Made `children` prop optional on `ThemeProvider`

## [0.3.0] — 2026-02-16

### Added
- `resolveFont()` utility for cross-platform font family resolution
- Android font weight handling (maps weight values to platform-specific font family suffixes)

## [0.2.0] — 2026-02-15

### Added
- Card component with heading, body, and image support
- Card Storybook stories
- Link to cast-ui-examples in README

### Changed
- Reduced default token padding values
- Increased spacing token 200 from 16 to 20

### Fixed
- Publish workflow version check to prevent duplicate npm publishes
- OIDC-based npm publish with provenance attestation

## [0.1.0] — 2026-02-14

### Added
- Initial project setup with React Native + Expo foundation
- Button component with filled, outline, and text variants
- Design token files (Consumer, Corporate, Luxury, White Label themes)
- Storybook configuration with React Native Web
- Chromatic GitHub Actions workflow for visual regression testing
- CI workflows for adoption tracking and npm publish
- MIT license

### Changed
- Rebranded from Atlas to Cast
- Scoped package to `@castui/cast-ui`
- Removed Button `size` prop in favour of token-driven sizing

[2.0.0]: https://github.com/Connagh/cast-ui/compare/v1.1.0...v2.0.0
[1.1.0]: https://github.com/Connagh/cast-ui/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Connagh/cast-ui/compare/v0.5.0...v1.0.0
[0.5.0]: https://github.com/Connagh/cast-ui/compare/v0.4.1...v0.5.0
[0.4.1]: https://github.com/Connagh/cast-ui/compare/v0.3.0...v0.4.1
[0.3.0]: https://github.com/Connagh/cast-ui/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Connagh/cast-ui/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Connagh/cast-ui/releases/tag/v0.1.0
