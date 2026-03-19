/**
 * Semantic intent colors — derived from semantic.tokens.json
 * Maps: intent → prominence → state → { bg, fg, border }
 *
 * Source tokens: intent/{intent}/{prominence}/{state}/{bg|fg|border}
 * Primitive palette refs: blue (brand), cool-grey (neutral), red (danger)
 */

type StateColors = {
  bg: string;
  fg: string;
  border: string;
};

type ProminenceColors = {
  default: StateColors;
  hover: StateColors;
  active: StateColors;
};

type IntentColors = {
  default: ProminenceColors;
  bold: ProminenceColors;
  subtle: ProminenceColors;
  ringColour: string;
};

export type IntentName = 'brand' | 'neutral' | 'danger';
export type ProminenceName = 'default' | 'bold' | 'subtle';
export type StateName = 'default' | 'hover' | 'active';

export const intentColors: Record<IntentName, IntentColors> = {
  neutral: {
    default: {
      default: { bg: '#FFFFFF', fg: '#374151', border: '#D1D5DB' },
      hover: { bg: '#F9FAFB', fg: '#1F2937', border: '#9CA3AF' },
      active: { bg: '#F3F4F6', fg: '#111827', border: '#6B7280' },
    },
    bold: {
      default: { bg: '#374151', fg: '#FFFFFF', border: '#374151' },
      hover: { bg: '#1F2937', fg: '#FFFFFF', border: '#1F2937' },
      active: { bg: '#111827', fg: '#FFFFFF', border: '#111827' },
    },
    subtle: {
      default: { bg: 'transparent', fg: '#374151', border: 'transparent' },
      hover: { bg: '#F9FAFB', fg: '#1F2937', border: 'transparent' },
      active: { bg: '#F3F4F6', fg: '#111827', border: 'transparent' },
    },
    ringColour: '#9CA3AF',
  },
  brand: {
    default: {
      default: { bg: '#FFFFFF', fg: '#2563EB', border: '#93C5FD' },
      hover: { bg: '#EFF6FF', fg: '#1D4ED8', border: '#60A5FA' },
      active: { bg: '#DBEAFE', fg: '#1E40AF', border: '#3B82F6' },
    },
    bold: {
      default: { bg: '#2563EB', fg: '#FFFFFF', border: '#2563EB' },
      hover: { bg: '#1D4ED8', fg: '#FFFFFF', border: '#1D4ED8' },
      active: { bg: '#1E40AF', fg: '#FFFFFF', border: '#1E40AF' },
    },
    subtle: {
      default: { bg: 'transparent', fg: '#2563EB', border: 'transparent' },
      hover: { bg: '#EFF6FF', fg: '#1D4ED8', border: 'transparent' },
      active: { bg: '#DBEAFE', fg: '#1E40AF', border: 'transparent' },
    },
    ringColour: '#60A5FA',
  },
  danger: {
    default: {
      default: { bg: '#FFFFFF', fg: '#DC2626', border: '#FCA5A5' },
      hover: { bg: '#FEF2F2', fg: '#B91C1C', border: '#F87171' },
      active: { bg: '#FEE2E2', fg: '#991B1B', border: '#EF4444' },
    },
    bold: {
      default: { bg: '#DC2626', fg: '#FFFFFF', border: '#DC2626' },
      hover: { bg: '#B91C1C', fg: '#FFFFFF', border: '#B91C1C' },
      active: { bg: '#991B1B', fg: '#FFFFFF', border: '#991B1B' },
    },
    subtle: {
      default: { bg: 'transparent', fg: '#DC2626', border: 'transparent' },
      hover: { bg: '#FEF2F2', fg: '#B91C1C', border: 'transparent' },
      active: { bg: '#FEE2E2', fg: '#991B1B', border: 'transparent' },
    },
    ringColour: '#F87171',
  },
};

/** Disabled state — shared across all intents */
export const disabledColors: StateColors = {
  bg: '#F3F4F6',
  fg: '#9CA3AF',
  border: '#E5E7EB',
};

/** Semantic control constants */
export const controlTokens = {
  borderWidth: 1,
};
<<<<<<< Updated upstream
=======

/** Surface tokens — backgrounds and overlay styling */
export const surfaceTokens = {
  /** Page/screen background — cool-grey/50 */
  base: '#F9FAFB',
  /** Subtle background for sections/cards — cool-grey/100 */
  subtle: '#F3F4F6',
  /** Overlay surfaces (Dialog, Popover, Tooltip, Select, etc.) */
  overlay: {
    bg: '#FFFFFF',
    border: '#E5E7EB',
    borderRadius: 8,
  },
};

/** Semantic text tokens */
export const textTokens = {
  description: '#6B7280',
};

/** Overlay/scrim opacity */
export const overlayTokens = {
  scrimOpacity: 0.5,
};
>>>>>>> Stashed changes
