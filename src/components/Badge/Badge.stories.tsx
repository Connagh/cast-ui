import React from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  decorators: [
    (Story) => (
      <View style={{ padding: 24 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    children: { control: 'text', description: 'Badge label text.' },
    intent: {
      control: 'select',
      options: ['neutral', 'brand', 'danger'],
      description: 'Semantic intent — drives the colour scheme.',
    },
    variant: {
      control: 'select',
      options: ['solid', 'subtle', 'outline'],
      description: 'Surface treatment.',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size variant — controls padding, gap, and typography.',
    },
    dot: { control: 'boolean', description: 'Show a leading status dot.' },
    leadingIcon: { control: 'text', description: 'Material Symbols name.' },
    trailingIcon: { control: 'text', description: 'Material Symbols name.' },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

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
    children: 'Badge',
    intent: 'neutral',
    variant: 'solid',
    size: 'default',
    dot: false,
  },
};

/** The three surface treatments across each intent. */
export const Variants: Story = {
  render: () => {
    const variants = ['solid', 'subtle', 'outline'] as const;
    return (
      <View style={{ gap: 16 }}>
        {variants.map((variant) => (
          <View key={variant} style={{ gap: 8 }}>
            <SectionLabel>{variant}</SectionLabel>
            <Row>
              <Badge variant={variant} intent="neutral">
                Neutral
              </Badge>
              <Badge variant={variant} intent="brand">
                Brand
              </Badge>
              <Badge variant={variant} intent="danger">
                Danger
              </Badge>
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
      <Badge size="small">Small</Badge>
      <Badge size="default">Default</Badge>
      <Badge size="large">Large</Badge>
    </Row>
  ),
};

/** Leading status dots — useful for "live", "online", or count indicators. */
export const WithDot: Story = {
  render: () => (
    <Row>
      <Badge intent="brand" variant="subtle" dot>
        Active
      </Badge>
      <Badge intent="danger" variant="subtle" dot>
        Error
      </Badge>
      <Badge intent="neutral" variant="outline" dot>
        Draft
      </Badge>
    </Row>
  ),
};

/** Leading and trailing icons. */
export const WithIcons: Story = {
  render: () => (
    <Row>
      <Badge intent="brand" leadingIcon="check">
        Verified
      </Badge>
      <Badge intent="danger" variant="subtle" leadingIcon="error">
        Failed
      </Badge>
      <Badge intent="neutral" variant="outline" trailingIcon="close">
        Tag
      </Badge>
    </Row>
  ),
};

/** Full matrix — every variant × intent × size. */
export const Matrix: Story = {
  render: () => {
    const variants = ['solid', 'subtle', 'outline'] as const;
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
                  <Badge key={intent} variant={variant} intent={intent} size={size}>
                    {intent}
                  </Badge>
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
// Density comparison — Badge spacing is constant across densities by design.
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
          <Badge intent="brand">Brand</Badge>
          <Badge intent="danger" variant="subtle">
            Danger
          </Badge>
        </Row>
      </View>
    </ThemeProvider>
  );
}

/** Badge sizing stays identical across densities (only spacing tokens differ
 * elsewhere; Badge has none that vary). */
export const DensityComparison: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 48, flexWrap: 'wrap' }}>
      <DensityColumn density="compact" />
      <DensityColumn density="default" />
      <DensityColumn density="comfortable" />
    </View>
  ),
};
