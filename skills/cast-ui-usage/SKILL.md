---
name: cast-ui-usage
description: >-
  How to USE the @castui/cast-ui React Native component library in an app.
  Covers the design language (intent / prominence / size, density, light/dark,
  brand colour overrides), ThemeProvider setup, loading fonts, theming from a
  Figma cast-theme.json via applyCastTheme, and every component with its props
  and usage. Use this whenever writing or reviewing app code that imports from
  @castui/cast-ui: picking a component, wiring ThemeProvider, applying a brand
  theme, fixing why icons or fonts render wrong, or choosing the right
  intent/prominence/size. This is a consumer guide for building apps with the
  library, NOT a guide to building or extending the library itself.
---

# Using Cast UI

Cast UI (`@castui/cast-ui`) is a cross-platform React Native component library.
The same components run on iOS, Android, and the web (through react-native-web).
It has zero runtime dependencies (only `react` and `react-native` as peers), and
every colour, size, and spacing value comes from design tokens, so the whole
look is themeable at runtime with no rebuild.

This skill is for building an app *with* the library. If the task is adding a new
component to the library or editing its Figma kit, that is a different job and
this skill does not cover it.

Browse every component live in the hosted Storybook:
https://main--6990f00d7b8682c18d2ed5f3.chromatic.com

The documentation site has live editable examples, full prop tables, patterns,
templates, and the motion system: https://connagh.github.io/cast-ui/

## Install and the one rule

```bash
npm install @castui/cast-ui
```

Peer deps: `react` (>=18), `react-native` (>=0.72). Nothing else is installed.

**The one rule: wrap your app in `ThemeProvider` once, near the root.** Every
component reads its colours and spacing from that context. A component rendered
outside a provider falls back to defaults, but always mount one so density,
colour mode, and brand colours work.

```tsx
import { ThemeProvider, Button } from '@castui/cast-ui';

export function App() {
  return (
    <ThemeProvider>
      <Button intent="brand" prominence="bold" onPress={save}>
        Save changes
      </Button>
    </ThemeProvider>
  );
}
```

## The design language

Most components share three style props. Learn these once and they apply
everywhere. They are the vocabulary the Figma kit and the code agree on.

- **`intent`** is what something means: `'neutral'` (default grey), `'brand'`
  (your primary colour, blue out of the box), or `'danger'` (red, for
  destructive or error states). Pick by meaning, not by colour.
- **`prominence`** is how visually heavy it is: `'default'` (outlined),
  `'bold'` (filled, the strongest), or `'subtle'` (ghost, no border or fill
  until hovered). A page should usually have one bold action and the rest
  default or subtle.
- **`size`** is `'small'`, `'default'`, or `'large'`. It scales padding and the
  type used inside the component.

Not every component exposes all three. A few use a `variant` instead (for
example `Card` is `outline | elevated`, `Badge` is `solid | subtle | outline`),
and purely structural pieces (Divider, Skeleton) have none. The per-component
list below says which props each one takes.

Two more ideas worth holding in your head:

- **Density is global, not per-component.** Spacing across the whole UI scales
  with the provider's `density`. Colours, radius, and type never change with
  density, so brand and legibility stay constant whether the app feels tight or
  roomy. Your own page layout can ride the same rhythm: read
  `useTheme().spacing` for a density-aware scale (`xs` to `xxl`) instead of
  hardcoding gaps and padding.
- **Colour is themeable, structure is not.** You can recolour any intent at
  runtime through the provider. You cannot restyle a component's layout through
  props beyond the `style` escape hatch, that is by design, it keeps every
  instance consistent.

## ThemeProvider: the five controls

`ThemeProvider` takes five independent settings. All are optional.

### density

How tight or roomy spacing feels, `'compact' | 'default' | 'comfortable'`.
Changing it rescales padding and gaps across every component at once.

```tsx
<ThemeProvider density="compact">{/* ... */}</ThemeProvider>
```

### colorMode

`'light' | 'dark'`. Switches every colour in the library. Drive it off the OS
setting with React Native's `useColorScheme`:

