# Changelog

All notable changes to `@castui/cast-ui` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **`makeBrandColors` helper.** Builds a complete `brand` intent from one seed colour, or a few shades, covering every prominence and state with a bg, fg, and border. Pass it to `ThemeProvider` `colors` for a rebrand that leaves nothing on the old colour. It closes the trap where a hand-written `brand` override sets only a few fields, so the outline background tints stay blue and a selected outline Chip or Button keeps a blue fill. Exported from the package entry point with the `BrandSeed` type, alongside `deriveBrandDependents`, the function that recomputes the brand-tinted scheme surfaces from the live brand
- **`useFocusVisible` hook and `focusRingStyle` helper.** Focus tracking that shows the ring only when focus came from the keyboard, matching the browser `:focus-visible` rule. Exported from the package entry point with the `FocusVisibleState` type
- **Keyboard focus rings on Button, Chip, Link, and Tabs.** These had no focus indicator. They now draw a brand focus ring on keyboard focus, as a web outline so there is no layout shift
- **`brand` prop on `ThemeProvider`.** Pass one seed colour, or a base/hover/active set, and the provider builds a full brand ramp for the active colour mode. The dark ramp uses light brand foregrounds on dark saturated surfaces, so a rebrand reads well in light and dark with no per-mode tuning. It is merged before `colors`, so an explicit `colors.brand` override still wins. `makeBrandColors` now takes a `mode` argument to build the same ramp directly. This is the recommended way to rebrand
- **Themeable fonts.** `ThemeProvider` accepts a `fonts` prop: `sans` for body and label text, `display` for headings, `mono` for code, `serif` where needed. Omit `display` and it follows `sans`. The active families are on the theme as `theme.fonts` and read by every text-rendering component, and `<Text>` uses the display face for `heading-*` and `display-*` types. Exported from the package entry point as `defaultFonts` with the `FontFamilyTokens` type. On the web a dev-only warning flags a family that is not loaded
- **`applyCastTheme` maps fonts.** A cast-theme.json `fonts` block, or a `typography.fontFamily` fallback (theme-file version 5), is mapped onto the `fonts` prop, so a theme file can reskin the typeface alongside colour and motion

### Changed
- **Default font is now Geist, not Inter.** The `sans` family shipped in `defaultFonts`, and read by every text component, is now Geist. Geist is Vercel's open-source UI typeface, licensed under the SIL Open Font License 1.1 and free for commercial use. Load a font named `Geist` at start-up instead of `Inter`. Nothing errors if you load the old name, text just falls back to the system font, and icon names still show if the symbols font is missing. To keep Inter, pass `fonts={{ sans: 'Inter' }}` to `ThemeProvider`. `mono` (JetBrains Mono) and `serif` (Noto Serif) are unchanged. Mirrors the kit, where the `font-family/sans` primitive variable now resolves to Geist and every text style follows it

### Fixed
- **Focus ring follows a brand override.** The ring held a fixed blue and stayed blue after a `brand` override or a cast-sync rebrand. It now resolves from the live brand (`brand.default.active.border`). The value is unchanged in the default blue theme. Mirrors the kit, where `control/focus-ring-colour` now binds `intent/brand/default/active/border` instead of a static blue
- **Selected Chips follow a brand override.** A selected or active Chip with the outline variant kept a blue background tint after a brand change, because a hand-written override that set only fg and border left the tint on the base blue. Building the override with `makeBrandColors` fills every field, so the tint recolours. The docs-site brand presets now use it
- **Focus ring is keyboard-only.** The ring on Input, Checkbox, Radio, Toggle, and Select appeared on any focus, including a mouse press. It now follows `:focus-visible` and shows only for keyboard focus. Text fields keep their focus ring on any focus, since a field needs a visible active state while typing
- **One focus outline across text fields.** Input, Autocomplete, and the Select trigger drew three different focus outlines: a brand ring, a grey border, and nothing. They now share one treatment, a resting neutral border, a hover border, and a brand focus ring on focus, at matching widths
- **Autocomplete's selected option follows a brand override.** The selected row in the Autocomplete dropdown read a frozen blue from the colour scheme, so it stayed blue on a rebrand. The 4.11.0 selection fix reached List, Menu, and Select but missed it. The scheme's selection surfaces (`select`, `menu`, `list`, `table`) now derive from the live brand at theme build, so anything that reads them tracks the brand. The values are unchanged in the default blue theme
- **Generated brand ramps are legible in dark mode.** `makeBrandColors` built one light-tuned ramp and reused it in dark, so a non-blue brand (violet, emerald, amber, rose) left selected list and menu items, subtle buttons, brand links, and chips with dark brand text on a near-black tint, below the WCAG AA contrast minimum. In dark mode it now returns light brand foregrounds on dark saturated surfaces, matching the built-in blue, so selected and subtle text clear AA. Reported on the docs-site left navigation with the violet theme in dark mode. Light mode is unchanged
- **Text-field focus ring is keyboard-only.** Input and Autocomplete drew the brand focus ring on any focus, including a mouse click. They now use `useFocusVisible`, so the ring shows only on keyboard focus; a click shows a subtle neutral border and no ring. This matches the Select trigger and the other controls (Button, Chip, Link, Tabs, Checkbox, Radio, Toggle), which were already keyboard-only, so focus is consistent across the library
- **Disabled Button follows the colour mode.** The disabled `<Button>` held a hardcoded light-grey palette, so it showed light disabled colours in dark mode. It now reads `scheme.disabled`, so it matches the active mode like every other control. No change in light mode


