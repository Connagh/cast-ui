import React from 'react';
import { Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { AppBar } from './AppBar';

const meta: Meta<typeof AppBar> = {
  title: 'Components/AppBar',
  component: AppBar,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof AppBar>;

export const Default: Story = {
  args: { title: 'My App' },
};

export const WithLeading: Story = {
  args: { title: 'My App', leading: <Text style={{ marginRight: 16 }}>{'\u2190'}</Text> },
};

export const WithTrailing: Story = {
  args: { title: 'My App', trailing: <Text>{'\u22EE'}</Text> },
};
