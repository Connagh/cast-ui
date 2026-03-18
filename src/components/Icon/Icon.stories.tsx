import React from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  argTypes: {
    name: {
      control: 'text',
      description: 'Material Symbols icon name (e.g., "star", "close", "settings").',
    },
    size: {
      control: { type: 'number', min: 12, max: 48, step: 4 },
      description: 'Icon size in pixels.',
    },
    color: {
      control: 'color',
      description: 'Icon colour.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

/** Interactive playground. */
export const Playground: Story = {
  args: {
    name: 'star',
    size: 24,
    color: '#374151',
  },
};

/** Common icons at the default button icon size (16px). */
export const CommonIcons: Story = {
  render: () => {
    const icons = [
      'add', 'close', 'check', 'delete', 'edit',
      'search', 'settings', 'star', 'favorite', 'home',
      'arrow_back', 'arrow_forward', 'chevron_left', 'chevron_right',
      'cloud_upload', 'cloud_download', 'visibility', 'visibility_off',
      'content_copy', 'share',
    ];

    return (
      <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
        {icons.map((name) => (
          <View key={name} style={{ alignItems: 'center', gap: 4, width: 72 }}>
            <Icon name={name} size={24} color="#374151" />
            <Text
              style={{ fontSize: 10, color: '#9CA3AF', textAlign: 'center' }}
            >
              {name}
            </Text>
          </View>
        ))}
      </View>
    );
  },
};

/** Size scale demonstration. */
export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
      {[16, 20, 24, 32, 40, 48].map((size) => (
        <View key={size} style={{ alignItems: 'center', gap: 4 }}>
          <Icon name="star" size={size} color="#2563EB" />
          <Text style={{ fontSize: 10, color: '#9CA3AF' }}>{size}px</Text>
        </View>
      ))}
    </View>
  ),
};
