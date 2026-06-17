/**
 * Autocomplete — a text field that filters a list of options as you type.
 *
 * Maps 1:1 to the Figma <Autocomplete> component:
 *   size  → small | default | large
 *   state → default | hover | focus | error | disabled
 *   option state → default | hover | selected | disabled
 *
 * Autocomplete is the Select combobox specialised for client-side filtering. Its
 * field is an Input, so it reuses the input tokens; its options are
 * value-selection rows, so it reuses the select tokens and the
 * scheme.select.option colours. It introduces no new tokens. Type to filter the
 * options by label, press one to select it, or clear the field.
 *
 * value is controlled with value/onValueChange (null = nothing selected) or
 * uncontrolled with defaultValue. Pass a filterOptions function to change how
 * matching works. Fonts are consumer-loaded.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import {
  fontFamily,
  fontWeight,
  label,
  body,
  caption,
  controlTokens,
  iconSize,
} from '../../tokens';
import { Icon } from '../Icon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AutocompleteSize = 'small' | 'default' | 'large';

export type AutocompleteOption = {
  /** Unique value. */
  value: string;
  /** Display label — also what the filter matches against. */
  label: string;
  /** Supporting text below the label. */
  description?: string;
  /** Leading icon — Material Symbols name or a ReactNode. */
  icon?: string | React.ReactNode;
  /** Disables this option. */
  disabled?: boolean;
};

export type AutocompleteProps = {
  /** The options to choose from. */
  options: AutocompleteOption[];
  /** Selected value (controlled). null = nothing selected. */
  value?: string | null;
  /** Initial value (uncontrolled). */
  defaultValue?: string | null;
  /** Selection change handler. */
  onValueChange?: (value: string | null) => void;
  /** Called with the input text as it changes. */
  onInputChange?: (text: string) => void;
  /** Field label above the input. */
  label?: string;
  /** Helper or error text below the input. */
  helperText?: string;
  /** Placeholder when empty. */
  placeholder?: string;
  /** Leading icon in the field. */
  leadingIcon?: string | React.ReactNode;
  /** Size variant. */
  size?: AutocompleteSize;
  /** Disables the field. */
  disabled?: boolean;
  /** Error state — danger border + red helper text. */
  error?: boolean;
  /** Show a clear button when there is input. Defaults to true. */
  clearable?: boolean;
  /** Text shown when no option matches. Defaults to "No options". */
  noOptionsText?: string;
  /** Override the default case-insensitive label filter. */
  filterOptions?: (options: AutocompleteOption[], query: string) => AutocompleteOption[];
  /** Style override for the outer container. */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label — falls back to the label prop. */
  accessibilityLabel?: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CONTENT_MAX_HEIGHT = 240;

const LABEL_SCALE: Record<AutocompleteSize, keyof typeof label> = {
  small: 'lg',
  default: 'md',
  large: 'lg',
};
const BODY_SCALE: Record<AutocompleteSize, keyof typeof body> = {
  small: 'sm',
  default: 'md',
  large: 'lg',
};

const SHADOW_WEB = {
  boxShadow: '0px 2px 4px -2px rgba(0,0,0,0.05), 0px 4px 6px -1px rgba(0,0,0,0.07)',
};
const SHADOW_NATIVE: ViewStyle = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 6,
  elevation: 4,
};

const defaultFilter = (options: AutocompleteOption[], query: string) =>
  options.filter((o) => o.label.toLowerCase().includes(query));

// ---------------------------------------------------------------------------
// Option row
// ---------------------------------------------------------------------------

