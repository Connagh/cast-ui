import React from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './Progress';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  decorators: [
    (Story) => (
      <View style={{ padding: 24, width: 360 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Completion percentage (0–100). Leave empty for indeterminate.',
    },
    intent: {
      control: 'select',
      options: ['neutral', 'brand', 'danger'],
      description: 'Semantic intent — drives the fill colour.',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size variant — controls track thickness.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

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

const Stack = ({ children }: { children: React.ReactNode }) => (
  <View style={{ gap: 12 }}>{children}</View>
);

/** Interactive playground — drag `value`, or clear it for indeterminate. */
export const Playground: Story = {
  args: {
    value: 60,
    intent: 'brand',
    size: 'default',
  },
};

/** Determinate fills across the percentage range. */
export const Values: Story = {
  render: () => (
    <Stack>
      {[0, 25, 50, 75, 100].map((v) => (
        <View key={v} style={{ gap: 4 }}>
          <SectionLabel>{`${v}%`}</SectionLabel>
          <Progress value={v} />
        </View>
      ))}
    </Stack>
  ),
};

/** The three intents. */
export const Intents: Story = {
  render: () => (
    <Stack>
      <View style={{ gap: 4 }}>
        <SectionLabel>neutral</SectionLabel>
        <Progress value={66} intent="neutral" />
      </View>
      <View style={{ gap: 4 }}>
        <SectionLabel>brand</SectionLabel>
        <Progress value={66} intent="brand" />
      </View>
      <View style={{ gap: 4 }}>
        <SectionLabel>danger</SectionLabel>
        <Progress value={66} intent="danger" />
      </View>
    </Stack>
  ),
};

/** Track thickness — small, default, large. */
export const Sizes: Story = {
  render: () => (
    <Stack>
      <View style={{ gap: 4 }}>
        <SectionLabel>small</SectionLabel>
        <Progress value={50} size="small" />
      </View>
      <View style={{ gap: 4 }}>
        <SectionLabel>default</SectionLabel>
        <Progress value={50} size="default" />
      </View>
      <View style={{ gap: 4 }}>
        <SectionLabel>large</SectionLabel>
        <Progress value={50} size="large" />
      </View>
    </Stack>
  ),
};

/** Indeterminate — an animated sweep for unknown-duration work. */
export const Indeterminate: Story = {
  render: () => (
    <Stack>
      <Progress intent="brand" />
      <Progress intent="neutral" size="small" />
      <Progress intent="danger" size="large" />
    </Stack>
  ),
};

/** Full matrix — every intent × size at a fixed value. */
export const Matrix: Story = {
  render: () => {
    const intents = ['neutral', 'brand', 'danger'] as const;
    const sizes = ['small', 'default', 'large'] as const;
    return (
      <View style={{ gap: 24 }}>
        {intents.map((intent) => (
          <View key={intent} style={{ gap: 12 }}>
            <SectionLabel>{intent}</SectionLabel>
            {sizes.map((size) => (
              <Progress key={size} value={70} intent={intent} size={size} />
            ))}
          </View>
        ))}
      </View>
    );
  },
};

// ---------------------------------------------------------------------------
// Density comparison — Progress thickness is constant across densities by
// design (track-height is keyed by the size prop, not density).
// ---------------------------------------------------------------------------

function DensityColumn({
  density,
}: {
  density: 'compact' | 'default' | 'comfortable';
}) {
  return (
    <ThemeProvider density={density}>
      <View style={{ gap: 8, width: 240 }}>
        <SectionLabel>{density}</SectionLabel>
        <Progress value={60} intent="brand" />
      </View>
    </ThemeProvider>
  );
}

/** Progress sizing stays identical across densities. */
export const DensityComparison: Story = {
  render: () => (
    <View style={{ gap: 24 }}>
      <DensityColumn density="compact" />
      <DensityColumn density="default" />
      <DensityColumn density="comfortable" />
    </View>
  ),
};
