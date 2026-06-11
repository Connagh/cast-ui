import React, { useState } from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  decorators: [
    (Story) => (
      <View style={{ padding: 24 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    checked: {
      control: 'select',
      options: [false, true, 'indeterminate'],
      description: 'Checked state.',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size variant — controls indicator + icon size.',
    },
    disabled: { control: 'boolean', description: 'Disables interaction.' },
    children: { control: 'text', description: 'Optional label text.' },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

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

/** Interactive playground — toggle a single checkbox via the controls panel. */
export const Playground: Story = {
  render: (args) => {
    const [checked, setChecked] = useState<boolean | 'indeterminate'>(
      args.checked ?? false,
    );
    return (
      <Checkbox {...args} checked={checked} onChange={setChecked} />
    );
  },
  args: {
    children: 'Label',
    checked: false,
    size: 'default',
    disabled: false,
  },
};

/** The three checked states: unchecked, checked, indeterminate. */
export const CheckedStates: Story = {
  render: () => {
    const [a, setA] = useState(false);
    const [b, setB] = useState(true);
    const [c, setC] = useState<boolean | 'indeterminate'>('indeterminate');
    return (
      <View style={{ gap: 12 }}>
        <Checkbox checked={a} onChange={setA}>
          Unchecked
        </Checkbox>
        <Checkbox checked={b} onChange={setB}>
          Checked
        </Checkbox>
        <Checkbox checked={c} onChange={setC}>
          Indeterminate
        </Checkbox>
      </View>
    );
  },
};

/** Small, default, and large sizes side by side. */
export const Sizes: Story = {
  render: () => {
    const [s, setS] = useState(true);
    const [d, setD] = useState(true);
    const [l, setL] = useState(true);
    return (
      <View style={{ gap: 16 }}>
        <Checkbox size="small" checked={s} onChange={setS}>
          Small
        </Checkbox>
        <Checkbox size="default" checked={d} onChange={setD}>
          Default
        </Checkbox>
        <Checkbox size="large" checked={l} onChange={setL}>
          Large
        </Checkbox>
      </View>
    );
  },
};

/** Disabled in each checked state. */
export const Disabled: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Checkbox checked={false} disabled>
        Disabled unchecked
      </Checkbox>
      <Checkbox checked disabled>
        Disabled checked
      </Checkbox>
      <Checkbox checked="indeterminate" disabled>
        Disabled indeterminate
      </Checkbox>
    </View>
  ),
};

/** Full matrix — every size × checked state. */
export const Matrix: Story = {
  render: () => {
    const sizes = ['small', 'default', 'large'] as const;
    const states: Array<{ label: string; checked: boolean | 'indeterminate' }> = [
      { label: 'Unchecked', checked: false },
      { label: 'Checked', checked: true },
      { label: 'Indeterminate', checked: 'indeterminate' },
    ];
    return (
      <View style={{ gap: 24 }}>
        {sizes.map((size) => (
          <View key={size} style={{ gap: 8 }}>
            <SectionLabel>{size}</SectionLabel>
            <View style={{ flexDirection: 'row', gap: 24, flexWrap: 'wrap' }}>
              {states.map((s) => (
                <Checkbox key={s.label} size={size} checked={s.checked}>
                  {s.label}
                </Checkbox>
              ))}
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
  const [b, setB] = useState<boolean | 'indeterminate'>('indeterminate');
  return (
    <ThemeProvider density={density}>
      <View style={{ gap: 8 }}>
        <SectionLabel>{density}</SectionLabel>
        <Checkbox checked={a} onChange={setA}>
          Email notifications
        </Checkbox>
        <Checkbox checked={b} onChange={setB}>
          Select all
        </Checkbox>
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
