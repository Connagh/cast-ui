/**
 * Dialog — modal overlay for focused tasks, confirmations, and alerts.
 *
 * Maps to the Figma <Dialog> component:
 *   size → small | default | large
 *
 * Structure: scrim backdrop → card (icon + title + description + slot + actions)
 * Surface styling uses shared overlay tokens (bg, border, radius, shadow).
 * Spacing tokens come from the density theme.
 *
 * Exports:
 *   Dialog        — full modal (backdrop + card)
 *   DialogContent — just the card, for inline use or custom overlays
 */

import React from 'react';
import {
  Modal,
  Pressable,
  View,
  Text,
  Platform,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { useTheme } from '../../theme';
import { Button } from '../Button';
import { Icon } from '../Icon';
import {
  fontFamily,
  fontWeight,
  title,
  body,
  surfaceTokens,
  textTokens,
  overlayTokens,
  controlTokens,
} from '../../tokens';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DialogSize = 'small' | 'default' | 'large';

export type DialogAction = {
  /** Button label text. */
  label: string;
  /** Press handler. */
  onPress: () => void;
};

export type DialogContentProps = {
  /** Dialog title — always visible. */
  title: string;
  /** Supporting text below the title. */
  description?: string;
  /** Header icon — Material Symbols name string or ReactNode. */
  icon?: string | React.ReactNode;
  /** Size variant — controls padding, gap, typography, icon size, and width. */
  size?: DialogSize;
  /** Custom content between the description and actions. */
  children?: React.ReactNode;
  /** Primary action button (brand/bold). Rendered on the right. */
  primaryAction?: DialogAction;
  /** Secondary action button (neutral/default). Rendered on the left. */
  secondaryAction?: DialogAction;
  /** Style override for the card. */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label — falls back to title if not provided. */
  accessibilityLabel?: string;
};

export type DialogProps = DialogContentProps & {
  /** Controls visibility. */
  open: boolean;
  /** Called when the backdrop is pressed or the dialog requests close. */
  onClose?: () => void;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maps dialog size → typography scale key */
const TYPO_SCALE: Record<DialogSize, 'sm' | 'md' | 'lg'> = {
  small: 'sm',
  default: 'md',
  large: 'lg',
};

/** Maps dialog size → button size */
const BUTTON_SIZE: Record<DialogSize, 'small' | 'default' | 'large'> = {
  small: 'small',
  default: 'default',
  large: 'large',
};

/** Fixed widths per dialog size (from Figma spec) */
const DIALOG_WIDTH: Record<DialogSize, number> = {
  small: 360,
  default: 480,
  large: 600,
};

/** Internal spacing constants (semantic tokens, constant across densities) */
const HEADER_ICON_GAP = 8;   // space/5
const TITLE_DESC_GAP = 2;    // space/2

/** Shadow for web — matches Figma shadow/lg */
const SHADOW_WEB = {
  boxShadow: '0px 4px 6px rgba(0,0,0,0.04), 0px 10px 15px rgba(0,0,0,0.08)',
};

/** Shadow for native */
const SHADOW_NATIVE: ViewStyle = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.08,
  shadowRadius: 15,
  elevation: 8,
};

// ---------------------------------------------------------------------------
// DialogContent — the card, without modal/backdrop
// ---------------------------------------------------------------------------

/**
 * The dialog card rendered inline — no modal, no backdrop.
 * Use this for static display (e.g., Storybook visual stories)
 * or when building custom overlay implementations.
 */
export function DialogContent({
  title: titleText,
  description,
  icon,
  size = 'default',
  children,
  primaryAction,
  secondaryAction,
  style,
  accessibilityLabel,
}: DialogContentProps) {
  const { components, colors } = useTheme();
  const sizeTokens = components.dialog[size];
  const titleTokens = title[TYPO_SCALE[size]];
  const bodyTokens = body[TYPO_SCALE[size]];
  const buttonSize = BUTTON_SIZE[size];

  const fgColor = colors.neutral.default.default.fg;

  const resolvedIcon =
    typeof icon === 'string' ? (
      <Icon name={icon} size={sizeTokens.iconSize} color={fgColor} />
    ) : (
      icon
    );

  const hasActions = primaryAction || secondaryAction;

  return (
    <View
      accessibilityRole="alert"
      accessibilityLabel={accessibilityLabel || titleText}
      style={[
        {
          width: DIALOG_WIDTH[size],
          maxWidth: '100%',
          backgroundColor: surfaceTokens.overlay.bg,
          borderWidth: controlTokens.borderWidth,
          borderColor: surfaceTokens.overlay.border,
          borderRadius: surfaceTokens.overlay.borderRadius,
          padding: sizeTokens.padding,
          gap: sizeTokens.gap,
          ...(Platform.OS === 'web' ? SHADOW_WEB : SHADOW_NATIVE),
        },
        style,
      ]}
    >
      {/* Header: icon + title + description */}
      <View style={{ gap: TITLE_DESC_GAP }}>
        <View style={{ gap: HEADER_ICON_GAP }}>
          {resolvedIcon}
          <Text
            accessibilityRole="header"
            style={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.medium,
              fontSize: titleTokens.fontSize,
              lineHeight: titleTokens.lineHeight,
              letterSpacing: titleTokens.letterSpacing,
              color: fgColor,
            }}
          >
            {titleText}
          </Text>
        </View>
        {description ? (
          <Text
            style={{
              fontFamily: fontFamily.sans,
              fontWeight: fontWeight.regular,
              fontSize: bodyTokens.fontSize,
              lineHeight: bodyTokens.lineHeight,
              letterSpacing: bodyTokens.letterSpacing,
              color: textTokens.description,
            }}
          >
            {description}
          </Text>
        ) : null}
      </View>

      {/* Content slot */}
      {children}

      {/* Actions */}
      {hasActions ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: sizeTokens.gap,
          }}
        >
          {secondaryAction ? (
            <Button
              intent="neutral"
              prominence="default"
              size={buttonSize}
              onPress={secondaryAction.onPress}
            >
              {secondaryAction.label}
            </Button>
          ) : null}
          {primaryAction ? (
            <Button
              intent="brand"
              prominence="bold"
              size={buttonSize}
              onPress={primaryAction.onPress}
            >
              {primaryAction.label}
            </Button>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Dialog — full modal with backdrop
// ---------------------------------------------------------------------------

export function Dialog({
  open,
  onClose,
  ...contentProps
}: DialogProps) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close dialog"
        style={{
          flex: 1,
          backgroundColor: `rgba(0, 0, 0, ${overlayTokens.scrimOpacity})`,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          accessibilityRole="none"
          style={{ maxWidth: '90%' }}
        >
          <DialogContent {...contentProps} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