```tsx
import { useColorScheme } from 'react-native';

const scheme = useColorScheme();
<ThemeProvider colorMode={scheme === 'dark' ? 'dark' : 'light'}>
```

### colors (brand overrides)

Pass a partial `colors` object to replace specific intent colours with your own.
You only write the slots you want to change, everything else keeps its default.
The shape is `intent -> prominence -> state -> { bg, fg, border }`, where state
is `default | hover | active`.

```tsx
<ThemeProvider
  colors={{
    brand: {
      bold: {
        default: { bg: '#7C3AED', fg: '#FFFFFF', border: '#7C3AED' },
        hover:   { bg: '#6D28D9', fg: '#FFFFFF', border: '#6D28D9' },
        active:  { bg: '#5B21B6', fg: '#FFFFFF', border: '#5B21B6' },
      },
    },
  }}
>
```

Overriding `brand` also recolours every selection state that uses it: a Toggle that is on, a checked Radio or Checkbox, a selected List, Menu, or Select option, and a selected Table row. They read the brand intent at render, so a brand override flows through with no extra wiring. One caveat for tinted selections (list, menu, select, table row): they read `brand.subtle` (the tint), so override `brand.subtle` too, not only `brand.bold`, or the tint stays at its default while the solid controls recolour.

### scheme (the rest of the palette)

A deep-partial override for the non-intent colours: surfaces, standalone text
colours, the focus ring, and overlay. Most apps never set this by hand,
`applyCastTheme` (below) builds it for you from a Figma export. Set it directly
only when you want to nudge, say, the page surface or description text colour
without a full theme file.

### motion (retime the system)

Primitive-level motion overrides: durations, cycle lengths, easing beziers,
springs. Semantic roles (transition / feedback / loop) are rebuilt from them,
so one number retimes every component that uses it. Like colours, this
usually arrives from Figma via a cast-theme.json rather than by hand.

```tsx
<ThemeProvider motion={{ duration: { base: 300 } }}>
```

### Nesting and reading the theme

Providers nest. A compact data table can live inside a comfortable app:

```tsx
<ThemeProvider density="comfortable">
  <Page>
    <ThemeProvider density="compact"><DataTable /></ThemeProvider>
  </Page>
</ThemeProvider>
```

Your own components can read the active theme with `useTheme()`:

```tsx
import { useTheme } from '@castui/cast-ui';

function Price() {
  const { colors, scheme, density } = useTheme();
  return <Text style={{ color: colors.brand.bold.default.bg }}>£12</Text>;
}
```

`useTheme()` returns `{ density, colorMode, components, spacing, colors, scheme,
disabledColors, motion }`. `colors[intent][prominence][state]` gives `{ bg, fg, border }`;
`components[name][size]` gives the spacing tokens for the active density;
`spacing` is a density-aware layout scale (`xs` to `xxl`) for your own page
layout, so page gutters and section gaps scale with density too. The
raw token modules (`lightColors`, `intentColors`, `label`, `body`, `fontFamily`,
`iconSize`, and so on) are also exported for direct use.

## Theming from Figma with cast-sync and applyCastTheme

The `cast-sync` Figma plugin (in the package repo) reads the cast-ui-kit Figma
file's colour variables and downloads a `cast-theme.json`. The workflow is:
recolour the variables in Figma, run the plugin, drop the new file into the app.
No code changes.

The clean way to apply that file is `applyCastTheme(theme, mode)`. It pairs the
file's colours with the matching `colorMode` so they cannot desync, and maps the
file's `text`, `surface`, and `focusRing` sections into the `scheme` prop so they
actually take effect. Spread the result into `ThemeProvider`:

```tsx
import theme from './cast-theme.json';
import { ThemeProvider, applyCastTheme } from '@castui/cast-ui';

const [mode, setMode] = useState<'light' | 'dark'>('light');

<ThemeProvider {...applyCastTheme(theme, mode)}>
  <App />
</ThemeProvider>
```

