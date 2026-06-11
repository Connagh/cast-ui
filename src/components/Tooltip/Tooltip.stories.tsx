import React from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  decorators: [
    (Story) => (
      <View style={{ padding: 48 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    children: { control: 'text', description: 'Tooltip label text.' },
    direction: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'The edge the arrow sits on.',
    },
    size: {
      control: 'select',
      options: ['small', 'default'],
      description: 'Size variant — controls padding and typography.',
    },
    hasArrow: { control: 'boolean', description: 'Show the directional arrow.' },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

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

/** Interactive playground — tweak every prop via the controls panel. */
export const Playground: Story = {
  args: {
    children: 'Tooltip',
    direction: 'bottom',
    size: 'small',
    hasArrow: true,
  },
};

/** The arrow can sit on any of the four edges. */
export const Directions: Story = {
  render: () => {
    const directions = ['top', 'bottom', 'left', 'right'] as const;
    return (
      <View style={{ flexDirection: 'row', gap: 40, flexWrap: 'wrap' }}>
        {directions.map((direction) => (
          <View key={direction} style={{ gap: 12 }}>
            <SectionLabel>{direction}</SectionLabel>
            <Tooltip direction={direction}>{direction}</Tooltip>
          </View>
        ))}
      </View>
    );
  },
};

/** Small and default sizes. */
export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 32, alignItems: 'flex-start' }}>
      <View style={{ gap: 12 }}>
        <SectionLabel>small</SectionLabel>
        <Tooltip size="small">Small tooltip</Tooltip>
      </View>
      <View style={{ gap: 12 }}>
        <SectionLabel>default</SectionLabel>
        <Tooltip size="default">Default tooltip</Tooltip>
      </View>
    </View>
  ),
};

/** Without the arrow — a plain pill label. */
export const NoArrow: Story = {
  render: () => <Tooltip hasArrow={false}>No arrow</Tooltip>,
};

// ---------------------------------------------------------------------------
// Density comparison — tooltip padding grows with density.
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
        <Tooltip size="default">Padding scales</Tooltip>
      </View>
    </ThemeProvider>
  );
}

/** Tooltip padding grows with density (compact → comfortable). */
export const DensityComparison: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 48, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <DensityColumn density="compact" />
      <DensityColumn density="default" />
      <DensityColumn density="comfortable" />
    </View>
  ),
};
