/**
 * Badge — a compact pill for labels, counts, and status indicators.
 *
 * Maps to the Figma <Badge> component (node 307:3354):
 *   intent  → neutral | brand | danger   (Figma "default" === neutral)
 *   variant → solid | subtle | outline   (Figma surface treatment)
 *   size    → small | default | large    (Figma "neutral" === default)
 *
 * Spacing/sizing comes from the `badge` theme tokens (keyed by size; constant
 * across density). Colours map directly onto the semantic intent system:
 *   solid   → intent bold     (filled, white text)
 *   subtle  → intent subtle   (transparent fill, coloured text)
 *   outline → intent bold border + intent default text (transparent fill)
 * Typography uses the label scale (sm/md/lg) matched to the badge size.
 */

import React from 'react';
import {
  View,
  Text,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { useTheme } from '../../theme';
import { fontFamily, fontWeight, label, controlTokens, iconSize } from '../../tokens';
import type { ColorScheme } from '../../tokens';
import type { IntentName } from '../../tokens';
import { Icon } from '../Icon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BadgeSize = 'small' | 'default' | 'large';
export type BadgeVariant = 'solid' | 'subtle' | 'outline';

export type BadgeProps = {
  /** The badge label text. */
  children: string;
  /** Semantic intent — drives the colour scheme. */
  intent?: IntentName;
  /** Surface treatment — solid (filled), subtle (tinted), or outline (bordered). */
  variant?: BadgeVariant;
  /** Size variant — controls padding, gap, and typography scale. */
  size?: BadgeSize;
  /** Shows a leading status dot in the foreground colour. */
  dot?: boolean;
  /** Icon before the label — Material Symbols name string or a ReactNode. */
  leadingIcon?: string | React.ReactNode;
  /** Icon after the label — Material Symbols name string or a ReactNode. */
  trailingIcon?: string | React.ReactNode;
  /** Outer style — use for positioning (margin, flex, alignSelf). */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label — falls back to children text if not provided. */
  accessibilityLabel?: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maps badge size → label typography scale */
const LABEL_SCALE: Record<BadgeSize, keyof typeof label> = {
  small: 'sm',
  default: 'md',
  large: 'lg',
};

/** Icon size scales with the badge size, matching the shared `iconSize`
 * scale (small→16, default→20, large→24). */

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type ResolvedColors = { bg: string; fg: string; border: string };

function resolveColors(
  intent: IntentName,
  variant: BadgeVariant,
  intentColors: ColorScheme['intents'],
): ResolvedColors {
  const clrs = intentColors[intent];
  switch (variant) {
    case 'subtle':
      return clrs.subtle.default;
    case 'outline':
      return {
        bg: 'transparent',
        fg: clrs.default.default.fg,
        border: clrs.bold.default.border,
      };
    case 'solid':
    default:
      return clrs.bold.default;
  }
}

export function Badge({
  children,
  intent = 'neutral',
  variant = 'solid',
  size = 'default',
  dot = false,
  leadingIcon,
  trailingIcon,
  style,
  accessibilityLabel,
}: BadgeProps) {
  const { components, scheme } = useTheme();

  const sizeTokens = components.badge[size];
  const labelTokens = label[LABEL_SCALE[size]];
  const colors = resolveColors(intent, variant, scheme.intents);

  const resolvedLeading =
    typeof leadingIcon === 'string' ? (
      <Icon name={leadingIcon} size={size} color={colors.fg} />
    ) : (
      leadingIcon
    );
  const resolvedTrailing =
    typeof trailingIcon === 'string' ? (
      <Icon name={trailingIcon} size={size} color={colors.fg} />
    ) : (
      trailingIcon
    );

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel || children}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'flex-start',
          gap: sizeTokens.gap,
          paddingHorizontal: sizeTokens.paddingX,
          paddingVertical: sizeTokens.paddingY,
          borderRadius: components.badge.borderRadius,
          borderWidth: controlTokens.borderWidth,
          borderColor: colors.border,
          backgroundColor: colors.bg,
        },
        style,
      ]}
    >
      {dot ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={{
            width: sizeTokens.dotSize,
            height: sizeTokens.dotSize,
            borderRadius: sizeTokens.dotSize / 2,
            backgroundColor: colors.fg,
          }}
        />
      ) : null}

      {resolvedLeading ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={{ width: iconSize[size], height: iconSize[size] }}
        >
          {resolvedLeading}
        </View>
      ) : null}

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
        {children}
      </Text>

      {resolvedTrailing ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no"
          style={{ width: iconSize[size], height: iconSize[size] }}
        >
          {resolvedTrailing}
        </View>
      ) : null}
    </View>
  );
}
