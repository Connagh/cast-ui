import React from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  decorators: [
    (Story) => (
      <ThemeProvider density="default">
        <View style={{ padding: 24 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    title: { control: 'text', description: 'Heading text.' },
    children: { control: 'text', description: 'Description text.' },
    intent: {
      control: 'select',
      options: ['neutral', 'brand', 'danger'],
      description: 'Semantic intent — colours the icon and text.',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size variant — controls padding, gap, and typography.',
    },
    icon: { control: 'text', description: 'Leading Material Symbols name.' },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

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

/** Interactive playground — tweak every prop via the controls panel. */
export const Playground: Story = {
  args: {
    title: 'Note',
    children: 'Description',
    intent: 'neutral',
    size: 'default',
    icon: 'info',
    onClose: () => {},
  },
};

/** One toast per intent. */
export const Intents: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Toast intent="neutral" icon="info" onClose={() => {}} title="Heads up">
        Your changes have been saved.
      </Toast>
      <Toast intent="brand" icon="rocket_launch" onClose={() => {}} title="New feature">
        Density theming is now available.
      </Toast>
      <Toast intent="danger" icon="error" onClose={() => {}} title="Upload failed">
        The file exceeds the 10MB limit.
      </Toast>
    </View>
  ),
};

/** Small, default, and large sizes. */
export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Toast size="small" intent="brand" icon="info" onClose={() => {}} title="Small">
        Description text
      </Toast>
      <Toast size="default" intent="brand" icon="info" onClose={() => {}} title="Default">
        Description text
      </Toast>
      <Toast size="large" intent="brand" icon="info" onClose={() => {}} title="Large">
        Description text
      </Toast>
    </View>
  ),
};

/** Without a leading icon, without a description, and without a close button. */
export const Variations: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <Toast intent="neutral" onClose={() => {}} title="No icon">
        A toast without a leading icon.
      </Toast>
      <Toast intent="brand" icon="check_circle" onClose={() => {}} title="Title only" />
      <Toast intent="neutral" icon="notifications" title="No dismiss">
        This toast cannot be dismissed.
      </Toast>
    </View>
  ),
};

/** Full matrix — every intent × size. */
export const Matrix: Story = {
  render: () => {
    const intents = ['neutral', 'brand', 'danger'] as const;
    const sizes = ['small', 'default', 'large'] as const;
    return (
      <View style={{ gap: 24 }}>
        {sizes.map((size) => (
          <View key={size} style={{ gap: 12 }}>
            <SectionLabel>{size}</SectionLabel>
            {intents.map((intent) => (
              <Toast
                key={intent}
                intent={intent}
                size={size}
                icon="info"
                onClose={() => {}}
                title="Note"
              >
                Description
              </Toast>
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
        <Toast intent="brand" icon="info" onClose={() => {}} title="Note">
          Description
        </Toast>
      </View>
    </ThemeProvider>
  );
}

/** Compare compact, default, and comfortable densities (padding + gap change). */
export const DensityComparison: Story = {
  render: () => (
    <View style={{ gap: 24 }}>
      <DensityColumn density="compact" />
      <DensityColumn density="default" />
      <DensityColumn density="comfortable" />
    </View>
  ),
};
