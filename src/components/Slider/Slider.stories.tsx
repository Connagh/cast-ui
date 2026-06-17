import React, { useState } from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof Slider> = {
  title: 'Components/Slider',
  component: Slider,
  decorators: [
    (Story) => (
      <View style={{ padding: 24, width: 320 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    intent: { control: 'select', options: ['neutral', 'brand', 'danger'] },
    size: { control: 'select', options: ['small', 'default', 'large'] },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

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

/** Interactive — drag the thumb or tap the track. */
export const Playground: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => {
    const Demo = () => {
      const [value, setValue] = useState(40);
      return (
        <View style={{ gap: 8 }}>
          <Slider {...args} value={value} onValueChange={setValue} />
          <Text style={{ color: '#6B7280' }}>{`Value: ${value}`}</Text>
        </View>
      );
    };
    return <Demo />;
  },
  args: { intent: 'brand', size: 'default', min: 0, max: 100, step: 1, disabled: false },
};

/** The three intents at a fixed value. */
export const Intents: Story = {
  render: () => (
    <View style={{ gap: 20 }}>
      {(['neutral', 'brand', 'danger'] as const).map((intent) => (
        <View key={intent} style={{ gap: 6 }}>
          <SectionLabel>{intent}</SectionLabel>
          <Slider defaultValue={60} intent={intent} />
        </View>
      ))}
    </View>
  ),
};

/** Track + thumb sizes. */
export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 20 }}>
      {(['small', 'default', 'large'] as const).map((size) => (
        <View key={size} style={{ gap: 6 }}>
          <SectionLabel>{size}</SectionLabel>
          <Slider defaultValue={50} size={size} />
        </View>
      ))}
    </View>
  ),
};

/** Stepped — snaps to increments of 25. */
export const Steps: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState(50);
      return (
        <View style={{ gap: 8 }}>
          <Slider value={value} onValueChange={setValue} step={25} />
          <Text style={{ color: '#6B7280' }}>{`Value: ${value}`}</Text>
        </View>
      );
    };
    return <Demo />;
  },
};

/** Disabled. */
export const Disabled: Story = {
  render: () => <Slider defaultValue={40} disabled />,
};

/** Slider sizing is constant across densities. */
export const DensityComparison: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => (
    <View style={{ gap: 20 }}>
      {(['compact', 'default', 'comfortable'] as const).map((density) => (
        <ThemeProvider key={density} density={density}>
          <View style={{ gap: 6, width: 260 }}>
            <SectionLabel>{density}</SectionLabel>
            <Slider defaultValue={60} />
          </View>
        </ThemeProvider>
      ))}
    </View>
  ),
};
