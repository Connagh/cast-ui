import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Backdrop } from './Backdrop';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof Backdrop> = {
  title: 'Components/Backdrop',
  component: Backdrop,
  argTypes: {
    open: { control: 'boolean' },
    invisible: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Backdrop>;

/**
 * Backdrop fills its parent, so each story frames it inside a relative,
 * clipped box rather than letting it cover the whole canvas.
 */
const Frame = ({ children }: { children: React.ReactNode }) => (
  <View
    style={{
      width: 360,
      height: 240,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      backgroundColor: '#FFFFFF',
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {children}
  </View>
);

const FakeContent = () => (
  <View style={{ gap: 8, alignItems: 'center' }}>
    <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151' }}>
      Page content
    </Text>
    <Text style={{ fontSize: 13, color: '#6B7280' }}>
      The backdrop dims this layer.
    </Text>
  </View>
);

const Spinner = () => (
  <View
    style={{
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 4,
      borderColor: '#FFFFFF',
      borderTopColor: 'transparent',
    }}
  />
);

/** Tap the box to toggle the scrim. */
export const Playground: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => {
    const Demo = () => {
      const [open, setOpen] = useState(args.open ?? false);
      return (
        <Frame>
          <Pressable onPress={() => setOpen(true)}>
            <FakeContent />
          </Pressable>
          <Backdrop {...args} open={open} onPress={() => setOpen(false)} />
        </Frame>
      );
    };
    return <Demo />;
  },
  args: { open: false, invisible: false },
};

/** Open scrim with centred content. */
export const WithContent: Story = {
  render: () => (
    <Frame>
      <FakeContent />
      <Backdrop open>
        <Spinner />
      </Backdrop>
    </Frame>
  ),
};

/** Invisible scrim — transparent but still catches presses. */
export const Invisible: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => {
    const Demo = () => {
      const [count, setCount] = useState(0);
      const [open, setOpen] = useState(true);
      return (
        <Frame>
          <Text style={{ color: '#374151' }}>{`Dismissed ${count} times`}</Text>
          <Backdrop
            open={open}
            invisible
            onPress={() => {
              setCount((c) => c + 1);
              setOpen(false);
            }}
          />
        </Frame>
      );
    };
    return <Demo />;
  },
};

/** Dark mode scrim. */
export const DarkMode: Story = {
  render: () => (
    <ThemeProvider colorMode="dark">
      <View
        style={{
          width: 360,
          height: 240,
          borderRadius: 8,
          backgroundColor: '#111827',
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: '#E5E7EB' }}>Dark surface</Text>
        <Backdrop open>
          <Spinner />
        </Backdrop>
      </View>
    </ThemeProvider>
  ),
};
