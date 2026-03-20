import React, { useState } from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectOption,
  SelectGroup,
  SelectSeparator,
  SelectTag,
} from './Select';
import { ThemeProvider } from '../../theme';

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  decorators: [
    (Story) => (
      <ThemeProvider density="default">
        <View style={{ padding: 24, maxWidth: 360 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multi', 'combobox'],
      description: 'Selection mode.',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size variant — controls padding, gap, and typography.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the entire select.',
    },
    error: {
      control: 'boolean',
      description: 'Error state — shows danger border and red helper text.',
    },
    label: { control: 'text', description: 'Form label above the input.' },
    helperText: {
      control: 'text',
      description: 'Helper or error text below the input.',
    },
    placeholder: { control: 'text', description: 'Placeholder text.' },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Interactive playground — use the controls panel to explore all variants. */
export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState<string>('');
    return (
      <Select
        {...args}
        type="single"
        value={value}
        onValueChange={setValue}
      >
        <SelectOption value="option1" icon="star">
          Option 1
        </SelectOption>
        <SelectOption value="option2" icon="star" description="With description">
          Option 2
        </SelectOption>
        <SelectOption value="option3" icon="star">
          Option 3
        </SelectOption>
      </Select>
    );
  },
  args: {
    label: 'Form label',
    helperText: 'Helper text',
    placeholder: 'Select an option...',
    size: 'default',
    disabled: false,
    error: false,
  },
};

/** Single select with grouped options and separators. */
export const SingleSelect: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Select
        label="Country"
        helperText="Select your country"
        placeholder="Select a country..."
        value={value}
        onValueChange={setValue}
        leadingIcon="public"
      >
        <SelectGroup label="Europe">
          <SelectOption value="uk" icon="flag">
            United Kingdom
          </SelectOption>
          <SelectOption value="fr" icon="flag" description="Republic of France">
            France
          </SelectOption>
          <SelectOption value="de" icon="flag">
            Germany
          </SelectOption>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup label="Americas">
          <SelectOption value="us" icon="flag">
            United States
          </SelectOption>
          <SelectOption value="ca" icon="flag">
            Canada
          </SelectOption>
          <SelectOption value="br" icon="flag" disabled>
            Brazil
          </SelectOption>
        </SelectGroup>
      </Select>
    );
  },
};

/** Multi-select with tag pills. */
export const MultiSelect: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>(['react', 'typescript']);
    return (
      <Select
        type="multi"
        label="Technologies"
        helperText="Select your tech stack"
        placeholder="Select technologies..."
        values={values}
        onValuesChange={setValues}
      >
        <SelectOption value="react" icon="code">
          React
        </SelectOption>
        <SelectOption value="typescript" icon="code">
          TypeScript
        </SelectOption>
        <SelectOption value="nodejs" icon="dns">
          Node.js
        </SelectOption>
        <SelectOption value="graphql" icon="hub">
          GraphQL
        </SelectOption>
        <SelectOption value="rust" icon="memory" disabled>
          Rust
        </SelectOption>
      </Select>
    );
  },
};

/** Combobox with search filtering. */
export const Combobox: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [search, setSearch] = useState('');
    const options = [
      { value: 'apple', label: 'Apple', icon: 'nutrition' },
      { value: 'banana', label: 'Banana', icon: 'nutrition' },
      { value: 'cherry', label: 'Cherry', icon: 'nutrition' },
      { value: 'grape', label: 'Grape', icon: 'nutrition' },
      { value: 'mango', label: 'Mango', icon: 'nutrition' },
      { value: 'orange', label: 'Orange', icon: 'nutrition' },
    ];
    const filtered = options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase()),
    );
    return (
      <Select
        type="combobox"
        label="Fruit"
        helperText="Search for a fruit"
        placeholder="Type to search..."
        value={value}
        onValueChange={(v) => {
          setValue(v);
          const opt = options.find((o) => o.value === v);
          setSearch(opt?.label ?? '');
        }}
        searchValue={search}
        onSearchChange={setSearch}
      >
        {filtered.map((o) => (
          <SelectOption key={o.value} value={o.value} icon={o.icon}>
            {o.label}
          </SelectOption>
        ))}
      </Select>
    );
  },
};

/** Small, default, and large sizes side by side. */
export const Sizes: Story = {
  render: () => {
    const [s, setS] = useState('');
    const [d, setD] = useState('');
    const [l, setL] = useState('');
    return (
      <View style={{ gap: 24 }}>
        <Select
          size="small"
          label="Small"
          placeholder="Select..."
          value={s}
          onValueChange={setS}
        >
          <SelectOption value="a">Option A</SelectOption>
          <SelectOption value="b">Option B</SelectOption>
        </Select>
        <Select
          size="default"
          label="Default"
          placeholder="Select..."
          value={d}
          onValueChange={setD}
        >
          <SelectOption value="a">Option A</SelectOption>
          <SelectOption value="b">Option B</SelectOption>
        </Select>
        <Select
          size="large"
          label="Large"
          placeholder="Select..."
          value={l}
          onValueChange={setL}
        >
          <SelectOption value="a">Option A</SelectOption>
          <SelectOption value="b">Option B</SelectOption>
        </Select>
      </View>
    );
  },
};