`applyCastTheme` is forward-compatible: older theme files and files with extra
sections both load without throwing. The older manual form still works if you
only want the intent colours:

```tsx
<ThemeProvider colorMode="light" colors={theme.colors.light}>
```

but `applyCastTheme` is preferred because it also brings across surfaces, text,
and the focus ring, and keeps the mode in sync.

## Motion in your own components

Read animation values through `useMotion()`, never as raw numbers. It returns
the motion tokens plus `reduceMotion` (tracks the OS setting live),
`useNativeDriver` (false on web), and `scale(ms)` (collapses to 0 under
reduce-motion).

```tsx
import { useMotion } from '@castui/cast-ui';

const motion = useMotion();
Animated.timing(value, {
  toValue: 1,
  duration: motion.scale(motion.transition.enter.duration),
  easing: motion.transition.enter.easing,
  useNativeDriver: motion.useNativeDriver,
}).start();
```

Roles: `transition.standard|enter|exit|expand`, `feedback.press|shake|pop`,
`loop.spin|pulse|indeterminate`. For loops, check `motion.reduceMotion` and
skip starting the loop. Drawer, BottomSheet, Backdrop, Spinner, Skeleton,
Progress, SpeedDial, and Accordion already animate this way.

## Fonts (read this if text or icons look wrong)

Cast UI ships no font files. Two fonts must be loaded by the app:

- **Inter** for all text.
- **Material Symbols Outlined** for the `<Icon>` component and every embedded
  icon.

If a font is not loaded there is no error. Text quietly falls back to the system
font, and **icons render as their literal name** ("star" instead of the glyph).
So if you see icon names as words on screen, the Material Symbols font is not
loaded. Load both once at start-up.

Expo (covers iOS, Android, and web):

```tsx
import { useFonts } from 'expo-font';

const [fontsLoaded] = useFonts({
  Inter: require('./assets/Inter.ttf'),
  MaterialSymbolsOutlined: require('./assets/MaterialSymbolsOutlined.ttf'),
});
```

Plain web, add to the HTML head:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
```

Bare React Native, link the `.ttf` files as assets keeping the family names
`Inter` and `MaterialSymbolsOutlined`. The Material Symbols variable font is
about 10 MB; for production native builds, subset it to the icons you use.

## Icons

Icons are the `<Icon>` component, rendering Material Symbols Outlined by name
(the font ligature). Anywhere a component takes an icon prop (`leadingIcon`,
`trailingIcon`, `icon`), pass the Material Symbols name as a string and the
component colours and sizes it for you:

```tsx
<Button leadingIcon="add" intent="brand" prominence="bold" onPress={add}>
  New
</Button>
```

Browse names at https://fonts.google.com/icons. You can also pass your own React
node instead of a string if you need a custom icon. Standalone:

```tsx
import { Icon } from '@castui/cast-ui';

