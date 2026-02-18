import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    severity: { control: 'select', options: ['info', 'success', 'error', 'warning'] },
    title: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: { severity: 'info', title: 'Information', children: 'This is an informational alert.' },
};

export const Success: Story = {
  args: { severity: 'success', title: 'Success', children: 'Operation completed successfully.' },
};

export const Error: Story = {
  args: { severity: 'error', title: 'Error', children: 'Something went wrong.' },
};

export const Warning: Story = {
  args: { severity: 'warning', children: 'Proceed with caution.' },
};

export const Dismissible: Story = {
  args: { severity: 'info', title: 'Heads up', children: 'You can dismiss this alert.', onDismiss: () => {} },
};
