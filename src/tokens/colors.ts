/**
 * Semantic intent colours — derived from semantic.tokens.json
 * Maps: intent → prominence → state → { bg, fg, border }
 *
 * Source tokens: intent/{intent}/{prominence}/{state}/{bg|fg|border}
 * Primitive palette refs: blue (brand), cool-grey (neutral), red (danger)
 *
 * Two colour schemes are exported — `lightColors` and `darkColors` — matching
 * the `semantic-light` / `semantic-dark` modes of the Figma semantic variable
 * collection. The active scheme is resolved by ThemeProvider via the
 * `colorMode` prop; components read colours from `useTheme().scheme`.
 *
 * The flat named exports at the bottom (intentColors, surfaceTokens, …) are
 * the light-scheme values, kept for backwards compatibility.
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
};

export type IntentName = 'brand' | 'neutral' | 'danger';
export type ProminenceName = 'default' | 'bold' | 'subtle';
export type StateName = 'default' | 'hover' | 'active';

/** Colour mode — matches the semantic-light/semantic-dark Figma variable modes */
export type ColorMode = 'light' | 'dark';

// ---------------------------------------------------------------------------
// Scheme shape
// ---------------------------------------------------------------------------

type OptionStateColors = {
  default: { bg: string; fg: string };
  hover: { bg: string; fg: string };
  selected: { bg: string; fg: string };
  selectedHover: { bg: string; fg: string };
  disabled: { bg: string; fg: string };
};

export type ColorScheme = {
  /** intent → prominence → state → { bg, fg, border } */
  intents: Record<IntentName, IntentColors>;
  /** Disabled state — shared across all intents */
  disabled: StateColors;
  /** Focus ring colour — control/focus-ring-colour */
  focusRing: { color: string };
  /** Surface tokens — backgrounds and overlay styling */
  surface: {
    /** Page/screen background — surface/base */
    base: string;
    /** Subtle background for sections/cards — surface/subtle */
    subtle: string;
    /** Overlay surfaces (Dialog, Popover, Tooltip, Select, etc.) */
    overlay: { bg: string; border: string; borderRadius: number };
  };
  /** Semantic text tokens */
  text: {
    /** Default foreground for standalone text — text/primary (Text component default) */
    primary: string;
    description: string;
    /** Placeholder text in form fields — intent/neutral/placeholder */
    placeholder: string;
  };
  /** Overlay/scrim opacity */
  overlay: { scrimOpacity: number };
  /** Option state colours — used by SelectOption (neutral intent) */
  select: {
    option: OptionStateColors;
    /** Separator line colour */
    separator: string;
  };
  /** Tag tokens — multi-select pill styling (layout constant across modes) */
  tag: {
    bg: string;
    fg: string;
    borderRadius: number;
    paddingX: number;
    paddingY: number;
    gap: number;
    closeSize: number;
  };
  /** Error/danger colour for form field borders and helper text */
  error: { border: string; fg: string };
  /** Checkbox colours — indicator box, icon, and label */
  checkbox: {
    box: {
      uncheckedDefault: { bg: string; border: string };
      uncheckedHover: { bg: string; border: string };
      checked: { bg: string; border: string };
      disabled: { bg: string; border: string };
    };
    icon: { default: string; disabled: string };
    label: { default: string; disabled: string };
  };
  /** Radio colours — indicator ring/fill, centre dot, and label */
  radio: {
    indicator: {
      uncheckedDefault: { bg: string; border: string };
      uncheckedHover: { bg: string; border: string };
      checked: { bg: string; border: string };
      checkedHover: { bg: string; border: string };
      disabled: { bg: string; border: string };
    };
    dot: { default: string; disabled: string };
    label: { default: string; disabled: string };
  };
  /** Toggle colours — track (on/off/disabled) + thumb + label */
  toggle: {
    track: {
      off: string;
      offHover: string;
      on: string;
      onHover: string;
      disabledOff: string;
      disabledOn: string;
    };
    thumb: string;
    label: { default: string; disabled: string };
  };
  /** Avatar colours — initials/icon fallback surface + foreground */
  avatar: { bg: string; fg: string };
  /** Skeleton colours — placeholder surface for loading states */
  skeleton: { bg: string; highlight: string };
  /** List colours — used by List / ListItem / ListSubheader */
  list: {
    item: OptionStateColors;
    subheaderFg: string;
    descriptionFg: string;
    separator: string;
    containerBg: string;
  };
};