<Icon name="chevron_right" size="default" color="#374151" />
```

`<Icon>` props: `name` (required), `size` (`'xs' | 'small' | 'default' | 'large'`
= 12 / 16 / 20 / 24, or a number), `color`, and the Material Symbols axes `fill`,
`weight`, `grade`, `opticalSize`. Only the Outlined style font is loaded, so
picking Rounded or Sharp in a design will not match in code.

## Component catalogue

All 37 components, grouped by use. Props marked `?` are optional. Strings passed
as `children` are required to be plain strings (not arbitrary nodes) on most
components, this keeps the type ramp consistent and prevents injection. For the
exact, always-current prop types, read the exported TypeScript types or the
Storybook "Playground" story for each component.

### Foundational

**Text** renders the type ramp. `type` is one of `caption`, `label-sm|md|lg`,
`body-sm|md|lg`, `title-sm|md|lg`, `heading-sm|md|lg`, `display-sm|md|lg`.
Other props: `color?`, `numberOfLines?`, `selectable?`. Children must be a string.

```tsx
<Text type="heading-lg">Dashboard</Text>
<Text type="body-md" color="#6B7280">Last synced 2 minutes ago</Text>
```

**Icon** see the Icons section above.

**Divider** a separator line. `orientation?` (`'horizontal' | 'vertical'`),
`color?`.

### Actions and input

**Button** `children: string`, `intent?`, `prominence?`, `size?`, `disabled?`,
`leadingIcon?`, `trailingIcon?`, `onPress?`. The workhorse action.

**Input** single-line text field. `label?`, `helperText?`, `placeholder?`,
`value?`, `defaultValue?`, `onChangeText?`, `size?`, `error?`, `disabled?`,
`leadingIcon?`, `trailingIcon?`, plus the usual RN text-input props
(`secureTextEntry?`, `keyboardType?`, `autoCapitalize?`, `returnKeyType?`,
`onSubmitEditing?`, `onFocus?`, `onBlur?`). Set `error` to show the error state.

**Select** dropdown with three modes via `type`: `'single'`, `'multi'` (tag
pills), `'combobox'` (search). Compound: put `SelectOption` (and optionally
`SelectGroup`, `SelectSeparator`) as children.

```tsx
<Select type="single" label="Country" value={country} onValueChange={setCountry}>
  <SelectOption value="uk">United Kingdom</SelectOption>
  <SelectOption value="us">United States</SelectOption>
</Select>
```

For `multi` use `values` / `onValuesChange`; for `combobox` use `searchValue` /
`onSearchChange`. Other props: `size?`, `placeholder?`, `leadingIcon?`,
`disabled?`, `error?`.

**Checkbox** `checked?` (`true | false | 'indeterminate'`), `onChange?`,
`children?` (label), `size?`, `disabled?`.

**Radio** a single control with `value?`, `checked?`, `onChange?`, `children?`,
`size?`. Use **RadioGroup** to manage a set: `value`, `onValueChange`, `size?`,
`disabled?`, with `Radio` children.

```tsx
<RadioGroup value={plan} onValueChange={setPlan}>
  <Radio value="free">Free</Radio>
  <Radio value="pro">Pro</Radio>
</RadioGroup>
```

**Toggle** on/off switch. `checked?`, `onChange?`, `children?` (label), `size?`,
`disabled?`.

**Chip** compact element for filters, selections, tags. `children: string`,
`intent?`, `variant?` (`'outline' | 'subtle'`), `size?`, `selected?`,
`disabled?`, `leadingIcon?`, `onPress?`, `onRemove?` (shows a remove affordance).

### Display and feedback

**Badge** small pill for labels, counts, status. `children: string`, `intent?`,
`variant?` (`'solid' | 'subtle' | 'outline'`), `size?`, `dot?` (status dot),
`leadingIcon?`, `trailingIcon?`.

**Alert** inline message. `intent?`, `size?`, `variant?` (`'subtle' | 'outline'`),
`title?`, `description?`, `icon?` (string name, custom node, or `null` to hide),
`onClose?` (shows a close button).

**Toast** brief notification. `title: string`, `children?` (body), `intent?`,
`size?`, `icon?`, `onClose?`.

**Card** content container. `size?`, `variant?` (`'outline' | 'elevated'`),
`image?`, `icon?`, `title?`, `subtitle?`, `body?`, `actions?` (a node, usually
buttons), or arbitrary `children`.

**Avatar** user representation. `size?`, and one of `source` (image),
`initials` (string), or `icon`. Falls back gracefully across the three via
`type` resolution.

**Skeleton** loading placeholder. `shape?` (`'text' | 'circle' | 'rectangle'`),
`width?`, `height?`, `radius?`, `animated?` (pulse, on by default).

**Progress** linear progress bar. `value?` (0 to 100 for determinate, omit or
pass `null` for an indeterminate sweep), `intent?`, `size?`.

**Spinner** indeterminate circular loader. `intent?`, `size?`. Use Progress when
you know the percentage, Spinner when you do not.

**Tooltip** short hint on hover or focus. `children: string`, `direction?`
(`'top' | 'bottom' | 'left' | 'right'`), `size?`, `hasArrow?`.

### Overlays and layout

**Dialog** modal for confirmations and focused tasks. `open`, `onClose?`, plus
content props: `title` (required), `description?`, `icon?`, `size?`,
`primaryAction?` / `secondaryAction?` (each `{ label, onPress }` — no intent
field; the primary action renders bold brand), or `children`.
`DialogContent` is the card alone, for custom overlays.

```tsx
<Dialog
  open={open}
  onClose={close}
  title="Delete project?"
  description="This cannot be undone."
  primaryAction={{ label: 'Delete', onPress: remove }}
  secondaryAction={{ label: 'Cancel', onPress: close }}