## [4.11.0] — 2026-07-05

### Added
- **Density-aware layout spacing scale** — a general spacing scale for app layout, exposed on the theme as `theme.spacing` and read through `useTheme()`. Six steps (`xs`, `sm`, `md`, `lg`, `xl`, `xxl`) that scale with the active density the same way component spacing does: compact tightens them, comfortable loosens them, and they stay constant across colour mode. It fills a gap in the density system, which until now only rescaled spacing inside components and left app-level layout (page gutters, section gaps, stacks) with no density-aware primitive to build on. Exported from the package entry point as `spacingScales` (the resolved values for all three densities) and the `SpacingScale` type. Mirrors a new `spacing/{xs..xxl}` family in the Figma `component` collection, each step aliasing a primitive `space/*`
- **Icon-only Button** — `<Button>` now renders as an icon-only button when `children` is empty or omitted: the label text is skipped and a single `leadingIcon` sits centred inside the button's padding. Existing buttons are unaffected, since a non-empty label renders exactly as before. Pair it with `accessibilityLabel` so the button stays named for screen readers. Mirrors the new `has label` toggle on the Figma `<Button>` component
- **`withAlpha` colour helper** — a small utility exported from the package entry point that adds an alpha channel to a solid 6-digit hex colour, returning an 8-digit `#RRGGBBAA` string (inputs that are not a plain 6-digit hex, such as `transparent` or an already-8-digit value, pass through unchanged). It is handy when building a manual `brand` override and you need a tinted selection surface derived from a solid brand colour, the same tints `applyCastTheme` gets for free from a cast-sync export

### Fixed
- **Selection colours now follow a brand override** — a Toggle that is on, a checked Radio or Checkbox, a selected List, Menu, or Select option, and a selected Table row each held a frozen copy of the default brand blue in the colour scheme, so they stayed blue when the `brand` intent was overridden through the `colors` prop or a cast-sync `cast-theme.json`. They now resolve from the live intent at render: solid fills read `colors.brand.bold`, and tinted selection surfaces read `colors.brand.subtle` (`hover` for selected, `active` for selected+hover). Mirrors the Figma kit, where the same layers now bind `intent/brand/{bold,subtle}/…` instead of a static token. When overriding `brand` by hand, set `brand.subtle` as well so tinted selections recolour, not only `brand.bold`

## [4.10.1] — 2026-07-05

### Fixed
- **Menu opens when its trigger is a Button** — a `<Menu>` whose `trigger` was an interactive element, such as a `<Button>`, did not open on press. The menu wrapped the trigger in its own pressable, and React Native grants a press to a single element, so the inner Button won the gesture and the open toggle never ran. The toggle now sits on the trigger itself, so a Button, an Icon, or any trigger opens the menu on the first press. No prop or token change; mirrors the Figma `<Menu>` component. Fixes the density and brand menus in the docs-site top bar
- **Cards no longer clip an open Menu, Select, or Autocomplete** — `<Card>` clipped all of its content to its rounded corners, so a dropdown opened inside a card (for example a `<Select>` in a form) was cut off at the card edge. The card now clips only its top media slot to the rounded corners, so an overlay can extend past the card boundary. No prop or token change; mirrors the Figma `<Card>` component

