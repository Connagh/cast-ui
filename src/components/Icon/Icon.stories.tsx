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
    fill: { control: 'boolean', description: 'Filled vs outlined (web).' },
    weight: {
      control: 'select',
      options: [100, 200, 300, 400, 500, 600, 700],
      description: 'Stroke weight, wght axis (web).',
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

/** Variable-font axes — fill and weight (web, via fontVariationSettings). */
export const FillAndWeight: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
        <Icon name="favorite" size={32} color="#DC2626" fill={false} />
        <Icon name="favorite" size={32} color="#DC2626" fill />
        <Text style={{ fontSize: 12, color: '#6B7280' }}>outlined → filled</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
        {[100, 300, 400, 500, 700].map((w) => (
          <View key={w} style={{ alignItems: 'center', gap: 4 }}>
            <Icon name="settings" size={32} color="#374151" weight={w as 400} />
            <Text style={{ fontSize: 10, color: '#9CA3AF' }}>{w}</Text>
          </View>
        ))}
      </View>
    </View>
  ),
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
