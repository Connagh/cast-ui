import React from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Components/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    direction: { control: 'select', options: ['horizontal', 'vertical'] },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  args: { direction: 'horizontal' },
  render: (args) => (
    <View style={{ width: 300 }}>
      <Text>Above</Text>
      <Divider {...args} />
      <Text>Below</Text>
    </View>
  ),
};

export const Vertical: Story = {
  args: { direction: 'vertical' },
  render: (args) => (
    <View style={{ flexDirection: 'row', height: 40, alignItems: 'center' }}>
      <Text>Left</Text>
      <Divider {...args} />
      <Text>Right</Text>
    </View>
  ),
};
