import React from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { ThemeProvider } from '../../theme';

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  decorators: [
    (Story) => (
      <ThemeProvider density="default">
        <Story />
      </ThemeProvider>
    ),
  ],
  argTypes: {
    intent: {
      control: 'select',
      options: ['neutral', 'brand', 'danger'],
      description: 'Semantic intent — drives the colour scheme.',
    },
    prominence: {
      control: 'select',
      options: ['default', 'bold', 'subtle'],
      description: 'Visual weight — outlined, filled, or ghost.',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size variant — controls padding, gap, and typography.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables interaction and applies muted styling.',
    },
    children: {
      control: 'text',
      description: 'Button label text.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Interactive playground — use the controls panel to explore all variants. */
export const Playground: Story = {
  args: {
    children: 'Button',
    intent: 'neutral',
    prominence: 'default',
    size: 'default',
    disabled: false,
  },
};

/** All three intents in the default prominence. */
export const Intents: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
      <Button intent="neutral">Neutral</Button>
      <Button intent="brand">Brand</Button>
      <Button intent="danger">Danger</Button>
    </View>
  ),
};

/** All three prominences for the brand intent. */
export const Prominences: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
      <Button intent="brand" prominence="default">
        Default
      </Button>
      <Button intent="brand" prominence="bold">
        Bold
      </Button>
      <Button intent="brand" prominence="subtle">
        Subtle
      </Button>
    </View>
  ),
};

/** Small, default, and large sizes. */
export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <Button intent="brand" prominence="bold" size="small">
        Small
      </Button>
      <Button intent="brand" prominence="bold" size="default">
        Default
      </Button>
      <Button intent="brand" prominence="bold" size="large">
        Large
      </Button>
    </View>
  ),
};

/** Disabled state across different intents and prominences. */
export const Disabled: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
      <Button intent="neutral" disabled>
        Neutral
      </Button>
      <Button intent="brand" prominence="bold" disabled>
        Brand Bold
      </Button>
      <Button intent="danger" prominence="subtle" disabled>
        Danger Subtle
      </Button>
    </View>
  ),
};

/**
 * Icons via string shorthand — colour auto-matches the button state.
 * Pass a Material Symbols name and the button handles the rest.
 */
export const WithIcons: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
      <Button intent="brand" prominence="bold" leadingIcon="add">
        Add item
      </Button>
      <Button intent="brand" prominence="bold" trailingIcon="arrow_forward">
        Continue
      </Button>
      <Button intent="danger" prominence="default" leadingIcon="delete">
        Delete
      </Button>
      <Button intent="neutral" prominence="subtle" leadingIcon="settings">
        Settings
      </Button>
      <Button
        intent="brand"
        prominence="bold"
        leadingIcon="cloud_upload"
        trailingIcon="chevron_right"
      >
        Upload
      </Button>
    </View>
  ),
};

// ---------------------------------------------------------------------------
// Density comparison
// ---------------------------------------------------------------------------

function DensityRow({
  density,
}: {
  density: 'compact' | 'default' | 'comfortable';
}) {
  return (
    <ThemeProvider density={density}>
      <View style={{ gap: 8 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '600',
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          {density}
        </Text>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Button intent="brand" prominence="bold" size="small" leadingIcon="star">
            Small
          </Button>
          <Button intent="brand" prominence="bold" size="default" leadingIcon="star">
            Default
          </Button>
          <Button intent="brand" prominence="bold" size="large" leadingIcon="star">
            Large
          </Button>
        </View>
      </View>
    </ThemeProvider>
  );
}

/** Compare compact, default, and comfortable densities side by side. */
export const DensityComparison: Story = {
  render: () => (
    <View style={{ gap: 24 }}>
      <DensityRow density="compact" />
      <DensityRow density="default" />
      <DensityRow density="comfortable" />
    </View>
  ),
};

// ---------------------------------------------------------------------------
// Full matrix
// ---------------------------------------------------------------------------

function MatrixRow({
  intent,
}: {
  intent: 'neutral' | 'brand' | 'danger';
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: '600',
          color: '#6B7280',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        {intent}
      </Text>
      <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
        <Button intent={intent} prominence="default">
          Default
        </Button>
        <Button intent={intent} prominence="bold">
          Bold
        </Button>
        <Button intent={intent} prominence="subtle">
          Subtle
        </Button>
        <Button intent={intent} prominence="default" disabled>
          Disabled
        </Button>
      </View>
    </View>
  );
}

/** Every intent x prominence combination, plus disabled. */
export const FullMatrix: Story = {
  render: () => (
    <View style={{ gap: 24 }}>
      <MatrixRow intent="neutral" />
      <MatrixRow intent="brand" />
      <MatrixRow intent="danger" />
    </View>
  ),
};
