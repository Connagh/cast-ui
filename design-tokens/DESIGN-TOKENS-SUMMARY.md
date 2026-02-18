# Design Tokens System - Complete Reference

## Overview

This design token system implements a professional three-tier architecture (Primitive > Semantic > Component). Every token is aliased through the correct layer, every value has a clear description, and the Default theme provides a neutral base for customisation via `createTheme()`.

> **Example themes (Consumer, Corporate, Luxury)** have moved to the [cast-ui-examples](https://github.com/Connagh/cast-ui-examples) repo. The comparisons below are kept for reference to illustrate how the token system supports completely different visual identities.

---

## Architecture

```
Primitive  -->  Semantic  -->  Component

Example chain:
  {Primitive.Colour.Blue-600}
    --> {Semantic.Colour.Primary}
      --> {Component.Button.Filled.Background}

  {Primitive.Font family.Font-humanist}
    --> {Semantic.Font family.Font-Brand}
      --> {Component.Card.Heading-Font-Family}

  {Primitive.Border radius.Radius-SM}
    --> {Semantic.Border radius.Radius-Medium}
      --> {Component.Button.Corner-Radius}
```

Changing a semantic token updates every component that references it. Changing a primitive updates every semantic token that references it. This is the foundation of a scalable, multi-brand design system.

---

## Primitive Tokens (Per-Theme Palette)

Each theme brings its own set of primitive tokens. The default theme uses Slate/Grey neutrals, but themed variants bring brand-specific palettes (Violet for Consumer, Blue for Corporate, Gold for Luxury). Primitives are never used directly in designs — they are only referenced by semantic tokens. cast-sync discovers primitives dynamically at export/import time, so adding new colour scales requires no code changes.

### Colours (40 tokens)

Brand colors provide a 5-stop scale (50 = lightest tint, 800 = darkest shade). Neutrals (Grey, Slate) extend to 900 for finer granularity. Pure white and black are standalone constants.

#### Brand Color Scales (5 stops each)

| Token | Hex | Purpose |
|-------|-----|---------|
| **Blue-50** | #EBF2FB | Lightest blue tint for backgrounds |
| **Blue-200** | #9EC2E9 | Soft blue for secondary fills |
| **Blue-400** | #628BE4 | Medium blue for interactive elements |
| **Blue-600** | #0C346F | Deep blue for primary brand |
| **Blue-800** | #072350 | Darkest blue for high-contrast emphasis |
| **Red-50** | #FDF2F2 | Lightest red for error backgrounds |
| **Red-200** | #E99E9E | Soft red for secondary error accents |
| **Red-400** | #E46262 | Medium red for error indicators |
| **Red-600** | #6F0C0C | Deep red for critical error states |
| **Red-800** | #4A0808 | Darkest red for high-contrast errors |
| **Green-50** | #F0FDF1 | Lightest green for success backgrounds |
| **Green-200** | #9EE9A1 | Soft green for secondary success |
| **Green-400** | #3DC253 | Medium green for success indicators |
| **Green-600** | #0C6F1E | Deep green for confirmed success |
| **Green-800** | #084A14 | Darkest green for high-contrast success |
| **Gold-50** | #FDF8EB | Lightest gold for warning backgrounds |
| **Gold-200** | #E9D8A6 | Soft gold for secondary warnings |
| **Gold-400** | #CAAD5F | Medium gold for warning indicators |
| **Gold-600** | #947C3E | Deep gold for prominent warnings |
| **Gold-800** | #6B592D | Darkest gold for high-contrast emphasis |
| **Violet-50** | #F5F0FF | Lightest violet for accent backgrounds |
| **Violet-200** | #D6BCFA | Soft violet for secondary accents |
| **Violet-400** | #9F7AEA | Medium violet for interactive accents |
| **Violet-600** | #553C9A | Deep violet for primary brand |
| **Violet-800** | #3B2870 | Darkest violet for high-contrast brand |

#### Neutral Scales (6 stops for finer text/UI control)

| Token | Hex | Purpose |
|-------|-----|---------|
| **Grey-50** | #F7F7F7 | Lightest grey for subtle backgrounds |
| **Grey-200** | #D8D8D8 | Soft grey for borders and dividers |
| **Grey-400** | #B1B1B1 | Medium grey for placeholder text |
| **Grey-600** | #696969 | Deep grey for secondary content |
| **Grey-800** | #3D3D3D | Darkest grey for high-contrast elements |
| **Grey-900** | #222222 | Near-black grey for maximum depth on light surfaces |
| **Slate-50** | #F8FAFC | Lightest slate for subtle backgrounds |
| **Slate-200** | #E2E8F0 | Soft slate for borders and cards |
| **Slate-400** | #94A3B8 | Medium slate for muted text |
| **Slate-600** | #475569 | Deep slate for secondary body text |
| **Slate-800** | #1E293B | Dark slate for headings |
| **Slate-900** | #0F172A | Darkest slate for primary text |

#### Absolute Extremes (not part of scales)

| Token | Hex | Purpose |
|-------|-----|---------|
| **White** | #FFFFFF | Pure white for light backgrounds and contrast text |
| **Black** | #000000 | Pure black for dark backgrounds and high-contrast text |

### Spacing (9 tokens, 8-point grid)

| Token | Value | Purpose |
|-------|-------|---------|
| 025 | 2px | Micro-adjustments (hairlines, tight borders) |
| 050 | 4px | Small gaps (label to input, icon to text) |
| 100 | 8px | Standard gap between elements |
| 150 | 12px | Comfortable internal padding |
| 200 | 16px | Standard padding for cards/sections |
| 300 | 24px | Large section spacing |
| 400 | 32px | Major layout breathing room |
| 600 | 48px | Vertical section spacing on web |
| 800 | 64px | Hero section margins |

### Text Size (6 tokens, modular scale)

| Token | Value | Purpose |
|-------|-------|---------|
| Text-size-100 | 12.8px | Smallest text for fine print and labels |
| Text-size-200 | 16px | Base body text size |
| Text-size-300 | 20px | Slightly larger for sub-headings |
| Text-size-400 | 25px | Mid-range heading size |
| Text-size-500 | 31px | Large heading for page titles |
| Text-size-600 | 39px | Extra-large display text |

### Font Weight (3 tokens)

| Token | Value | Purpose |
|-------|-------|---------|
| Weight-Regular | 400 | Standard weight for body text |
| Weight-Medium | 500 | Medium emphasis for buttons and labels |
| Weight-Bold | 700 | Strong emphasis for headings |

### Line Height (6 tokens, pixel values)

| Token | Value | Purpose |
|-------|-------|---------|
| 16 | 16px | Tight / UI labels, buttons |
| 20 | 20px | Small text |
| 24 | 24px | Body text, h3 headings |
| 32 | 32px | h2 headings |
| 40 | 40px | h1 headings |
| 48 | 48px | Display headings |

### Letter Spacing (5 tokens)

| Token | Value | Purpose |
|-------|-------|---------|
| Tracking-Tight | -0.02 | Tight letter spacing for large headings (-2%) |
| Tracking-Normal | 0 | Default letter spacing (0%) |
| Tracking-Wide | 0.02 | Wide letter spacing for small text or uppercase (+2%) |
| Tracking-Wider | 0.05 | Extra-wide tracking for labels and small caps (+5%) |
| Tracking-Widest | 0.1 | Maximum tracking for dramatic display text (+10%) |

### Paragraph Spacing (6 tokens)

| Token | Value | Purpose |
|-------|-------|---------|
| Para-None | 0px | No space between paragraphs |
| Para-Tight | 8px | Tight paragraph spacing |
| Para-Normal | 16px | Standard paragraph spacing |
| Para-Loose | 24px | Generous paragraph spacing |
| Para-Spacious | 32px | Spacious paragraph separation |
| Para-Airy | 48px | Very airy spacing for editorial layouts |

### Paragraph Indent (4 tokens)

| Token | Value | Purpose |
|-------|-------|---------|
| Indent-None | 0px | No first-line indent |
| Indent-Small | 16px | Small first-line indent |
| Indent-Medium | 32px | Medium first-line indent for book-style typography |
| Indent-Large | 48px | Large first-line indent for dramatic editorial style |

### Font Family (7 tokens)

| Token | Value | Purpose |
|-------|-------|---------|
| Font-sans | Inter | Clean, modern sans-serif for UI and body text |
| Font-serif | Playfair Display | Classic serif for editorial headings |
| Font-mono | JetBrains Mono | Monospaced font for code and data |
| Font-geometric | Poppins | Rounded geometric sans-serif for friendly brands |
| Font-humanist | Merriweather | Traditional humanist serif for professional brands |
| Font-display | Cormorant Garamond | Elegant display serif for luxury headings |
| Font-system | system-ui | Native OS typeface for maximum neutrality |

### Border Radius (8 tokens)

| Token | Value | Purpose |
|-------|-------|---------|
| Radius-None | 0px | Sharp corners with no rounding |
| Radius-XS | 2px | Minimal rounding for subtle softness |
| Radius-SM | 4px | Small rounding for inputs and chips |
| Radius-MD | 8px | Standard rounding for buttons and cards |
| Radius-LG | 12px | Generous rounding for prominent containers |
| Radius-XL | 16px | Large rounding for featured elements |
| Radius-2XL | 24px | Extra-large rounding for pill shapes |
| Radius-Full | 9999px | Fully circular for avatars and badges |

---

## Semantic Tokens (Theme-Specific Mapping)

Semantic tokens alias primitive tokens and provide the theming layer. When you switch themes in Figma, these values change and every component updates automatically.

### Colour Tokens (30 tokens per theme)

| Semantic Token | Consumer | Corporate | Luxury | Default |
|----------------|----------|-----------|--------|-------------|
| Surface | White | White | **Black** | White |
| On-Surface | Violet-600 | Blue-600 | **Gold-200** | Slate-900 |
| On-Surface-Muted | Slate-600 | Slate-600 | **Grey-400** | Slate-600 |
| Surface-Container | Slate-50 | Slate-50 | **Grey-600** | Slate-50 |
| Primary | Violet-600 | Blue-600 | **Gold-400** | Slate-900 |
| On-Primary | White | White | **Black** | White |
| Primary-Hover | Violet-400 | Blue-400 | Gold-200 | Slate-800 |
| Primary-Pressed | Violet-200 | Blue-200 | Gold-600 | Slate-600 |
| Secondary | Violet-200 | Slate-600 | Grey-400 | Slate-200 |
| On-Secondary | Violet-600 | White | Black | Slate-900 |
| Success | Green-400 | Green-600 | Green-400 | Green-600 |
| Error | Red-400 | Red-600 | Red-400 | Red-600 |
| Warning | Gold-400 | Gold-600 | Gold-400 | Gold-600 |
| Border | Slate-200 | Blue-200 | **Gold-600** | Slate-200 |
| Disabled-Container | Slate-200 | Slate-200 | Grey-600 | Slate-200 |
| On-Disabled | Slate-400 | Slate-400 | Grey-400 | Slate-400 |
| **Primary-Container** | Violet-50 | Blue-50 | **Gold-800** | Slate-200 |
| **On-Primary-Container** | Violet-800 | Blue-800 | **Gold-200** | Slate-900 |
| **Secondary-Container** | Violet-50 | Slate-200 | **Grey-800** | Slate-50 |
| **On-Secondary-Container** | Violet-800 | Slate-800 | **Grey-200** | Slate-800 |
| **Error-Container** | Red-50 | Red-50 | **Red-800** | Red-50 |
| **On-Error-Container** | Red-800 | Red-800 | **Red-200** | Red-800 |
| **Success-Container** | Green-50 | Green-50 | **Green-800** | Green-50 |
| **On-Success-Container** | Green-800 | Green-800 | **Green-200** | Green-800 |
| **Warning-Container** | Gold-50 | Gold-50 | **Gold-800** | Gold-50 |
| **On-Warning-Container** | Gold-800 | Gold-800 | **Gold-200** | Gold-800 |

### Typography Tokens (per theme)

#### Font Family (3 semantic tokens, mapped differently per theme)

| Semantic Token | Consumer | Corporate | Luxury | Default |
|----------------|----------|-----------|--------|-------------|
| **Font-Brand** | Poppins (geometric) | Merriweather (humanist) | Playfair Display (serif) | system-ui (system) |
| **Font-Interface** | Poppins (geometric) | Inter (sans) | Cormorant Garamond (display) | system-ui (system) |
| **Font-Data** | JetBrains Mono | JetBrains Mono | JetBrains Mono | JetBrains Mono |

This is the key typographic differentiation: switching themes in Figma completely changes the typefaces used throughout the design. Developers can consume `Font-Brand` and `Font-Interface` from Figma tokens to apply the correct font for each theme.

#### Text Size (11 tokens, consistent mapping across themes)

| Token | Maps to | Resolves to |
|-------|---------|-------------|
| Text-size-display | Text-size-600 | 39px |
| Text-size-h1 | Text-size-500 | 31px |
| Text-size-h2 | Text-size-400 | 25px |
| Text-size-h3 | Text-size-300 | 20px |
| Text-size-subtitle | Text-size-300 | 20px |
| Text-size-body | Text-size-200 | 16px |
| Text-size-small | Text-size-100 | 12.8px |
| Text-size-caption | Text-size-100 | 12.8px |
| Text-size-overline | Text-size-100 | 12.8px |
| Text-size-label | Text-size-100 | 12.8px |
| Text-size-button | Text-size-200 (most) / Text-size-100 (Luxury) | 16px / 12.8px |

#### Font Weight (3 tokens)

| Token | Consumer/Corporate/Default | Luxury |
|-------|-------------------------------|--------|
| Weight-heading | Bold (700) | Bold (700) |
| Weight-body | Regular (400) | Regular (400) |
| Weight-button | Medium (500) | **Bold (700)** |

#### Line Height (11 tokens, pixel values, consistent across themes)

| Token | Maps to | Value |
|-------|---------|-------|
| Line-Height-display | 48 | 48px |
| Line-Height-h1 | 40 | 40px |
| Line-Height-h2 | 32 | 32px |
| Line-Height-h3 | 24 | 24px |
| Line-Height-subtitle | 24 | 24px |
| Line-Height-body | 24 | 24px |
| Line-Height-small | 20 | 20px |
| Line-Height-caption | 16 | 16px |
| Line-Height-overline | 16 | 16px |
| Line-Height-label | 16 | 16px |
| Line-Height-button | 16 | 16px |

#### Letter Spacing (3 tokens, consistent across themes)

| Token | Maps to | Value |
|-------|---------|-------|
| Tracking-heading | Tracking-Tight | -0.02 |
| Tracking-body | Tracking-Normal | 0 |
| Tracking-label | Tracking-Wide | 0.02 |

#### Paragraph Spacing (2 tokens, theme-specific)

| Token | Consumer | Corporate | Luxury | Default |
|-------|----------|-----------|--------|-------------|
| **Para-body** | Para-Normal (16px) | Para-Tight (8px) | Para-Spacious (32px) | Para-Normal (16px) |
| **Para-editorial** | Para-Loose (24px) | Para-Normal (16px) | Para-Airy (48px) | Para-Loose (24px) |

**Theme personality:**
- **Consumer/Default**: Standard spacing for web content
- **Corporate**: Tighter spacing for information density
- **Luxury**: Very generous spacing for editorial elegance

#### Paragraph Indent (1 token, theme-specific)

| Token | Consumer | Corporate | Luxury | Default |
|-------|----------|-----------|--------|-------------|
| **Indent-editorial** | None (0px) | None (0px) | Medium (32px) | None (0px) |

**Luxury stands alone** with first-line indents for traditional book-style editorial typography. Other themes use modern block paragraphs.

### Border Radius (4 semantic tokens)

| Semantic Token | Consumer | Corporate | Luxury | Default |
|----------------|----------|-----------|--------|-------------|
| **Radius-Small** | Radius-MD (8px) | Radius-XS (2px) | Radius-None (0px) | Radius-SM (4px) |
| **Radius-Medium** | Radius-2XL (24px) | Radius-SM (4px) | Radius-None (0px) | Radius-MD (8px) |
| **Radius-Large** | Radius-XL (16px) | Radius-MD (8px) | Radius-None (0px) | Radius-LG (12px) |
| **Radius-Full** | Radius-Full (9999px) | Radius-Full (9999px) | Radius-None (0px) | Radius-Full (9999px) |

### Overlay (1 semantic token)

| Semantic Token | Default |
|----------------|---------|
| **Overlay** | Black (#000000) — used with a separate opacity value for backdrop scrim |

### Spacing (5 semantic tokens)

| Semantic Token | Maps to | Value |
|----------------|---------|-------|
| **Spacing-XS** | Primitive Spacing 050 | 4px |
| **Spacing-SM** | Primitive Spacing 100 | 8px |
| **Spacing-MD** | Primitive Spacing 150 | 12px |
| **Spacing-LG** | Primitive Spacing 200 | 16px |
| **Spacing-XL** | Primitive Spacing 300 | 24px |

### Border Width (2 semantic tokens)

| Semantic Token | Value |
|----------------|-------|
| **Border-Width-Thin** | 1px |
| **Border-Width-Medium** | 2px |

### Elevation (6 semantic tokens)

| Semantic Token | Value |
|----------------|-------|
| **Elevation-None** | 0 |
| **Elevation-XS** | 1 |
| **Elevation-SM** | 2 |
| **Elevation-MD** | 3 |
| **Elevation-LG** | 4 |
| **Elevation-XL** | 6 |

### Size (7 semantic tokens)

| Semantic Token | Value |
|----------------|-------|
| **Size-XS** | 2px |
| **Size-SM** | 4px |
| **Size-MD** | 16px |
| **Size-LG** | 24px |
| **Size-XL** | 32px |
| **Size-2XL** | 48px |
| **Size-3XL** | 64px |

### Opacity (2 semantic tokens)

| Semantic Token | Value |
|----------------|-------|
| **Opacity-Disabled** | 0.4 |
| **Opacity-Overlay** | 0.5 |

---

## Component Tokens

Component tokens reference semantic tokens to build complete, theme-aware UI components. They never reference primitive tokens directly (except for spacing, which is consistent across themes).

### Button Component

| Token | Description | Consumer | Corporate | Luxury | Default |
|-------|-------------|----------|-----------|--------|-------------|
| Padding-Horizontal | Left/right inner spacing | 16px | 24px | 32px | 16px |
| Padding-Vertical | Top/bottom inner spacing | 12px | 12px | 16px | 8px |
| Gap | Space between icon and text | 8px | 8px | 12px | 8px |
| **Corner-Radius** | `{Semantic.Border radius.Radius-Medium}` | 24px | 4px | 0px | 8px |
| Border-Width | Outline button border | 2px | 2px | 2px | 2px |
| Text-Size | `{Semantic.Text size.Text-size-button}` | 16px | 16px | 12.8px | 16px |
| Font-Weight | `{Semantic.Font weight.Weight-button}` | 500 | 500 | 700 | 500 |
| Line-Height | `{Semantic.Line height.Line-Height-button}` | 16px | 16px | 16px | 16px |
| **Font-Family** | `{Semantic.Font family.Font-Interface}` | Poppins | Inter | Cormorant Garamond | system-ui |

#### Button Variants

| Token | Filled | Outline | Text |
|-------|--------|---------|------|
| Background | `{Semantic.Colour.Primary}` | `{Semantic.Colour.Surface}` | `{Semantic.Colour.Surface}` |
| Content | `{Semantic.Colour.On-Primary}` | `{Semantic.Colour.Primary}` | `{Semantic.Colour.Primary}` |
| Border | — | `{Semantic.Colour.Primary}` | — |

#### Button States

| Token | Value |
|-------|-------|
| Hover-Background | `{Semantic.Colour.Primary-Hover}` |
| Pressed-Background | `{Semantic.Colour.Primary-Pressed}` |
| Disabled-Background | `{Semantic.Colour.Disabled-Container}` |
| Disabled-Content | `{Semantic.Colour.On-Disabled}` |

### Card Component

| Token | Description | Consumer | Corporate | Luxury | Default |
|-------|-------------|----------|-----------|--------|-------------|
| Padding | Inner spacing | 24px | 16px | 32px | 16px |
| Gap | Spacing between elements | 12px | 8px | 16px | 12px |
| **Corner-Radius** | `{Semantic.Border radius.Radius-Large}` | 16px | 8px | 0px | 12px |
| Stroke-Width | Border thickness | 2px | 2px | 1px | 2px |
| Elevation | Shadow depth | 4 | 2 | 0 | 1 |
| Background | `{Semantic.Colour.Surface-Container}` | Per theme | Per theme | Per theme | Per theme |
| Stroke | `{Semantic.Colour.Border}` | Per theme | Per theme | Per theme | Per theme |
| Heading-Size | Card title size | 20px (h3) | 20px (h3) | 25px (h2) | 20px (h3) |
| Heading-Weight | `{Semantic.Font weight.Weight-heading}` | Bold | Bold | Bold | Bold |
| **Heading-Font-Family** | `{Semantic.Font family.Font-Brand}` | Poppins | Merriweather | Playfair Display | system-ui |
| Body-Size | Card body size | 16px | 16px | 16px | 16px |
| Body-Weight | `{Semantic.Font weight.Weight-body}` | Regular | Regular | Regular | Regular |
| **Body-Font-Family** | `{Semantic.Font family.Font-Interface}` | Poppins | Inter | Cormorant Garamond | system-ui |
| **Heading-Color** | `{Semantic.Colour.On-Surface}` | Per theme | Per theme | Per theme | Slate-900 |
| **Body-Color** | `{Semantic.Colour.On-Surface-Muted}` | Per theme | Per theme | Per theme | Slate-600 |

---

## Theme Characteristics

### Consumer (Vibrant & Friendly)
- **Primary colour**: Violet-600 (#553C9A)
- **Typography**: Poppins throughout — round, approachable, modern
- **Border radius**: Very rounded (buttons 24px pill, cards 16px)
- **Elevation**: Soft shadows (4px)
- **Personality**: Playful, inviting, consumer-friendly

### Corporate (Professional & Trustworthy)
- **Primary colour**: Blue-600 (#0C346F)
- **Typography**: Merriweather for brand headings, Inter for UI — authoritative serif + clean sans
- **Border radius**: Crisp and sharp (buttons 4px, cards 8px)
- **Elevation**: Subtle shadows (2px)
- **Paragraph style**: Tight paragraph spacing (8px body, 16px editorial) for information density
- **Personality**: Professional, structured, business-appropriate

### Luxury (Dark & Elegant)
- **Primary colour**: Gold-400 (#CAAD5F) on Black surface
- **Typography**: Playfair Display for brand, Cormorant Garamond for UI — all-serif luxury feel
- **Border radius**: Zero on everything (angular, sharp, architectural)
- **Elevation**: Flat (0px) — relies on gold borders for definition
- **Button style**: Bold weight, small uppercase text (12.8px), generous padding (32px horizontal)
- **Paragraph style**: Very spacious paragraph separation (32px body, 48px editorial) with first-line indent (32px) for classic book typography
- **Personality**: Premium, exclusive, high-end

### Default (Neutral & Minimal)
- **Primary colour**: Slate-900 (#0F172A)
- **Typography**: system-ui throughout — adapts to the user's OS, maximally neutral
- **Border radius**: Moderate and balanced (buttons 8px, cards 12px)
- **Elevation**: Minimal shadow (1px)
- **Personality**: Clean, adaptable, ready for brand customisation via `createTheme()`

---

## What Changes When Themes Switch

When a designer or developer switches themes in Figma, **all of the following change simultaneously**:

1. **Colour palette** — primary, surface, feedback, border, and state colours
2. **Font families** — brand headings and interface text use completely different typefaces
3. **Border radius** — from pill-shaped (Consumer) to razor-sharp (Luxury)
4. **Spacing rhythm** — button padding and card density differ per theme
5. **Elevation** — from pronounced shadows to completely flat
6. **Typography weight** — Luxury uses bold buttons; others use medium
7. **Paragraph spacing** — from tight corporate (8px) to airy luxury (32-48px)
8. **Paragraph indent** — Luxury uses traditional first-line indent (32px); others use modern block paragraphs

This ensures each theme is a genuinely distinct visual experience, not just a colour swap.

---

## Developer Consumption

Developers can consume these tokens through Figma's token export or tools like Style Dictionary. The semantic layer provides the API surface:

```css
/* Example CSS custom properties from tokens */
--colour-primary: var(--semantic-colour-primary);
--font-brand: var(--semantic-font-family-font-brand);
--font-interface: var(--semantic-font-family-font-interface);
--radius-medium: var(--semantic-border-radius-radius-medium);
--tracking-body: var(--semantic-letter-spacing-tracking-body);
--para-body: var(--semantic-paragraph-spacing-para-body);
--para-indent: var(--semantic-paragraph-indent-indent-editorial);
```

```jsx
// Example React usage
<Button
  style={{
    backgroundColor: tokens.semantic.colour.primary,
    fontFamily: tokens.semantic.fontFamily.fontInterface,
    borderRadius: tokens.semantic.borderRadius.radiusMedium,
    fontWeight: tokens.semantic.fontWeight.weightButton,
    letterSpacing: tokens.semantic.letterSpacing.trackingLabel,
  }}
/>

<Article
  style={{
    fontFamily: tokens.semantic.fontFamily.fontInterface,
    letterSpacing: tokens.semantic.letterSpacing.trackingBody,
    marginBottom: tokens.semantic.paragraphSpacing.paraBody,
    textIndent: tokens.semantic.paragraphIndent.indentEditorial,
  }}
/>
```

### TextField Component (17 tokens)

Shared input base used by Autocomplete and Select.

| Token | Type | Default Reference |
|-------|------|-------------------|
| Padding-Horizontal | number | `{Primitive.Spacing.150}` (12) |
| Padding-Vertical | number | `{Primitive.Spacing.100}` (8) |
| Corner-Radius | number | `{Semantic.Border radius.Radius-Medium}` (8) |
| Border-Width | number | `{Primitive.Spacing.025}` (2) |
| Background | color | `{Semantic.Colour.Surface}` |
| Border-Color | color | `{Semantic.Colour.Border}` |
| Focus-Border-Color | color | `{Semantic.Colour.Primary}` |
| Error-Border-Color | color | `{Semantic.Colour.Error}` |
| Text-Color | color | `{Semantic.Colour.On-Surface}` |
| Placeholder-Color | color | `{Semantic.Colour.On-Surface-Muted}` |
| Text-Size | number | `{Semantic.Text size.Text-size-body}` (16) |
| Font-Family | string | `{Semantic.Font family.Font-Interface}` |
| Label-Color | color | `{Semantic.Colour.On-Surface}` |
| Label-Size | number | `{Semantic.Text size.Text-size-small}` (12.8) |
| Helper-Color | color | `{Semantic.Colour.On-Surface-Muted}` |
| Helper-Size | number | `{Semantic.Text size.Text-size-small}` (12.8) |
| Error-Color | color | `{Semantic.Colour.Error}` |

### Checkbox Component (11 tokens)

| Token | Type | Default Reference |
|-------|------|-------------------|
| Size | number | `{Primitive.Spacing.200}` (16) |
| Corner-Radius | number | `{Semantic.Border radius.Radius-Small}` (4) |
| Border-Width | number | `{Primitive.Spacing.025}` (2) |
| Gap | number | `{Primitive.Spacing.100}` (8) |
| Border-Color | color | `{Semantic.Colour.Border}` |
| Checked-Background | color | `{Semantic.Colour.Primary}` |
| Checked-Icon-Color | color | `{Semantic.Colour.On-Primary}` |
| Label-Color | color | `{Semantic.Colour.On-Surface}` |
| Label-Size | number | `{Semantic.Text size.Text-size-body}` (16) |
| Label-Font-Family | string | `{Semantic.Font family.Font-Interface}` |
| Disabled-Opacity | number | 0.4 |

### FAB Component (10 tokens)

Floating Action Button.

| Token | Type | Default Reference |
|-------|------|-------------------|
| Size | number | `{Primitive.Spacing.600}` (48) |
| Corner-Radius | number | `{Semantic.Border radius.Radius-Full}` (9999) |
| Background | color | `{Semantic.Colour.Primary}` |
| Icon-Color | color | `{Semantic.Colour.On-Primary}` |
| Icon-Size | number | `{Primitive.Spacing.300}` (24) |
| Hover-Background | color | `{Semantic.Colour.Primary-Hover}` |
| Pressed-Background | color | `{Semantic.Colour.Primary-Pressed}` |
| Elevation | number | 4 |
| Extended-Padding-Horizontal | number | `{Primitive.Spacing.200}` (16) |
| Extended-Gap | number | `{Primitive.Spacing.100}` (8) |

### Autocomplete Component (9 tokens)

Input uses TextField tokens; these are dropdown-specific.

| Token | Type | Default Reference |
|-------|------|-------------------|
| Dropdown-Background | color | `{Semantic.Colour.Surface}` |
| Dropdown-Corner-Radius | number | `{Semantic.Border radius.Radius-Medium}` (8) |
| Dropdown-Elevation | number | 2 |
| Option-Hover-Background | color | `{Semantic.Colour.Surface-Container}` |
| Option-Text-Color | color | `{Semantic.Colour.On-Surface}` |
| Option-Text-Size | number | `{Semantic.Text size.Text-size-body}` (16) |
| Option-Padding-Horizontal | number | `{Semantic.Spacing.Spacing-LG}` (16) |
| Option-Padding-Vertical | number | `{Semantic.Spacing.Spacing-SM}` (8) |
| Font-Family | string | `{Semantic.Font family.Font-Interface}` |

### Select Component (11 tokens)

Input uses TextField tokens; these are dropdown-specific.

| Token | Type | Default Reference |
|-------|------|-------------------|
| Dropdown-Background | color | `{Semantic.Colour.Surface}` |
| Dropdown-Corner-Radius | number | `{Semantic.Border radius.Radius-Medium}` (8) |
| Dropdown-Elevation | number | 2 |
| Option-Hover-Background | color | `{Semantic.Colour.Surface-Container}` |
| Indicator-Color | color | `{Semantic.Colour.On-Surface-Muted}` |
| Option-Text-Color | color | `{Semantic.Colour.On-Surface}` |
| Option-Text-Size | number | `{Semantic.Text size.Text-size-body}` (16) |
| Option-Padding-Horizontal | number | `{Semantic.Spacing.Spacing-LG}` (16) |
| Option-Padding-Vertical | number | `{Semantic.Spacing.Spacing-SM}` (8) |
| Font-Family | string | `{Semantic.Font family.Font-Interface}` |
| Selected-Option-Background | color | `{Semantic.Colour.Primary-Container}` |

### Switch Component (14 tokens)

| Token | Type | Default Reference |
|-------|------|-------------------|
| Track-Width | number | `{Primitive.Spacing.600}` (48) |
| Track-Height | number | `{Primitive.Spacing.300}` (24) |
| Track-Corner-Radius | number | `{Semantic.Border radius.Radius-Full}` (9999) |
| Track-Off-Background | color | `{Semantic.Colour.Border}` |
| Track-On-Background | color | `{Semantic.Colour.Primary}` |
| Thumb-Size | number | `{Primitive.Spacing.200}` (16) |
| Thumb-Corner-Radius | number | `{Semantic.Border radius.Radius-Full}` (9999) |
| Thumb-Off-Background | color | `{Semantic.Colour.Surface}` |
| Thumb-On-Background | color | `{Semantic.Colour.On-Primary}` |
| Thumb-Offset | number | `{Primitive.Spacing.050}` (4) |
| Label-Color | color | `{Semantic.Colour.On-Surface}` |
| Label-Size | number | `{Semantic.Text size.Text-size-body}` (16) |
| Label-Font-Family | string | `{Semantic.Font family.Font-Interface}` |
| Gap | number | `{Primitive.Spacing.100}` (8) |

### Badge Component (8 tokens)

| Token | Type | Default Reference |
|-------|------|-------------------|
| Min-Size | number | `{Primitive.Spacing.200}` (16) |
| Padding-Horizontal | number | `{Primitive.Spacing.050}` (4) |
| Corner-Radius | number | `{Semantic.Border radius.Radius-Full}` (9999) |
| Background | color | `{Semantic.Colour.Error}` |
| Content-Color | color | `{Semantic.Colour.On-Error}` |
| Text-Size | number | `{Semantic.Text size.Text-size-small}` (12.8) |
| Font-Weight | number | `{Semantic.Font weight.Weight-button}` (500) |
| Font-Family | string | `{Semantic.Font family.Font-Interface}` |

### Chip Component (12 tokens)

| Token | Type | Default Reference |
|-------|------|-------------------|
| Padding-Horizontal | number | `{Primitive.Spacing.150}` (12) |
| Padding-Vertical | number | `{Primitive.Spacing.050}` (4) |
| Gap | number | `{Primitive.Spacing.050}` (4) |
| Corner-Radius | number | `{Semantic.Border radius.Radius-Small}` (4) |
| Background | color | `{Semantic.Colour.Secondary-Container}` |
| Content-Color | color | `{Semantic.Colour.On-Secondary-Container}` |
| Selected-Background | color | `{Semantic.Colour.Primary-Container}` |
| Selected-Content-Color | color | `{Semantic.Colour.On-Primary-Container}` |
| Border-Width | number | `{Primitive.Spacing.025}` (2) |
| Border-Color | color | `{Semantic.Colour.Border}` |
| Text-Size | number | `{Semantic.Text size.Text-size-small}` (12.8) |
| Font-Family | string | `{Semantic.Font family.Font-Interface}` |

### Divider Component (3 tokens)

| Token | Type | Default Reference |
|-------|------|-------------------|
| Color | color | `{Semantic.Colour.Border}` |
| Thickness | number | 1 |
| Margin | number | `{Primitive.Spacing.100}` (8) |

### Icon Component (3 tokens)

Icon colour is inherited from parent component — only sizes are tokenized.

| Token | Type | Default Reference |
|-------|------|-------------------|
| Size-Small | number | `{Primitive.Spacing.200}` (16) |
| Size-Medium | number | `{Primitive.Spacing.300}` (24) |
| Size-Large | number | `{Primitive.Spacing.400}` (32) |

### Table Component (13 tokens)

| Token | Type | Default Reference |
|-------|------|-------------------|
| Header-Background | color | `{Semantic.Colour.Surface-Container}` |
| Header-Text-Color | color | `{Semantic.Colour.On-Surface}` |
| Header-Font-Weight | number | `{Semantic.Font weight.Weight-heading}` (700) |
| Header-Text-Size | number | `{Semantic.Text size.Text-size-small}` (12.8) |
| Cell-Text-Color | color | `{Semantic.Colour.On-Surface}` |
| Cell-Text-Size | number | `{Semantic.Text size.Text-size-body}` (16) |
| Cell-Padding-Horizontal | number | `{Primitive.Spacing.150}` (12) |
| Cell-Padding-Vertical | number | `{Primitive.Spacing.100}` (8) |
| Row-Border-Color | color | `{Semantic.Colour.Border-Subtle}` |
| Row-Border-Width | number | 1 |
| Row-Hover-Background | color | `{Semantic.Colour.Surface-Container}` |
| Corner-Radius | number | `{Semantic.Border radius.Radius-Medium}` (8) |
| Font-Family | string | `{Semantic.Font family.Font-Interface}` |

### Alert Component (14 tokens)

Severity colours (success/error/warning) are read from semantic container tokens at runtime.

| Token | Type | Default Reference |
|-------|------|-------------------|
| Padding | number | `{Primitive.Spacing.200}` (16) |
| Gap | number | `{Primitive.Spacing.100}` (8) |
| Corner-Radius | number | `{Semantic.Border radius.Radius-Medium}` (8) |
| Border-Width | number | `{Primitive.Spacing.025}` (2) |
| Background | color | `{Semantic.Colour.Surface-Container}` |
| Border-Color | color | `{Semantic.Colour.Border}` |
| Title-Color | color | `{Semantic.Colour.On-Surface}` |
| Body-Color | color | `{Semantic.Colour.On-Surface}` |
| Icon-Color | color | `{Semantic.Colour.On-Surface}` |
| Font-Family | string | `{Semantic.Font family.Font-Interface}` |
| Icon-Size | number | `{Primitive.Spacing.300}` (24) |
| Title-Size | number | `{Semantic.Text size.Text-size-body}` (16) |
| Title-Font-Weight | number | `{Semantic.Font weight.Weight-heading}` (700) |
| Body-Size | number | `{Semantic.Text size.Text-size-small}` (12.8) |

### Backdrop Component (2 tokens)

| Token | Type | Default Reference |
|-------|------|-------------------|
| Color | color | `{Semantic.Colour.Overlay}` |
| Opacity | number | 0.5 |

### Skeleton Component (4 tokens)

| Token | Type | Default Reference |
|-------|------|-------------------|
| Background | color | `{Semantic.Colour.Surface-Container}` |
| Highlight | color | `{Semantic.Colour.Border-Subtle}` |
| Corner-Radius | number | `{Semantic.Border radius.Radius-Small}` (4) |
| Circle-Size | number | `{Primitive.Spacing.400}` (32) |

### Snackbar Component (10 tokens)

| Token | Type | Default Reference |
|-------|------|-------------------|
| Background | color | `{Semantic.Colour.On-Surface}` (inverted) |
| Content-Color | color | `{Semantic.Colour.Surface}` (inverted) |
| Action-Color | color | `{Semantic.Colour.Primary-Hover}` |
| Padding | number | `{Primitive.Spacing.200}` (16) |
| Gap | number | `{Primitive.Spacing.100}` (8) |
| Corner-Radius | number | `{Semantic.Border radius.Radius-Medium}` (8) |
| Elevation | number | 3 |
| Text-Size | number | `{Semantic.Text size.Text-size-body}` (16) |
| Font-Weight | number | `{Semantic.Font weight.Weight-body}` (400) |
| Font-Family | string | `{Semantic.Font family.Font-Interface}` |

### Dialog Component (12 tokens)

| Token | Type | Default Reference |
|-------|------|-------------------|
| Background | color | `{Semantic.Colour.Surface}` |
| Corner-Radius | number | `{Semantic.Border radius.Radius-Large}` (12) |
| Padding | number | `{Primitive.Spacing.300}` (24) |
| Gap | number | `{Primitive.Spacing.200}` (16) |
| Elevation | number | 6 |
| Title-Size | number | `{Semantic.Text size.Text-size-h3}` (20) |
| Title-Font-Weight | number | `{Semantic.Font weight.Weight-heading}` (700) |
| Title-Font-Family | string | `{Semantic.Font family.Font-Brand}` |
| Title-Color | color | `{Semantic.Colour.On-Surface}` |
| Body-Size | number | `{Semantic.Text size.Text-size-body}` (16) |
| Body-Font-Family | string | `{Semantic.Font family.Font-Interface}` |
| Body-Color | color | `{Semantic.Colour.On-Surface}` |

### AppBar Component (10 tokens)

| Token | Type | Default Reference |
|-------|------|-------------------|
| Height | number | `{Primitive.Spacing.800}` (64) |
| Padding-Horizontal | number | `{Primitive.Spacing.200}` (16) |
| Background | color | `{Semantic.Colour.Surface}` |
| Title-Color | color | `{Semantic.Colour.On-Surface}` |
| Title-Size | number | `{Semantic.Text size.Text-size-h3}` (20) |
| Title-Font-Weight | number | `{Semantic.Font weight.Weight-heading}` (700) |
| Title-Font-Family | string | `{Semantic.Font family.Font-Brand}` |
| Icon-Color | color | `{Semantic.Colour.On-Surface}` |
| Border-Color | color | `{Semantic.Colour.Border-Subtle}` |
| Elevation | number | 0 |

### Link Component (5 tokens)

Link inherits font size and family from surrounding text.

| Token | Type | Default Reference |
|-------|------|-------------------|
| Color | color | `{Semantic.Colour.Primary}` |
| Hover-Color | color | `{Semantic.Colour.Primary-Hover}` |
| Visited-Color | color | `{Semantic.Colour.On-Surface-Muted}` |
| Underline-Offset | number | `{Primitive.Spacing.025}` (2) |
| Font-Weight | number | `{Semantic.Font weight.Weight-body}` (400) |

### SpeedDial Component (7 tokens)

Main FAB uses `component.fab.*` tokens; these are for secondary actions.

| Token | Type | Default Reference |
|-------|------|-------------------|
| Action-Size | number | `{Primitive.Spacing.400}` (32) |
| Action-Background | color | `{Semantic.Colour.Surface-Container}` |
| Action-Icon-Color | color | `{Semantic.Colour.On-Surface}` |
| Action-Icon-Size | number | `{Semantic.Size.Size-LG}` (24) |
| Action-Corner-Radius | number | `{Semantic.Border radius.Radius-Full}` (9999) |
| Gap | number | `{Primitive.Spacing.100}` (8) |
| Action-Elevation | number | 2 |

---

## Token Count Summary

| Layer | Tokens |
|-------|--------|
| Primitive | 90 |
| Semantic | 87 (colour 31, typography 27, border radius 4, spacing 5, border width 2, elevation 6, size 7, opacity 2, overlay 1, paragraph 3) |
| Component — Button | 26 |
| Component — Card | 16 |
| Component — TextField | 17 |
| Component — Checkbox | 11 |
| Component — FAB | 10 |
| Component — Autocomplete | 9 |
| Component — Select | 11 |
| Component — Switch | 14 |
| Component — Badge | 8 |
| Component — Chip | 12 |
| Component — Divider | 3 |
| Component — Icon | 3 |
| Component — Table | 13 |
| Component — Alert | 14 |
| Component — Backdrop | 2 |
| Component — Skeleton | 4 |
| Component — Snackbar | 10 |
| Component — Dialog | 12 |
| Component — AppBar | 10 |
| Component — Link | 5 |
| Component — SpeedDial | 7 |
| **Grand Total** | **394** |

---

## File Structure

```
design-tokens/
├── Default.tokens.json        (Default base theme — cast-sync flat export, system-ui typography)
└── DESIGN-TOKENS-SUMMARY.md   (This file)
```

> Example theme token files (Consumer, Corporate, Luxury) are available in
> `cast-ui/.storybook/themes/` and `cast-ui-examples/expo-snack/themes/` (identical files in both locations).

---

## Technical Notes

- `Default.tokens.json` uses the cast-sync **flat export format** — all values are pre-resolved (no alias references to parse)
- The `_aliases` section in each theme JSON records the design-intent alias chains (component → semantic → primitive) for round-trip fidelity with Figma
- Token naming follows **industry best practices**:
  - `White` and `Black` (not `-000`) as standalone constants
  - Brand colors use 5-stop scales (50-800)
  - Neutrals (Grey, Slate) use 6-stop scales (50-900) for finer text/UI control
- **Primitive sets are per-theme** — each theme brings its own colour palette and can define additional stops or entirely different colour families. cast-sync discovers primitives dynamically
- Semantic tokens provide the theming layer — they map design intent to the theme's specific primitives
- Component tokens ensure consistency across the design system
- Border radius flows through all three tiers: Primitive scale > Semantic size > Component application
- Typography flows through all three tiers: Primitive fonts > Semantic roles > Component usage
- Button Outline and Text variant backgrounds use `semantic.color.surface` to automatically adapt to light/dark themes
