/**
 * Tabs — a horizontal, underline-style tab bar for switching between views.
 *
 * Compound component. `<Tabs>` is the container that owns the selected `value`
 * and `onValueChange`; `<Tab>` is an individual tab. They communicate through
 * context, so a consumer writes:
 *
 *   <Tabs value={tab} onValueChange={setTab}>
 *     <Tab value="overview">Overview</Tab>
 *     <Tab value="activity" leadingIcon="bolt">Activity</Tab>
 *     <Tab value="settings" disabled>Settings</Tab>
 *   </Tabs>
 *
 * Maps 1:1 to the Figma <Tabs> component set:
 *   intent → neutral | brand | danger   (selected indicator + selected label)
 *   size   → small | default | large    (padding, gap, typography, indicator)
 *   Tab state=Selected → the active tab; state=Disabled → disabled
 *
 * Labels render through the shared <Text> component (label scale, medium
 * weight) and optional leading icons through <Icon>, so Tabs inherits the
 * type ramp and the Material Symbols slot architecture rather than restyling
 * text itself. Tabs switch views in place, so each tab is a `tab` role (not a
 * link — there is no <Link> in Cast UI, and a tab is not navigation).
 *
 * Tokens: `gap` / `paddingX` / `paddingY` / `listGap` are density spacing from
 * `components.tabs`; `indicatorHeight` is keyed by `size` and constant across
 * density (like Progress's track-height); `indicatorRadius` is the pill radius.
 * Colours: the selected indicator and selected label bind to the intent system
 * (`colors[intent].default.default.fg`); unselected labels use
 * `scheme.text.description`, hovered use `scheme.text.primary`, disabled use
 * `scheme.disabled.fg`; the baseline divider is the dedicated
 * `scheme.tabs.track` semantic (cool-grey/200 light, cool-grey/700 dark).
 */

import React, { createContext, useContext, useState } from 'react';
import {
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
  type GestureResponderEvent,
} from 'react-native';
import { useTheme } from '../../theme';
import { controlTokens } from '../../tokens';
import type { IntentName } from '../../tokens';
import { Text, type TextType } from '../Text';
import { Icon } from '../Icon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TabsSize = 'small' | 'default' | 'large';

export type TabsProps = {
  /** The currently selected tab's `value`. */
  value?: string;
  /** Called with the next tab's `value` when a tab is pressed. */
  onValueChange?: (value: string) => void;
  /** Semantic intent — drives the selected indicator + selected label colour. */
  intent?: IntentName;
  /** Size variant — controls padding, gap, typography, and indicator height. */
  size?: TabsSize;
  /** `<Tab>` children. */
  children: React.ReactNode;
  /** Outer style — use for positioning (margin, width, alignSelf). */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label for the tab list. */
  accessibilityLabel?: string;
};

export type TabProps = {
  /** Unique value identifying this tab — matched against `Tabs.value`. */
  value: string;
  /** The tab label text. */
  children: string;
  /** Icon before the label — Material Symbols name string or a ReactNode. */
  leadingIcon?: string | React.ReactNode;
  /** Disables interaction and applies muted styling. */
  disabled?: boolean;
  /** Outer style — applied to the tab pressable. */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label — falls back to the label text. */
  accessibilityLabel?: string;
};

// ---------------------------------------------------------------------------
// Context — connects Tabs to its Tab children
// ---------------------------------------------------------------------------

type TabsContextValue = {
  value: string | undefined;
  onValueChange?: (value: string) => void;
  size: TabsSize;
  intent: IntentName;
};

const TabsCtx = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
  const ctx = useContext(TabsCtx);
  if (!ctx) {
    throw new Error(`<${component}> must be used within <Tabs>`);
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maps tab size → label typography scale (Text component `type`). */
const LABEL_TYPE: Record<TabsSize, TextType> = {
  small: 'label-sm',
  default: 'label-md',
  large: 'label-lg',
};

// ---------------------------------------------------------------------------
// Tab
// ---------------------------------------------------------------------------

export function Tab({
  value,
  children,
  leadingIcon,
  disabled = false,
  style,
  accessibilityLabel,
}: TabProps) {
  const { value: selectedValue, onValueChange, size, intent } =
    useTabsContext('Tab');
  const { components, colors, scheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const sizeTokens = components.tabs[size];
  const { indicatorRadius } = components.tabs;
  const isSelected = selectedValue === value;
  // Selected label + indicator track the intent *fg* (text/line colour), mirroring
  // the Figma binding intent/{intent}/default/default/fg — same hex as bold/bg in
  // light, but correctly the text colour (not the solid fill) in dark mode.
  const accent = colors[intent].default.default.fg;

  // Resolve the label/icon colour from interaction + selection state.
  const fg = disabled
    ? scheme.disabled.fg
    : isSelected
      ? accent
      : isHovered
        ? scheme.text.primary
        : scheme.text.description;

  const indicatorColor = isSelected ? accent : 'transparent';

  const handlePress = (_e: GestureResponderEvent) => {
    if (!disabled && !isSelected) onValueChange?.(value);
  };

  const resolvedLeading =
    typeof leadingIcon === 'string' ? (
      <Icon name={leadingIcon} size={size} color={fg} />
    ) : (
      leadingIcon
    );

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      accessibilityRole="tab"
      accessibilityLabel={accessibilityLabel || children}
      accessibilityState={{ selected: isSelected, disabled }}
      style={style}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: sizeTokens.gap,
          paddingHorizontal: sizeTokens.paddingX,
          paddingVertical: sizeTokens.paddingY,
        }}
      >
        {resolvedLeading}
        <Text type={LABEL_TYPE[size]} color={fg} selectable={false}>
          {children}
        </Text>
        {/* Selected indicator — overlaps the tab-list baseline border. */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: -controlTokens.borderWidth,
            height: sizeTokens.indicatorHeight,
            borderRadius: indicatorRadius,
            backgroundColor: indicatorColor,
          }}
        />
      </View>
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

export function Tabs({
  value,
  onValueChange,
  intent = 'brand',
  size = 'default',
  children,
  style,
  accessibilityLabel,
}: TabsProps) {
  const { components, scheme } = useTheme();
  const { listGap } = components.tabs;

  return (
    <TabsCtx.Provider value={{ value, onValueChange, size, intent }}>
      <View
        accessibilityRole="tablist"
        accessibilityLabel={accessibilityLabel}
        style={[
          {
            flexDirection: 'row',
            alignSelf: 'flex-start',
            gap: listGap,
            borderBottomWidth: controlTokens.borderWidth,
            borderBottomColor: scheme.tabs.track,
          },
          style,
        ]}
      >
        {children}
      </View>
    </TabsCtx.Provider>
  );
}
