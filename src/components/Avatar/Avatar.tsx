/**
 * Avatar — a circular representation of a user or entity.
 *
 * Maps to the Figma <Avatar> component (node 307:4153):
 *   size → small | default | large   (drives diameter, glyph + initials scale)
 *   type → image | initials | icon   (inferred from the props you pass)
 *
 * The frame diameter comes from the `avatar` density theme (size × density);
 * the circle radius is constant (full pill). Initials use the label scale
 * matched to the size; the icon glyph and initials colour are the neutral
 * foreground. Image avatars fill the frame and have no background.
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  type ImageSourcePropType,
  type ViewStyle,
  type StyleProp,
} from 'react-native';
import { useTheme } from '../../theme';
import { fontFamily, fontWeight, label } from '../../tokens';
import { Icon } from '../Icon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AvatarSize = 'small' | 'default' | 'large';
export type AvatarType = 'image' | 'initials' | 'icon';

export type AvatarProps = {
  /** Size variant — controls diameter, initials, and glyph scale. */
  size?: AvatarSize;
  /** Image source — when set, renders an image avatar filling the frame. */
  source?: ImageSourcePropType;
  /** Initials to display (e.g. "AB"). Used when no `source` is provided. */
  initials?: string;
  /** Fallback icon — Material Symbols name string or a ReactNode. */
  icon?: string | React.ReactNode;
  /** Outer style — use for positioning (margin, flex, alignSelf). */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label — falls back to initials, else "Avatar". */
  accessibilityLabel?: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maps avatar size → initials typography scale */
const LABEL_SCALE: Record<AvatarSize, keyof typeof label> = {
  small: 'sm',
  default: 'md',
  large: 'lg',
};

/** Default fallback glyph when no source/initials/icon is supplied. */
const FALLBACK_ICON = 'person';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function resolveType(props: AvatarProps): AvatarType {
  if (props.source) return 'image';
  if (props.initials) return 'initials';
  return 'icon';
}

export function Avatar({
  size = 'default',
  source,
  initials,
  icon,
  style,
  accessibilityLabel,
}: AvatarProps) {
  const { components, scheme } = useTheme();
  const avatarColors = scheme.avatar;
  const tokens = components.avatar;
  const sizeTokens = tokens[size];
  const labelTokens = label[LABEL_SCALE[size]];
  const type = resolveType({ source, initials, icon });

  const frameStyle: ViewStyle = {
    width: sizeTokens.size,
    height: sizeTokens.size,
    borderRadius: tokens.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: type === 'image' ? undefined : avatarColors.bg,
  };

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel || initials || 'Avatar'}
      style={[frameStyle, style]}
    >
      {type === 'image' ? (
        <Image
          source={source as ImageSourcePropType}
          resizeMode="cover"
          style={{ width: '100%', height: '100%' }}
        />
      ) : type === 'initials' ? (
        <Text
          selectable={false}
          style={{
            fontFamily: fontFamily.sans,
            fontWeight: fontWeight.medium,
            fontSize: labelTokens.fontSize,
            lineHeight: labelTokens.lineHeight,
            letterSpacing: labelTokens.letterSpacing,
            color: avatarColors.fg,
            textAlign: 'center',
          }}
        >
          {initials}
        </Text>
      ) : (
        <View accessibilityElementsHidden importantForAccessibility="no">
          {typeof icon === 'string' || icon == null ? (
            <Icon
              name={typeof icon === 'string' ? icon : FALLBACK_ICON}
              size={sizeTokens.iconSize}
              color={avatarColors.fg}
            />
          ) : (
            icon
          )}
        </View>
      )}
    </View>
  );
}