/>
```

**BottomSheet** modal surface that slides up from the bottom. It hugs its content
up to about 90% of the screen height, then the content scrolls. `open`,
`onClose?`, `closeOnBackdropPress?` (default true), `title?`, `showHandle?`
(drag handle, default true), and `children`. `BottomSheetContent` is the sheet
card without the modal or animation, for inline use.

```tsx
<BottomSheet open={open} onClose={close} title="Share to">
  <Button intent="brand" prominence="bold" onPress={share}>Continue</Button>
</BottomSheet>
```

**Popover** anchored floating panel. `children` (the panel content),
`direction?`, `size?`, `hideArrow?`.

**List** vertical list. Compose `ListItem` (with `description?`, `icon?`,
`trailingIcon?`, `selected?`, `disabled?`, `onPress?`), `ListSubheader`, and
`ListDivider`.

```tsx
<List>
  <ListSubheader>Account</ListSubheader>
  <ListItem icon="person" onPress={openProfile}>Profile</ListItem>
  <ListDivider />
  <ListItem icon="logout" onPress={signOut}>Sign out</ListItem>
</List>
```

**Tabs** underline tab bar. `<Tabs value onValueChange intent? size?>` owns
selection; `<Tab value leadingIcon? disabled?>` is one tab. `intent` colours only
the selected tab's label and underline.

```tsx
<Tabs value={tab} onValueChange={setTab}>
  <Tab value="overview">Overview</Tab>
  <Tab value="activity">Activity</Tab>
</Tabs>
```

**Accordion** stack of expandable sections. `<Accordion type value? defaultValue?
onValueChange? size? collapsible?>` with `<AccordionItem value title leadingIcon?
disabled?>` children. `type` is `'single'` (one open at a time) or `'multiple'`.

```tsx
<Accordion type="single" defaultValue="shipping">
  <AccordionItem value="shipping" title="Shipping">
    Free delivery on orders over £50.
  </AccordionItem>
  <AccordionItem value="returns" title="Returns" leadingIcon="undo">
    Return any item within 30 days.
  </AccordionItem>
