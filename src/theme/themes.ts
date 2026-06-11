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

import type { DensityTheme, ComponentTokens } from './types';

export const themes: Record<DensityTheme, ComponentTokens> = {
  compact: {
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
      small:   { indicatorSize: 16, iconSize: 10 },
      default: { indicatorSize: 20, iconSize: 12 },
      large:   { indicatorSize: 24, iconSize: 14 },
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
  },

  default: {
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
      small:   { indicatorSize: 16, iconSize: 10 },
      default: { indicatorSize: 20, iconSize: 12 },
      large:   { indicatorSize: 24, iconSize: 14 },
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
  },

  comfortable: {
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
      small:   { indicatorSize: 16, iconSize: 10 },
      default: { indicatorSize: 20, iconSize: 12 },
      large:   { indicatorSize: 24, iconSize: 14 },
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
  },
};
