import React, { useState } from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from './Chip';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof Chip> = {
  title: 'Components/Chip',
  component: Chip,
  decorators: [
    (Story) => (
      <View style={{ padding: 24 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    children: { control: 'text', description: 'Chip label text.' },
    intent: {
      control: 'select',
      options: ['neutral', 'brand', 'danger'],
      description: 'Semantic intent — drives the colour scheme.',
    },
    variant: {
      control: 'select',
      options: ['outline', 'subtle'],
      description: 'Surface treatment.',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size variant — controls padding, gap, and typography.',
    },
    selected: { control: 'boolean', description: 'Selected (active) state.' },
    disabled: { control: 'boolean', description: 'Disables interaction.' },
    leadingIcon: { control: 'text', description: 'Material Symbols name.' },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

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

const Row = ({ children }: { children: React.ReactNode }) => (
  <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
    {children}
  </View>
);

/** Interactive playground — tweak every prop via the controls panel. */
export const Playground: Story = {
  args: {
    children: 'Chip',
    intent: 'neutral',
    variant: 'outline',
    size: 'default',
    selected: false,
    disabled: false,
    leadingIcon: 'sell',
    onPress: () => {},
    onRemove: () => {},
  },
};

/** The two surface treatments across each intent. */
export const Variants: Story = {
  render: () => {
    const variants = ['outline', 'subtle'] as const;
    return (
      <View style={{ gap: 16 }}>
        {variants.map((variant) => (
          <View key={variant} style={{ gap: 8 }}>
            <SectionLabel>{variant}</SectionLabel>
            <Row>
              <Chip variant={variant} intent="neutral">
                Neutral
              </Chip>
              <Chip variant={variant} intent="brand">
                Brand
              </Chip>
              <Chip variant={variant} intent="danger">
                Danger
              </Chip>
            </Row>
          </View>
        ))}
      </View>
    );
  },
};

/** Small, default, and large sizes. */
export const Sizes: Story = {
  render: () => (
    <Row>
      <Chip size="small" leadingIcon="sell" onRemove={() => {}}>
        Small
      </Chip>
      <Chip size="default" leadingIcon="sell" onRemove={() => {}}>
        Default
      </Chip>
      <Chip size="large" leadingIcon="sell" onRemove={() => {}}>
        Large
      </Chip>
    </Row>
  ),
};

/** Selectable filter chips — toggle selection on press. */
export const Selectable: Story = {
  render: () => {
    const options = ['All', 'Active', 'Archived', 'Drafts'];
    const [selected, setSelected] = useState('All');
    return (
      <Row>
        {options.map((opt) => (
          <Chip
            key={opt}
            intent="brand"
            variant="outline"
            selected={selected === opt}
            onPress={() => setSelected(opt)}
          >
            {opt}
          </Chip>
        ))}
      </Row>
    );
  },
};

/** Removable input chips — manage a dynamic list of tokens. */
export const Removable: Story = {
  render: () => {
    const [tags, setTags] = useState(['design', 'react-native', 'tokens', 'figma']);
    return (
      <Row>
        {tags.map((tag) => (
          <Chip
            key={tag}
            intent="neutral"
            variant="subtle"
            leadingIcon="tag"
            onRemove={() => setTags((t) => t.filter((x) => x !== tag))}
          >
            {tag}
          </Chip>
        ))}
      </Row>
    );
  },
};

/** Disabled in both variants. */
export const Disabled: Story = {
  render: () => (
    <Row>
      <Chip variant="outline" disabled leadingIcon="sell" onRemove={() => {}}>
        Outline
      </Chip>
      <Chip variant="subtle" disabled leadingIcon="sell" onRemove={() => {}}>
        Subtle
      </Chip>
    </Row>
  ),
};

/** Full matrix — every variant × intent × size. */
export const Matrix: Story = {
  render: () => {
    const variants = ['outline', 'subtle'] as const;
    const intents = ['neutral', 'brand', 'danger'] as const;
    const sizes = ['small', 'default', 'large'] as const;
    return (
      <View style={{ gap: 24 }}>
        {variants.map((variant) => (
          <View key={variant} style={{ gap: 12 }}>
            <SectionLabel>{variant}</SectionLabel>
            {sizes.map((size) => (
              <Row key={size}>
                {intents.map((intent) => (
                  <Chip
                    key={intent}
                    variant={variant}
                    intent={intent}
                    size={size}
                    leadingIcon="sell"
                    onRemove={() => {}}
                  >
                    {intent}
                  </Chip>
                ))}
              </Row>
            ))}
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
  return (
    <ThemeProvider density={density}>
      <View style={{ gap: 8 }}>
        <SectionLabel>{density}</SectionLabel>
        <Row>
          <Chip intent="brand" leadingIcon="sell" onRemove={() => {}}>
            Brand
          </Chip>
          <Chip intent="neutral" variant="subtle" onRemove={() => {}}>
            Neutral
          </Chip>
        </Row>
      </View>
    </ThemeProvider>
  );
}

/** Compare compact, default, and comfortable densities (padding + gap change). */
export const DensityComparison: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 48, flexWrap: 'wrap' }}>
      <DensityColumn density="compact" />
      <DensityColumn density="default" />
      <DensityColumn density="comfortable" />
    </View>
  ),
};
