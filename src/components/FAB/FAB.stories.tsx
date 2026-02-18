import React from 'react';
import { Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { FAB } from './FAB';

const meta: Meta<typeof FAB> = {
  title: 'Components/FAB',
  component: FAB,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['standard', 'extended'] },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof FAB>;

export const Standard: Story = {
  args: { icon: <Text>+</Text>, variant: 'standard' },
};

export const Extended: Story = {
  args: { icon: <Text>+</Text>, label: 'Create', variant: 'extended' },
};