</Accordion>
```

### Added in 4.9

**Link** inline or standalone text link. `children: string`, `intent?`
(default brand), `size?`, `underline?` (`'none' | 'hover' | 'always'`),
`href?` (real anchor on web), `onPress?`, `leadingIcon?/trailingIcon?`,
`disabled?`.

**Backdrop** full-screen dimming scrim. `open`, `onPress?`, `invisible?`,
`children?` (centred, e.g. a Spinner). Fades with transition/standard.

**Breadcrumbs** hierarchy trail. `<Breadcrumbs size? separator?>` with
`<Breadcrumb current? onPress?>` children; the `current` item renders as text.

**CodeBlock** monospaced code on a subtle surface. `children: string`,
`title?`, `language?`, `showCopy?` (default true), `showLineNumbers?`, `size?`,
`onCopy?`.

**Drawer** panel sliding from an edge. `open`, `onClose?`, `anchor?`
(`'left' | 'right' | 'top' | 'bottom'`), `title?`, `closeOnBackdropPress?`.
`DrawerContent` is the panel alone.

**Menu** actions anchored to a trigger. `<Menu trigger placement? size?
open? onOpenChange? closeOnSelect?>` with `<MenuItem leadingIcon? intent?
disabled? onPress>`, `<MenuDivider>`, `<MenuLabel>` children. Fires actions;
holds no value (that's Select).

**ToggleButtonGroup** segmented control. `exclusive?` (default true) with
`value/onValueChange`, or multi with `values/onValuesChange`; `intent?`,
`size?`. `<ToggleButton value children? leadingIcon? disabled?>` per segment.

**AppBar** top bar. `title`, `leadingIcon?` + `onLeadingPress?`, `leading?`
(custom slot), `trailing?` (actions slot — note: not `actions`), `intent?`,
`prominence?` (bold = filled bar), `size?`, `align?` (`'start' | 'center'`).

**Slider** pick a number by dragging. `value?/defaultValue?/onValueChange?`,
`min?` (0), `max?` (100), `step?` (1), `intent?`, `size?`, `disabled?`.

**SpeedDial** FAB that fans into actions. `icon?/openIcon?`, `direction?`,
`intent?`, `size?`, `open?/onOpenChange?/defaultOpen?`, `backdrop?` (default
true); `<SpeedDialAction icon label onPress>` children.

**Table** columnar data. `<Table size? striped? hoverable?>` with
`TableHead/TableBody/TableRow/TableCell`; cells take `flex?`, `width?`,
`numeric?`, `align?`; rows take `onPress?`.

**Autocomplete** type-to-filter over a fixed list. `options:
{ value, label }[]`, `value?/defaultValue?/onValueChange?` (null = none),
`onInputChange?`, `label?/helperText?/placeholder?/leadingIcon?`, `size?`,
`filterOptions?`.

### Breakpoints (responsive layouts)

`useBreakpoint()` returns the active tier (`base` under 600, then `sm`/`md`/
`lg`/`xl` at 600/840/1200/1600). `useMinWidth('md')` is a boolean.
`useResponsiveValue({ base: 1, md: 2, lg: 3 })` picks per tier with fallback
to the nearest below. Fixed foundation: not on the theme, not exported by
cast-sync.

## Recipes

**Light/dark that follows the OS:**

```tsx
const scheme = useColorScheme();
<ThemeProvider colorMode={scheme === 'dark' ? 'dark' : 'light'}>
```

**A whole brand from Figma:** export `cast-theme.json` with the cast-sync plugin,
then `<ThemeProvider {...applyCastTheme(theme, mode)}>`.

**A destructive confirm:** `Dialog` with `primaryAction` `intent: 'danger'`.

**A primary plus secondary action row:** one `Button` `prominence="bold"`, the
rest `prominence="default"` or `"subtle"`, all the same `size`.

**Custom one-off styling:** most components accept a `style` prop for layout
(margin, width, alignSelf). Use it for positioning, not for recolouring,
recolour through the theme so it stays consistent.

## Conventions and gotchas

- **Text children are strings.** Button, Text, Badge, Chip, Tab, ListItem and
  similar take a plain string as children, not arbitrary JSX. Compose layout
  around them, not inside them.
- **Icons are names, not imports.** Pass a Material Symbols name string. If icons
  show as words, the Material Symbols font is not loaded (see Fonts).
- **Recolour through the theme, never hardcode hex** in component usage. Use the
  `colors` or `scheme` provider props, or `useTheme()` for your own views.
- **Density is set on the provider, not per component.** To make one region
  denser, nest a provider.
- **Web vs native focus:** the focus ring is web-only (a CSS outline). On native
  there is intentionally no focus ring, matching platform norms.
- **It is one cross-platform set.** The same import works on iOS, Android, and
  web; do not look for platform-specific entry points.
- **Discover exact props from types.** The package ships full `.d.ts`. The export
  surface lives in the package entry point, and each component exports its
  `XxxProps` type. The Storybook "Playground" story for a component is the live,
  exhaustive prop reference.

## When this skill does not apply

If the task is building or extending the library (new component, design tokens,
the Figma kit, cast-sync, Code Connect), this consumer guide is the wrong tool,
that work has its own maintainer playbook in the package repo.

<!-- Last reconciled: 2026-07-04 against @castui/cast-ui v4.10.0 (37 components, motion token system). -->