// ---------------------------------------------------------------------------
// Light scheme — semantic-light mode
// ---------------------------------------------------------------------------

export const lightColors: ColorScheme = {
  intents: {
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
    },
  },
  disabled: { bg: '#F3F4F6', fg: '#9CA3AF', border: '#E5E7EB' },
  focusRing: { color: '#3B82F6' }, // blue/500
  surface: {
    base: '#F9FAFB', // cool-grey/50
    subtle: '#F3F4F6', // cool-grey/100
    overlay: { bg: '#FFFFFF', border: '#E5E7EB', borderRadius: 8 },
  },
  text: {
    primary: '#374151', // cool-grey/700
    description: '#6B7280',
    placeholder: '#9CA3AF',
  },
  overlay: { scrimOpacity: 0.5 },
  select: {
    option: {
      default:       { bg: 'transparent', fg: '#374151' },
      hover:         { bg: '#F9FAFB',     fg: '#111827' },
      selected:      { bg: '#EFF6FF',     fg: '#1D4ED8' },
      selectedHover: { bg: '#DBEAFE',     fg: '#1D4ED8' },
      disabled:      { bg: 'transparent', fg: '#9CA3AF' },
    },
    separator: '#E5E7EB',
  },
  tag: {
    bg: '#F3F4F6',
    fg: '#374151',
    borderRadius: 4,
    paddingX: 6,
    paddingY: 1,
    gap: 4,
    closeSize: 12,
  },
  error: { border: '#FCA5A5', fg: '#DC2626' },
  checkbox: {
    box: {
      uncheckedDefault: { bg: '#FFFFFF', border: '#D1D5DB' },
      uncheckedHover: { bg: '#FFFFFF', border: '#9CA3AF' },
      checked: { bg: '#2563EB', border: 'transparent' },
      disabled: { bg: '#F3F4F6', border: '#E5E7EB' },
    },
    icon: { default: '#FFFFFF', disabled: '#9CA3AF' },
    label: { default: '#374151', disabled: '#6B7280' },
  },
  radio: {
    indicator: {
      uncheckedDefault: { bg: '#FFFFFF', border: '#D1D5DB' },
      uncheckedHover: { bg: '#FFFFFF', border: '#9CA3AF' },
      checked: { bg: '#2563EB', border: 'transparent' },
      checkedHover: { bg: '#1D4ED8', border: 'transparent' },
      disabled: { bg: '#F3F4F6', border: '#E5E7EB' },
    },
    dot: { default: '#FFFFFF', disabled: '#9CA3AF' },
    label: { default: '#374151', disabled: '#9CA3AF' },
  },
  toggle: {
    track: {
      off: '#E5E7EB', // control/toggle/off/bg
      offHover: '#D1D5DB', // control/toggle/off/hover/bg
      on: '#2563EB', // intent/brand/bold/default/bg
      onHover: '#1D4ED8', // intent/brand/bold/hover/bg
      disabledOff: '#F3F4F6', // intent/disabled/bg
      disabledOn: '#9CA3AF', // intent/disabled/fg
    },
    thumb: '#FFFFFF',
    label: { default: '#374151', disabled: '#9CA3AF' },
  },
  avatar: { bg: '#F3F4F6', fg: '#374151' },
  skeleton: { bg: '#F3F4F6', highlight: '#E5E7EB' },
  list: {
    item: {
      default:       { bg: 'transparent', fg: '#374151' },
      hover:         { bg: '#F9FAFB',     fg: '#111827' },
      selected:      { bg: '#EFF6FF',     fg: '#1D4ED8' },
      selectedHover: { bg: '#DBEAFE',     fg: '#1D4ED8' },
      disabled:      { bg: '#F3F4F6',     fg: '#9CA3AF' },
    },
    subheaderFg: '#6B7280',
    descriptionFg: '#6B7280',
    separator: '#E5E7EB',
    containerBg: '#FFFFFF',
  },
};

// ---------------------------------------------------------------------------
// Dark scheme — semantic-dark mode
// ---------------------------------------------------------------------------

