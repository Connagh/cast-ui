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

## [1.3.1]. Focus ring is keyboard-only, everywhere. 2026-07-06

Wording only. No variable, component, or style changes. The brand focus ring is a keyboard-only runtime behaviour in code (it follows the browser :focus-visible rule), including on the text fields now. Figma has no focus-visible variant, so the association lives in the component descriptions.

### Pending actions
- Add one line to the Input, Autocomplete, and Select descriptions: the brand focus ring shows on keyboard focus only; a click shows a plain border. This matches the note already planned for Button, Chip, Link, and Tabs in 1.2.3.
- No publish needed. Nothing in the kit's variables, components, or styles changed.

## [1.3.0]. Fonts are themeable. 2026-07-06

A theme can now carry its own fonts, not just colour and motion. Change the font on the kit's Text Styles and cast-sync exports it, so a consuming app reskins its type with no code change. Nothing in the kit is renamed or rebound, so existing files are unaffected until you choose to change a font.

### Changed
- **cast-sync export (version 5).** The exported cast-theme.json now includes a fonts block: display, sans, and mono, read from the Text Styles. display comes from the display and heading styles, sans from body and label, mono from a code style if one exists. applyCastTheme maps this onto the ThemeProvider fonts prop.

### Added
- **Font theming from the Text Styles.** No new variables. To give a theme a display and body pairing, set the font on the kit's display and heading styles and on the body and label styles, then run cast-sync. The docs-site Themes page shows a set of these pairings live and downloadable.

### Pending actions
- Re-run cast-sync in the cast-ui-kit file to emit a version 5 file with the fonts block. Older version 4 files still load; the fonts block is simply absent.
- No publish is needed for existing consumers, since no variable, component, or style changed. Publish only if you change the kit's own Text Style fonts.

## [1.2.3]. Focus ring follows brand. 2026-07-05

The focus ring now uses the brand intent instead of a fixed blue. Recolour the brand and the focus ring recolours with it. Before, control/focus-ring-colour bound a blue primitive, so the ring stayed blue after a brand change. The colour is the same in the default blue theme, so nothing moves until you change the brand. Pulling this version matches the package code, where the focus ring now reads the brand.

### Changed
- **control/focus-ring-colour.** Now binds intent/brand/default/active/border in both modes. It used to bind colours/blue/500 in light and colours/blue/400 in dark, the same values the brand active border holds, so the ring looks identical until the brand changes.
- **intent/neutral/option/selected and selected+hover.** Rebound from raw blue primitives to intent/brand/subtle. These variables have been orphaned since 1.2.2 moved the selected states onto the brand directly, so nothing renders differently. The rebind keeps the leftover variables consistent if anything picks them up later.

### Pending actions
- Publish the cast-ui-kit library in Figma so consumers receive this version.
- Re-export the semantic collection with cast-sync to record the new alias in the token JSON. The rendered value is unchanged in the blue theme, so apps are unaffected until then.
- Focus on Button, Chip, Link, and Tabs is a runtime keyboard-only ring in code, the same way hover is runtime. It is not a new Figma variant. Add a line to each component description noting the focus-visible ring when you next edit them.

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
