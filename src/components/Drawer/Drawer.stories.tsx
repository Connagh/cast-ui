import React, { useState } from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Drawer, DrawerContent, type DrawerAnchor } from './Drawer';
import { Button } from '../Button';
import { Link } from '../Link';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  argTypes: {
    anchor: {
      control: 'select',
      options: ['left', 'right', 'top', 'bottom'],
      description: 'Which edge the panel slides in from.',
    },
    closeOnBackdropPress: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

const SectionLabel = ({ children }: { children: string }) => (
  <Text
    style={{
      fontSize: 12,
      fontWeight: '600',
      color: '#6B7280',
      textTransform: 'uppercase',
      letterSpacing: 1,
    }}
  >
    {children}
  </Text>
);

const NavLinks = () => (
  <View style={{ gap: 12 }}>
    <Link leadingIcon="home" intent="neutral">
      Home
    </Link>
    <Link leadingIcon="folder" intent="neutral">
      Projects
    </Link>
    <Link leadingIcon="group" intent="neutral">
      Team
    </Link>
    <Link leadingIcon="settings" intent="neutral">
      Settings
    </Link>
  </View>
);

/** Tap to open the drawer; pick the anchor in controls. */
export const Playground: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => {
    const Demo = () => {
      const [open, setOpen] = useState(false);
      return (
        <View style={{ padding: 24 }}>
          <Button intent="brand" onPress={() => setOpen(true)}>
            Open drawer
          </Button>
          <Drawer {...args} open={open} onClose={() => setOpen(false)} title="Menu">
            <NavLinks />
          </Drawer>
        </View>
      );
    };
    return <Demo />;
  },
  args: { anchor: 'left', closeOnBackdropPress: true },
};

/**
 * The four anchors, shown as static panels inside clipped frames (the live
 * Drawer renders in a modal over the whole screen).
 */
export const Anchors: Story = {
  render: () => {
    const frame = (anchor: DrawerAnchor) => {
      const horizontal = anchor === 'left' || anchor === 'right';
      return (
        <View key={anchor} style={{ gap: 6 }}>
          <SectionLabel>{anchor}</SectionLabel>
          <View
            style={{
              width: 320,
              height: 220,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              backgroundColor: '#F3F4F6',
              overflow: 'hidden',
              flexDirection: horizontal ? 'row' : 'column',
              justifyContent:
                anchor === 'left' || anchor === 'top' ? 'flex-start' : 'flex-end',
            }}
          >
            <DrawerContent anchor={anchor} title="Menu" style={horizontal ? { width: 200 } : undefined}>
              <NavLinks />
            </DrawerContent>
          </View>
        </View>
      );
    };
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24, padding: 24 }}>
        {(['left', 'right', 'top', 'bottom'] as const).map(frame)}
      </View>
    );
  },
};

/** Panel content — title plus a navigation list. */
export const WithContent: Story = {
  render: () => (
    <View
      style={{
        width: 320,
        height: 360,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#F3F4F6',
        overflow: 'hidden',
        flexDirection: 'row',
      }}
    >
      <DrawerContent anchor="left" title="Workspace">
        <NavLinks />
      </DrawerContent>
    </View>
  ),
};

function DensityColumn({
  density,
}: {
  density: 'compact' | 'default' | 'comfortable';
}) {
  return (
    <ThemeProvider density={density}>
      <View style={{ gap: 6 }}>
        <SectionLabel>{density}</SectionLabel>
        <View
          style={{
            width: 280,
            height: 240,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#E5E7EB',
            backgroundColor: '#F3F4F6',
            overflow: 'hidden',
            flexDirection: 'row',
          }}
        >
          <DrawerContent anchor="left" title="Menu" style={{ width: 200 }}>
            <NavLinks />
          </DrawerContent>
        </View>
      </View>
    </ThemeProvider>
  );
}

/** Density changes panel padding and the content gap. */
export const DensityComparison: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24, padding: 24 }}>
      <DensityColumn density="compact" />
      <DensityColumn density="default" />
      <DensityColumn density="comfortable" />
    </View>
  ),
};
