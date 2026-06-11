import React from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../Button';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  decorators: [
    (Story) => (
      <View style={{ padding: 24 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size variant — controls padding, gap, and typography.',
    },
    variant: {
      control: 'select',
      options: ['outline', 'elevated'],
      description: 'outline (border) or elevated (border + drop shadow).',
    },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    body: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

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

/** A coloured placeholder standing in for a media <Image>. */
const ImagePlaceholder = ({ color = '#C7D2FE' }: { color?: string }) => (
  <View style={{ flex: 1, backgroundColor: color }} />
);

const Actions = () => (
  <>
    <Button intent="neutral" prominence="subtle" size="small">
      Cancel
    </Button>
    <Button intent="brand" size="small">
      Confirm
    </Button>
  </>
);

/** Interactive playground — full card with every slot populated. */
export const Playground: Story = {
  render: (args) => (
    <View style={{ width: 300 }}>
      <Card
        {...args}
        image={<ImagePlaceholder />}
        icon="star"
        actions={<Actions />}
      />
    </View>
  ),
  args: {
    size: 'default',
    variant: 'outline',
    title: 'Title',
    subtitle: 'Subtitle',
    body: 'Description text that explains the card content.',
  },
};

/** Outline vs elevated. */
export const Variants: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 24, flexWrap: 'wrap' }}>
      <View style={{ width: 280, gap: 8 }}>
        <SectionLabel>Outline</SectionLabel>
        <Card
          variant="outline"
          image={<ImagePlaceholder />}
          icon="landscape"
          title="Mountain trip"
          subtitle="3 day itinerary"
          body="A scenic route through the alpine ridges and valleys."
          actions={<Actions />}
        />
      </View>
      <View style={{ width: 280, gap: 8 }}>
        <SectionLabel>Elevated</SectionLabel>
        <Card
          variant="elevated"
          image={<ImagePlaceholder color="#FBCFE8" />}
          icon="landscape"
          title="Mountain trip"
          subtitle="3 day itinerary"
          body="A scenic route through the alpine ridges and valleys."
          actions={<Actions />}
        />
      </View>
    </View>
  ),
};

/** Small, default, and large sizes. */
export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      {(['small', 'default', 'large'] as const).map((size) => (
        <View key={size} style={{ width: 280, gap: 8 }}>
          <SectionLabel>{size}</SectionLabel>
          <Card
            size={size}
            variant="outline"
            image={<ImagePlaceholder />}
            icon="star"
            title="Title"
            subtitle="Subtitle"
            body="Description text."
            actions={<Actions />}
          />
        </View>
      ))}
    </View>
  ),
};

/** Content variations — slots render only when their prop is provided. */
export const ContentVariations: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <View style={{ width: 260 }}>
        <Card title="Title only" />
      </View>
      <View style={{ width: 260 }}>
        <Card icon="info" title="Title" subtitle="With subtitle, no image" />
      </View>
      <View style={{ width: 260 }}>
        <Card
          title="No image"
          body="A card with body text and actions but no media."
          actions={<Actions />}
        />
      </View>
      <View style={{ width: 260 }}>
        <Card image={<ImagePlaceholder color="#BBF7D0" />} title="Image + title" />
      </View>
    </View>
  ),
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
      <View style={{ width: 280, gap: 8 }}>
        <SectionLabel>{density}</SectionLabel>
        <Card
          variant="outline"
          image={<ImagePlaceholder />}
          icon="star"
          title="Title"
          subtitle="Subtitle"
          body="Padding and gap scale with density."
          actions={<Actions />}
        />
      </View>
    </ThemeProvider>
  );
}

/** Compare compact, default, and comfortable densities. */
export const DensityComparison: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <DensityColumn density="compact" />
      <DensityColumn density="default" />
      <DensityColumn density="comfortable" />
    </View>
  ),
};
