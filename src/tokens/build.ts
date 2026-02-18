/**
 * Token build script.
 *
 * Reads the Figma design-token JSON from `design-tokens/Default.tokens.json`
 * and generates:
 *   1. A typed TypeScript theme object (`default.ts`)
 *   2. A barrel index (`index.ts`)
 *   3. A reference JSON (`default.reference.json`) — copy-paste starting
 *      point for consumers creating custom themes via `createTheme()`.
 *
 * Usage:  npx ts-node src/tokens/build.ts
 *
 * The generated files are gitignored – run this before Storybook or library
 * builds.
 */

import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Recursively resolve a token `$value`.
 *
 * - String references like `{Primitive.Colour.Slate-900}` are followed
 *   through the full token tree until a concrete value is reached.
 * - Figma color objects (with a `hex` property) are collapsed to hex strings.
 * - Numbers and plain strings are returned as-is.
 */
function resolveValue(root: Record<string, unknown>, value: unknown): string | number {
  // Reference string – follow the alias chain
  if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
    const refPath = value.slice(1, -1); // strip { }
    const parts = refPath.split('.');

    let cursor: unknown = root;
    for (const part of parts) {
      if (cursor && typeof cursor === 'object' && part in (cursor as Record<string, unknown>)) {
        cursor = (cursor as Record<string, unknown>)[part];
      } else {
        throw new Error(`Cannot resolve token reference: ${value} (failed at "${part}")`);
      }
    }

    // `cursor` is now the token node – recurse on its $value
    const node = cursor as Record<string, unknown>;
    if ('$value' in node) {
      return resolveValue(root, node.$value);
    }
    throw new Error(`Token at "${refPath}" has no $value`);
  }

  // Figma color object – extract hex
  if (typeof value === 'object' && value !== null && 'hex' in (value as Record<string, unknown>)) {
    return (value as Record<string, unknown>).hex as string;
  }

  // Direct number or string
  if (typeof value === 'number' || typeof value === 'string') {
    return value;
  }

  throw new Error(`Unexpected token value type: ${JSON.stringify(value)}`);
}

/**
 * Shorthand: navigate to a token by its dot-separated path and resolve.
 */
function resolve(root: Record<string, unknown>, tokenPath: string): string | number {
  const parts = tokenPath.split('.');
  let cursor: unknown = root;
  for (const part of parts) {
    if (cursor && typeof cursor === 'object' && part in (cursor as Record<string, unknown>)) {
      cursor = (cursor as Record<string, unknown>)[part];
    } else {
      throw new Error(`Token path not found: ${tokenPath} (failed at "${part}")`);
    }
  }
  const node = cursor as Record<string, unknown>;
  if ('$value' in node) {
    return resolveValue(root, node.$value);
  }
  throw new Error(`Token at "${tokenPath}" has no $value`);
}

// ---------------------------------------------------------------------------
// Serialisation helpers
// ---------------------------------------------------------------------------

/** Recursively serialise a plain JS value to TypeScript source with indentation. */
function toTS(value: unknown, indent: number = 2): string {
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number') return String(value);
  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value as Record<string, unknown>);
    const pad = ' '.repeat(indent);
    const inner = entries
      .map(([k, v]) => `${pad}${k}: ${toTS(v, indent + 2)},`)
      .join('\n');
    return `{\n${inner}\n${' '.repeat(indent - 2)}}`;
  }
  return String(value);
}

// ---------------------------------------------------------------------------
// Theme builder
// ---------------------------------------------------------------------------

interface ThemeConfig {
  file: string;
  name: string;
  exportName: string;
}

const THEMES: ThemeConfig[] = [
  { file: 'Default.tokens.json', name: 'default', exportName: 'defaultTheme' },
];

/**
 * Build a fully-resolved theme object from Figma design-token JSON.
 *
 * Tokens that exist in Default.tokens.json are resolved through the alias
 * chain. Semantic categories and component tokens not yet defined in Figma
 * are derived from resolved semantic values to keep the output consistent.
 */
