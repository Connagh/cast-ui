/**
 * The site's top navigation. Built from Cast UI components so the chrome
 * itself is a live demo: links, menus, buttons, and the drawer all restyle
 * when the visitor changes colour mode, density, or brand.
 */

import React, { useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Divider,
  Drawer,
  Icon,
  Link,
  List,
  ListItem,
  Menu,
  MenuItem,
  MenuLabel,
  useMinWidth,
  useTheme,
} from '@castui/cast-ui';
import { brandPresets, useSiteTheme } from '../theme/SiteTheme';

export const NAV_ITEMS = [
  { label: 'Docs', path: '/docs/getting-started', match: '/docs' },
  { label: 'Components', path: '/components', match: '/components' },
  { label: 'Patterns', path: '/patterns', match: '/patterns' },
  { label: 'Templates', path: '/templates', match: '/templates' },
  { label: 'Themes', path: '/themes', match: '/themes' },
  { label: 'Motion', path: '/motion', match: '/motion' },
  { label: 'Playground', path: '/playground', match: '/playground' },
  { label: 'Architecture', path: '/architecture', match: '/architecture' },
];

export const EXTERNAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/Connagh/cast-ui' },
  { label: 'npm', href: 'https://www.npmjs.com/package/@castui/cast-ui' },
  { label: 'Storybook', href: 'https://main--6990f00d7b8682c18d2ed5f3.chromatic.com' },
  { label: 'Figma kit', href: 'https://www.figma.com/community/file/1648821010844688421/cast-ui-kit-for-react-native' },
];

function ThemeControls({ compact }: { compact?: boolean }) {
  const site = useSiteTheme();
  const activeBrand = brandPresets.find((p) => p.id === site.brandId) ?? brandPresets[0];

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Button
        intent="neutral"
        prominence="subtle"
        size="small"
        leadingIcon={site.colorMode === 'light' ? 'dark_mode' : 'light_mode'}
        onPress={() => site.setColorMode(site.colorMode === 'light' ? 'dark' : 'light')}
      >
        {compact ? (site.colorMode === 'light' ? 'Dark mode' : 'Light mode') : ''}
      </Button>
      <Menu
        size="small"
        placement="bottom-end"
        trigger={
          <Button intent="neutral" prominence="subtle" size="small" leadingIcon="density_medium">
            {compact ? `Density: ${site.density}` : ''}
          </Button>
        }
      >
        <MenuLabel>Density</MenuLabel>
        <MenuItem leadingIcon={site.density === 'compact' ? 'check' : 'density_small'} onPress={() => site.setDensity('compact')}>
          Compact
        </MenuItem>
        <MenuItem leadingIcon={site.density === 'default' ? 'check' : 'density_medium'} onPress={() => site.setDensity('default')}>
          Default
        </MenuItem>
        <MenuItem leadingIcon={site.density === 'comfortable' ? 'check' : 'density_large'} onPress={() => site.setDensity('comfortable')}>
          Comfortable
        </MenuItem>
      </Menu>
      <Menu
        size="small"
        placement="bottom-end"
        trigger={
          <Button intent="neutral" prominence="subtle" size="small" leadingIcon="palette">
            {compact ? `Brand: ${activeBrand.label}` : ''}
          </Button>
        }
      >
        <MenuLabel>Brand colour</MenuLabel>
        {brandPresets.map((preset) => (
          <MenuItem
            key={preset.id}
            selected={site.brandId === preset.id}
            leadingIcon={<Icon name="circle" fill size="small" color={preset.swatch} />}
            onPress={() => site.setBrandId(preset.id)}
          >
            {preset.label}
          </MenuItem>
        ))}
      </Menu>
    </View>
  );
}

export function TopNav() {
  const { scheme, colors } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const wide = useMinWidth('lg');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const go = (path: string) => {
    setDrawerOpen(false);
    navigate(path);
  };

  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: scheme.surface.overlay.border,
        backgroundColor: scheme.surface.base,
        position: 'sticky' as never,
        top: 0,
        zIndex: 100,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 10,
          maxWidth: 1400,
          width: '100%',
          alignSelf: 'center',
          gap: 12,
        }}
      >
        <Pressable
          onPress={() => go('/')}
          accessibilityRole="link"
          accessibilityLabel="Cast UI home"
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          {/* logo.png is the full cast-ui wordmark (598×120). Fix the height
              and let the container hug the image via aspectRatio, so the
              wordmark shows in full instead of being cropped to a square.
              The mark is a single colour, so tintColor recolours it to the
              active brand. It follows the brand picker and stays legible in
              light and dark. */}
          <Image
            source={{ uri: `${import.meta.env.BASE_URL}logo.png` }}
            resizeMode="contain"
            accessibilityLabel="cast-ui"
            tintColor={colors.brand.bold.default.bg}
            style={{ height: 24, aspectRatio: 598 / 120 }}
          />
        </Pressable>

        {wide ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18, flex: 1, justifyContent: 'center' }}>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  intent={location.pathname.startsWith(item.match) ? 'brand' : 'neutral'}
                  size="small"
                  underline="none"
                  onPress={() => go(item.path)}
                >
                  {item.label}
                </Link>
              ))}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <ThemeControls />
              <Divider orientation="vertical" />
              <Link size="small" underline="none" href="https://github.com/Connagh/cast-ui" trailingIcon="open_in_new">
                GitHub
              </Link>
              <Button intent="brand" prominence="bold" size="small" onPress={() => go('/docs/getting-started')}>
                Get started
              </Button>
            </View>
          </>
        ) : (
          <Button
            intent="neutral"
            prominence="subtle"
            size="small"
            leadingIcon="menu"
            accessibilityLabel="Open navigation"
            onPress={() => setDrawerOpen(true)}
          >
            {''}
          </Button>
        )}
      </View>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} anchor="right" title="cast-ui">
        <List>
          {NAV_ITEMS.map((item) => (
            <ListItem
              key={item.path}
              selected={location.pathname.startsWith(item.match)}
              onPress={() => go(item.path)}
            >
              {item.label}
            </ListItem>
          ))}
        </List>
        <Divider />
        <View style={{ paddingVertical: 12 }}>
          <ThemeControls compact />
        </View>
        <Divider />
        <List>
          {EXTERNAL_LINKS.map((item) => (
            <ListItem key={item.href} trailingIcon="open_in_new" onPress={() => window.open(item.href, '_blank')}>
              {item.label}
            </ListItem>
          ))}
        </List>
      </Drawer>
    </View>
  );
}
