import React from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Backdrop } from './Backdrop';

const meta: Meta<typeof Backdrop> = {
  title: 'Components/Backdrop',
  component: Backdrop,
  tags: ['autodocs'],
  argTypes: {
    visible: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Backdrop>;

export const Visible: Story = {
  args: { visible: true },
  render: (args) => (
    <View style={{ height: 200 }}>
      <Text>Content behind backdrop</Text>
      <Backdrop {...args} />
    </View>
  ),
};

export const Hidden: Story = {
  args: { visible: false },
};
