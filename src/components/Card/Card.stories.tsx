import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Card } from './Card';
import { Button } from '../Button/Button';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    body: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    title: 'Title',
    subtitle: 'Subtitle',
    body: 'Body',
    actions: (
      <>
        <Button label="Action 1" variant="filled" />
        <Button label="Action 2" variant="outline" />
      </>
    ),
  },
};

export const TitleOnly: Story = {
  args: {
    title: 'Title',
  },
};

export const WithBody: Story = {
  args: {
    title: 'Title',
    body: 'Body text that provides additional context about the card content.',
  },
};

export const WithActions: Story = {
  args: {
    title: 'Title',
    body: 'Body',
    actions: (
      <>
        <Button label="Action 1" variant="filled" />
        <Button label="Action 2" variant="outline" />
      </>
    ),
  },
};

export const NoActions: Story = {
  args: {
    title: 'Title',
    subtitle: 'Subtitle',
    body: 'Body text without any action buttons.',
  },
};
