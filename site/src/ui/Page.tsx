import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { Text, useTheme } from '@castui/cast-ui';

/** Standard page container: centred column with comfortable gutters. */
export function Page({
  children,
  wide,
  style,
}: {
  children: React.ReactNode;
  wide?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          width: '100%',
          maxWidth: wide ? 1400 : 1080,
          alignSelf: 'center',
          paddingHorizontal: 20,
          paddingTop: 40,
          gap: 40,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Page heading: small eyebrow, title, one-paragraph lede. */
export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
}) {
  const { scheme, colors } = useTheme();
  return (
    <View style={{ gap: 10, maxWidth: 760 }}>
      {eyebrow ? (
        <Text type="label-sm" color={colors.brand.subtle.default.fg}>
          {eyebrow.toUpperCase()}
        </Text>
      ) : null}
      <Text type="display-sm">{title}</Text>
      {lede ? (
        <Text type="body-lg" color={scheme.text.description}>
          {lede}
        </Text>
      ) : null}
    </View>
  );
}

/** Section heading inside a page. */
export function Section({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: string;
  children?: React.ReactNode;
}) {
  const { scheme } = useTheme();
  return (
    <View style={{ gap: 16 }}>
      <View style={{ gap: 6, maxWidth: 760 }}>
        <Text type="heading-sm">{title}</Text>
        {lede ? (
          <Text type="body-md" color={scheme.text.description}>
            {lede}
          </Text>
        ) : null}
      </View>
      {children}
    </View>
  );
}

/** Body paragraph with measure cap. */
export function Prose({ children, color }: { children: string; color?: string }) {
  const { scheme } = useTheme();
  return (
    <Text type="body-md" color={color ?? scheme.text.primary} style={{ maxWidth: 760 }}>
      {children}
    </Text>
  );
}
