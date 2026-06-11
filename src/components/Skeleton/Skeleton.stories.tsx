import React from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  decorators: [
    (Story) => (
      <View style={{ padding: 24 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    shape: {
      control: 'select',
      options: ['text', 'circle', 'rectangle'],
      description: 'Shape preset — sets default size and corner radius.',
    },
    width: { control: 'number', description: 'Width override (px).' },
    height: { control: 'number', description: 'Height override (px).' },
    animated: { control: 'boolean', description: 'Run the opacity pulse.' },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

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

/** Interactive playground — tweak every prop via the controls panel. */
export const Playground: Story = {
  args: {
    shape: 'text',
    animated: true,
  },
};

/** The three shape presets. */
export const Shapes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <View style={{ gap: 8 }}>
        <SectionLabel>text</SectionLabel>
        <Skeleton shape="text" />
      </View>
      <View style={{ gap: 8 }}>
        <SectionLabel>circle</SectionLabel>
        <Skeleton shape="circle" />
      </View>
      <View style={{ gap: 8 }}>
        <SectionLabel>rectangle</SectionLabel>
        <Skeleton shape="rectangle" />
      </View>
    </View>
  ),
};

/** Multiple text lines build a paragraph placeholder; the last line is shorter. */
export const TextLines: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <Skeleton shape="text" width={240} />
      <Skeleton shape="text" width={240} />
      <Skeleton shape="text" width={160} />
    </View>
  ),
};

/** Composed loading state — avatar + heading + body, mirroring real content. */
export const CardPlaceholder: Story = {
  render: () => (
    <View
      style={{
        width: 280,
        gap: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
      }}
    >
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <Skeleton shape="circle" />
        <View style={{ gap: 8, flex: 1 }}>
          <Skeleton shape="text" width="80%" />
          <Skeleton shape="text" width="50%" />
        </View>
      </View>
      <Skeleton shape="rectangle" width="100%" height={120} />
    </View>
  ),
};

/** Static (non-animated) — useful for deterministic visual snapshots. */
export const Static: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <Skeleton shape="text" width={240} animated={false} />
      <Skeleton shape="text" width={160} animated={false} />
    </View>
  ),
};
