import React, { useState } from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, Tab, type TabsSize } from './Tabs';
import { ThemeProvider } from '../../theme';
import type { IntentName } from '../../tokens';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
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
      description: 'Semantic intent — drives the selected indicator + label.',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size variant — padding, gap, typography, indicator height.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

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

/** A controlled Tabs that remembers its own selection for the demos. */
function TabsDemo({
  intent,
  size,
  initial = 'overview',
  withIcons = false,
  withDisabled = false,
}: {
  intent?: IntentName;
  size?: TabsSize;
  initial?: string;
  withIcons?: boolean;
  withDisabled?: boolean;
}) {
  const [value, setValue] = useState(initial);
  return (
    <Tabs value={value} onValueChange={setValue} intent={intent} size={size}>
      <Tab value="overview" leadingIcon={withIcons ? 'dashboard' : undefined}>
        Overview
      </Tab>
      <Tab value="activity" leadingIcon={withIcons ? 'bolt' : undefined}>
        Activity
      </Tab>
      <Tab value="settings" leadingIcon={withIcons ? 'settings' : undefined}>
        Settings
      </Tab>
      {withDisabled ? (
        <Tab value="archived" disabled>
          Archived
        </Tab>
      ) : null}
    </Tabs>
  );
}

/** Interactive playground — click between tabs. */
export const Playground: Story = {
  args: { intent: 'brand', size: 'default' },
  render: (args) => <TabsDemo intent={args.intent} size={args.size} />,
};

/** The three intents drive the selected indicator + label colour. */
export const Intents: Story = {
  render: () => (
    <View style={{ gap: 24 }}>
      {(['neutral', 'brand', 'danger'] as const).map((intent) => (
        <View key={intent} style={{ gap: 8 }}>
          <SectionLabel>{intent}</SectionLabel>
          <TabsDemo intent={intent} />
        </View>
      ))}
    </View>
  ),
};

/** Size variants — small, default, large. */
export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 24 }}>
      {(['small', 'default', 'large'] as const).map((size) => (
        <View key={size} style={{ gap: 8 }}>
          <SectionLabel>{size}</SectionLabel>
          <TabsDemo size={size} />
        </View>
      ))}
    </View>
  ),
};

/** Tabs with leading icons. */
export const WithIcons: Story = {
  render: () => <TabsDemo withIcons />,
};

/** A disabled tab is muted and non-interactive. */
export const WithDisabled: Story = {
  render: () => <TabsDemo withDisabled />,
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
            {sizes.map((size) => (
              <TabsDemo key={size} intent={intent} size={size} />
            ))}
          </View>
        ))}
      </View>
    );
  },
};

// ---------------------------------------------------------------------------
// Density comparison — tab spacing grows with density; the indicator height,
// radius, and colours stay constant.
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
        <TabsDemo intent="brand" />
      </View>
    </ThemeProvider>
  );
}

/** Spacing differs across densities; indicator + colours are constant. */
export const DensityComparison: Story = {
  render: () => (
    <View style={{ gap: 24 }}>
      <DensityColumn density="compact" />
      <DensityColumn density="default" />
      <DensityColumn density="comfortable" />
    </View>
  ),
};
