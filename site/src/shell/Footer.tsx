import React from 'react';
import { View } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { Divider, Link, Text, useTheme } from '@castui/cast-ui';
import { EXTERNAL_LINKS, NAV_ITEMS } from './TopNav';

export function Footer() {
  const { scheme } = useTheme();
  const navigate = useNavigate();

  return (
    <View style={{ borderTopWidth: 1, borderTopColor: scheme.surface.overlay.border, marginTop: 64 }}>
      <View
        style={{
          maxWidth: 1400,
          width: '100%',
          alignSelf: 'center',
          paddingHorizontal: 20,
          paddingVertical: 40,
          gap: 24,
        }}
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 48 }}>
          <View style={{ gap: 8, minWidth: 200 }}>
            <Text type="title-sm">cast-ui</Text>
            <Text type="body-sm" color={scheme.text.description}>
              One set of components for iOS, Android and the web. Designed in Figma, shipped as code, always in sync.
            </Text>
          </View>
          <View style={{ gap: 8 }}>
            <Text type="label-sm" color={scheme.text.description}>
              SITE
            </Text>
            {NAV_ITEMS.map((item) => (
              <Link key={item.path} intent="neutral" size="small" underline="hover" onPress={() => navigate(item.path)}>
                {item.label}
              </Link>
            ))}
          </View>
          <View style={{ gap: 8 }}>
            <Text type="label-sm" color={scheme.text.description}>
              ECOSYSTEM
            </Text>
            {EXTERNAL_LINKS.map((item) => (
              <Link key={item.href} intent="neutral" size="small" underline="hover" href={item.href} trailingIcon="open_in_new">
                {item.label}
              </Link>
            ))}
            <Link
              intent="neutral"
              size="small"
              underline="hover"
              href="https://www.chromatic.com/builds?appId=6990f00d7b8682c18d2ed5f3"
              trailingIcon="open_in_new"
            >
              Chromatic
            </Link>
          </View>
        </View>
        <Divider />
        <Text type="caption" color={scheme.text.description}>
          MIT licensed. Built with @castui/cast-ui through react-native-web: the site is rendered by the components it documents.
        </Text>
      </View>
    </View>
  );
}
