import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { TextField } from './TextField';

const meta: Meta<typeof TextField> = {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: { label: 'Label', placeholder: 'Enter text...' },
};

export const WithHelper: Story = {
  args: { label: 'Email', placeholder: 'you@example.com', helperText: 'We will never share your email.' },
};

export const ErrorState: Story = {
  args: { label: 'Email', value: 'invalid', error: true, helperText: 'Please enter a valid email.' },
};

export const Disabled: Story = {
  args: { label: 'Disabled', value: 'Cannot edit', disabled: true },
};