function OptionRow({
  option,
  size,
  selected,
  onSelect,
}: {
  option: AutocompleteOption;
  size: AutocompleteSize;
  selected: boolean;
  onSelect: (value: string) => void;
}) {
  const { components, scheme } = useTheme();
  const tokens = components.select.option;
  const opt = scheme.select.option;
  const [isHovered, setIsHovered] = useState(false);
  const disabled = Boolean(option.disabled);

  const labelTokens = label[BODY_SCALE[size]];
  const bodyTokens = body[BODY_SCALE[size]];

  const colors = disabled
    ? opt.disabled
    : selected && isHovered
      ? opt.selectedHover
      : selected
        ? opt.selected
        : isHovered
          ? opt.hover
          : opt.default;

  const resolvedIcon =
    typeof option.icon === 'string' ? (
      <Icon name={option.icon} size={size} color={colors.fg} />
    ) : (
      option.icon
    );

  return (
    <Pressable
      onPress={() => {
        if (!disabled) onSelect(option.value);
      }}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      disabled={disabled}
      accessibilityRole="menuitem"
      accessibilityState={{ selected, disabled }}
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
          style={{ width: iconSize[size], height: iconSize[size] }}
        >
          {resolvedIcon}
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text
          selectable={false}
          style={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.medium,
            fontSize: labelTokens.fontSize,
            lineHeight: labelTokens.lineHeight,
            letterSpacing: labelTokens.letterSpacing,
            color: colors.fg,
          }}
        >
          {option.label}
        </Text>
        {option.description ? (
          <Text
            numberOfLines={1}
            selectable={false}
            style={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.regular,
              fontSize: bodyTokens.fontSize,
              lineHeight: bodyTokens.lineHeight,
              letterSpacing: bodyTokens.letterSpacing,
              color: disabled ? colors.fg : scheme.text.description,
            }}
          >
            {option.description}
          </Text>
        ) : null}
      </View>
      {selected && !disabled ? (
        <Icon name="check" size={size} color={colors.fg} />
      ) : null}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Autocomplete
// ---------------------------------------------------------------------------

