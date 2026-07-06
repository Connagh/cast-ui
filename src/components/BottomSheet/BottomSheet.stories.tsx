import React, { useState } from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { BottomSheet, BottomSheetContent } from './BottomSheet';
import { Button } from '../Button';
import { ThemeProvider } from '../../theme';

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof BottomSheet> = {
  title: 'Components/BottomSheet',
  component: BottomSheet,
  argTypes: {
    title: { control: 'text', description: 'Heading shown above the content.' },
    showHandle: {
      control: 'boolean',
      description: 'Show the drag handle pill at the top.',
    },
    closeOnBackdropPress: {
      control: 'boolean',
      description: 'Dismiss when the scrim is pressed.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof BottomSheet>;

/** A phone-width frame so the inline sheet reads at its real width. */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return <View style={{ width: 390, alignSelf: 'flex-start' }}>{children}</View>;
}

const bodyText = {
  fontFamily: 'Geist',
  fontSize: 15,
  lineHeight: 22,
  color: '#374151',
} as const;

// ---------------------------------------------------------------------------
// Playground — interactive, uses the real modal
// ---------------------------------------------------------------------------

/** Press the button to open the full sheet. It slides up, the scrim fades in. */
export const Playground: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  args: { title: 'Sheet title', showHandle: true, closeOnBackdropPress: true },
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <View>
        <Button intent="brand" prominence="bold" onPress={() => setOpen(true)}>
          Open sheet
        </Button>
        <BottomSheet {...args} open={open} onClose={() => setOpen(false)}>
          <Text style={bodyText}>
            This sheet hugs its content up to 90% of the screen height, then the
            content scrolls. Press the scrim or a button to close it.
          </Text>
          <Button
            intent="brand"
            prominence="bold"
            onPress={() => setOpen(false)}
          >
            Done
          </Button>
        </BottomSheet>
      </View>
    );
  },
};

// ---------------------------------------------------------------------------
// Visual stories — static cards, no modal, captured by Chromatic
// ---------------------------------------------------------------------------

/** Default: drag handle, title, and content. */
export const Default: Story = {
  render: () => (
    <PhoneFrame>
      <BottomSheetContent title="Share to">
        <Text style={bodyText}>
          A sheet is the right surface for quick, focused choices that sit on top
          of the current screen.
        </Text>
        <Button intent="brand" prominence="bold" onPress={() => {}}>
          Continue
        </Button>
      </BottomSheetContent>
    </PhoneFrame>
  ),
};

/** No drag handle, no title — just content. */
export const ContentOnly: Story = {
  render: () => (
    <PhoneFrame>
      <BottomSheetContent showHandle={false}>
        <Text style={bodyText}>
          A bare sheet with no handle and no title. Use this when the content
          provides its own header.
        </Text>
      </BottomSheetContent>
    </PhoneFrame>
  ),
};

/** Title, handle, and a stack of actions. */
export const WithActions: Story = {
  render: () => (
    <PhoneFrame>
      <BottomSheetContent title="Account">
        <Button intent="neutral" prominence="default" onPress={() => {}}>
          Edit profile
        </Button>
        <Button intent="neutral" prominence="default" onPress={() => {}}>
          Notifications
        </Button>
        <Button intent="danger" prominence="bold" onPress={() => {}}>
          Sign out
        </Button>
      </BottomSheetContent>
    </PhoneFrame>
  ),
};

/** Long content. The sheet caps its height and the body scrolls. */
export const LongContent: Story = {
  render: () => (
    <PhoneFrame>
      <View style={{ height: 420 }}>
        <BottomSheetContent title="Terms">
          {Array.from({ length: 12 }).map((_, i) => (
            <Text key={i} style={bodyText}>
              Paragraph {i + 1}. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
            </Text>
          ))}
        </BottomSheetContent>
      </View>
    </PhoneFrame>
  ),
};

// ---------------------------------------------------------------------------
// Density comparison
// ---------------------------------------------------------------------------

/** Compare compact, default, and comfortable densities side by side. */
export const DensityComparison: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 24, flexWrap: 'wrap' }}>
      {(['compact', 'default', 'comfortable'] as const).map((density) => (
        <ThemeProvider key={density} density={density}>
          <View style={{ gap: 8, width: 320 }}>
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
            <BottomSheetContent title="Share to">
              <Text style={bodyText}>
                Only padding and gap change across densities.
              </Text>
              <Button intent="brand" prominence="bold" onPress={() => {}}>
                Continue
              </Button>
            </BottomSheetContent>
          </View>
        </ThemeProvider>
      ))}
    </View>
  ),
};