export const darkColors: ColorScheme = {
  intents: {
    neutral: {
      default: {
        default: { bg: '#111827', fg: '#E5E7EB', border: '#4B5563' },
        hover: { bg: '#1F2937', fg: '#F3F4F6', border: '#6B7280' },
        active: { bg: '#374151', fg: '#F9FAFB', border: '#9CA3AF' },
      },
      bold: {
        default: { bg: '#E5E7EB', fg: '#111827', border: '#E5E7EB' },
        hover: { bg: '#F3F4F6', fg: '#111827', border: '#F3F4F6' },
        active: { bg: '#F9FAFB', fg: '#111827', border: '#F9FAFB' },
      },
      subtle: {
        default: { bg: 'transparent', fg: '#E5E7EB', border: 'transparent' },
        hover: { bg: '#1F2937', fg: '#F3F4F6', border: 'transparent' },
        active: { bg: '#374151', fg: '#F9FAFB', border: 'transparent' },
      },
    },
    brand: {
      default: {
        default: { bg: '#111827', fg: '#60A5FA', border: '#2563EB' },
        hover: { bg: '#1E3A8A', fg: '#93C5FD', border: '#3B82F6' },
        active: { bg: '#1E40AF', fg: '#BFDBFE', border: '#60A5FA' },
      },
      // Bold (filled) intents keep their light values — white-on-600 stays
      // AA-accessible on dark surfaces and preserves brand recognition.
      bold: {
        default: { bg: '#2563EB', fg: '#FFFFFF', border: '#2563EB' },
        hover: { bg: '#1D4ED8', fg: '#FFFFFF', border: '#1D4ED8' },
        active: { bg: '#1E40AF', fg: '#FFFFFF', border: '#1E40AF' },
      },
      subtle: {
        default: { bg: 'transparent', fg: '#60A5FA', border: 'transparent' },
        hover: { bg: '#1E3A8A', fg: '#93C5FD', border: 'transparent' },
        active: { bg: '#1E40AF', fg: '#BFDBFE', border: 'transparent' },
      },
    },
    danger: {
      default: {
        default: { bg: '#111827', fg: '#F87171', border: '#DC2626' },
        hover: { bg: '#7F1D1D', fg: '#FCA5A5', border: '#EF4444' },
        active: { bg: '#991B1B', fg: '#FECACA', border: '#F87171' },
      },
      bold: {
        default: { bg: '#DC2626', fg: '#FFFFFF', border: '#DC2626' },
        hover: { bg: '#B91C1C', fg: '#FFFFFF', border: '#B91C1C' },
        active: { bg: '#991B1B', fg: '#FFFFFF', border: '#991B1B' },
      },
      subtle: {
        default: { bg: 'transparent', fg: '#F87171', border: 'transparent' },
        hover: { bg: '#7F1D1D', fg: '#FCA5A5', border: 'transparent' },
        active: { bg: '#991B1B', fg: '#FECACA', border: 'transparent' },
      },
    },
  },
  disabled: { bg: '#1F2937', fg: '#4B5563', border: '#374151' },
  focusRing: { color: '#60A5FA' }, // blue/400 — lifted one step for dark surfaces
  surface: {
    base: '#111827', // cool-grey/900
    subtle: '#1F2937', // cool-grey/800
    overlay: { bg: '#1F2937', border: '#374151', borderRadius: 8 },
  },
  text: {
    primary: '#E5E7EB', // cool-grey/200
    description: '#9CA3AF',
    placeholder: '#6B7280',
  },
  overlay: { scrimOpacity: 0.5 },
  select: {
    option: {
      default:       { bg: 'transparent', fg: '#E5E7EB' },
      hover:         { bg: '#374151',     fg: '#F9FAFB' },
      selected:      { bg: '#1E3A8A',     fg: '#93C5FD' },
      selectedHover: { bg: '#1E40AF',     fg: '#93C5FD' },
      disabled:      { bg: 'transparent', fg: '#6B7280' },
    },
    separator: '#374151',
  },
  tag: {
    bg: '#374151',
    fg: '#E5E7EB',
    borderRadius: 4,
    paddingX: 6,
    paddingY: 1,
    gap: 4,
    closeSize: 12,
  },
  error: { border: '#DC2626', fg: '#F87171' },
  checkbox: {
    box: {
      uncheckedDefault: { bg: '#111827', border: '#4B5563' },
      uncheckedHover: { bg: '#111827', border: '#6B7280' },
      checked: { bg: '#2563EB', border: 'transparent' },
      disabled: { bg: '#1F2937', border: '#374151' },
    },
    icon: { default: '#FFFFFF', disabled: '#6B7280' },
    label: { default: '#E5E7EB', disabled: '#6B7280' },
  },
  radio: {
    indicator: {
      uncheckedDefault: { bg: '#111827', border: '#4B5563' },
      uncheckedHover: { bg: '#111827', border: '#6B7280' },
      checked: { bg: '#2563EB', border: 'transparent' },
      checkedHover: { bg: '#1D4ED8', border: 'transparent' },
      disabled: { bg: '#1F2937', border: '#374151' },
    },
    dot: { default: '#FFFFFF', disabled: '#6B7280' },
    label: { default: '#E5E7EB', disabled: '#6B7280' },
  },
  toggle: {
    track: {
      off: '#374151',
      offHover: '#4B5563',
      on: '#2563EB',
      onHover: '#1D4ED8',
      disabledOff: '#1F2937',
      disabledOn: '#4B5563',
    },
    thumb: '#FFFFFF',
    label: { default: '#E5E7EB', disabled: '#6B7280' },
  },
  avatar: { bg: '#374151', fg: '#E5E7EB' },
  skeleton: { bg: '#1F2937', highlight: '#374151' },
  list: {
    item: {
      default:       { bg: 'transparent', fg: '#E5E7EB' },
      hover:         { bg: '#374151',     fg: '#F9FAFB' },
      selected:      { bg: '#1E3A8A',     fg: '#93C5FD' },
      selectedHover: { bg: '#1E40AF',     fg: '#93C5FD' },
      disabled:      { bg: '#1F2937',     fg: '#6B7280' },
    },
    subheaderFg: '#9CA3AF',
    descriptionFg: '#9CA3AF',
    separator: '#374151',
    containerBg: '#1F2937',
  },
};