export function Autocomplete({
  options,
  value: controlledValue,
  defaultValue = null,
  onValueChange,
  onInputChange,
  label: fieldLabel,
  helperText,
  placeholder = 'Search…',
  leadingIcon,
  size = 'default',
  disabled = false,
  error = false,
  clearable = true,
  noOptionsText = 'No options',
  filterOptions = defaultFilter,
  style,
  accessibilityLabel,
}: AutocompleteProps) {
  const { components, scheme, colors } = useTheme();
  const inputTokens = components.input[size];
  const neutral = colors.neutral.default;

  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue);
  const value = isControlled ? (controlledValue as string | null) : internalValue;

  const selectedLabel = useMemo(
    () => options.find((o) => o.value === value)?.label ?? '',
    [options, value],
  );

  const [search, setSearch] = useState(selectedLabel);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Keep the field text in sync when the selected value changes externally.
  useEffect(() => {
    setSearch(selectedLabel);
  }, [selectedLabel]);

  const query = search.trim().toLowerCase();
  const showAll = query.length === 0 || (value != null && search === selectedLabel);
  const filtered = showAll ? options : filterOptions(options, query);

  const labelTypo = label[LABEL_SCALE[size]];
  const bodyTypo = body[BODY_SCALE[size]];

  const setValue = (next: string | null) => {
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  const handleSelect = (optionValue: string) => {
    setValue(optionValue);
    const lbl = options.find((o) => o.value === optionValue)?.label ?? '';
    setSearch(lbl);
    onInputChange?.(lbl);
    setIsOpen(false);
  };

  const handleClear = () => {
    setValue(null);
    setSearch('');
    onInputChange?.('');
    setIsOpen(true);
  };

  // Escape closes the dropdown on web.
  useEffect(() => {
    if (!isOpen || Platform.OS !== 'web') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const borderColor = disabled
    ? scheme.disabled.border
    : error
      ? scheme.error.border
      : isFocused
        ? neutral.hover.border
        : neutral.default.border;
  const bgColor = disabled ? scheme.disabled.bg : neutral.default.bg;
  const fgColor = disabled ? scheme.disabled.fg : neutral.default.fg;

  const resolvedLeading =
    typeof leadingIcon === 'string' ? (
      <Icon name={leadingIcon} size={size} color={fgColor} />
    ) : (
      leadingIcon
    );

  const hasContent = search.length > 0 || value != null;

  return (
    <View style={[{ alignSelf: 'stretch', gap: components.input.fieldGap, zIndex: isOpen ? 1000 : 0 }, style]}>
      {fieldLabel ? (
        <Text
          selectable={false}
          style={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.medium,
            fontSize: labelTypo.fontSize,
            lineHeight: labelTypo.lineHeight,
            letterSpacing: labelTypo.letterSpacing,
            color: fgColor,
          }}
        >
          {fieldLabel}
        </Text>
      ) : null}

      <View style={{ position: 'relative' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: inputTokens.gap,
            paddingHorizontal: inputTokens.paddingX,
            paddingVertical: inputTokens.paddingY,
            borderRadius: inputTokens.borderRadius,
            borderWidth: controlTokens.borderWidth,
            borderColor,
            backgroundColor: bgColor,
          }}
        >
          {resolvedLeading ? (
            <View
              accessibilityElementsHidden
              importantForAccessibility="no"
              style={{ width: iconSize[size], height: iconSize[size] }}
            >
              {resolvedLeading}
            </View>
          ) : null}

          <TextInput
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              onInputChange?.(text);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => {
              setIsFocused(true);
              setIsOpen(true);
            }}
            onBlur={() => setIsFocused(false)}
            editable={!disabled}
            placeholder={placeholder}
            placeholderTextColor={scheme.text.description}
            accessibilityLabel={accessibilityLabel || fieldLabel || 'Search'}
            style={{
              flex: 1,
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.regular,
              fontSize: bodyTypo.fontSize,
              lineHeight: bodyTypo.lineHeight,
              letterSpacing: bodyTypo.letterSpacing,
              color: fgColor,
              padding: 0,
              ...(Platform.OS === 'web' ? ({ outlineWidth: 0 } as unknown as ViewStyle) : {}),
            }}
          />

          {clearable && hasContent && !disabled ? (
            <Pressable
              onPress={handleClear}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Clear"
            >
              <Icon name="close" size={size} color={fgColor} />
            </Pressable>
          ) : (
            <View
              accessibilityElementsHidden
              importantForAccessibility="no"
              style={isOpen ? { transform: [{ rotate: '180deg' }] } : undefined}
            >
              <Icon name="arrow_drop_down" size={size} color={fgColor} />
            </View>
          )}
        </View>

        {/* Click-outside layer */}
        {isOpen ? (
          <Pressable
            onPress={() => setIsOpen(false)}
            accessibilityRole="button"
            accessibilityLabel="Close options"
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
                position: 'absolute',
                top: -9999,
                left: -9999,
                width: 99999,
                height: 99999,
              } as ViewStyle,
            })}
          />
        ) : null}

        {/* Dropdown */}
        {isOpen ? (
          <View
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              paddingTop: 4,
              zIndex: 1,
            }}
          >
            <View
              style={{
                backgroundColor: scheme.surface.overlay.bg,
                borderWidth: controlTokens.borderWidth,
                borderColor: scheme.surface.overlay.border,
                borderRadius: scheme.surface.overlay.borderRadius,
                paddingVertical: components.select.content.paddingY,
                maxHeight: CONTENT_MAX_HEIGHT,
                ...(Platform.OS === 'web' ? SHADOW_WEB : SHADOW_NATIVE),
              }}
            >
              {filtered.length > 0 ? (
                <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
                  {filtered.map((option) => (
                    <OptionRow
                      key={option.value}
                      option={option}
                      size={size}
                      selected={option.value === value}
                      onSelect={handleSelect}
                    />
                  ))}
                </ScrollView>
              ) : (
                <Text
                  selectable={false}
                  style={{
                    fontFamily: fontFamily.sans,
                    fontWeight: fontWeight.regular,
                    fontSize: bodyTypo.fontSize,
                    lineHeight: bodyTypo.lineHeight,
                    letterSpacing: bodyTypo.letterSpacing,
                    color: scheme.text.description,
                    paddingHorizontal: components.select.option.paddingX,
                    paddingVertical: components.select.option.paddingY,
                  }}
                >
                  {noOptionsText}
                </Text>
              )}
            </View>
          </View>
        ) : null}
      </View>

      {helperText ? (
        <Text
          selectable={false}
          style={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.regular,
            fontSize: caption.fontSize,
            lineHeight: caption.lineHeight,
            letterSpacing: caption.letterSpacing,
            color: error ? scheme.error.fg : scheme.text.description,
          }}
        >
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}
