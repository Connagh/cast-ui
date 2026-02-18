import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {
  args: { label: 'Accept terms', checked: false },
};

export const Checked: Story = {
  args: { label: 'Accept terms', checked: true },
};

export const Disabled: Story = {
  args: { label: 'Cannot change', checked: false, disabled: true },
};

export const NoLabel: Story = {
  args: { checked: true },
};
