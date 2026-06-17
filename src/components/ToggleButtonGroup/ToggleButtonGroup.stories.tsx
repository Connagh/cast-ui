import React, { useState } from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { ToggleButtonGroup, ToggleButton } from './ToggleButtonGroup';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof ToggleButtonGroup> = {
  title: 'Components/ToggleButtonGroup',
  component: ToggleButtonGroup,
  decorators: [
    (Story) => (
      <View style={{ padding: 24 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    intent: { control: 'select', options: ['neutral', 'brand', 'danger'] },
    size: { control: 'select', options: ['small', 'default', 'large'] },
    exclusive: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ToggleButtonGroup>;

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

/** Interactive single-select. */
export const Playground: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => {
    const Demo = () => {
      const [value, setValue] = useState<string | null>('center');
      return (
        <ToggleButtonGroup {...args} value={value} onValueChange={setValue}>
          <ToggleButton value="left" leadingIcon="format_align_left">
            Left
          </ToggleButton>
          <ToggleButton value="center" leadingIcon="format_align_center">
            Center
          </ToggleButton>
          <ToggleButton value="right" leadingIcon="format_align_right">
            Right
          </ToggleButton>
        </ToggleButtonGroup>
      );
    };
    return <Demo />;
  },
  args: { intent: 'brand', size: 'default', exclusive: true, disabled: false },
};

/** Multi-select (exclusive=false) returns a string array. */
export const MultiSelect: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => {
    const Demo = () => {
      const [values, setValues] = useState<string[]>(['bold']);
      return (
        <ToggleButtonGroup exclusive={false} values={values} onValuesChange={setValues}>
          <ToggleButton value="bold" leadingIcon="format_bold" />
          <ToggleButton value="italic" leadingIcon="format_italic" />
          <ToggleButton value="underline" leadingIcon="format_underlined" />
        </ToggleButtonGroup>
      );
    };
    return <Demo />;
  },
};

/** The three intents (selected fill). */
export const Intents: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      {(['neutral', 'brand', 'danger'] as const).map((intent) => (
        <View key={intent} style={{ gap: 6 }}>
          <SectionLabel>{intent}</SectionLabel>
          <ToggleButtonGroup intent={intent} value="one">
            <ToggleButton value="one">One</ToggleButton>
            <ToggleButton value="two">Two</ToggleButton>
            <ToggleButton value="three">Three</ToggleButton>
          </ToggleButtonGroup>
        </View>
      ))}
    </View>
  ),
};

/** Sizes — small, default, large. */
export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      {(['small', 'default', 'large'] as const).map((size) => (
        <View key={size} style={{ gap: 6 }}>
          <SectionLabel>{size}</SectionLabel>
          <ToggleButtonGroup size={size} value="day">
            <ToggleButton value="day">Day</ToggleButton>
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
          </ToggleButtonGroup>
        </View>
      ))}
    </View>
  ),
};

/** Icon-only segments. */
export const IconOnly: Story = {
  render: () => (
    <ToggleButtonGroup value="grid">
      <ToggleButton value="grid" leadingIcon="grid_view" />
      <ToggleButton value="list" leadingIcon="view_list" />
      <ToggleButton value="board" leadingIcon="view_kanban" />
    </ToggleButtonGroup>
  ),
};

/** Disabled — whole group and a single segment. */
export const Disabled: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <ToggleButtonGroup value="one" disabled>
        <ToggleButton value="one">One</ToggleButton>
        <ToggleButton value="two">Two</ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup value="one">
        <ToggleButton value="one">One</ToggleButton>
        <ToggleButton value="two" disabled>
          Two
        </ToggleButton>
        <ToggleButton value="three">Three</ToggleButton>
      </ToggleButtonGroup>
    </View>
  ),
};

function DensityColumn({
  density,
}: {
  density: 'compact' | 'default' | 'comfortable';
}) {
  return (
    <ThemeProvider density={density}>
      <View style={{ gap: 6 }}>
        <SectionLabel>{density}</SectionLabel>
        <ToggleButtonGroup value="center">
          <ToggleButton value="left" leadingIcon="format_align_left">
            Left
          </ToggleButton>
          <ToggleButton value="center" leadingIcon="format_align_center">
            Center
          </ToggleButton>
          <ToggleButton value="right" leadingIcon="format_align_right">
            Right
          </ToggleButton>
        </ToggleButtonGroup>
      </View>
    </ThemeProvider>
  );
}

/** Density changes padding and gap. */
export const DensityComparison: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => (
    <View style={{ gap: 20 }}>
      <DensityColumn density="compact" />
      <DensityColumn density="default" />
      <DensityColumn density="comfortable" />
    </View>
  ),
};
