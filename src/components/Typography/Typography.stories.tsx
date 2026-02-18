import React from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Typography } from './Typography';

const meta: Meta<typeof Typography> = {
  title: 'Components/Typography',
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'display',
        'h1',
        'h2',
        'h3',
        'subtitle',
        'body',
        'small',
        'caption',
        'overline',
        'label',
        'button',
      ],
    },
    color: { control: 'color' },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

// ---------------------------------------------------------------------------
// Individual variants
// ---------------------------------------------------------------------------

export const Display: Story = {
  args: { variant: 'display', children: 'Display' },
};

export const H1: Story = {
  args: { variant: 'h1', children: 'Heading 1' },
};

export const H2: Story = {
  args: { variant: 'h2', children: 'Heading 2' },
};

export const H3: Story = {
  args: { variant: 'h3', children: 'Heading 3' },
};

export const Subtitle: Story = {
  args: { variant: 'subtitle', children: 'Subtitle text' },
};

export const Body: Story = {
  args: { variant: 'body', children: 'Body text for paragraphs and general content.' },
};

export const Small: Story = {
  args: { variant: 'small', children: 'Small text' },
};

export const Caption: Story = {
  args: { variant: 'caption', children: 'Caption text' },
};

export const Overline: Story = {
  args: { variant: 'overline', children: 'Overline text' },
};

export const Label: Story = {
  args: { variant: 'label', children: 'Label text' },
};

export const ButtonVariant: Story = {
  args: { variant: 'button', children: 'Button text' },
};

// ---------------------------------------------------------------------------
// All variants
// ---------------------------------------------------------------------------

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <Typography variant="display">Display</Typography>
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="subtitle">Subtitle</Typography>
      <Typography variant="body">Body</Typography>
      <Typography variant="small">Small</Typography>
      <Typography variant="caption">Caption</Typography>
      <Typography variant="overline">Overline</Typography>
      <Typography variant="label">Label</Typography>
      <Typography variant="button">Button</Typography>
    </View>
  ),
};
