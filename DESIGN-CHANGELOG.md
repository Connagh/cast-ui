# cast-ui-kit design changelog

The version history of the cast-ui-kit Figma library: variables, components,
styles, and the pages that document them. These numbers belong to the design
library. They are not the npm package version and never track it.

## Versioning

The library uses its own semver. Major when something published is removed,
renamed, or rebound so existing consumers break. Minor when a component,
variable group, or style is added and nothing breaks. Patch for value tweaks,
recolours, new variants on existing components, and wording fixes. When an
entry mixes buckets, the highest wins.

## [1.1.0]. Motion becomes a token collection. 2026-07-04

The kit now carries motion the same way it carries colour. A new motion
variable collection holds every duration, easing curve, and spring the code
uses, and a rebuilt Motion page shows each token moving at its real value.
Pulling this version gives designers named motion values to reference, and
gives the cast-sync plugin (v4) a collection to export into cast-theme.json.

### Added
- **Motion variable collection.** 54 variables in one mode. Durations
  (instant 100, fast 150, base 220, slow 320 ms), loop cycles (pulse 700,
  spin 800, sweep 1200 ms), five easing curves stored as cubic-bezier control
  points (standard, entrance, exit, emphasized, linear), the shared overlay
  spring, and the semantic roles (transition, feedback, loop) that alias
  them. The numbers match src/tokens/motion.ts in the package exactly.
- **Motion page.** A spec sheet built like the component sheets. Duration
  cards animate at their own token. Easing cards plot each curve and play it.
  Loop cards show one cycle of spin, pulse, and sweep. A role table maps
  every semantic role to its recipe and the components that use it. The
  animations are keyframed with the exact bezier values from the collection.

### Changed
- **Component descriptions.** Drawer, BottomSheet, Backdrop, Spinner,
  Skeleton, Progress, SpeedDial, and Accordion now name their motion role
  and note that they honour the reduce-motion setting.

### Removed
- **The {Jump} scratch frame on the Motion page.** It was a keyframe test,
  never a published component. The experiment it proved (Figma keyframes
  accept the code's cubic-beziers unchanged) now lives properly in the
  Motion page cards.

### Pending actions
- Publish the cast-ui-kit library in Figma so consumers receive this version.
- Run cast-sync after publishing and commit the regenerated token JSON if
  the export differs. The committed design-tokens/motion.tokens.json was
  written alongside the collection and should match.

## [1.0.0]. Baseline. 2026-07-04

The library as it stands before motion, recorded so later entries have a
floor to diff against. 37 public components (Button through Table, matching
the 37 code exports one for one), their private sub-components, and three
variable collections: primitive (302 raw values), semantic (235 tokens in
light and dark, the layer components bind to), component (273 spacing and
size tokens across the compact, default, and comfortable density modes).
Pages: Welcome (with the ecosystem map), Components, Patterns (empty, error,
success, and stat-card states), Motion, and Example.
