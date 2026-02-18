import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['rectangle', 'circle', 'text'] },
    width: { control: 'number' },
    height: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Rectangle: Story = {
  args: { variant: 'rectangle', width: 200, height: 100 },
};

export const Circle: Story = {
  args: { variant: 'circle' },
};

export const TextLines: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <Skeleton variant="text" width={250} height={16} />
      <Skeleton variant="text" width={200} height={16} />
      <Skeleton variant="text" width={180} height={16} />
    </View>
  ),
};
