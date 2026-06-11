import React from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider,
  decorators: [
    (Story) => (
      <View style={{ padding: 24, width: 320 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Line direction.',
    },
    color: { control: 'color', description: 'Line colour.' },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

const Para = ({ children }: { children: string }) => (
  <Text style={{ fontSize: 14, color: '#374151', lineHeight: 20 }}>{children}</Text>
);

/** Default horizontal rule. */
export const Horizontal: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Para>Section one content above the divider.</Para>
      <Divider />
      <Para>Section two content below the divider.</Para>
    </View>
  ),
};

/** Vertical rule — stretches to the height of its row container. */
export const Vertical: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', alignItems: 'stretch', height: 40, gap: 12 }}>
      <Text style={{ fontSize: 14, color: '#374151' }}>Home</Text>
      <Divider orientation="vertical" />
      <Text style={{ fontSize: 14, color: '#374151' }}>Profile</Text>
      <Divider orientation="vertical" />
      <Text style={{ fontSize: 14, color: '#374151' }}>Settings</Text>
    </View>
  ),
};

/** Inset / spaced dividers in a simple list. */
export const InList: Story = {
  render: () => {
    const items = ['Inbox', 'Starred', 'Sent', 'Drafts'];
    return (
      <View>
        {items.map((item, i) => (
          <View key={item}>
            <View style={{ paddingVertical: 12 }}>
              <Para>{item}</Para>
            </View>
            {i < items.length - 1 ? <Divider /> : null}
          </View>
        ))}
      </View>
    );
  },
};