/** Scheme lookup by colour mode */
export const colorSchemes: Record<ColorMode, ColorScheme> = {
  light: lightColors,
  dark: darkColors,
};

// ---------------------------------------------------------------------------
// Legacy flat exports — light-scheme values, kept for backwards compatibility.
// Prefer reading from useTheme().scheme so dark mode is respected.
// ---------------------------------------------------------------------------

export const intentColors: Record<IntentName, IntentColors> = lightColors.intents;

/** Disabled state — shared across all intents */
export const disabledColors: StateColors = lightColors.disabled;

/** Semantic control constants */
export const controlTokens = {
  borderWidth: 1,
  /** Focus ring width — control/focus-ring-width */
  focusRingWidth: 2,
  /** Focus ring offset — control/focus-ring-offset */
  focusRingOffset: 2,
  /** Focus ring colour — control/focus-ring-colour (blue/500). Mode-aware value: useTheme().scheme.focusRing.color */
  focusRingColor: lightColors.focusRing.color,
};

/** Surface tokens — backgrounds and overlay styling */
export const surfaceTokens = lightColors.surface;

/** Semantic text tokens */
export const textTokens = lightColors.text;

/** Overlay/scrim opacity */
export const overlayTokens = {
  scrimOpacity: lightColors.overlay.scrimOpacity,
};

/** Option state colours — used by SelectOption (neutral intent) */
export const selectColors = lightColors.select;

/** Tag tokens — multi-select pill styling (constant across densities) */
export const tagTokens = lightColors.tag;

/** Error/danger colour for form field borders and helper text */
export const errorTokens = lightColors.error;

/** Checkbox colours — indicator box, icon, and label */
export const checkboxColors = lightColors.checkbox;

/** Radio colours — indicator ring/fill, centre dot, and label */
export const radioColors = lightColors.radio;

/** Toggle colours — track (on/off/disabled) + thumb + label */
export const toggleColors = lightColors.toggle;

/** Avatar colours — initials/icon fallback surface + foreground */
export const avatarColors = lightColors.avatar;

/** Skeleton colours — placeholder surface for loading states */
export const skeletonColors = lightColors.skeleton;

/** List colours — used by List / ListItem / ListSubheader */
export const listColors = lightColors.list;