function buildResolvedTheme(
  config: ThemeConfig,
  tokens: Record<string, unknown>,
): Record<string, unknown> {
  const r = (p: string) => resolve(tokens, p);

  // -- Semantic layer (resolved from Figma tokens) --------------------------

  const color = {
    surface: r('Semantic.Colour.Surface') as string,
    onSurface: r('Semantic.Colour.On-Surface') as string,
    onSurfaceMuted: r('Semantic.Colour.On-Surface-Muted') as string,
    surfaceContainer: r('Semantic.Colour.Surface-Container') as string,

    primary: r('Semantic.Colour.Primary') as string,
    onPrimary: r('Semantic.Colour.On-Primary') as string,
    primaryHover: r('Semantic.Colour.Primary-Hover') as string,
    primaryPressed: r('Semantic.Colour.Primary-Pressed') as string,

    secondary: r('Semantic.Colour.Secondary') as string,
    onSecondary: r('Semantic.Colour.On-Secondary') as string,

    success: r('Semantic.Colour.Success') as string,
    onSuccess: r('Semantic.Colour.On-Success') as string,
    error: r('Semantic.Colour.Error') as string,
    onError: r('Semantic.Colour.On-Error') as string,
    warning: r('Semantic.Colour.Warning') as string,
    onWarning: r('Semantic.Colour.On-Warning') as string,

    border: r('Semantic.Colour.Border') as string,
    borderSubtle: r('Semantic.Colour.Border-Subtle') as string,

    disabledContainer: r('Semantic.Colour.Disabled-Container') as string,
    onDisabled: r('Semantic.Colour.On-Disabled') as string,

    primaryContainer: r('Semantic.Colour.Primary-Container') as string,
    onPrimaryContainer: r('Semantic.Colour.On-Primary-Container') as string,
    secondaryContainer: r('Semantic.Colour.Secondary-Container') as string,
    onSecondaryContainer: r('Semantic.Colour.On-Secondary-Container') as string,
    errorContainer: r('Semantic.Colour.Error-Container') as string,
    onErrorContainer: r('Semantic.Colour.On-Error-Container') as string,
    successContainer: r('Semantic.Colour.Success-Container') as string,
    onSuccessContainer: r('Semantic.Colour.On-Success-Container') as string,
    warningContainer: r('Semantic.Colour.Warning-Container') as string,
    onWarningContainer: r('Semantic.Colour.On-Warning-Container') as string,

    overlay: r('Primitive.Colour.Black') as string,
  };

  const fontFamily = {
    brand: r('Semantic.Font family.Font-Brand') as string,
    interface: r('Semantic.Font family.Font-Interface') as string,
    data: r('Semantic.Font family.Font-Data') as string,
  };

  const fontSize = {
    display: r('Semantic.Text size.Text-size-display') as number,
    h1: r('Semantic.Text size.Text-size-h1') as number,
    h2: r('Semantic.Text size.Text-size-h2') as number,
    h3: r('Semantic.Text size.Text-size-h3') as number,
    body: r('Semantic.Text size.Text-size-body') as number,
    small: r('Semantic.Text size.Text-size-small') as number,
    button: r('Semantic.Text size.Text-size-button') as number,
  };

  const fontWeight = {
    heading: r('Semantic.Font weight.Weight-heading') as number,
    body: r('Semantic.Font weight.Weight-body') as number,
    button: r('Semantic.Font weight.Weight-button') as number,
  };

  const lineHeight = {
    heading: r('Semantic.Line height.Line-Height-heading') as number,
    body: r('Semantic.Line height.Line-Height-body') as number,
    uiLabel: r('Semantic.Line height.Line-Height-UI-label') as number,
  };

  const letterSpacing = {
    heading: r('Semantic.Letter spacing.Tracking-heading') as number,
    body: r('Semantic.Letter spacing.Tracking-body') as number,
    label: r('Semantic.Letter spacing.Tracking-label') as number,
  };

  const paragraphSpacing = {
    body: r('Semantic.Paragraph spacing.Para-body') as number,
    editorial: r('Semantic.Paragraph spacing.Para-editorial') as number,
  };

  const paragraphIndent = {
    editorial: r('Semantic.Paragraph indent.Indent-editorial') as number,
  };

  const borderRadius = {
    small: r('Semantic.Border radius.Radius-Small') as number,
    medium: r('Semantic.Border radius.Radius-Medium') as number,
    large: r('Semantic.Border radius.Radius-Large') as number,
    full: r('Primitive.Border radius.Radius-Full') as number,
  };

  // -- Semantic categories derived from Primitive tokens --------------------

  const spacing = {
    xs: r('Primitive.Spacing.050') as number,
    sm: r('Primitive.Spacing.100') as number,
    md: r('Primitive.Spacing.150') as number,
    lg: r('Primitive.Spacing.200') as number,
    xl: r('Primitive.Spacing.300') as number,
  };

  const borderWidth = {
    thin: 1,
    medium: r('Primitive.Spacing.025') as number,
  };

  const elevation = {
    none: 0,
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 6,
  };

  const size = {
    xs: r('Primitive.Spacing.025') as number,
    sm: r('Primitive.Spacing.050') as number,
    md: r('Primitive.Spacing.200') as number,
    lg: r('Primitive.Spacing.300') as number,
    xl: r('Primitive.Spacing.400') as number,
    xxl: r('Primitive.Spacing.600') as number,
    xxxl: r('Primitive.Spacing.800') as number,
  };

  const opacity = {
    disabled: 0.4,
    overlay: 0.5,
  };

  const semantic = {
    color,
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    paragraphSpacing,
    paragraphIndent,
    borderRadius,
    spacing,
    borderWidth,
    elevation,
    size,
    opacity,
  };

  // -- Component layer ------------------------------------------------------
  // Button and Card are resolved from Figma tokens; the remaining components
  // derive defaults from the resolved semantic values above.

  const button = {
    paddingHorizontal: r('Component.Button.Padding-Horizontal') as number,
    paddingVertical: r('Component.Button.Padding-Vertical') as number,
    gap: r('Component.Button.Gap') as number,
    cornerRadius: r('Component.Button.Corner-Radius') as number,
    borderWidth: r('Component.Button.Border-Width') as number,
    textSize: r('Component.Button.Text-Size') as number,
    fontWeight: r('Component.Button.Font-Weight') as number,
    lineHeight: r('Component.Button.Line-Height') as number,
    fontFamily: r('Component.Button.Font-Family') as string,

    filled: {
      background: r('Component.Button.Filled.Background') as string,
      content: r('Component.Button.Filled.Content') as string,
    },
    outline: {
      background: r('Component.Button.Outline.Background') as string,
      border: r('Component.Button.Outline.Border') as string,
      content: r('Component.Button.Outline.Content') as string,
    },
    text: {
      background: r('Component.Button.Text.Background') as string,
      content: r('Component.Button.Text.Content') as string,
    },
    state: {
      hoverBackground: r('Component.Button.State.Hover-Background') as string,
      pressedBackground: r('Component.Button.State.Pressed-Background') as string,
      disabledBackground: r('Component.Button.State.Disabled-Background') as string,
      disabledContent: r('Component.Button.State.Disabled-Content') as string,
    },
  };

  const card = {
    padding: r('Component.Card.Padding') as number,
    gap: r('Component.Card.Gap') as number,
    background: r('Component.Card.Background') as string,
    stroke: r('Component.Card.Stroke') as string,
    strokeWidth: r('Component.Card.Stroke-Width') as number,
    cornerRadius: r('Component.Card.Corner-Radius') as number,
    elevation: r('Component.Card.Elevation') as number,
    headingSize: r('Component.Card.Heading-Size') as number,
    headingWeight: r('Component.Card.Heading-Weight') as number,
    headingFontFamily: r('Component.Card.Heading-Font-Family') as string,
    headingColor: color.onSurface,
    bodySize: r('Component.Card.Body-Size') as number,
    bodyWeight: r('Component.Card.Body-Weight') as number,
    bodyFontFamily: r('Component.Card.Body-Font-Family') as string,
    bodyColor: color.onSurfaceMuted,
  };

  const textField = {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    cornerRadius: borderRadius.medium,
    borderWidth: borderWidth.medium,
    background: color.surface,
    borderColor: color.border,
    focusBorderColor: color.primary,
    errorBorderColor: color.error,
    textColor: color.onSurface,
    placeholderColor: color.onSurfaceMuted,
    textSize: fontSize.body,
    fontFamily: fontFamily.interface,
    labelColor: color.onSurface,
    labelSize: fontSize.small,
    helperColor: color.onSurfaceMuted,
    helperSize: fontSize.small,
    errorColor: color.error,
  };

  const checkbox = {
    size: size.md,
    cornerRadius: borderRadius.small,
    borderWidth: borderWidth.medium,
    gap: spacing.sm,
    borderColor: color.border,
    checkedBackground: color.primary,
    checkedIconColor: color.onPrimary,
    labelColor: color.onSurface,
    labelSize: fontSize.body,
    labelFontFamily: fontFamily.interface,
    disabledOpacity: opacity.disabled,
  };

  const fab = {
    size: size.xxl,
    cornerRadius: borderRadius.full,
    background: color.primary,
    iconColor: color.onPrimary,
    iconSize: size.lg,
    hoverBackground: color.primaryHover,
    pressedBackground: color.primaryPressed,
    elevation: elevation.lg,
    extendedPaddingHorizontal: spacing.lg,
    extendedGap: spacing.sm,
  };

  const autocomplete = {
    dropdownBackground: color.surface,
    dropdownCornerRadius: borderRadius.medium,
    dropdownElevation: elevation.sm,
    optionHoverBackground: color.surfaceContainer,
    optionTextColor: color.onSurface,
    optionTextSize: fontSize.body,
    optionPaddingHorizontal: spacing.lg,
    optionPaddingVertical: spacing.sm,
    fontFamily: fontFamily.interface,
  };

  const select = {
    dropdownBackground: color.surface,
    dropdownCornerRadius: borderRadius.medium,
    dropdownElevation: elevation.sm,
    optionHoverBackground: color.surfaceContainer,
    indicatorColor: color.onSurfaceMuted,
    optionTextColor: color.onSurface,
    optionTextSize: fontSize.body,
    optionPaddingHorizontal: spacing.lg,
    optionPaddingVertical: spacing.sm,
    fontFamily: fontFamily.interface,
    selectedOptionBackground: color.primaryContainer,
  };

  const switchTokens = {
    trackWidth: size.xxl,
    trackHeight: size.lg,
    trackCornerRadius: borderRadius.full,
    trackOffBackground: color.border,
    trackOnBackground: color.primary,
    thumbSize: size.md,
    thumbCornerRadius: borderRadius.full,
    thumbOffBackground: color.surface,
    thumbOnBackground: color.surface,
    thumbOffset: spacing.xs,
    labelColor: color.onSurface,
    labelSize: fontSize.body,
    labelFontFamily: fontFamily.interface,
    gap: spacing.sm,
  };

  const badge = {
    minSize: size.md,
    paddingHorizontal: spacing.xs,
    cornerRadius: borderRadius.full,
    background: color.error,
    contentColor: color.onError,
    textSize: fontSize.small,
    fontWeight: fontWeight.button,
    fontFamily: fontFamily.interface,
  };

  const chip = {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
    cornerRadius: borderRadius.small,
    background: color.surfaceContainer,
    contentColor: color.onSecondaryContainer,
    selectedBackground: color.primaryContainer,
    selectedContentColor: color.onPrimaryContainer,
    borderWidth: borderWidth.medium,
    borderColor: color.border,
    textSize: fontSize.small,
    fontFamily: fontFamily.interface,
  };

  const divider = {
    color: color.border,
    thickness: borderWidth.thin,
    margin: spacing.sm,
  };

  const icon = {
    sizeSmall: size.md,
    sizeMedium: size.lg,
    sizeLarge: size.xl,
  };

  const table = {
    headerBackground: color.surfaceContainer,
    headerTextColor: color.onSurface,
    headerFontWeight: fontWeight.heading,
    headerTextSize: fontSize.small,
    cellTextColor: color.onSurface,
    cellTextSize: fontSize.body,
    cellPaddingHorizontal: spacing.md,
    cellPaddingVertical: spacing.sm,
    rowBorderColor: color.surfaceContainer,
    rowBorderWidth: borderWidth.thin,
    rowHoverBackground: color.surfaceContainer,
    cornerRadius: borderRadius.medium,
    fontFamily: fontFamily.interface,
  };

  const alert = {
    padding: spacing.lg,
    gap: spacing.sm,
    cornerRadius: borderRadius.medium,
    borderWidth: borderWidth.medium,
    background: color.surfaceContainer,
    borderColor: color.border,
    titleColor: color.onSurface,
    bodyColor: color.onSurface,
    iconColor: color.onSurface,
    fontFamily: fontFamily.interface,
    iconSize: size.lg,
    titleSize: fontSize.body,
    titleFontWeight: fontWeight.heading,
    bodySize: fontSize.small,
  };

  const backdrop = {
    color: color.overlay,
    opacity: opacity.overlay,
  };

  const skeleton = {
    background: color.surfaceContainer,
    highlight: color.surfaceContainer,
    cornerRadius: borderRadius.small,
    circleSize: size.xl,
  };

  const snackbar = {
    background: color.primary,
    contentColor: color.onPrimary,
    actionColor: color.primaryHover,
    padding: spacing.lg,
    gap: spacing.sm,
    cornerRadius: borderRadius.medium,
    elevation: elevation.md,
    textSize: fontSize.body,
    fontWeight: fontWeight.body,
    fontFamily: fontFamily.interface,
  };

  const dialog = {
    background: color.surface,
    cornerRadius: borderRadius.large,
    padding: spacing.xl,
    gap: spacing.lg,
    elevation: elevation.xl,
    titleSize: fontSize.h3,
    titleFontWeight: fontWeight.heading,
    titleFontFamily: fontFamily.interface,
    titleColor: color.onSurface,
    bodySize: fontSize.body,
    bodyFontFamily: fontFamily.interface,
    bodyColor: color.onSurface,
  };

  const appBar = {
    height: size.xxxl,
    paddingHorizontal: spacing.lg,
    background: color.surface,
    titleColor: color.onSurface,
    titleSize: fontSize.h3,
    titleFontWeight: fontWeight.heading,
    titleFontFamily: fontFamily.interface,
    iconColor: color.onSurface,
    borderColor: color.borderSubtle,
    elevation: elevation.none,
  };

  const link = {
    color: color.primary,
    hoverColor: color.primaryHover,
    visitedColor: color.onSurfaceMuted,
    underlineOffset: size.xs,
    fontWeight: fontWeight.body,
  };

  const speedDial = {
    actionSize: size.xl,
    actionBackground: color.surfaceContainer,
    actionIconColor: color.onSurface,
    actionIconSize: size.lg,
    actionCornerRadius: borderRadius.full,
    gap: spacing.sm,
    actionElevation: elevation.sm,
  };

  const component = {
    button,
    card,
    textField,
    checkbox,
    fab,
    autocomplete,
    select,
    switch: switchTokens,
    badge,
    chip,
    divider,
    icon,
    table,
    alert,
    backdrop,
    skeleton,
    snackbar,
    dialog,
    appBar,
    link,
    speedDial,
  };

  return { name: config.name, semantic, component };
}

