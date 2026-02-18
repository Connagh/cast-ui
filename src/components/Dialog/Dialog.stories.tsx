import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Dialog } from './Dialog';
import { Button } from '../Button/Button';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    visible: { control: 'boolean' },
    title: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  args: {
    visible: true,
    title: 'Confirm Action',
    children: 'Are you sure you want to proceed? This action cannot be undone.',
    actions: (
      <>
        <Button label="Cancel" variant="text" />
        <Button label="Confirm" variant="filled" />
      </>
    ),
  },
};

export const NoActions: Story = {
  args: {
    visible: true,
    title: 'Notice',
    children: 'Your session will expire in 5 minutes.',
  },
};
