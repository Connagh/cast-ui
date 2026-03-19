import React, { useState } from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from './Dialog';
import { Button } from '../Button';
import { ThemeProvider } from '../../theme';

// ---------------------------------------------------------------------------
// Helper: wraps Dialog with a trigger button and open state
// ---------------------------------------------------------------------------

function DialogDemo(props: Omit<React.ComponentProps<typeof Dialog>, 'open' | 'onClose'> & { triggerLabel?: string }) {
  const [open, setOpen] = useState(false);
  const { triggerLabel = 'Open dialog', ...dialogProps } = props;
  return (
    <View>
      <Button intent="brand" prominence="bold" onPress={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      <Dialog
        {...dialogProps}
        open={open}
        onClose={() => setOpen(false)}
        secondaryAction={dialogProps.secondaryAction ?? { label: 'Cancel', onPress: () => setOpen(false) }}
        primaryAction={dialogProps.primaryAction ?? { label: 'Confirm', onPress: () => setOpen(false) }}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  decorators: [
    (Story) => (
      <ThemeProvider density="default">
        <Story />
      </ThemeProvider>
    ),
  ],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size variant — controls padding, gap, typography, and width.',
    },
    title: { control: 'text' },
    description: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

/** Interactive playground — click the button to open. */
export const Playground: Story = {
  render: () => (
    <DialogDemo
      title="Confirm action"
      description="Are you sure you want to proceed? This action cannot be undone."
      icon="warning"
      size="default"
    />
  ),
};

/** All three size variants. */
export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
      <DialogDemo
        title="Small dialog"
        description="Compact confirmation."
        icon="info"
        size="small"
        triggerLabel="Small"
      />
      <DialogDemo
        title="Default dialog"
        description="Standard dialog with a comfortable amount of space for content."
        icon="help"
        size="default"
        triggerLabel="Default"
      />
      <DialogDemo
        title="Large dialog"
        description="Spacious dialog for complex content or longer descriptions that need room to breathe."
        icon="warning"
        size="large"
        triggerLabel="Large"
      />
    </View>
  ),
};

/** Dialog with custom content in the slot. */
export const WithSlotContent: Story = {
  render: () => (
    <DialogDemo
      title="Delete project"
      description="This will permanently delete the project and all associated data."
      icon="delete"
      size="default"
      triggerLabel="With slot content"
      primaryAction={undefined}
    >
      <View
        style={{
          backgroundColor: '#FEF2F2',
          borderRadius: 8,
          padding: 12,
        }}
      >
        <Text style={{ fontSize: 14, color: '#991B1B' }}>
          Warning: 3 team members will lose access immediately.
        </Text>
      </View>
    </DialogDemo>
  ),
};

/** Dialog without an icon. */
export const NoIcon: Story = {
  render: () => (
    <DialogDemo
      title="Save changes?"
      description="You have unsaved changes that will be lost if you leave."
      size="default"
      triggerLabel="No icon"
    />
  ),
};

// ---------------------------------------------------------------------------
// Density comparison
// ---------------------------------------------------------------------------

function DensityRow({ density }: { density: 'compact' | 'default' | 'comfortable' }) {
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
        <DialogDemo
          title="Confirm action"
          description="Are you sure you want to proceed?"
          icon="warning"
          size="default"
          triggerLabel={density}
        />
      </View>
    </ThemeProvider>
  );
}

/** Compare compact, default, and comfortable densities. */
export const DensityComparison: Story = {
  render: () => (
    <View style={{ gap: 24 }}>
      <DensityRow density="compact" />
      <DensityRow density="default" />
      <DensityRow density="comfortable" />
    </View>
  ),
};