/**
 * Serialise a resolved theme object to a TypeScript source file.
 */
function buildThemeSource(
  config: ThemeConfig,
  tokens: Record<string, unknown>,
): string {
  const theme = buildResolvedTheme(config, tokens);
  return `// Auto-generated by src/tokens/build.ts – DO NOT EDIT
import type { CastTheme } from '../../theme/types';

export const ${config.exportName}: CastTheme = ${toTS(theme, 2)};
`;
}

/**
 * Build a resolved JSON reference file for the given theme.
 * Consumers copy this as a starting point and modify values.
 */
function buildReferenceJson(
  _config: ThemeConfig,
  tokens: Record<string, unknown>,
  theme: Record<string, unknown>,
): string {
  return JSON.stringify(theme, null, 2) + '\n';
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const rootDir = path.resolve(__dirname, '..', '..');
  const tokensDir = path.join(rootDir, 'design-tokens');
  const outDir = path.join(rootDir, 'src', 'tokens', 'generated');

  // Ensure output directory exists
  fs.mkdirSync(outDir, { recursive: true });

  const exports: string[] = [];

  for (const theme of THEMES) {
    const filePath = path.join(tokensDir, theme.file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const tokens = JSON.parse(raw);

    // Build resolved theme once, reuse for both outputs
    const resolved = buildResolvedTheme(theme, tokens);

    // Generate TypeScript theme object
    const source = buildThemeSource(theme, tokens);
    const outFile = path.join(outDir, `${theme.name}.ts`);
    fs.writeFileSync(outFile, source, 'utf-8');

    // Generate reference JSON
    const refJson = buildReferenceJson(theme, tokens, resolved);
    const refFile = path.join(outDir, `${theme.name}.reference.json`);
    fs.writeFileSync(refFile, refJson, 'utf-8');

    exports.push(`export { ${theme.exportName} } from './${theme.name}';`);
    console.log(`  ✓ ${theme.name} → ${path.relative(rootDir, outFile)}`);
    console.log(`  ✓ ${theme.name}.reference.json → ${path.relative(rootDir, refFile)}`);
  }

  // Write barrel index
  const indexSource = [
    '// Auto-generated by src/tokens/build.ts – DO NOT EDIT',
    "export type { CastTheme, ThemeName } from '../../theme/types';",
    '',
    ...exports,
    '',
  ].join('\n');

  fs.writeFileSync(path.join(outDir, 'index.ts'), indexSource, 'utf-8');
  console.log('  ✓ index.ts');
  console.log('\nToken build complete.');
}

main();
