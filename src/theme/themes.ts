/**
 * Density theme definitions — extracted from component token files.
 *
 * Source files:
 *   design-tokens/component/component-compact.tokens.json
 *   design-tokens/component/component-default.tokens.json
 *   design-tokens/component/component-comfortable.tokens.json
 *
 * Values verified against Figma variable defs.
 * Only spacing/sizing tokens live here — colours are constant across densities.
 */

import type { DensityTheme, ComponentTokens, SpacingScale } from './types';

export const themes: Record<DensityTheme, ComponentTokens> = {
  compact: {
    accordion: {
      small:   { gap: 6, paddingX: 8,  paddingY: 6 },
      default: { gap: 8, paddingX: 12, paddingY: 8 },
      large:   { gap: 8, paddingX: 16, paddingY: 12 },
    },
    dialog: {
      small:   { padding: 16, gap: 12, iconSize: 24 },
      default: { padding: 24, gap: 16, iconSize: 32 },
      large:   { padding: 32, gap: 24, iconSize: 40 },
    },
    button: {
      small:   { gap: 4,  paddingX: 6,  paddingY: 2,  borderRadius: 8 },
      default: { gap: 8,  paddingX: 10, paddingY: 6,  borderRadius: 8 },
      large:   { gap: 16, paddingX: 20, paddingY: 14, borderRadius: 8 },
    },
    input: {
      fieldGap: 1,
      small:   { gap: 4,  paddingX: 6,  paddingY: 2,  borderRadius: 8 },
      default: { gap: 12, paddingX: 10, paddingY: 6,  borderRadius: 8 },
      large:   { gap: 16, paddingX: 20, paddingY: 14, borderRadius: 8 },
    },
    select: {
      content:   { paddingY: 2 },
      option:    { gap: 8,  paddingX: 8,  paddingY: 4, borderRadius: 4 },
      group:     { paddingX: 8,  labelPaddingY: 6 },
      separator: { marginY: 4 },
    },
    list: {
      sectionGap: 1,
      item:      { gap: 8,  paddingX: 8,  paddingY: 4, borderRadius: 4, iconSize: 16 },
      subheader: { paddingX: 8,  paddingY: 4 },
    },
    checkbox: {
      gap: 4, borderRadius: 4, focusRingWidth: 2,
      small:   { indicatorSize: 16, iconSize: 16 },
      default: { indicatorSize: 20, iconSize: 20 },
      large:   { indicatorSize: 24, iconSize: 24 },
    },
    alert: {
      borderRadius: 8,
      small:   { padding: 8,  gap: 8,  iconSize: 16, closeSize: 16 },
      default: { padding: 12, gap: 12, iconSize: 20, closeSize: 16 },
      large:   { padding: 16, gap: 16, iconSize: 24, closeSize: 20 },
    },
    toggle: {
      gap: 4, thumbOffset: 2, focusRingWidth: 2,
      small:   { trackWidth: 32, trackHeight: 16, thumbSize: 12 },
      default: { trackWidth: 40, trackHeight: 20, thumbSize: 16 },
      large:   { trackWidth: 48, trackHeight: 24, thumbSize: 20 },
    },
    card: {
      borderRadius: 8,
      small:   { padding: 8,  gap: 8,  iconSize: 16, imageHeight: 120 },
      default: { padding: 12, gap: 12, iconSize: 20, imageHeight: 160 },
      large:   { padding: 16, gap: 16, iconSize: 24, imageHeight: 200 },
    },
    badge: {
      borderRadius: 9999,
      small:   { gap: 2, paddingX: 4, paddingY: 0, dotSize: 6 },
      default: { gap: 4, paddingX: 6, paddingY: 1, dotSize: 6 },
      large:   { gap: 4, paddingX: 8, paddingY: 2, dotSize: 8 },
    },
    radio: {
      gap: 4, borderRadius: 9999, focusRingWidth: 2,
      small:   { indicatorSize: 16, dotSize: 6 },
      default: { indicatorSize: 20, dotSize: 8 },
      large:   { indicatorSize: 24, dotSize: 10 },
    },
    toast: {
      borderRadius: 8, minWidth: 280, maxWidth: 420,
      small:   { padding: 8,  gap: 8,  iconSize: 16, closeSize: 16 },
      default: { padding: 12, gap: 12, iconSize: 20, closeSize: 16 },
      large:   { padding: 16, gap: 16, iconSize: 24, closeSize: 20 },
    },
    chip: {
      borderRadius: 9999,
      small:   { gap: 2, paddingX: 4, paddingY: 1, iconSize: 12 },
      default: { gap: 4, paddingX: 6, paddingY: 2, iconSize: 14 },
      large:   { gap: 4, paddingX: 8, paddingY: 4, iconSize: 16 },
    },
    avatar: {
      borderRadius: 9999,
      small:   { size: 24, iconSize: 12 },
      default: { size: 40, iconSize: 16 },
      large:   { size: 64, iconSize: 24 },
    },
    popover: {
      borderRadius: 8, arrowSize: 8,
      small:   { padding: 8 },
      default: { padding: 12 },
      large:   { padding: 16 },
    },
    tooltip: {
      borderRadius: 4, arrowSize: 6,
      small:   { paddingX: 4, paddingY: 1 },
      default: { paddingX: 6, paddingY: 2 },
    },
    progress: {
      borderRadius: 9999,
      small:   { trackHeight: 4 },
      default: { trackHeight: 8 },
      large:   { trackHeight: 12 },
    },
    spinner: {
      small:   { diameter: 16, stroke: 2 },
      default: { diameter: 24, stroke: 2 },
      large:   { diameter: 32, stroke: 4 },
    },
    tabs: {
      listGap: 8, indicatorRadius: 9999,
      small:   { gap: 4, paddingX: 8,  paddingY: 4, indicatorHeight: 2 },
      default: { gap: 6, paddingX: 10, paddingY: 6, indicatorHeight: 2 },
      large:   { gap: 8, paddingX: 12, paddingY: 8, indicatorHeight: 4 },
    },
    bottomSheet: {
      borderRadius: 16, handleWidth: 40, handleHeight: 4, handleGap: 8,
      padding: 16, gap: 12,
    },
    link: {
      small:   { gap: 2 },
      default: { gap: 4 },
      large:   { gap: 4 },
    },
    breadcrumbs: {
      small:   { gap: 4 },
      default: { gap: 4 },
      large:   { gap: 8 },
    },
    codeBlock: {
      borderRadius: 8,
      small:   { padding: 8,  gap: 8 },
      default: { padding: 12, gap: 8 },
      large:   { padding: 16, gap: 12 },
    },
    drawer: { padding: 16, gap: 12 },
    menu: {
      item:      { gap: 8, paddingX: 8, paddingY: 4, borderRadius: 4 },
      content:   { paddingY: 2 },
      group:     { paddingX: 8, labelPaddingY: 6 },
      separator: { marginY: 4 },
    },
    toggleButtonGroup: {
      borderRadius: 8,
      small:   { paddingX: 6,  paddingY: 2,  gap: 4 },
      default: { paddingX: 10, paddingY: 6,  gap: 8 },
      large:   { paddingX: 20, paddingY: 14, gap: 16 },
    },
    appBar: {
      small:   { paddingX: 12, paddingY: 6,  gap: 8 },
      default: { paddingX: 16, paddingY: 8,  gap: 8 },
      large:   { paddingX: 16, paddingY: 12, gap: 12 },
    },
    slider: {
      borderRadius: 9999,
      small:   { trackHeight: 4, thumbSize: 12 },
      default: { trackHeight: 6, thumbSize: 16 },
      large:   { trackHeight: 8, thumbSize: 20 },
    },
    speedDial: {
      small:   { fabSize: 40, actionSize: 32, gap: 6 },
      default: { fabSize: 48, actionSize: 40, gap: 8 },
      large:   { fabSize: 64, actionSize: 48, gap: 12 },
    },
    table: {
      small:   { cellPaddingX: 8,  cellPaddingY: 4 },
      default: { cellPaddingX: 12, cellPaddingY: 8 },
      large:   { cellPaddingX: 16, cellPaddingY: 12 },
    },
  },

  default: {
    accordion: {
      small:   { gap: 8,  paddingX: 12, paddingY: 8 },
      default: { gap: 8,  paddingX: 16, paddingY: 12 },
      large:   { gap: 12, paddingX: 20, paddingY: 16 },
    },
    dialog: {
      small:   { padding: 24, gap: 16, iconSize: 24 },
      default: { padding: 32, gap: 24, iconSize: 32 },
      large:   { padding: 40, gap: 32, iconSize: 40 },
    },
    button: {
      small:   { gap: 8,  paddingX: 10, paddingY: 6,  borderRadius: 8 },
      default: { gap: 12, paddingX: 14, paddingY: 10, borderRadius: 8 },
      large:   { gap: 20, paddingX: 24, paddingY: 16, borderRadius: 8 },
    },
    input: {
      fieldGap: 2,
      small:   { gap: 8,  paddingX: 10, paddingY: 6,  borderRadius: 8 },
      default: { gap: 12, paddingX: 14, paddingY: 10, borderRadius: 8 },
      large:   { gap: 20, paddingX: 24, paddingY: 16, borderRadius: 8 },
    },
    select: {
      content:   { paddingY: 4 },
      option:    { gap: 12, paddingX: 12, paddingY: 6, borderRadius: 4 },
      group:     { paddingX: 12, labelPaddingY: 6 },
      separator: { marginY: 4 },
    },
    list: {
      sectionGap: 1,
      item:      { gap: 12, paddingX: 12, paddingY: 6, borderRadius: 4, iconSize: 20 },
      subheader: { paddingX: 12, paddingY: 6 },
    },
    checkbox: {
      gap: 8, borderRadius: 4, focusRingWidth: 2,
      small:   { indicatorSize: 16, iconSize: 16 },
      default: { indicatorSize: 20, iconSize: 20 },
      large:   { indicatorSize: 24, iconSize: 24 },
    },
    alert: {
      borderRadius: 8,
      small:   { padding: 12, gap: 12, iconSize: 16, closeSize: 16 },
      default: { padding: 16, gap: 16, iconSize: 20, closeSize: 16 },
      large:   { padding: 24, gap: 24, iconSize: 24, closeSize: 20 },
    },
    toggle: {
      gap: 8, thumbOffset: 2, focusRingWidth: 2,
      small:   { trackWidth: 32, trackHeight: 16, thumbSize: 12 },
      default: { trackWidth: 40, trackHeight: 20, thumbSize: 16 },
      large:   { trackWidth: 48, trackHeight: 24, thumbSize: 20 },
    },
    card: {
      borderRadius: 8,
      small:   { padding: 12, gap: 12, iconSize: 16, imageHeight: 120 },
      default: { padding: 16, gap: 16, iconSize: 20, imageHeight: 160 },
      large:   { padding: 24, gap: 24, iconSize: 24, imageHeight: 200 },
    },
    badge: {
      borderRadius: 9999,
      small:   { gap: 2, paddingX: 4, paddingY: 0, dotSize: 6 },
      default: { gap: 4, paddingX: 6, paddingY: 1, dotSize: 6 },
      large:   { gap: 4, paddingX: 8, paddingY: 2, dotSize: 8 },
    },
    radio: {
      gap: 8, borderRadius: 9999, focusRingWidth: 2,
      small:   { indicatorSize: 16, dotSize: 6 },
      default: { indicatorSize: 20, dotSize: 8 },
      large:   { indicatorSize: 24, dotSize: 10 },
    },
    toast: {
      borderRadius: 8, minWidth: 280, maxWidth: 420,
      small:   { padding: 12, gap: 12, iconSize: 16, closeSize: 16 },
      default: { padding: 16, gap: 16, iconSize: 20, closeSize: 16 },
      large:   { padding: 24, gap: 24, iconSize: 24, closeSize: 20 },
    },
    chip: {
      borderRadius: 9999,
      small:   { gap: 4, paddingX: 6,  paddingY: 2, iconSize: 12 },
      default: { gap: 4, paddingX: 8,  paddingY: 4, iconSize: 14 },
      large:   { gap: 8, paddingX: 10, paddingY: 6, iconSize: 16 },
    },
    avatar: {
      borderRadius: 9999,
      small:   { size: 32, iconSize: 12 },
      default: { size: 48, iconSize: 16 },
      large:   { size: 80, iconSize: 24 },
    },
    popover: {
      borderRadius: 8, arrowSize: 8,
      small:   { padding: 12 },
      default: { padding: 16 },
      large:   { padding: 24 },
    },
    tooltip: {
      borderRadius: 4, arrowSize: 6,
      small:   { paddingX: 6, paddingY: 2 },
      default: { paddingX: 8, paddingY: 4 },
    },
    progress: {
      borderRadius: 9999,
      small:   { trackHeight: 4 },
      default: { trackHeight: 8 },
      large:   { trackHeight: 12 },
    },
    spinner: {
      small:   { diameter: 16, stroke: 2 },
      default: { diameter: 24, stroke: 2 },
      large:   { diameter: 32, stroke: 4 },
    },
    tabs: {
      listGap: 16, indicatorRadius: 9999,
      small:   { gap: 6, paddingX: 10, paddingY: 6,  indicatorHeight: 2 },
      default: { gap: 8, paddingX: 12, paddingY: 8,  indicatorHeight: 2 },
      large:   { gap: 8, paddingX: 16, paddingY: 10, indicatorHeight: 4 },
    },
    bottomSheet: {
      borderRadius: 16, handleWidth: 40, handleHeight: 4, handleGap: 8,
      padding: 24, gap: 16,
    },
    link: {
      small:   { gap: 4 },
      default: { gap: 4 },
      large:   { gap: 8 },
    },
    breadcrumbs: {
      small:   { gap: 4 },
      default: { gap: 8 },
      large:   { gap: 8 },
    },
    codeBlock: {
      borderRadius: 8,
      small:   { padding: 12, gap: 8 },
      default: { padding: 16, gap: 12 },
      large:   { padding: 24, gap: 16 },
    },
    drawer: { padding: 24, gap: 16 },
    menu: {
      item:      { gap: 12, paddingX: 12, paddingY: 6, borderRadius: 4 },
      content:   { paddingY: 4 },
      group:     { paddingX: 12, labelPaddingY: 6 },
      separator: { marginY: 4 },
    },
    toggleButtonGroup: {
      borderRadius: 8,
      small:   { paddingX: 10, paddingY: 6,  gap: 8 },
      default: { paddingX: 14, paddingY: 10, gap: 12 },
      large:   { paddingX: 24, paddingY: 16, gap: 20 },
    },
    appBar: {
      small:   { paddingX: 16, paddingY: 8,  gap: 8 },
      default: { paddingX: 16, paddingY: 12, gap: 12 },
      large:   { paddingX: 24, paddingY: 16, gap: 16 },
    },
    slider: {
      borderRadius: 9999,
      small:   { trackHeight: 4, thumbSize: 12 },
      default: { trackHeight: 6, thumbSize: 16 },
      large:   { trackHeight: 8, thumbSize: 20 },
    },
    speedDial: {
      small:   { fabSize: 40, actionSize: 32, gap: 8 },
      default: { fabSize: 48, actionSize: 40, gap: 12 },
      large:   { fabSize: 64, actionSize: 48, gap: 16 },
    },
    table: {
      small:   { cellPaddingX: 12, cellPaddingY: 6 },
      default: { cellPaddingX: 16, cellPaddingY: 12 },
      large:   { cellPaddingX: 24, cellPaddingY: 16 },
    },
  },

  comfortable: {
    accordion: {
      small:   { gap: 8,  paddingX: 16, paddingY: 12 },
      default: { gap: 12, paddingX: 20, paddingY: 16 },
      large:   { gap: 12, paddingX: 24, paddingY: 20 },
    },
    dialog: {
      small:   { padding: 40, gap: 24, iconSize: 24 },
      default: { padding: 40, gap: 32, iconSize: 32 },
      large:   { padding: 48, gap: 40, iconSize: 40 },
    },
    button: {
      small:   { gap: 12, paddingX: 14, paddingY: 10, borderRadius: 8 },
      default: { gap: 16, paddingX: 20, paddingY: 14, borderRadius: 8 },
      large:   { gap: 24, paddingX: 32, paddingY: 20, borderRadius: 8 },
    },
    input: {
      fieldGap: 4,
      small:   { gap: 12, paddingX: 14, paddingY: 10, borderRadius: 8 },
      default: { gap: 12, paddingX: 20, paddingY: 14, borderRadius: 8 },
      large:   { gap: 24, paddingX: 32, paddingY: 20, borderRadius: 8 },
    },
    select: {
      content:   { paddingY: 6 },
      option:    { gap: 16, paddingX: 16, paddingY: 8, borderRadius: 4 },
      group:     { paddingX: 16, labelPaddingY: 6 },
      separator: { marginY: 4 },
    },
    list: {
      sectionGap: 1,
      item:      { gap: 16, paddingX: 16, paddingY: 8, borderRadius: 4, iconSize: 24 },
      subheader: { paddingX: 16, paddingY: 8 },
    },
    checkbox: {
      gap: 12, borderRadius: 4, focusRingWidth: 2,
      small:   { indicatorSize: 16, iconSize: 16 },
      default: { indicatorSize: 20, iconSize: 20 },
      large:   { indicatorSize: 24, iconSize: 24 },
    },
    alert: {
      borderRadius: 8,
      small:   { padding: 16, gap: 16, iconSize: 16, closeSize: 16 },
      default: { padding: 24, gap: 24, iconSize: 20, closeSize: 16 },
      large:   { padding: 40, gap: 40, iconSize: 24, closeSize: 20 },
    },
    toggle: {
      gap: 12, thumbOffset: 2, focusRingWidth: 2,
      small:   { trackWidth: 32, trackHeight: 16, thumbSize: 12 },
      default: { trackWidth: 40, trackHeight: 20, thumbSize: 16 },
      large:   { trackWidth: 48, trackHeight: 24, thumbSize: 20 },
    },
    card: {
      borderRadius: 8,
      small:   { padding: 16, gap: 16, iconSize: 16, imageHeight: 120 },
      default: { padding: 24, gap: 24, iconSize: 20, imageHeight: 160 },
      large:   { padding: 40, gap: 40, iconSize: 24, imageHeight: 200 },
    },
    badge: {
      borderRadius: 9999,
      small:   { gap: 2, paddingX: 4, paddingY: 0, dotSize: 6 },
      default: { gap: 4, paddingX: 6, paddingY: 1, dotSize: 6 },
      large:   { gap: 4, paddingX: 8, paddingY: 2, dotSize: 8 },
    },
    radio: {
      gap: 12, borderRadius: 9999, focusRingWidth: 2,
      small:   { indicatorSize: 16, dotSize: 6 },
      default: { indicatorSize: 20, dotSize: 8 },
      large:   { indicatorSize: 24, dotSize: 10 },
    },
    toast: {
      borderRadius: 8, minWidth: 280, maxWidth: 420,
      small:   { padding: 16, gap: 16, iconSize: 16, closeSize: 16 },
      default: { padding: 24, gap: 24, iconSize: 20, closeSize: 16 },
      large:   { padding: 40, gap: 40, iconSize: 24, closeSize: 20 },
    },
    chip: {
      borderRadius: 9999,
      small:   { gap: 4, paddingX: 8,  paddingY: 4, iconSize: 12 },
      default: { gap: 8, paddingX: 10, paddingY: 6, iconSize: 14 },
      large:   { gap: 8, paddingX: 12, paddingY: 8, iconSize: 16 },
    },
    avatar: {
      borderRadius: 9999,
      small:   { size: 40, iconSize: 12 },
      default: { size: 64, iconSize: 16 },
      large:   { size: 96, iconSize: 24 },
    },
    popover: {
      borderRadius: 8, arrowSize: 8,
      small:   { padding: 16 },
      default: { padding: 24 },
      large:   { padding: 40 },
    },
    tooltip: {
      borderRadius: 4, arrowSize: 6,
      small:   { paddingX: 8, paddingY: 4 },
      default: { paddingX: 10, paddingY: 6 },
    },
    progress: {
      borderRadius: 9999,
      small:   { trackHeight: 4 },
      default: { trackHeight: 8 },
      large:   { trackHeight: 12 },
    },
    spinner: {
      small:   { diameter: 16, stroke: 2 },
      default: { diameter: 24, stroke: 2 },
      large:   { diameter: 32, stroke: 4 },
    },
    tabs: {
      listGap: 24, indicatorRadius: 9999,
      small:   { gap: 8,  paddingX: 12, paddingY: 8,  indicatorHeight: 2 },
      default: { gap: 8,  paddingX: 16, paddingY: 10, indicatorHeight: 2 },
      large:   { gap: 12, paddingX: 20, paddingY: 12, indicatorHeight: 4 },
    },
    bottomSheet: {
      borderRadius: 16, handleWidth: 40, handleHeight: 4, handleGap: 8,
      padding: 32, gap: 24,
    },
    link: {
      small:   { gap: 4 },
      default: { gap: 8 },
      large:   { gap: 8 },
    },
    breadcrumbs: {
      small:   { gap: 8 },
      default: { gap: 8 },
      large:   { gap: 12 },
    },
    codeBlock: {
      borderRadius: 8,
      small:   { padding: 16, gap: 12 },
      default: { padding: 24, gap: 16 },
      large:   { padding: 32, gap: 24 },
    },
    drawer: { padding: 32, gap: 24 },
    menu: {
      item:      { gap: 16, paddingX: 16, paddingY: 8, borderRadius: 4 },
      content:   { paddingY: 6 },
      group:     { paddingX: 16, labelPaddingY: 6 },
      separator: { marginY: 4 },
    },
    toggleButtonGroup: {
      borderRadius: 8,
      small:   { paddingX: 14, paddingY: 10, gap: 12 },
      default: { paddingX: 20, paddingY: 14, gap: 16 },
      large:   { paddingX: 32, paddingY: 20, gap: 24 },
    },
    appBar: {
      small:   { paddingX: 16, paddingY: 12, gap: 12 },
      default: { paddingX: 24, paddingY: 16, gap: 16 },
      large:   { paddingX: 32, paddingY: 20, gap: 20 },
    },
    slider: {
      borderRadius: 9999,
      small:   { trackHeight: 4, thumbSize: 12 },
      default: { trackHeight: 6, thumbSize: 16 },
      large:   { trackHeight: 8, thumbSize: 20 },
    },
    speedDial: {
      small:   { fabSize: 40, actionSize: 32, gap: 12 },
      default: { fabSize: 48, actionSize: 40, gap: 16 },
      large:   { fabSize: 64, actionSize: 48, gap: 20 },
    },
    table: {
      small:   { cellPaddingX: 16, cellPaddingY: 8 },
      default: { cellPaddingX: 20, cellPaddingY: 16 },
      large:   { cellPaddingX: 32, cellPaddingY: 24 },
    },
  },
};

/**
 * Density-aware layout spacing scale. App-level spacing (page gutters, section
 * gaps, stacks) that scales with density, the same way component spacing does.
 * Read it through useTheme().spacing. Values mirror the `spacing/*` family in
 * the Figma `component` collection (each aliases a primitive `space/*`).
 */
export const spacingScales: Record<DensityTheme, SpacingScale> = {
  compact:     { xs: 2, sm: 6,  md: 12, lg: 20, xl: 32, xxl: 48 },
  default:     { xs: 4, sm: 8,  md: 16, lg: 24, xl: 40, xxl: 64 },
  comfortable: { xs: 6, sm: 12, md: 20, lg: 32, xl: 48, xxl: 80 },
};
