import React, { useState } from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio, RadioGroup } from './Radio';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
  decorators: [
    (Story) => (
      <View style={{ padding: 24 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    checked: { control: 'boolean', description: 'Selected state (standalone).' },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size variant — controls indicator + dot size.',
    },
    disabled: { control: 'boolean', description: 'Disables interaction.' },
    children: { control: 'text', description: 'Optional label text.' },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

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

/** Interactive playground — toggle a single radio via the controls panel. */
export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.checked ?? false);
    return <Radio {...args} checked={checked} onChange={setChecked} />;
  },
  args: {
    children: 'Label',
    checked: false,
    size: 'default',
    disabled: false,
  },
};

/** Selected vs unselected. */
export const States: Story = {
  render: () => {
    const [off, setOff] = useState(false);
    const [on, setOn] = useState(true);
    return (
      <View style={{ gap: 12 }}>
        <Radio checked={off} onChange={setOff}>
          Unselected
        </Radio>
        <Radio checked={on} onChange={setOn}>
          Selected
        </Radio>
      </View>
    );
  },
};

/** Small, default, and large sizes. */
export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Radio size="small" checked>
        Small
      </Radio>
      <Radio size="default" checked>
        Default
      </Radio>
      <Radio size="large" checked>
        Large
      </Radio>
    </View>
  ),
};

/** Disabled in both states. */
export const Disabled: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Radio checked={false} disabled>
        Disabled unselected
      </Radio>
      <Radio checked disabled>
        Disabled selected
      </Radio>
    </View>
  ),
};

/** Single-selection group — only one option can be active at a time. */
export const Group: Story = {
  render: () => {
    const [value, setValue] = useState('standard');
    return (
      <RadioGroup value={value} onValueChange={setValue}>
        <Radio value="standard">Standard shipping</Radio>
        <Radio value="express">Express shipping</Radio>
        <Radio value="overnight">Overnight shipping</Radio>
      </RadioGroup>
    );
  },
};

/** Full matrix — every size × selected/unselected state. */
export const Matrix: Story = {
  render: () => {
    const sizes = ['small', 'default', 'large'] as const;
    return (
      <View style={{ gap: 24 }}>
        {sizes.map((size) => (
          <View key={size} style={{ gap: 8 }}>
            <SectionLabel>{size}</SectionLabel>
            <View style={{ flexDirection: 'row', gap: 32, flexWrap: 'wrap' }}>
              <Radio size={size} checked={false}>
                Off
              </Radio>
              <Radio size={size} checked>
                On
              </Radio>
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
  const [value, setValue] = useState('a');
  return (
    <ThemeProvider density={density}>
      <View style={{ gap: 8 }}>
        <SectionLabel>{density}</SectionLabel>
        <RadioGroup value={value} onValueChange={setValue}>
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
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
