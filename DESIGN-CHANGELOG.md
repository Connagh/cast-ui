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

## [1.2.2]. Selection colours follow brand. 2026-07-05

Selected list items, menu items, and select options now use the brand intent instead of a fixed blue. Recolour the brand and every selected state recolours with it. Before, these three bound a neutral option colour that happened to hold a blue value, so a selected row stayed blue after a brand change. The colours are the same in the default blue theme, so nothing moves until you change the brand. Pulling this version matches the package code, where the same selected states now read the brand subtle colour.

### Changed
- **ListItem, MenuItem, and SelectOptions selected states.** The selected fill and text now bind intent/brand/subtle/hover, both bg and fg. SelectOptions' selected+hover variants bind intent/brand/subtle/active. They used to bind intent/neutral/option/selected, a neutral group that held a static blue and could not follow a brand change.
- **Toggle, Radio, Checkbox, and TableRow.** No change. These already bound the brand intent, so they tracked the brand before this version. The package code caught up to match them.

### Pending actions
- Publish the cast-ui-kit library in Figma so consumers receive this version.
- No cast-sync re-export needed. This change is a layer binding, not a variable, so the token JSON does not change.
- Optional cleanup: intent/neutral/option/selected and intent/neutral/option/selected+hover are no longer used by any component set. Leave them or remove them in a later version.

## [1.2.1]. Icon-only Button. 2026-07-05

Button gains a has label toggle, so an icon-only button is a real state in the kit instead of a hand edit. Turn has label off and turn on one icon. The label hides, the gap between icon and label collapses, and the icon sits centred inside even padding. Default is on, so every button that already ships keeps its label and nothing moves. Pulling this version matches the icon-only fix in the package code, where an empty label renders the same centred icon.

### Added
- **has label toggle on Button.** A boolean on the Button set, default true, bound to the label text node across all 108 variants. It works like has leading icon and has trailing icon: an optional part you switch on or off. Off hides the label, so a single icon centres inside the button's padding.

### Changed
- **Button description.** Rewritten to the standard template. It now explains icon-only usage, reminds you to set an accessibilityLabel in code for an icon-only button, and lists the full property to prop map.

### Pending actions
- Publish the cast-ui-kit library in Figma so consumers receive this version.
- No cast-sync re-export needed. This change is a component property and its binding, not a variable, so the token JSON does not change.

## [1.2.0]. Layout spacing scale. 2026-07-05

The component collection gains a spacing scale for laying out pages and sections. Six steps, xs to xxl, each one scaling across the three density modes. Designers now have named spacing values to build screens with, on the same rhythm the components already use. Compact tightens every step, comfortable loosens it. Pulling this version gives the cast-sync plugin a new group to export, and matches the spacing scale shipped in the package code.

### Added
- **Spacing scale.** Six variables in the component collection, spacing/xs through spacing/xxl. Each one aliases a primitive space value and changes across the three density modes. Read as compact, default, comfortable: xs 2, 4, 6; sm 6, 8, 12; md 12, 16, 20; lg 20, 24, 32; xl 32, 40, 48; xxl 48, 64, 80. Scoped to gap and padding. The values match spacingScales in src/theme/themes.ts in the package.

### Pending actions
- Publish the cast-ui-kit library in Figma so consumers receive this version.
- Run cast-sync and commit the regenerated token JSON. The spacing group is new in Figma and not yet in design-tokens/component/component-*.tokens.json.

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
