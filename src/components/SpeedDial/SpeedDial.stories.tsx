import React from 'react';
import { Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { SpeedDial } from './SpeedDial';

const meta: Meta<typeof SpeedDial> = {
  title: 'Components/SpeedDial',
  component: SpeedDial,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof SpeedDial>;

export const Closed: Story = {
  args: {
    icon: <Text style={{ fontSize: 24, color: '#fff' }}>+</Text>,
    open: false,
    actions: [
      { icon: <Text style={{ color: '#fff' }}>{'\u270E'}</Text>, label: 'Edit', onPress: () => {} },
      { icon: <Text style={{ color: '#fff' }}>{'\u2605'}</Text>, label: 'Star', onPress: () => {} },
    ],
  },
};

export const Open: Story = {
  args: {
    icon: <Text style={{ fontSize: 24, color: '#fff' }}>+</Text>,
    open: true,
    actions: [
      { icon: <Text style={{ color: '#fff' }}>{'\u270E'}</Text>, label: 'Edit', onPress: () => {} },
      { icon: <Text style={{ color: '#fff' }}>{'\u2605'}</Text>, label: 'Star', onPress: () => {} },
      { icon: <Text style={{ color: '#fff' }}>{'\u2709'}</Text>, label: 'Mail', onPress: () => {} },
    ],
  },
};
