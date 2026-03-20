/**
 * Select — form control for choosing from a list of options.
 *
 * Maps to the Figma <Select> component:
 *   type  → single | multi | combobox
 *   size  → small | default | large
 *   state → default | hover | focus | error | disabled
 *
 * Trigger (input field) spacing comes from the density theme's `input` tokens.
 * Dropdown content spacing comes from the density theme's `select` tokens.
 * Colours come from the semantic intent system (constant across densities).
 *
 * Sub-components:
 *   SelectOption     — an individual option row
 *   SelectGroup      — a labelled group of options
 *   SelectSeparator  — a visual divider between groups
 *   SelectTag        — pill badge for multi-select (exported for standalone use)
 *   SelectContent    — the dropdown card (exported for custom overlay use)
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from 'react';
import {
  Pressable,
  View,
  Text,
  ScrollView,
  TextInput,
  Platform,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { useTheme } from '../../theme';
import { Icon } from '../Icon';
import {
  fontFamily,
  fontWeight,
  label,
  body,
  caption,
  controlTokens,
  surfaceTokens,
  selectColors,
  tagTokens,
  errorTokens,
  disabledColors,
  intentColors,
  textTokens,
} from '../../tokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SelectSize = 'small' | 'default' | 'large';
export type SelectType = 'single' | 'multi' | 'combobox';

export type SelectOptionProps = {
  /** Unique value identifier for this option. */
  value: string;
  /** Display label — rendered as the option text. */
  children: string;
  /** Supporting description text below the label. */
  description?: string;
  /** Leading icon — Material Symbols name string or ReactNode. */
  icon?: string | React.ReactNode;
  /** Disables this option. */
  disabled?: boolean;
};

export type SelectGroupProps = {
  /** Group label displayed above the options. */
  label: string;
  /** SelectOption children. */
  children: React.ReactNode;
};

export type SelectTagProps = {
  /** Tag label text. */
  children: string;
  /** Called when the remove button is pressed. */
  onRemove?: () => void;
  /** Disables interaction. */
  disabled?: boolean;
};

export type SelectProps = {
  /** Selection mode. */
  type?: SelectType;
  /** Size variant — controls padding, gap, and typography scale. */
  size?: SelectSize;
  /** Form label above the input. */
  label?: string;
  /** Helper or error text below the input. */
  helperText?: string;
  /** Placeholder text when no value is selected. */
  placeholder?: string;
  /** Leading icon in the trigger — Material Symbols name or ReactNode. */
  leadingIcon?: string | React.ReactNode;
  /** Disables the entire select. */
  disabled?: boolean;
  /** Error state — shows danger border and red helper text. */
  error?: boolean;
  /** Selected value (single / combobox). */
  value?: string;
  /** Selection change handler (single / combobox). */
  onValueChange?: (value: string) => void;
  /** Selected values (multi). */
  values?: string[];
  /** Selection change handler (multi). */
  onValuesChange?: (values: string[]) => void;
  /** Combobox search text (controlled). */
  searchValue?: string;
  /** Combobox search change handler. */
  onSearchChange?: (text: string) => void;
  /** SelectOption / SelectGroup / SelectSeparator children. */
  children: React.ReactNode;
  /** Style override for the outer container. */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label — falls back to label prop. */
  accessibilityLabel?: string;
};

// ---------------------------------------------------------------------------
// Context — connects Select to its children
// ---------------------------------------------------------------------------

type OptionInfo = { label: string; icon?: string | React.ReactNode };

type SelectContextValue = {
  type: SelectType;
  size: SelectSize;
  selectedValues: string[];
  onSelect: (value: string) => void;
  registerOption: (value: string, info: OptionInfo) => void;
  unregisterOption: (value: string) => void;
};

const SelectCtx = createContext<SelectContextValue | null>(null);

