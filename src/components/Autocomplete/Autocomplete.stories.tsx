import React, { useState } from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Autocomplete, type AutocompleteOption } from './Autocomplete';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof Autocomplete> = {
  title: 'Components/Autocomplete',
  component: Autocomplete,
  decorators: [
    (Story) => (
      <View style={{ padding: 24, width: 340, minHeight: 320 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    size: { control: 'select', options: ['small', 'default', 'large'] },
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    clearable: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

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

const COUNTRIES: AutocompleteOption[] = [
  { value: 'au', label: 'Australia' },
  { value: 'br', label: 'Brazil' },
  { value: 'ca', label: 'Canada' },
  { value: 'de', label: 'Germany' },
  { value: 'jp', label: 'Japan' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
];

const FRAMEWORKS: AutocompleteOption[] = [
  { value: 'react', label: 'React', description: 'A UI library', icon: 'code' },
  { value: 'vue', label: 'Vue', description: 'The progressive framework', icon: 'code' },
  { value: 'svelte', label: 'Svelte', description: 'Compiled components', icon: 'code' },
  { value: 'angular', label: 'Angular', description: 'Full framework', icon: 'code', disabled: true },
];

/** Interactive playground. */
export const Playground: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => {
    const Demo = () => {
      const [value, setValue] = useState<string | null>(null);
      return (
        <Autocomplete
          {...args}
          options={COUNTRIES}
          value={value}
          onValueChange={setValue}
          label="Country"
          placeholder="Search countries…"
        />
      );
    };
    return <Demo />;
  },
  args: { size: 'default', disabled: false, error: false, clearable: true },
};

/** Open with options (default value preselected). */
export const Basic: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState<string | null>('ca');
      return (
        <Autocomplete
          options={COUNTRIES}
          value={value}
          onValueChange={setValue}
          label="Country"
          helperText="Start typing to filter."
        />
      );
    };
    return <Demo />;
  },
};

/** Options with icons and descriptions. */
export const WithDescriptions: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState<string | null>(null);
      return (
        <Autocomplete
          options={FRAMEWORKS}
          value={value}
          onValueChange={setValue}
          label="Framework"
          leadingIcon="search"
        />
      );
    };
    return <Demo />;
  },
};

/** Error state. */
export const ErrorState: Story = {
  render: () => (
    <Autocomplete
      options={COUNTRIES}
      label="Country"
      error
      helperText="Please choose a country."
      placeholder="Search countries…"
    />
  ),
};

/** Disabled. */
export const Disabled: Story = {
  render: () => (
    <Autocomplete options={COUNTRIES} label="Country" disabled defaultValue="us" />
  ),
};

/** Sizes — small, default, large. */
export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      {(['small', 'default', 'large'] as const).map((size) => (
        <View key={size} style={{ gap: 6 }}>
          <SectionLabel>{size}</SectionLabel>
          <Autocomplete options={COUNTRIES} size={size} defaultValue="jp" placeholder="Search…" />
        </View>
      ))}
    </View>
  ),
};

/** Density changes the field and option padding. */
export const DensityComparison: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => (
    <View style={{ gap: 16 }}>
      {(['compact', 'default', 'comfortable'] as const).map((density) => (
        <ThemeProvider key={density} density={density}>
          <View style={{ gap: 6 }}>
            <SectionLabel>{density}</SectionLabel>
            <Autocomplete options={COUNTRIES} defaultValue="de" placeholder="Search…" />
          </View>
        </ThemeProvider>
      ))}
    </View>
  ),
};
