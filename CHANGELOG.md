# Changelog

All notable changes to `@castui/cast-ui` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.1.1] — 2026-03-20

### Fixed
- Move `zIndex` from inner trigger wrapper to outer Select container so the dropdown is not trapped in a parent stacking context
- Add Escape key handler to dismiss the dropdown on web
- Default outer container to `alignSelf: 'stretch'` so the Select fills its parent without an explicit width

## [4.1.0] — 2026-03-19

### Added
- **Select component** — form control for choosing from a list of options, with single, multi (tag pills), and combobox (search input) modes
- **SelectOption** — individual option row with icon, label, description, check mark, and disabled state
- **SelectGroup** — labelled group of options with uppercase caption header
- **SelectSeparator** — visual divider between option groups
- **SelectTag** — pill badge sub-component for multi-select, also exported for standalone use
- **SelectContent** — dropdown card exported separately for custom overlay implementations
- **Input theme tokens** — `fieldGap`, `paddingX`, `paddingY`, `gap`, `borderRadius` per size across all 3 densities
- **Select theme tokens** — `content`, `option`, `group`, `separator` spacing tokens across all 3 densities
- **Caption typography scale** — 11px/16px/0.5 tracking for helper text, group labels, and tags
- **Select color tokens** — option state colours (default, hover, selected, selected+hover, disabled), separator colour, tag tokens, error tokens

## [4.0.0] — 2026-03-19

### Removed
- **BREAKING:** Removed `ringColour` from `IntentColors` type and all intent color definitions (neutral, brand, danger)
- **BREAKING:** Removed `focusRingWidth` and `focusRingOffset` from `ButtonSizeTokens` type and all density theme values
- Removed custom focus ring styling from Button component — browsers now provide accessible `:focus-visible` outlines natively

### Changed
- Updated Customisation docs to remove focus ring references and `ringColour` from color override examples

## [3.2.0] — 2026-03-19

### Added
- **Dialog component** — modal overlay with scrim backdrop, icon, title, description, content slot, and action buttons
- **Typography scales** — added `title` (sm/md/lg) and `body` (sm/md/lg) to shared tokens
- **Surface tokens** — shared `surfaceTokens.overlay` (bg, border, radius) for Dialog, Popover, Tooltip, etc.
- **Text tokens** — `textTokens.description` for secondary text colour
- **Overlay tokens** — `overlayTokens.scrimOpacity` for modal backdrops
- **Dialog density themes** — padding and gap tokens for compact/default/comfortable across all 3 sizes
- **Dialog Storybook stories** — Playground, Sizes, WithSlotContent, NoIcon, DensityComparison

## [3.1.0] — 2026-03-18

### Added
- **Button component** — `intent` (neutral/brand/danger), `prominence` (default/bold/subtle), `size` (small/default/large), with hover, press, and disabled states
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

[4.1.1]: https://github.com/Connagh/cast-ui/compare/v4.1.0...v4.1.1
[4.1.0]: https://github.com/Connagh/cast-ui/compare/v4.0.0...v4.1.0
[4.0.0]: https://github.com/Connagh/cast-ui/compare/v3.2.0...v4.0.0
[3.2.0]: https://github.com/Connagh/cast-ui/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/Connagh/cast-ui/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/Connagh/cast-ui/compare/v2.0.0...v3.0.0