function useSelectContext(): SelectContextValue {
  const ctx = useContext(SelectCtx);
  if (!ctx) throw new Error('Select sub-components must be used within <Select>');
  return ctx;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ICON_SIZE = 16;
const CHEVRON_SIZE = 16;
const CONTENT_MAX_HEIGHT = 240;

/** Maps select size → label typography scale (for form label text) */
const LABEL_SCALE: Record<SelectSize, keyof typeof label> = {
  small: 'lg',
  default: 'md',
  large: 'lg',
};

/** Maps select size → body typography scale (for input value text) */
const BODY_SCALE: Record<SelectSize, keyof typeof body> = {
  small: 'sm',
  default: 'md',
  large: 'lg',
};

/** Shadow for web — matches Figma shadow/md */
const SHADOW_WEB = {
  boxShadow:
    '0px 2px 4px -2px rgba(0,0,0,0.05), 0px 4px 6px -1px rgba(0,0,0,0.07)',
};

/** Shadow for native */
const SHADOW_NATIVE: ViewStyle = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 6,
  elevation: 4,
};

// ---------------------------------------------------------------------------
// SelectTag — pill badge for multi-select
// ---------------------------------------------------------------------------

export function SelectTag({ children, onRemove, disabled = false }: SelectTagProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: tagTokens.gap,
        backgroundColor: tagTokens.bg,
        borderRadius: tagTokens.borderRadius,
        paddingHorizontal: tagTokens.paddingX,
        paddingVertical: tagTokens.paddingY,
      }}
    >
      <Text
        style={{
          fontFamily: fontFamily.sans,
          fontWeight: fontWeight.regular,
          fontSize: caption.fontSize,
          lineHeight: caption.lineHeight,
          letterSpacing: caption.letterSpacing,
          color: tagTokens.fg,
        }}
        selectable={false}
      >
        {children}
      </Text>
      {onRemove && !disabled ? (
        <Pressable
          onPress={onRemove}
          hitSlop={4}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${children}`}
        >
          <Icon name="close" size={tagTokens.closeSize} color={tagTokens.fg} />
        </Pressable>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// SelectSeparator — visual divider
// ---------------------------------------------------------------------------

export function SelectSeparator() {
  const { components } = useTheme();
  const tokens = components.select.separator;

  return (
    <View style={{ paddingVertical: tokens.marginY }}>
      <View
        style={{
          height: 1,
          backgroundColor: selectColors.separator,
        }}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// SelectGroup — labelled group of options
// ---------------------------------------------------------------------------

export function SelectGroup({ label: groupLabel, children }: SelectGroupProps) {
  const { components } = useTheme();
  const tokens = components.select.group;

  return (
    <View>
      <View
        style={{
          paddingHorizontal: tokens.paddingX,
          paddingVertical: tokens.labelPaddingY,
        }}
      >
        <Text
          style={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.regular,
            fontSize: caption.fontSize,
            lineHeight: caption.lineHeight,
            letterSpacing: caption.letterSpacing,
            color: textTokens.description,
            textTransform: 'uppercase',
          }}
          selectable={false}
        >
          {groupLabel}
        </Text>
      </View>
      {children}
    </View>
  );
}

// ---------------------------------------------------------------------------
// SelectOption — individual option row
// ---------------------------------------------------------------------------

export function SelectOption({
  value,
  children: optionLabel,
  description,
  icon,
  disabled = false,
}: SelectOptionProps) {
  const ctx = useSelectContext();
  const { components } = useTheme();
  const tokens = components.select.option;
  const [isHovered, setIsHovered] = useState(false);

  const isSelected = ctx.selectedValues.includes(value);
  const labelTokens = label[BODY_SCALE[ctx.size]];
  const bodyTokens = body[BODY_SCALE[ctx.size]];

  // Register this option with the parent Select
  useEffect(() => {
    ctx.registerOption(value, { label: optionLabel, icon });
    return () => ctx.unregisterOption(value);
    // Only re-register when value or label change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, optionLabel]);

  // Resolve colours
  const colors = disabled
    ? selectColors.option.disabled
    : isSelected && isHovered
      ? selectColors.option.selectedHover
      : isSelected
        ? selectColors.option.selected
        : isHovered
          ? selectColors.option.hover
          : selectColors.option.default;

  const resolvedIcon =
    typeof icon === 'string' ? (
      <Icon name={icon} size={ICON_SIZE} color={colors.fg} />
    ) : (
      icon
    );

  return (
    <Pressable
      onPress={() => {
        if (!disabled) ctx.onSelect(value);
      }}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      disabled={disabled}
      accessibilityRole="menuitem"
      accessibilityLabel={optionLabel}
      accessibilityState={{ selected: isSelected, disabled }}
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: tokens.gap,
        paddingHorizontal: tokens.paddingX,
        paddingVertical: tokens.paddingY,
        borderRadius: tokens.borderRadius,
        backgroundColor: colors.bg,
      }}
    >
      {resolvedIcon ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={{ width: ICON_SIZE, height: ICON_SIZE }}
        >
          {resolvedIcon}
        </View>
      ) : null}

      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text
          style={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.medium,
            fontSize: labelTokens.fontSize,
            lineHeight: labelTokens.lineHeight,
            letterSpacing: labelTokens.letterSpacing,
            color: colors.fg,
          }}
          selectable={false}
        >
          {optionLabel}
        </Text>
        {description ? (
          <Text
            style={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.regular,
              fontSize: bodyTokens.fontSize,
              lineHeight: bodyTokens.lineHeight,
              letterSpacing: bodyTokens.letterSpacing,
              color: disabled ? colors.fg : textTokens.description,
            }}
            numberOfLines={1}
            selectable={false}
          >
            {description}
          </Text>
        ) : null}
      </View>

      {isSelected && !disabled ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={{ width: ICON_SIZE, height: ICON_SIZE }}
        >
          <Icon name="check" size={ICON_SIZE} color={colors.fg} />
        </View>
      ) : null}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// SelectContent — the dropdown card (exported for custom overlay use)
// ---------------------------------------------------------------------------

export type SelectContentProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function SelectContent({ children, style }: SelectContentProps) {
  const { components } = useTheme();
  const tokens = components.select.content;

  return (
    <View
      style={[
        {
          backgroundColor: surfaceTokens.overlay.bg,
          borderWidth: controlTokens.borderWidth,
          borderColor: surfaceTokens.overlay.border,
          borderRadius: surfaceTokens.overlay.borderRadius,
          paddingVertical: tokens.paddingY,
          maxHeight: CONTENT_MAX_HEIGHT,
          ...(Platform.OS === 'web' ? SHADOW_WEB : SHADOW_NATIVE),
        },
        style,
      ]}
    >
      <ScrollView
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
      >
        {children}
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Select — main component (trigger + dropdown overlay)
// ---------------------------------------------------------------------------

export function Select({
  type = 'single',
  size = 'default',
  label: formLabel,
  helperText,
  placeholder = 'Select...',
  leadingIcon,
  disabled = false,
  error = false,
  value,
  onValueChange,
  values,
  onValuesChange,
  searchValue,
  onSearchChange,
  children,
  style,
  accessibilityLabel,
}: SelectProps) {
  const { components } = useTheme();
  const inputTokens = components.input[size];
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const optionRegistry = useRef<Map<string, OptionInfo>>(new Map());
  const [, forceUpdate] = useState(0);

  const selectedValues = useMemo(() => {
    if (type === 'multi') return values ?? [];
    return value != null ? [value] : [];
  }, [type, value, values]);

  const handleSelect = useCallback(
    (optionValue: string) => {
      if (type === 'multi') {
        const current = values ?? [];
        const next = current.includes(optionValue)
          ? current.filter((v) => v !== optionValue)
          : [...current, optionValue];
        onValuesChange?.(next);
      } else {
        onValueChange?.(optionValue);
        setIsOpen(false);
      }
    },
    [type, values, onValueChange, onValuesChange],
  );

  const registerOption = useCallback(
    (val: string, info: OptionInfo) => {
      optionRegistry.current.set(val, info);
      forceUpdate((n) => n + 1);
    },
    [],
  );

  const unregisterOption = useCallback((val: string) => {
    optionRegistry.current.delete(val);
  }, []);

  const ctxValue = useMemo<SelectContextValue>(
    () => ({
      type,
      size,
      selectedValues,
      onSelect: handleSelect,
      registerOption,
      unregisterOption,
    }),
    [type, size, selectedValues, handleSelect, registerOption, unregisterOption],
  );

  // Resolve typography scales
  const labelTypo = label[LABEL_SCALE[size]];
  const bodyTypo = body[BODY_SCALE[size]];

  // Resolve trigger border colour
  const triggerBorderColor = disabled
    ? disabledColors.border
    : error
      ? errorTokens.border
      : isHovered
        ? intentColors.neutral.default.hover.border
        : intentColors.neutral.default.default.border;

  const triggerBgColor = disabled
    ? disabledColors.bg
    : isHovered
      ? intentColors.neutral.default.hover.bg
      : intentColors.neutral.default.default.bg;

  const triggerFgColor = disabled
    ? disabledColors.fg
    : intentColors.neutral.default.default.fg;

  // Resolve leading icon
  const resolvedLeadingIcon =
    typeof leadingIcon === 'string' ? (
      <Icon name={leadingIcon} size={ICON_SIZE} color={triggerFgColor} />
    ) : (
      leadingIcon
    );

  // Get display text for single select
  const getSelectedLabel = (): string | undefined => {
    if (type === 'single' || type === 'combobox') {
      if (value != null) {
        const info = optionRegistry.current.get(value);
        return info?.label;
      }
    }
    return undefined;
  };

  const displayText = getSelectedLabel();

  // Escape key dismisses the dropdown (web)
  useEffect(() => {
    if (!isOpen || Platform.OS !== 'web') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <SelectCtx.Provider value={ctxValue}>
      <View
        style={[
          { alignSelf: 'stretch' as const, gap: components.input.fieldGap, zIndex: isOpen ? 1000 : 0 },
          style,
        ]}
      >
        {/* Form label */}
        {formLabel ? (
          <Text
            style={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.medium,
              fontSize: labelTypo.fontSize,
              lineHeight: labelTypo.lineHeight,
              letterSpacing: labelTypo.letterSpacing,
              color: triggerFgColor,
            }}
            selectable={false}
          >
            {formLabel}
          </Text>
        ) : null}

        {/* Trigger wrapper — anchors the dropdown below the input */}
        <View style={{ position: 'relative' as const }}>
        <Pressable
          onPress={() => {
            if (!disabled) setIsOpen(!isOpen);
          }}
          onHoverIn={() => setIsHovered(true)}
          onHoverOut={() => setIsHovered(false)}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={
            accessibilityLabel || formLabel || 'Select option'
          }
          accessibilityState={{ disabled, expanded: isOpen }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: inputTokens.gap,
            paddingHorizontal: inputTokens.paddingX,
            paddingVertical: inputTokens.paddingY,
            borderRadius: inputTokens.borderRadius,
            borderWidth: controlTokens.borderWidth,
            borderColor: triggerBorderColor,
            backgroundColor: triggerBgColor,
          }}
        >
          {/* Leading icon */}
          {resolvedLeadingIcon ? (
            <View
              accessibilityElementsHidden
              importantForAccessibility="no"
              style={{ width: ICON_SIZE, height: ICON_SIZE }}
            >
              {resolvedLeadingIcon}
            </View>
          ) : null}

          {/* Trigger content — varies by type */}
          {type === 'multi' ? (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 4,
                alignItems: 'center',
              }}
            >
              {selectedValues.length > 0
                ? selectedValues.map((val) => {
                    const info = optionRegistry.current.get(val);
                    return (
                      <SelectTag
                        key={val}
                        disabled={disabled}
                        onRemove={
                          disabled
                            ? undefined
                            : () => {
                                const next = selectedValues.filter(
                                  (v) => v !== val,
                                );
                                onValuesChange?.(next);
                              }
                        }
                      >
                        {info?.label ?? val}
                      </SelectTag>
                    );
                  })
                : renderPlaceholder(placeholder, bodyTypo)}
            </View>
          ) : type === 'combobox' ? (
            <TextInput
              value={searchValue ?? displayText ?? ''}
              onChangeText={(text) => {
                onSearchChange?.(text);
                if (!isOpen) setIsOpen(true);
              }}
              onFocus={() => {
                if (!isOpen) setIsOpen(true);
              }}
              placeholder={placeholder}
              placeholderTextColor={textTokens.description}
              editable={!disabled}
              style={{
                flex: 1,
                fontFamily: fontFamily.sans,
                fontWeight: fontWeight.regular,
                fontSize: bodyTypo.fontSize,
                lineHeight: bodyTypo.lineHeight,
                letterSpacing: bodyTypo.letterSpacing,
                color: triggerFgColor,
                padding: 0,
                ...(Platform.OS === 'web'
                  ? ({ outlineWidth: 0 } as unknown as ViewStyle)
                  : {}),
              }}
              accessibilityLabel={accessibilityLabel || formLabel || 'Search'}
            />
          ) : (
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: fontFamily.sans,
                  fontWeight: fontWeight.regular,
                  fontSize: bodyTypo.fontSize,
                  lineHeight: bodyTypo.lineHeight,
                  letterSpacing: bodyTypo.letterSpacing,
                  color: displayText
                    ? triggerFgColor
                    : textTokens.description,
                }}
                selectable={false}
              >
                {displayText ?? placeholder}
              </Text>
            </View>
          )}

          {/* Chevron icon */}
          <View
            accessibilityElementsHidden
            importantForAccessibility="no"
            style={
              isOpen
                ? { transform: [{ rotate: '180deg' }] }
                : undefined
            }
          >
            <Icon
              name="keyboard_arrow_down"
              size={CHEVRON_SIZE}
              color={triggerFgColor}
            />
          </View>
        </Pressable>

        {/* Click-outside backdrop */}
        {isOpen ? (
          <Pressable
            onPress={() => setIsOpen(false)}
            accessibilityRole="button"
            accessibilityLabel="Close select"
            style={Platform.select({
              web: {
                position: 'fixed' as ViewStyle['position'],
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 0,
              } as ViewStyle,
              default: {
                position: 'absolute' as const,
                top: -9999,
                left: -9999,
                width: 99999,
                height: 99999,
              } as ViewStyle,
            })}
          />
        ) : null}

        {/* Dropdown — always mounted so options register for tag labels */}
        <View
          style={[
            {
              position: 'absolute' as const,
              top: '100%' as unknown as number,
              left: 0,
              right: 0,
              paddingTop: 4,
              zIndex: 1,
            },
            !isOpen && ({ display: 'none' } as ViewStyle),
          ]}
        >
          <SelectContent>{children}</SelectContent>
        </View>
        </View>

        {/* Helper text */}
        {helperText ? (
          <Text
            style={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.regular,
              fontSize: caption.fontSize,
              lineHeight: caption.lineHeight,
              letterSpacing: caption.letterSpacing,
              color: error ? errorTokens.fg : textTokens.description,
            }}
            selectable={false}
          >
            {helperText}
          </Text>
        ) : null}
      </View>
    </SelectCtx.Provider>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderPlaceholder(
  text: string,
  typo: { fontSize: number; lineHeight: number; letterSpacing: number },
) {
  return (
    <Text
      style={{
        fontFamily: fontFamily.sans,
        fontWeight: fontWeight.regular,
        fontSize: typo.fontSize,
        lineHeight: typo.lineHeight,
        letterSpacing: typo.letterSpacing,
        color: textTokens.description,
      }}
      selectable={false}
    >
      {text}
    </Text>
  );
}
