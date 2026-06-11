import React, { useState } from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  decorators: [
    (Story) => (
      <View style={{ padding: 24, width: 320 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    label: { control: 'text', description: 'Form label above the field.' },
    placeholder: { control: 'text', description: 'Empty-state placeholder.' },
    helperText: { control: 'text', description: 'Helper / error text below.' },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size variant — controls padding, gap, and typography.',
    },
    error: { control: 'boolean', description: 'Error state.' },
    disabled: { control: 'boolean', description: 'Disables interaction.' },
    leadingIcon: { control: 'text', description: 'Material Symbols name.' },
    trailingIcon: { control: 'text', description: 'Material Symbols name.' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

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

/** Interactive playground — type into a controlled field. */
export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <Input {...args} value={value} onChangeText={setValue} />;
  },
  args: {
    label: 'Form label',
    placeholder: 'Placeholder',
    helperText: 'Helper text',
    size: 'default',
    error: false,
    disabled: false,
  },
};

/** Empty (placeholder) vs filled value. */
export const States: Story = {
  render: () => {
    const [filled, setFilled] = useState('hello@castui.dev');
    return (
      <View style={{ gap: 16 }}>
        <Input label="Empty" placeholder="you@example.com" helperText="Helper text" />
        <Input
          label="Filled"
          value={filled}
          onChangeText={setFilled}
          helperText="Helper text"
        />
      </View>
    );
  },
};

/** Error and disabled states. */
export const ErrorAndDisabled: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Input
        label="Error"
        value="not-an-email"
        error
        helperText="Enter a valid email address"
      />
      <Input label="Disabled" value="Cannot edit" disabled helperText="Helper text" />
      <Input label="Disabled empty" placeholder="Placeholder" disabled />
    </View>
  ),
};

/** Leading and trailing icons. */
export const WithIcons: Story = {
  render: () => {
    const [a, setA] = useState('');
    const [b, setB] = useState('');
    return (
      <View style={{ gap: 16 }}>
        <Input
          label="Search"
          placeholder="Search..."
          leadingIcon="search"
          value={a}
          onChangeText={setA}
        />
        <Input
          label="Amount"
          placeholder="0.00"
          trailingIcon="attach_money"
          keyboardType="decimal-pad"
          value={b}
          onChangeText={setB}
        />
      </View>
    );
  },
};

/** Small, default, and large sizes. */
export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Input size="small" label="Small" placeholder="Small" helperText="Helper text" />
      <Input size="default" label="Default" placeholder="Default" helperText="Helper text" />
      <Input size="large" label="Large" placeholder="Large" helperText="Helper text" />
    </View>
  ),
};

// ---------------------------------------------------------------------------
// Density comparison — field padding/gap scale with density.
// ---------------------------------------------------------------------------

function DensityColumn({
  density,
}: {
  density: 'compact' | 'default' | 'comfortable';
}) {
  const [value, setValue] = useState('');
  return (
    <ThemeProvider density={density}>
      <View style={{ gap: 8, width: 240 }}>
        <SectionLabel>{density}</SectionLabel>
        <Input
          label="Email"
          placeholder="you@example.com"
          helperText="Helper text"
          value={value}
          onChangeText={setValue}
        />
      </View>
    </ThemeProvider>
  );
}

/** Compare compact, default, and comfortable densities (padding + gap change). */
export const DensityComparison: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 32, flexWrap: 'wrap' }}>
      <DensityColumn density="compact" />
      <DensityColumn density="default" />
      <DensityColumn density="comfortable" />
    </View>
  ),
};
