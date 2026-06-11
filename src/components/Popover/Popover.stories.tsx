import React from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Popover } from './Popover';
import { ThemeProvider } from '../../theme';
import { fontFamily, intentColors, textTokens } from '../../tokens';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  decorators: [
    (Story) => (
      <ThemeProvider density="default">
        <View style={{ padding: 48 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    direction: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'The edge the arrow sits on.',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size variant — controls content padding.',
    },
    hideArrow: { control: 'boolean', description: 'Hide the directional arrow.' },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

const SectionLabel = ({ children }: { children: string }) => (
  <Text
    style={{
      fontSize: 12,
      fontWeight: '600',
      color: '#6B7280',
      textTransform: 'uppercase',
      letterSpacing: 1,
    }}
  >
    {children}
  </Text>
);

const SampleContent = () => (
  <View style={{ gap: 4, width: 180 }}>
    <Text
      style={{
        fontFamily: fontFamily.sans,
        fontWeight: '500',
        fontSize: 14,
        color: intentColors.neutral.default.default.fg,
      }}
    >
      Keyboard shortcuts
    </Text>
    <Text
      style={{
        fontFamily: fontFamily.sans,
        fontSize: 12,
        color: textTokens.description,
      }}
    >
      Press ⌘K to open the command menu from anywhere.
    </Text>
  </View>
);

/** Interactive playground — tweak every prop via the controls panel. */
export const Playground: Story = {
  args: {
    direction: 'bottom',
    size: 'default',
    hideArrow: false,
    children: <SampleContent />,
  },
};

/** The arrow can sit on any of the four edges. */
export const Directions: Story = {
  render: () => {
    const directions = ['top', 'bottom', 'left', 'right'] as const;
    return (
      <View style={{ flexDirection: 'row', gap: 48, flexWrap: 'wrap' }}>
        {directions.map((direction) => (
          <View key={direction} style={{ gap: 12 }}>
            <SectionLabel>{direction}</SectionLabel>
            <Popover direction={direction}>
              <Text style={{ fontFamily: fontFamily.sans, fontSize: 14 }}>
                Arrow on {direction}
              </Text>
            </Popover>
          </View>
        ))}
      </View>
    );
  },
};

/** Small, default, and large padding. */
export const Sizes: Story = {
  render: () => {
    const sizes = ['small', 'default', 'large'] as const;
    return (
      <View style={{ flexDirection: 'row', gap: 32, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {sizes.map((size) => (
          <View key={size} style={{ gap: 12 }}>
            <SectionLabel>{size}</SectionLabel>
            <Popover size={size}>
              <Text style={{ fontFamily: fontFamily.sans, fontSize: 14 }}>{size}</Text>
            </Popover>
          </View>
        ))}
      </View>
    );
  },
};

// ---------------------------------------------------------------------------
// Density comparison — popover padding grows with density.
// ---------------------------------------------------------------------------

function DensityColumn({
  density,
}: {
  density: 'compact' | 'default' | 'comfortable';
}) {
  return (
    <ThemeProvider density={density}>
      <View style={{ gap: 12 }}>
        <SectionLabel>{density}</SectionLabel>
        <Popover>
          <Text style={{ fontFamily: fontFamily.sans, fontSize: 14 }}>Padding scales</Text>
        </Popover>
      </View>
    </ThemeProvider>
  );
}

/** Popover padding grows with density (compact → comfortable). */
export const DensityComparison: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 48, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <DensityColumn density="compact" />
      <DensityColumn density="default" />
      <DensityColumn density="comfortable" />
    </View>
  ),
};
