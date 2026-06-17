/**
 * ToggleButtonGroup — a segmented row of buttons for picking one or more values.
 *
 * Compound component. <ToggleButtonGroup> owns the selection and lays the
 * buttons out joined in a row; <ToggleButton> is one segment.
 *
 *   <ToggleButtonGroup value={align} onValueChange={setAlign}>
 *     <ToggleButton value="left" leadingIcon="format_align_left">Left</ToggleButton>
 *     <ToggleButton value="center" leadingIcon="format_align_center">Center</ToggleButton>
 *     <ToggleButton value="right" leadingIcon="format_align_right">Right</ToggleButton>
 *   </ToggleButtonGroup>
 *
 * Maps 1:1 to the Figma <Toggle Button Group> component:
 *   intent → neutral | brand | danger   (selected fill)
 *   size   → small | default | large    (padding, gap, typography)
 *   exclusive → single-select (string | null) vs multi-select (string[])
 *   ToggleButton state → default | hover | selected | disabled
 *
 * A toggle button is its own component, not the Button set, so it has dedicated
 * tokens (toggle-button-group/*). Selected segments fill with the intent bold
 * colour; unselected segments are transparent with neutral text and a neutral
 * hover. The group draws one neutral border with dividers between segments.
 * Spacing varies by density; typography by the size prop. Fonts are
 * consumer-loaded.
 */

import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import {
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import { controlTokens } from '../../tokens';
import type { IntentName } from '../../tokens';
import { Text, type TextType } from '../Text';
import { Icon } from '../Icon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ToggleButtonGroupSize = 'small' | 'default' | 'large';

export type ToggleButtonGroupProps = {
  /** Single-select (true, default) or multi-select (false). */
  exclusive?: boolean;
  /** Selected value (exclusive mode). null = nothing selected. */
  value?: string | null;
  /** Selection handler (exclusive mode). */
  onValueChange?: (value: string | null) => void;
  /** Selected values (multi mode). */
  values?: string[];
  /** Selection handler (multi mode). */
  onValuesChange?: (values: string[]) => void;
  /** Semantic intent — drives the selected fill colour. */
  intent?: IntentName;
  /** Size variant — padding, gap, and typography. */
  size?: ToggleButtonGroupSize;
  /** Disables every segment. */
  disabled?: boolean;
  /** `<ToggleButton>` children. */
  children: React.ReactNode;
  /** Outer style. */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label for the group. */
  accessibilityLabel?: string;
};

export type ToggleButtonProps = {
  /** Unique value identifying this segment. */
  value: string;
  /** The segment label. */
  children?: string;
  /** Icon before the label — Material Symbols name string or a ReactNode. */
  leadingIcon?: string | React.ReactNode;
  /** Disables this segment. */
  disabled?: boolean;
  /** Accessibility label — falls back to the label text. */
  accessibilityLabel?: string;
  /** Internal: set by <ToggleButtonGroup> on the first segment. */
  __first?: boolean;
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type ToggleButtonGroupContextValue = {
  intent: IntentName;
  size: ToggleButtonGroupSize;
  groupDisabled: boolean;
  isSelected: (value: string) => boolean;
  onItemPress: (value: string) => void;
};

const ToggleButtonGroupCtx = createContext<ToggleButtonGroupContextValue | null>(null);

function useToggleButtonGroupContext(): ToggleButtonGroupContextValue {
  const ctx = useContext(ToggleButtonGroupCtx);
  if (!ctx) throw new Error('<ToggleButton> must be used within <ToggleButtonGroup>');
  return ctx;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maps size → label typography scale (Text component `type`). */
const LABEL_TYPE: Record<ToggleButtonGroupSize, TextType> = {
  small: 'label-sm',
  default: 'label-md',
  large: 'label-lg',
};

// ---------------------------------------------------------------------------
// ToggleButton
// ---------------------------------------------------------------------------

export function ToggleButton({
  value,
  children,
  leadingIcon,
  disabled = false,
  accessibilityLabel,
  __first = false,
}: ToggleButtonProps) {
  const { intent, size, groupDisabled, isSelected, onItemPress } =
    useToggleButtonGroupContext();
  const { components, colors, scheme } = useTheme();
  const sizeTokens = components.toggleButtonGroup[size];
  const [isHovered, setIsHovered] = useState(false);

  const isDisabled = disabled || groupDisabled;
  const selected = isSelected(value);

  // Selected segments fill with the intent bold colour; unselected are
  // transparent with neutral text and a neutral hover.
  const colorset = isDisabled
    ? { bg: scheme.disabled.bg, fg: scheme.disabled.fg }
    : selected
      ? isHovered
        ? { bg: colors[intent].bold.hover.bg, fg: colors[intent].bold.hover.fg }
        : { bg: colors[intent].bold.default.bg, fg: colors[intent].bold.default.fg }
      : isHovered
        ? { bg: colors.neutral.subtle.hover.bg, fg: colors.neutral.subtle.hover.fg }
        : { bg: 'transparent', fg: colors.neutral.default.default.fg };

  const resolvedLeading =
    typeof leadingIcon === 'string' ? (
      <Icon name={leadingIcon} size={size} color={colorset.fg} />
    ) : (
      leadingIcon
    );

  return (
    <Pressable
      onPress={() => {
        if (!isDisabled) onItemPress(value);
      }}
      disabled={isDisabled}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || children || value}
      accessibilityState={{ selected, disabled: isDisabled }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: sizeTokens.gap,
        paddingHorizontal: sizeTokens.paddingX,
        paddingVertical: sizeTokens.paddingY,
        backgroundColor: colorset.bg,
        borderLeftWidth: __first ? 0 : controlTokens.borderWidth,
        borderLeftColor: colors.neutral.default.default.border,
      }}
    >
      {resolvedLeading}
      {children ? (
        <Text type={LABEL_TYPE[size]} color={colorset.fg} selectable={false}>
          {children}
        </Text>
      ) : null}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// ToggleButtonGroup
// ---------------------------------------------------------------------------

export function ToggleButtonGroup({
  exclusive = true,
  value,
  onValueChange,
  values,
  onValuesChange,
  intent = 'brand',
  size = 'default',
  disabled = false,
  children,
  style,
  accessibilityLabel,
}: ToggleButtonGroupProps) {
  const { components, colors } = useTheme();
  const radius = components.toggleButtonGroup.borderRadius;

  const isSelected = (v: string) =>
    exclusive ? value === v : (values ?? []).includes(v);

  const onItemPress = (v: string) => {
    if (exclusive) {
      onValueChange?.(value === v ? null : v);
    } else {
      const current = values ?? [];
      const next = current.includes(v)
        ? current.filter((x) => x !== v)
        : [...current, v];
      onValuesChange?.(next);
    }
  };

  const items = React.Children.toArray(children).filter(Boolean);
  const rendered = items.map((child, i) =>
    React.cloneElement(child as React.ReactElement<ToggleButtonProps>, {
      key: `tb-${i}`,
      __first: i === 0,
    }),
  );

  return (
    <ToggleButtonGroupCtx.Provider
      value={{ intent, size, groupDisabled: disabled, isSelected, onItemPress }}
    >
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={accessibilityLabel}
        style={[
          {
            flexDirection: 'row',
            alignSelf: 'flex-start',
            borderWidth: controlTokens.borderWidth,
            borderColor: colors.neutral.default.default.border,
            borderRadius: radius,
            overflow: 'hidden',
          },
          style,
        ]}
      >
        {rendered}
      </View>
    </ToggleButtonGroupCtx.Provider>
  );
}
