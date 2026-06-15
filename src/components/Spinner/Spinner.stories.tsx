import React from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  decorators: [
    (Story) => (
      <View style={{ padding: 24 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    intent: {
      control: 'select',
      options: ['neutral', 'brand', 'danger'],
      description: 'Semantic intent — drives the arc colour.',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size variant — controls diameter and ring stroke.',
    },
    accessibilityLabel: {
      control: 'text',
      description: 'Describes what is loading.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

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

const Row = ({ children }: { children: React.ReactNode }) => (
  <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center' }}>
    {children}
  </View>
);

/** Interactive playground — pick an intent and size. */
export const Playground: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  args: {
    intent: 'brand',
    size: 'default',
  },
};

/** The three intents. */
export const Intents: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => (
    <View style={{ gap: 16 }}>
      <SectionLabel>neutral · brand · danger</SectionLabel>
      <Row>
        <Spinner intent="neutral" />
        <Spinner intent="brand" />
        <Spinner intent="danger" />
      </Row>
    </View>
  ),
};

/** Diameter + stroke — small, default, large. */
export const Sizes: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => (
    <View style={{ gap: 16 }}>
      <SectionLabel>small · default · large</SectionLabel>
      <Row>
        <Spinner size="small" />
        <Spinner size="default" />
        <Spinner size="large" />
      </Row>
    </View>
  ),
};

/** Full matrix — every intent × size. */
export const Matrix: Story = {
  render: () => {
    const intents = ['neutral', 'brand', 'danger'] as const;
    const sizes = ['small', 'default', 'large'] as const;
    return (
      <View style={{ gap: 24 }}>
        {intents.map((intent) => (
          <View key={intent} style={{ gap: 12 }}>
            <SectionLabel>{intent}</SectionLabel>
            <Row>
              {sizes.map((size) => (
                <Spinner key={size} intent={intent} size={size} />
              ))}
            </Row>
          </View>
        ))}
      </View>
    );
  },
};

// ---------------------------------------------------------------------------
// Density comparison — Spinner sizing is constant across densities by design
// (diameter + stroke are keyed by the size prop, not density).
// ---------------------------------------------------------------------------

function DensityColumn({
  density,
}: {
  density: 'compact' | 'default' | 'comfortable';
}) {
  return (
    <ThemeProvider density={density}>
      <View style={{ gap: 8 }}>
        <SectionLabel>{density}</SectionLabel>
        <Spinner intent="brand" />
      </View>
    </ThemeProvider>
  );
}

/** Spinner sizing stays identical across densities. */
export const DensityComparison: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => (
    <Row>
      <DensityColumn density="compact" />
      <DensityColumn density="default" />
      <DensityColumn density="comfortable" />
    </Row>
  ),
};
