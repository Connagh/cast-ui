import React from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const WithContent: Story = {
  args: {
    content: 5,
    children: <View style={{ width: 40, height: 40, backgroundColor: '#ccc', borderRadius: 8 }} />,
  },
};

export const Dot: Story = {
  args: {
    children: <View style={{ width: 40, height: 40, backgroundColor: '#ccc', borderRadius: 8 }} />,
  },
};

export const Standalone: Story = {
  args: { content: 99 },
};

export const Hidden: Story = {
  args: {
    content: 3,
    visible: false,
    children: <View style={{ width: 40, height: 40, backgroundColor: '#ccc', borderRadius: 8 }} />,
  },
};
