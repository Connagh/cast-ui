import React from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';
import { ThemeProvider } from '../../theme';

const SAMPLE_IMAGE = {
  uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=256&h=256&fit=crop&crop=faces',
};

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  decorators: [
    (Story) => (
      <View style={{ padding: 24 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size variant — controls diameter and glyph/initials scale.',
    },
    initials: { control: 'text', description: 'Initials shown for the initials type.' },
    icon: { control: 'text', description: 'Material Symbols name for the icon type.' },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

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

const Row = ({ children }: { children: React.ReactNode }) => (
  <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
    {children}
  </View>
);

/** Interactive playground — tweak every prop via the controls panel. */
export const Playground: Story = {
  args: {
    size: 'default',
    initials: 'AB',
  },
};

/** The three avatar types: image, initials, and icon. */
export const Types: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <SectionLabel>image · initials · icon</SectionLabel>
      <Row>
        <Avatar source={SAMPLE_IMAGE} accessibilityLabel="Profile photo" />
        <Avatar initials="AB" />
        <Avatar icon="star" />
        <Avatar accessibilityLabel="Unknown user" />
      </Row>
    </View>
  ),
};

/** Small, default, and large sizes for each type. */
export const Sizes: Story = {
  render: () => {
    const sizes = ['small', 'default', 'large'] as const;
    return (
      <View style={{ gap: 16 }}>
        {(['initials', 'icon', 'image'] as const).map((type) => (
          <View key={type} style={{ gap: 8 }}>
            <SectionLabel>{type}</SectionLabel>
            <Row>
              {sizes.map((size) =>
                type === 'image' ? (
                  <Avatar key={size} size={size} source={SAMPLE_IMAGE} />
                ) : type === 'icon' ? (
                  <Avatar key={size} size={size} icon="star" />
                ) : (
                  <Avatar key={size} size={size} initials="AB" />
                ),
              )}
            </Row>
          </View>
        ))}
      </View>
    );
  },
};

// ---------------------------------------------------------------------------
// Density comparison — avatar diameter scales up with density.
// ---------------------------------------------------------------------------

function DensityColumn({
  density,
}: {
  density: 'compact' | 'default' | 'comfortable';
}) {
  return (
    <ThemeProvider density={density}>
      <View style={{ gap: 8 }}>
        <SectionLabel>{density}</SectionLabel>
        <Row>
          <Avatar size="small" initials="AB" />
          <Avatar size="default" initials="AB" />
          <Avatar size="large" initials="AB" />
        </Row>
      </View>
    </ThemeProvider>
  );
}

/** Avatar diameter grows with density (compact → comfortable). */
export const DensityComparison: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 48, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <DensityColumn density="compact" />
      <DensityColumn density="default" />
      <DensityColumn density="comfortable" />
    </View>
  ),
};
