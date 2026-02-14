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
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
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
// Sizes
// ---------------------------------------------------------------------------

export const Small: Story = {
  args: {
    label: 'Small',
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    label: 'Medium',
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    label: 'Large',
    size: 'large',
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
