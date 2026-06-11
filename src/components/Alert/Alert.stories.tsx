import React from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  decorators: [
    (Story) => (
      <ThemeProvider density="default">
        <View style={{ padding: 24, maxWidth: 420 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    intent: {
      control: 'select',
      options: ['neutral', 'brand', 'danger'],
      description: 'Semantic intent — drives the colour scheme.',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size variant — controls padding, gap, and typography.',
    },
    variant: {
      control: 'select',
      options: ['subtle', 'outline'],
      description: 'subtle (no fill) or outline (white fill + intent border).',
    },
    title: { control: 'text', description: 'Bold title line.' },
    description: { control: 'text', description: 'Supporting description text.' },
    icon: { control: 'text', description: 'Material Symbols icon name.' },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

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

/** Interactive playground — explore every variant via the controls panel. */
export const Playground: Story = {
  args: {
    intent: 'neutral',
    size: 'default',
    variant: 'outline',
    title: 'Note',
    description: 'This is an inline alert message.',
    icon: 'info',
  },
};

/** All three intents in the outline variant. */
export const Intents: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Alert
        intent="neutral"
        variant="outline"
        icon="info"
        title="Heads up"
        description="This is a neutral, informational message."
      />
      <Alert
        intent="brand"
        variant="outline"
        icon="campaign"
        title="What's new"
        description="A brand-coloured alert for announcements."
      />
      <Alert
        intent="danger"
        variant="outline"
        icon="error"
        title="Something went wrong"
        description="A danger alert for errors and destructive states."
      />
    </View>
  ),
};

/** Subtle vs outline, across intents. */
export const Variants: Story = {
  render: () => (
    <View style={{ gap: 24 }}>
      <View style={{ gap: 8 }}>
        <SectionLabel>Subtle</SectionLabel>
        <Alert intent="neutral" variant="subtle" icon="info" title="Note" description="No fill, no border." />
        <Alert intent="brand" variant="subtle" icon="info" title="Note" description="No fill, no border." />
        <Alert intent="danger" variant="subtle" icon="error" title="Note" description="No fill, no border." />
      </View>
      <View style={{ gap: 8 }}>
        <SectionLabel>Outline</SectionLabel>
        <Alert intent="neutral" variant="outline" icon="info" title="Note" description="White fill, intent border." />
        <Alert intent="brand" variant="outline" icon="info" title="Note" description="White fill, intent border." />
        <Alert intent="danger" variant="outline" icon="error" title="Note" description="White fill, intent border." />
      </View>
    </View>
  ),
};

/** Small, default, and large sizes. */
export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Alert size="small" intent="brand" variant="outline" icon="info" title="Small" description="Small alert." />
      <Alert size="default" intent="brand" variant="outline" icon="info" title="Default" description="Default alert." />
      <Alert size="large" intent="brand" variant="outline" icon="info" title="Large" description="Large alert." />
    </View>
  ),
};

/** Dismissible alert — a close button appears when onClose is provided. */
export const Dismissible: Story = {
  render: () => (
    <Alert
      intent="danger"
      variant="outline"
      icon="error"
      title="Upload failed"
      description="Your file could not be uploaded. Try again."
      onClose={() => {}}
    />
  ),
};

/** Title-only and description-only configurations. */
export const ContentVariations: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Alert intent="neutral" variant="outline" icon="info" title="Title only" />
      <Alert intent="neutral" variant="outline" icon="info" description="Description only, no title." />
      <Alert intent="neutral" variant="outline" icon={null} title="No icon" description="Pass icon={null} to hide it." />
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
      <View style={{ gap: 8, width: 360 }}>
        <SectionLabel>{density}</SectionLabel>
        <Alert
          intent="brand"
          variant="outline"
          icon="info"
          title="Note"
          description="Padding and gap scale with density."
          onClose={() => {}}
        />
      </View>
    </ThemeProvider>
  );
}

/** Compare compact, default, and comfortable densities. */
export const DensityComparison: Story = {
  render: () => (
    <View style={{ gap: 24 }}>
      <DensityColumn density="compact" />
      <DensityColumn density="default" />
      <DensityColumn density="comfortable" />
    </View>
  ),
};
