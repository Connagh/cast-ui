import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['filled', 'outline', 'text'],
    },
    disabled: { control: 'boolean' },
    backgroundColor: { control: 'color' },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

export const Filled: Story = {
  args: {
    label: 'Button',
    variant: 'filled',
  },
};

export const Outline: Story = {
  args: {
    label: 'Button',
    variant: 'outline',
  },
};

export const TextVariant: Story = {
  args: {
    label: 'Button',
    variant: 'text',
  },
};

// ---------------------------------------------------------------------------
// States
// ---------------------------------------------------------------------------

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
  },
};