## [4.10.0] — 2026-07-04

### Added
- **Motion token system** — a two-layer motion system mirroring the colour and spacing tokens, exposed on the theme as `theme.motion` and mirrored 1:1 by the new `motion` variable collection in the Figma kit. The primitive layer is raw values: `duration` (instant/fast/base/slow = 100/150/220/320 ms), `cycle` (pulse/spin/sweep = 700/800/1200 ms), `easingBezier` (standard/entrance/exit/emphasized/linear as cubic-bezier control points, identical numbers in Figma and CSS), and `spring` (the shared overlay spring). The semantic layer is named roles components actually read: `transition` (standard/enter/exit/expand), `feedback` (press/shake/pop), and `loop` (spin/pulse/indeterminate). Easing functions build lazily on first use, so importing tokens never touches the native Easing API. All exported from the package entry point alongside `motionTokens`, `resolveMotion`, and the `MotionTokens`, `MotionTransition`, `MotionOverrides`, `MotionDurations`, `MotionCycles`, `EasingName`, `EasingBezierPoints`, and `SpringConfig` types
- **useMotion hook** — the single access point for animation. Returns the theme's motion tokens plus three runtime helpers: `reduceMotion` (tracks the OS reduce-motion setting live), `useNativeDriver` (false on web, where the native driver can't run), and `scale(ms)` (collapses a duration to 0 when reduce-motion is on). Components wrap durations in `scale()` and check `reduceMotion` before starting loops, so the whole library honours the accessibility setting from one place. Exported alongside the `Motion` type
- **Motion theming** — `ThemeProvider` accepts a `motion` prop of primitive-level overrides (durations, cycles, easing beziers, springs, and the press-scale/shake-amplitude/pulse-range numbers). `resolveMotion` rebuilds every semantic role from the merged primitives, so one duration override flows into each role that uses it. `applyCastTheme` maps the `motion` block of a cast-theme.json (version 4, exported by cast-sync from the kit's `motion` collection) onto the prop, so a brand can re-tune motion from Figma with no code changes

### Changed
- **Animated components now read motion tokens** — Drawer, BottomSheet, Backdrop, Spinner, Skeleton, Progress, SpeedDial, and Accordion consume their semantic roles through `useMotion()` instead of hardcoded per-component constants, and all honour reduce-motion. Overlay timing shifts slightly to the shared tokens (fades 240 ms → 220 ms; the drawer/sheet spring is now the shared `spring/overlay` config). Visual behaviour is otherwise unchanged

## [4.9.0] — 2026-06-18

### Added
- **Link component** — inline or standalone text link mirroring the Figma `<Link>` component, with `intent` (neutral/brand/danger) and `size` (small/default/large) props plus an `underline` style (`none`/`hover`/`always`). Fixed to the subtle prominence (coloured text, no fill), with brand as the default; colours come from the intent subtle fg. On web, passing `href` renders a real anchor through react-native-web; on native `onPress` drives navigation. The one spacing token is `link/{size}/gap` (density-varying) and icons follow the named Icon scale. Exported from the package entry point alongside `LinkProps`, `LinkSize`, and `LinkUnderline`
- **Backdrop component** — full-screen scrim that dims everything behind it, mirroring the Figma `<Backdrop>` component. Use it as a loading veil or the dimming layer behind a modal; it fades with `open` and can centre a child such as a Spinner. The scrim is black at `scheme.overlay.scrimOpacity`, so it follows the colour mode; `invisible` keeps it transparent but still catches presses, and `onPress` dismisses. Introduces no new tokens (reuses the shared overlay scrim opacity). Exported alongside `BackdropProps`
- **Breadcrumbs component** — hierarchy trail mirroring the Figma `<Breadcrumbs>` component, with a compound API: `<Breadcrumbs>` lays out the row and draws the separators, `<Breadcrumb current onPress>` is one entry (the last item, or any `current` item, renders as plain text; the rest are links). `size` is small/default/large and `separator` sets the glyph (default `chevron_right`). Labels render through `<Text>`, so it inherits the type ramp; the one spacing token is `breadcrumbs/{size}/gap` (density-varying). Exported alongside `Breadcrumb`, `BreadcrumbsProps`, `BreadcrumbProps`, and `BreadcrumbsSize`
- **CodeBlock component** — block of monospaced code on a subtle surface, mirroring the Figma `<CodeBlock>` component, with `size` (small/default/large). Renders code in JetBrains Mono, with an optional header (title/filename plus language tag), an optional copy button (the web Clipboard API when available plus an `onCopy` callback, keeping the zero-dependency contract), and optional line numbers; long lines scroll rather than wrap. Surface is `surface/subtle` with the shared overlay border; tokens are `code-block/{size}/{padding,gap}` (density-varying) and a constant `code-block/border-radius`. Exported alongside `CodeBlockProps` and `CodeBlockSize`
- **Drawer component** — panel that slides in from an edge, mirroring the Figma `<Drawer>` component. Left and right give a full-height side panel (default 320 wide); top and bottom give a full-width panel hugging content up to ~90% of the screen. Same interaction model as BottomSheet (slide in/out with the scrim, no finger dragging, dismiss on scrim press or `onClose`). Ships as two exports: `Drawer` (the full modal) and `DrawerContent` (just the panel, for inline use); padding/gap come from the density theme and the panel reuses the shared overlay tokens. Exported alongside `DrawerProps`, `DrawerContentProps`, and `DrawerAnchor`
- **Menu component** — transient overlay of actions anchored to a trigger, mirroring the Figma `<Menu>` component, with a compound API: `<Menu trigger>` owns the open state and the anchored overlay, `<MenuItem leadingIcon intent onPress>` is an action row, `<MenuDivider>` separates groups, `<MenuLabel>` is a section heading, and `<MenuContent>` is the floating card for custom anchoring. `size` is small/default/large. A Menu fires actions rather than holding a form value, so it has dedicated `menu/*` tokens and its own `scheme.menu.item` colour slice (mirroring the Select shape, namespaced to menu), exported as `menuColors`. Exported alongside `MenuItem`, `MenuDivider`, `MenuLabel`, `MenuContent`, and the `MenuProps`, `MenuItemProps`, `MenuLabelProps`, `MenuContentProps`, `MenuSize`, and `MenuPlacement` types
- **ToggleButtonGroup component** — segmented row of buttons for picking one or more values, mirroring the Figma `<Toggle Button Group>` component, with a compound API: `<ToggleButtonGroup value onValueChange exclusive>` owns the selection, `<ToggleButton value leadingIcon>` is one segment. `intent` (neutral/brand/danger) colours the selected fill, `size` is small/default/large, and `exclusive` switches single-select (`string | null`) and multi-select (`string[]`). Dedicated `toggle-button-group/*` tokens: selected segments fill with the intent bold colour and the group draws one neutral border with dividers between segments. Exported alongside `ToggleButton`, `ToggleButtonGroupProps`, `ToggleButtonProps`, and `ToggleButtonGroupSize`
- **AppBar component** — top bar with a leading control, a title, and trailing actions, mirroring the Figma `<App Bar>` component, with `intent` (neutral/brand/danger), `prominence` (default/bold/subtle), `size` (small/default/large), and `align` (start/center). Colour comes from the intent system; prominence picks the surface (bold is a filled bar, default is plain with a bottom divider, subtle is transparent). The bar hugs its height from the padding, so there is no fixed-height token; spacing varies by density and the title scale by size. Exported alongside `AppBarProps`, `AppBarSize`, and `AppBarAlign`
- **Slider component** — drag a thumb along a track to pick a number, mirroring the Figma `<Slider>` component, with `intent` (neutral/brand/danger) and `size` (small/default/large). Built on PanResponder, so it behaves the same on web and native with zero dependencies; controlled with `value`/`onValueChange` or uncontrolled with `defaultValue`. Tokens `slider/{size}/track-height` and `thumb-size` are keyed by size and constant across density (like Progress's track-height), with a pill `slider/border-radius`; the filled portion reuses the intent bold bg and the track is the dedicated `control/slider/track/bg` semantic (`scheme.slider.track`, cool-grey/200 light, cool-grey/700 dark), exported as `sliderColors`. Exported alongside `SliderProps` and `SliderSize`
- **SpeedDial component** — floating action button that expands into a set of actions, mirroring the Figma `<Speed Dial>` component, with a compound API: `<SpeedDial icon>` is the round FAB, `<SpeedDialAction icon label onPress>` is one action that fans out. `intent` colours the FAB fill, `size` is small/default/large, and `direction` (up/down/left/right) sets which way actions fan out; `open` is controlled or uncontrolled, with an optional dismissing scrim. Tokens `speed-dial/{size}/{fab-size,action-size}` are constant per size and `gap` is density-varying. Exported alongside `SpeedDialAction`, `SpeedDialProps`, `SpeedDialActionProps`, `SpeedDialSize`, and `SpeedDialDirection`
- **Table component** — rows and columns of data, mirroring the Figma `<Table>` component, with a compound API (`Table`, `TableHead`, `TableBody`, `TableRow`, `TableCell`) and `size` (small/default/large). Built from Views since React Native has no `<table>`; supports `striped` body rows, `hoverable` row highlighting, and selectable rows via `onPress`. Colours come from the dedicated `scheme.table` slice, which reuses existing surface/neutral/brand-subtle semantics (no new semantic variables), exported as `tableColors`; cell padding varies by density. Exported alongside `TableHead`, `TableBody`, `TableRow`, `TableCell`, and the `TableProps`, `TableSectionProps`, `TableRowProps`, `TableCellProps`, `TableSize`, and `TableCellAlign` types
- **Autocomplete component** — text field that filters a list of options as you type, mirroring the Figma `<Autocomplete>` component, with `size` (small/default/large). It is the Select combobox specialised for client-side filtering: the field reuses the input tokens and the options reuse the select tokens and `scheme.select.option` colours, so it introduces no new tokens. Controlled with `value`/`onValueChange` (`null` is nothing selected) or uncontrolled with `defaultValue`, with an optional `filterOptions` function to change matching. Exported alongside `AutocompleteProps`, `AutocompleteOption`, and `AutocompleteSize`
- **Breakpoints and responsive hooks** — a standalone responsive layer for adapting layouts across phones, tablets, and desktops. Adds the `breakpoints` scale (`sm`/`md`/`lg`/`xl` = 600/840/1200/1600, the Material 3 window size classes) with `Breakpoint`/`BreakpointKey` types and the pure `resolveBreakpoint`/`resolveResponsiveValue` helpers, plus three hooks built on `useWindowDimensions`: `useBreakpoint()` (the active tier, mobile-first with an implicit `base` below `sm`), `useResponsiveValue({ base, md, ... })` (pick a value per tier, falling back to the nearest tier below), and `useMinWidth('lg')` (a min-width boolean). The same values mirror the new `breakpoint/*` primitive variables in the Figma kit. Breakpoints are a fixed foundation: they are not part of `ThemeProvider`, do not change with density or brand overrides, and are not exported by cast-sync. Exported from the package entry point alongside `breakpoints`, `breakpointOrder`, `resolveBreakpoint`, `resolveResponsiveValue`, `Breakpoint`, `BreakpointKey`, `useBreakpoint`, `useMinWidth`, and `useResponsiveValue`


## [4.8.0] — 2026-06-16

### Added
- **Accordion component** — stack of expandable sections mirroring the Figma `<Accordion>` component, with a compound API: `<Accordion type value onValueChange>` owns which sections are open, `<AccordionItem value title leadingIcon disabled>` is one section. `type` is `single` (one open at a time, with `collapsible` to allow closing it) or `multiple` (any number open), `size` is `small`/`default`/`large`, and it supports controlled (`value`) or uncontrolled (`defaultValue`) use. Neutral only, flush/divided style: the header label renders through `<Text>` and the rotating chevron plus optional leading icon through `<Icon>`, so it inherits the type scale and Material Symbols slot architecture; headers use the `button` accessibility role with `expanded` state. Exported from the package entry point alongside `AccordionItem`, `AccordionProps`, `AccordionItemProps`, `AccordionSize`, and `AccordionType`
- **BottomSheet component** — modal surface that slides up from the bottom edge, mirroring the Figma `<BottomSheet>` component. The sheet hugs its content up to ~90% of the screen height, then the content scrolls, so there are no size variants. Ships as two exports: `<BottomSheet open onClose>` is the full modal (scrim + slide animation, dismiss on backdrop press via `closeOnBackdropPress`), and `<BottomSheetContent>` is just the sheet card for inline use. The card surface reuses the shared `surface.overlay` tokens and the scrim reuses `overlay.scrimOpacity`; the drag handle is the one bespoke colour. Exported from the package entry point alongside `BottomSheetProps` and `BottomSheetContentProps`
- **`applyCastTheme` helper** — turns a cast-sync `cast-theme.json` object plus a colour mode into `ThemeProvider` props in one call (`<ThemeProvider {...applyCastTheme(theme, mode)}>`). It pairs the mode-keyed intent block with `colorMode` so they can't desync, and maps the file's non-intent colour sections (`text`, `surface`, `focusRing`) into the new `scheme` override prop so they actually land. Every section is optional, so partial or future-versioned theme files never throw. Exported alongside the `CastThemeFile` and `CastThemeProps` types
- **`scheme` prop on `ThemeProvider`** — optional deep-partial override for the non-intent colour sections of the active scheme (surface, text, focusRing, overlay), deep-merged after `colors`. Forward-compatible, so a theme file can carry whatever sections it provides; usually set for you by `applyCastTheme` rather than by hand
- **`control/bottom-sheet/handle/bg` colour token** — dedicated drag-handle semantic (cool-grey/300 light, cool-grey/600 dark), available on the theme as `scheme.bottomSheet.handle` and mirroring the new Figma semantic variable
- **Accordion and BottomSheet theme tokens** — Accordion adds per-size `gap`/`paddingX`/`paddingY` (all density-varying) via `AccordionThemeTokens`/`AccordionSizeTokens`; BottomSheet adds density-varying `padding`/`gap` plus constant `borderRadius`/`handleWidth`/`handleHeight`/`handleGap` via `BottomSheetThemeTokens`. Both added to the theme types and every density theme

## [4.7.0] — 2026-06-14

### Added
- **Spinner component** — indeterminate circular loading indicator mirroring the Figma `<Spinner>` component, with `intent` (neutral/brand/danger) and `size` (small/default/large) props. Always indeterminate: it shows that work is happening, not how much is left (for a known percentage use `<Progress>`). The arc colour binds to the intent system; the ring is drawn with borders, so the component keeps the zero-dependency contract. Exported from the package entry point alongside `SpinnerProps` / `SpinnerSize`
- **`control/spinner/track/bg` colour token** — dedicated track-ring semantic (cool-grey/200 light, cool-grey/700 dark), available on the theme as `scheme.spinner.track` and mirroring the new Figma semantic variable; matches the `<Progress>` track and `<Toggle>` off-track
- **Spinner theme tokens** — per-size `diameter` (16/24/32) and `stroke` (2/2/4), constant across all three densities like Progress's track-height, added to the theme types (`SpinnerThemeTokens`, `SpinnerSizeTokens`) and every density theme

## [4.6.0] — 2026-06-14

### Added
- **Tabs component** — horizontal, underline-style tab bar mirroring the Figma `<Tabs>` component set, with `intent` (neutral/brand/danger) and `size` (small/default/large) props. A compound API: `<Tabs value onValueChange>` owns selection, `<Tab value disabled leadingIcon>` is an individual tab. Labels render through `<Text>` (label ramp) and leading icons through `<Icon>`, so it inherits the type scale and Material Symbols slot architecture; tabs use the `tab`/`tablist` accessibility roles. Exported from the package entry point alongside `Tab`, `TabsProps`, `TabProps`, and `TabsSize`
- **`control/tabs/track/bg` colour token** — dedicated baseline-divider semantic for the strip under the tabs (cool-grey/200 light, cool-grey/700 dark), exported as `tabsColors` and available on the theme as `scheme.tabs.track`, mirroring the new Figma semantic variable. The selected indicator and selected label colour come from the intent system; unselected/hover labels from `text.description`/`text.primary`
- **Tabs theme tokens** — per-size `gap`/`paddingX`/`paddingY` plus `indicatorHeight` (2/2/4, constant across density like Progress's track-height), the density-varying `listGap` between tabs, and the pill `indicatorRadius`; added to the theme types (`TabsThemeTokens`, `TabsSizeTokens`) and every density theme

### Changed
- **README logo** — the package logo (`logo.png`) now renders in the README header on the npm and GitHub project pages; the `<img>` reference was already present but the image only resolves now that the asset is committed to `main`

## [4.5.0] — 2026-06-13

### Added
- **Progress component** — linear progress indicator mirroring the Figma `<Progress>` component, with `intent` (neutral/brand/danger) and `size` (small/default/large) props. Shows a determinate percentage via `value` (0–100), or an indeterminate animated sweep when `value` is omitted. Exported from the package entry point alongside `ProgressProps` / `ProgressSize`
- **`control/progress/track/bg` colour token** — dedicated track-background semantic (cool-grey/200 light, cool-grey/700 dark), exported as `progressColors` and available on the theme as `scheme.progress.track`, mirroring the new Figma semantic variable
- **Progress theme tokens** — `progress/{size}/track-height` (4/8/12) and `progress/border-radius` (pill), constant across all three densities, added to the theme types and every density theme

## [4.4.0] — 2026-06-13

### Added
- **Icon size scale** — new `iconSize` token (`xs`/`small`/`default`/`large` = 12/16/20/24) and `IconSize` type; the `<Icon>` `size` prop now accepts the named scale in addition to a pixel number, mirroring the Figma `<Icon>` size variants (each bound to an `icon/{size}/size` variable in the component collection)

### Changed
- **Control icons now scale with the component `size`** — embedded icons map 1:1 to the Figma `<Icon>` size variants (`small`/`default`/`large` = 16/20/24) instead of a fixed 16px. Affects **Button** (leading/trailing), **Input** (leading/trailing + reserved icon boxes), **Badge** (leading/trailing), and **Select** (trigger leading icon, `arrow_drop_down` chevron, and `SelectOption` icon & check). The hardcoded `ICON_SIZE = 16` constant is gone from these components; sizing now flows from the host `size` (resolved via the shared `iconSize` scale). Components that already read a per-size `iconSize`/`closeSize` token (Alert, Card, Toast, Dialog, List, Chip, Checkbox, Avatar) are unchanged. **Visual change:** `default`/`large` variants of Button/Input/Badge/Select now render 20px/24px content icons (previously 16px); close/affordance icons still follow `closeSize` (16/16/20). No API or prop changes. In the Figma kit these instances were re-pointed from the deprecated standalone `<Icon>` component to the public `<Icon>` set's matching `size=` variant, keeping design and code 1:1
- **Checkbox tick & indeterminate scale with the indicator** — checkbox `iconSize` is now 16/20/24 (= `indicatorSize`) instead of 10/12/14; the Material Symbols glyph's intrinsic padding preserves breathing room. Mirrors the Figma migration of the tick/indeterminate onto the shared `<Icon>` component
- **Select dropdown indicator glyph** — `keyboard_arrow_down` → `arrow_drop_down`, matching the Figma `<Icon>` migration

## [4.3.0] — 2026-06-11

### Added
- **Text component** — typographic primitive mirroring the Figma `<Text>` component's 16-entry `type` ramp (`caption`, `label-sm/md/lg`, `body-sm/md/lg`, `title-sm/md/lg`, `heading-sm/md/lg`, `display-sm/md/lg`), with truncation via `numberOfLines` and `accessibilityRole="header"` on heading types
- **`heading` and `display` typography scales** — exported alongside `label`/`title`/`body`/`caption`, matching the kit's Text Styles
- **`text.primary` colour token** — new default foreground for standalone text in both schemes (cool-grey/700 light, cool-grey/200 dark), mirroring the `text/primary` semantic variable added to the Figma kit
- **cast-sync theme file v2** — the plugin now also exports `text` (standalone text colours per mode), `typography` (the full Text Style ramp, resolved from the variables the styles are bound to), and `shadows` (the `shadow/*` effect styles as drop-shadow layer lists, ahead of the upcoming elevation system). `colors.light`/`colors.dark` are unchanged, so v2 files remain drop-in for ThemeProvider's `colors` prop

## [4.2.2] — 2026-06-11

### Fixed
- **Icon font family on web now accepts both `MaterialSymbolsOutlined` and `Material Symbols Outlined`** — previously Icon requested only the spaced name on web, so Expo apps that registered the font via `useFonts({ MaterialSymbolsOutlined: ... })` (the documented Expo path) rendered icons as literal text on the web target, with no error anywhere. The web font-family is now a fallback list covering both names, so the Google Fonts CSS path and the expo-font path both work without configuration
- **Skeleton no longer warns on react-native-web** — the pulse animation requested `useNativeDriver: true` unconditionally, logging `Animated: useNativeDriver is not supported` on every web page load; the flag is now gated on `Platform.OS !== 'web'`

### Added
- **"Fonts" section in the README** — Inter and Material Symbols Outlined loading recipes for Expo (covering iOS, Android, and web with one `useFonts` call), plain web, and bare React Native, plus a note on subsetting the ~10 MB variable icon font for native builds. Neither font ships with the package and both fail silently when missing, so this is now documented on the npm page
- **Hosted Storybook links in the README** — the customisation guide reference now resolves to the Chromatic-hosted Storybook instead of naming a Storybook the reader couldn't reach

## [4.2.1] — 2026-06-11

### Fixed
- **Package was unloadable outside bundlers** — `dist/` was emitted as ES modules while `package.json` declared `"type": "commonjs"`, so `require()` (Node, Jest, SSR) failed with a syntax error. The build now emits CommonJS as intended. Metro/webpack consumers were unaffected.

### Added
- `exports` map and `engines` (node >=18) fields in `package.json`
- `sideEffects: false` so web bundlers can tree-shake unused components
- Smoke test (`scripts/smoke-test.js`) that loads the built package via `require()` and verifies the public API surface; runs via `npm test` and as a blocking step in the publish workflow
- `SECURITY.md` vulnerability disclosure policy and `CONTRIBUTING.md`
- `CODEOWNERS` file for automatic PR review assignment

### Changed
- Source maps and declaration maps are no longer published — they referenced `src/` files that are not in the package, so they were dead weight (roughly half the files in the tarball)

## [4.2.0] — 2026-06-11

### Added
- **15 new components** — Alert, Avatar, Badge, Card, Checkbox, Chip, Divider, Input, List (with ListItem, ListSubheader, ListDivider), Popover, Radio (with RadioGroup), Skeleton, Toast, Toggle, and Tooltip, each with theme tokens across all 3 densities and full Storybook stories
- **Dark colour mode** — `colorMode` prop on ThemeProvider switches between light and dark schemes (mirroring the Figma `semantic-light` / `semantic-dark` variable modes); full schemes exported as `lightColors` / `darkColors` / `colorSchemes`, with the active scheme available via `useTheme().scheme`
- **cast-sync Figma plugin** (`cast-sync/`) — exports the UI kit's semantic colour variables as a `cast-theme.json` file whose `colors.light` / `colors.dark` plug directly into ThemeProvider's `colors` prop; plugin UI shows a theme preview with colour swatches and a download button; no network access
- **Customisation guide** — new sections covering colour modes and importing a cast-sync theme file

### Changed
- Existing components (Button, Dialog, Icon, Select) read colours from the active scheme so they respond to `colorMode`
- Rewrote README with the full component table, theming guide, cast-sync workflow, and token architecture overview

### Removed
- Orphan `Link`, `Text`, and `Textarea` barrel files that pointed at unbuilt components and broke the build

### Security
- Hardened the adoption workflow: explicit `permissions: contents: read` and pinned `@zeroheight/adoption-cli` to 4.1.5 instead of executing the latest version with secrets in env
- Resolved all npm audit vulnerabilities in devDependencies (1 critical, 3 high, 4 moderate — all in the Storybook/webpack dev toolchain; the published package has zero runtime dependencies and was unaffected)

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

[Unreleased]: https://github.com/Connagh/cast-ui/compare/v4.3.0...HEAD
[4.3.0]: https://github.com/Connagh/cast-ui/compare/v4.2.2...v4.3.0
[4.2.2]: https://github.com/Connagh/cast-ui/compare/v4.2.1...v4.2.2
[4.2.1]: https://github.com/Connagh/cast-ui/compare/v4.2.0...v4.2.1
[4.2.0]: https://github.com/Connagh/cast-ui/compare/v4.1.1...v4.2.0
[4.1.1]: https://github.com/Connagh/cast-ui/compare/v4.1.0...v4.1.1
[4.1.0]: https://github.com/Connagh/cast-ui/compare/v4.0.0...v4.1.0
[4.0.0]: https://github.com/Connagh/cast-ui/compare/v3.2.0...v4.0.0
[3.2.0]: https://github.com/Connagh/cast-ui/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/Connagh/cast-ui/compare/v3.0.0...v3.1.0
[3.0.0]: https://github.com/Connagh/cast-ui/compare/v2.0.0...v3.0.0
