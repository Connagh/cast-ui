import React from 'react';
import { View, Text as RNText } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Text, type TextType } from './Text';
import { ThemeProvider } from '../../theme';
import { colorSchemes } from '../../tokens';

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const TYPE_OPTIONS: TextType[] = [
  'caption',
  'label-sm',
  'label-md',
  'label-lg',
  'body-sm',
  'body-md',
  'body-lg',
  'title-sm',
  'title-md',
  'title-lg',
  'heading-sm',
  'heading-md',
  'heading-lg',
  'display-sm',
  'display-md',
  'display-lg',
];

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  decorators: [
    (Story) => (
      <ThemeProvider density="default">
        <Story />
      </ThemeProvider>
    ),
  ],
  argTypes: {
    type: {
      control: 'select',
      options: TYPE_OPTIONS,
      description: 'Type ramp entry — mirrors the Figma `type` variant.',
    },
    color: {
      control: 'color',
      description: "Text colour — defaults to the scheme's text/primary.",
    },
    numberOfLines: {
      control: 'number',
      description: 'Truncate to this many lines with an ellipsis.',
    },
    children: {
      control: 'text',
      description: 'The text content.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Interactive playground — use the controls panel to explore the type ramp. */
export const Playground: Story = {
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
    type: 'body-md',
  },
};

function RampRow({ type }: { type: TextType }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 16 }}>
      <RNText
        style={{
          fontSize: 11,
          color: '#9CA3AF',
          width: 96,
          fontFamily: 'monospace',
        }}
      >
        {type}
      </RNText>
      <Text type={type}>The quick brown fox</Text>
    </View>
  );
}

/** Every entry in the type ramp, smallest to largest. */
export const TypeRamp: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      {TYPE_OPTIONS.map((type) => (
        <RampRow key={type} type={type} />
      ))}
    </View>
  ),
};

/** Truncation via numberOfLines. */
export const Truncation: Story = {
  render: () => (
    <View style={{ width: 240, gap: 12 }}>
      <Text type="body-md" numberOfLines={1}>
        A single line of body text that is far too long to fit and truncates
      </Text>
      <Text type="body-md" numberOfLines={2}>
        Two lines of body text that wrap once and then truncate with an
        ellipsis when the content keeps going beyond the limit
      </Text>
    </View>
  ),
};

/** Custom colours — overriding the text/primary default. */
export const Colors: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <Text type="title-md">Default (text/primary)</Text>
      <Text type="body-md" color={colorSchemes.light.text.description}>
        Description colour
      </Text>
      <Text type="body-md" color="#2563EB">
        Brand colour
      </Text>
    </View>
  ),
};

// ---------------------------------------------------------------------------
// Colour modes
// ---------------------------------------------------------------------------

function ModePanel({ colorMode }: { colorMode: 'light' | 'dark' }) {
  const scheme = colorSchemes[colorMode];
  return (
    <ThemeProvider colorMode={colorMode}>
      <View
        style={{
          gap: 12,
          padding: 24,
          borderRadius: 8,
          backgroundColor: scheme.surface.base,
        }}
      >
        <RNText
          style={{
            fontSize: 12,
            fontWeight: '600',
            color: scheme.text.description,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          {colorMode} mode
        </RNText>
        <Text type="heading-sm">Heading text</Text>
        <Text type="body-md">
          Body text picks up text/primary for the active colour mode.
        </Text>
        <Text type="caption" color={scheme.text.description}>
          Caption in the description colour
        </Text>
      </View>
    </ThemeProvider>
  );
}

/** text/primary adapts to the active colour mode automatically. */
export const ColorModes: Story = {
  render: () => (
    <View style={{ gap: 24 }}>
      <ModePanel colorMode="light" />
      <ModePanel colorMode="dark" />
    </View>
  ),
};