/** Error and disabled states. */
export const States: Story = {
  render: () => (
    <View style={{ gap: 24 }}>
      <Select
        label="Error state"
        helperText="This field is required"
        placeholder="Select..."
        error
      >
        <SelectOption value="a">Option A</SelectOption>
      </Select>
      <Select
        label="Disabled state"
        helperText="This field is locked"
        placeholder="Select..."
        disabled
      >
        <SelectOption value="a">Option A</SelectOption>
      </Select>
    </View>
  ),
};

/** Options with descriptions and mixed icons. */
export const WithDescriptions: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Select
        label="Plan"
        helperText="Choose your subscription"
        placeholder="Select a plan..."
        value={value}
        onValueChange={setValue}
      >
        <SelectOption value="free" icon="star_border" description="Up to 3 projects">
          Free
        </SelectOption>
        <SelectOption value="pro" icon="star_half" description="Unlimited projects">
          Pro
        </SelectOption>
        <SelectOption value="enterprise" icon="star" description="Custom everything">
          Enterprise
        </SelectOption>
      </Select>
    );
  },
};

/** Options with disabled items. */
export const WithDisabledOptions: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Select
        label="Priority"
        placeholder="Select priority..."
        value={value}
        onValueChange={setValue}
      >
        <SelectOption value="low" icon="arrow_downward">
          Low
        </SelectOption>
        <SelectOption value="medium" icon="remove">
          Medium
        </SelectOption>
        <SelectOption value="high" icon="arrow_upward">
          High
        </SelectOption>
        <SelectOption value="critical" icon="priority_high" disabled>
          Critical
        </SelectOption>
      </Select>
    );
  },
};

/** Leading icon on the trigger. */
export const WithLeadingIcon: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <Select
        label="Search engine"
        placeholder="Select..."
        leadingIcon="search"
        value={value}
        onValueChange={setValue}
      >
        <SelectOption value="google">Google</SelectOption>
        <SelectOption value="bing">Bing</SelectOption>
        <SelectOption value="duckduckgo">DuckDuckGo</SelectOption>
      </Select>
    );
  },
};

// ---------------------------------------------------------------------------
// SelectTag standalone
// ---------------------------------------------------------------------------

/** SelectTag rendered standalone (for multi-select pill reference). */
export const TagShowcase: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
      <SelectTag onRemove={() => {}}>React</SelectTag>
      <SelectTag onRemove={() => {}}>TypeScript</SelectTag>
      <SelectTag onRemove={() => {}}>Node.js</SelectTag>
      <SelectTag disabled>Disabled</SelectTag>
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
  const [value, setValue] = useState('');
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
        <Select
          label="Category"
          helperText="Helper text"
          placeholder="Select..."
          value={value}
          onValueChange={setValue}
          leadingIcon="folder"
        >
          <SelectGroup label="Group A">
            <SelectOption value="a1" icon="star">
              Option 1
            </SelectOption>
            <SelectOption value="a2" icon="star" description="Description text">
              Option 2
            </SelectOption>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup label="Group B">
            <SelectOption value="b1" icon="star">
              Option 3
            </SelectOption>
          </SelectGroup>
        </Select>
      </View>
    </ThemeProvider>
  );
}

/** Compare compact, default, and comfortable densities. */
export const DensityComparison: Story = {
  render: () => (
    <View style={{ gap: 32 }}>
      <DensityRow density="compact" />
      <DensityRow density="default" />
      <DensityRow density="comfortable" />
    </View>
  ),
};

// ---------------------------------------------------------------------------
// Full matrix
// ---------------------------------------------------------------------------

/** All three types in default size. */
export const TypeMatrix: Story = {
  render: () => {
    const [single, setSingle] = useState('');
    const [multi, setMulti] = useState<string[]>(['opt1']);
    const [combo, setCombo] = useState('');
    const [search, setSearch] = useState('');
    return (
      <View style={{ gap: 24 }}>
        <View style={{ gap: 4 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            Single
          </Text>
          <Select
            type="single"
            label="Single select"
            placeholder="Select..."
            value={single}
            onValueChange={setSingle}
          >
            <SelectOption value="opt1">Option 1</SelectOption>
            <SelectOption value="opt2">Option 2</SelectOption>
            <SelectOption value="opt3">Option 3</SelectOption>
          </Select>
        </View>
        <View style={{ gap: 4 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            Multi
          </Text>
          <Select
            type="multi"
            label="Multi select"
            placeholder="Select..."
            values={multi}
            onValuesChange={setMulti}
          >
            <SelectOption value="opt1">Option 1</SelectOption>
            <SelectOption value="opt2">Option 2</SelectOption>
            <SelectOption value="opt3">Option 3</SelectOption>
          </Select>
        </View>
        <View style={{ gap: 4 }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '600',
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            Combobox
          </Text>
          <Select
            type="combobox"
            label="Combobox"
            placeholder="Search..."
            value={combo}
            onValueChange={(v) => {
              setCombo(v);
              setSearch('');
            }}
            searchValue={search}
            onSearchChange={setSearch}
          >
            <SelectOption value="opt1">Option 1</SelectOption>
            <SelectOption value="opt2">Option 2</SelectOption>
            <SelectOption value="opt3">Option 3</SelectOption>
          </Select>
        </View>
      </View>
    );
  },
};
