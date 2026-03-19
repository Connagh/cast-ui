import React, { useState } from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Dialog, DialogContent } from './Dialog';
import { Button } from '../Button';
import { ThemeProvider } from '../../theme';

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

// ---------------------------------------------------------------------------
// Playground — interactive, uses the real modal
// ---------------------------------------------------------------------------

/** Click the button to open the full modal Dialog with backdrop. */
export const Playground: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <View>
        <Button intent="brand" prominence="bold" onPress={() => setOpen(true)}>
          Open dialog
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Confirm action"
          description="Are you sure you want to proceed? This action cannot be undone."
          icon="warning"
          size="default"
          secondaryAction={{ label: 'Cancel', onPress: () => setOpen(false) }}
          primaryAction={{ label: 'Confirm', onPress: () => setOpen(false) }}
        />
      </View>
    );
  },
};

// ---------------------------------------------------------------------------
// Visual stories — static cards, no modal, captured by Chromatic
// ---------------------------------------------------------------------------

const noop = () => {};

/** All three size variants rendered inline. */
export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 32 }}>
      <DialogContent
        title="Small dialog"
        description="Compact confirmation."
        icon="info"
        size="small"
        secondaryAction={{ label: 'Cancel', onPress: noop }}
        primaryAction={{ label: 'Confirm', onPress: noop }}
      />
      <DialogContent
        title="Default dialog"
        description="Standard dialog with a comfortable amount of space for content."
        icon="help"
        size="default"
        secondaryAction={{ label: 'Cancel', onPress: noop }}
        primaryAction={{ label: 'Confirm', onPress: noop }}
      />
      <DialogContent
        title="Large dialog"
        description="Spacious dialog for complex content or longer descriptions that need room to breathe."
        icon="warning"
        size="large"
        secondaryAction={{ label: 'Cancel', onPress: noop }}
        primaryAction={{ label: 'Confirm', onPress: noop }}
      />
    </View>
  ),
};

/** Dialog with custom content in the slot. */
export const WithSlotContent: Story = {
  render: () => (
    <DialogContent
      title="Delete project"
      description="This will permanently delete the project and all associated data."
      icon="delete"
      size="default"
      secondaryAction={{ label: 'Cancel', onPress: noop }}
      primaryAction={{ label: 'Delete', onPress: noop }}
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
    </DialogContent>
  ),
};

/** Dialog without an icon. */
export const NoIcon: Story = {
  render: () => (
    <DialogContent
      title="Save changes?"
      description="You have unsaved changes that will be lost if you leave."
      size="default"
      secondaryAction={{ label: 'Discard', onPress: noop }}
      primaryAction={{ label: 'Save', onPress: noop }}
    />
  ),
};

// ---------------------------------------------------------------------------
// Density comparison
// ---------------------------------------------------------------------------

/** Compare compact, default, and comfortable densities side by side. */
export const DensityComparison: Story = {
  render: () => (
    <View style={{ gap: 32 }}>
      {(['compact', 'default', 'comfortable'] as const).map((density) => (
        <ThemeProvider key={density} density={density}>
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
            <DialogContent
              title="Confirm action"
              description="Are you sure you want to proceed?"
              icon="warning"
              size="default"
              secondaryAction={{ label: 'Cancel', onPress: noop }}
              primaryAction={{ label: 'Confirm', onPress: noop }}
            />
          </View>
        </ThemeProvider>
      ))}
    </View>
  ),
};
