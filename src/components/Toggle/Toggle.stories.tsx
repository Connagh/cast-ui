import React, { useState } from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './Toggle';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  decorators: [
    (Story) => (
      <View style={{ padding: 24 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    checked: { control: 'boolean', description: 'On/off state.' },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size variant — controls track + thumb size.',
    },
    disabled: { control: 'boolean', description: 'Disables interaction.' },
    children: { control: 'text', description: 'Optional label text.' },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

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

/** Interactive playground — toggle a single switch via the controls panel. */
export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked ?? false);
    return <Toggle {...args} checked={checked} onChange={setChecked} />;
  },
  args: {
    children: 'Label',
    checked: false,
    size: 'default',
    disabled: false,
  },
};

/** On and off states. */
export const States: Story = {
  render: () => {
    const [off, setOff] = useState(false);
    const [on, setOn] = useState(true);
    return (
      <View style={{ gap: 12 }}>
        <Toggle checked={off} onChange={setOff}>
          Off
        </Toggle>
        <Toggle checked={on} onChange={setOn}>
          On
        </Toggle>
      </View>
    );
  },
};

/** Small, default, and large sizes. */
export const Sizes: Story = {
  render: () => {
    const [s, setS] = useState(true);
    const [d, setD] = useState(true);
    const [l, setL] = useState(true);
    return (
      <View style={{ gap: 16 }}>
        <Toggle size="small" checked={s} onChange={setS}>
          Small
        </Toggle>
        <Toggle size="default" checked={d} onChange={setD}>
          Default
        </Toggle>
        <Toggle size="large" checked={l} onChange={setL}>
          Large
        </Toggle>
      </View>
    );
  },
};

/** Disabled in both states. */
export const Disabled: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Toggle checked={false} disabled>
        Disabled off
      </Toggle>
      <Toggle checked disabled>
        Disabled on
      </Toggle>
    </View>
  ),
};

/** Full matrix — every size × on/off state. */
export const Matrix: Story = {
  render: () => {
    const sizes = ['small', 'default', 'large'] as const;
    return (
      <View style={{ gap: 24 }}>
        {sizes.map((size) => (
          <View key={size} style={{ gap: 8 }}>
            <SectionLabel>{size}</SectionLabel>
            <View style={{ flexDirection: 'row', gap: 32, flexWrap: 'wrap' }}>
              <Toggle size={size} checked={false}>
                Off
              </Toggle>
              <Toggle size={size} checked>
                On
              </Toggle>
            </View>
          </View>
        ))}
      </View>
    );
  },
};

// ---------------------------------------------------------------------------
// Density comparison
// ---------------------------------------------------------------------------

function DensityColumn({
  density,
}: {
  density: 'compact' | 'default' | 'comfortable';
}) {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  return (
    <ThemeProvider density={density}>
      <View style={{ gap: 8 }}>
        <SectionLabel>{density}</SectionLabel>
        <Toggle checked={a} onChange={setA}>
          Wi-Fi
        </Toggle>
        <Toggle checked={b} onChange={setB}>
          Bluetooth
        </Toggle>
      </View>
    </ThemeProvider>
  );
}

/** Compare compact, default, and comfortable densities (gap changes). */
export const DensityComparison: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 48, flexWrap: 'wrap' }}>
      <DensityColumn density="compact" />
      <DensityColumn density="default" />
      <DensityColumn density="comfortable" />
    </View>
  ),
};
