import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'boolean' },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Off: Story = {
  args: { label: 'Notifications', value: false },
};

export const On: Story = {
  args: { label: 'Notifications', value: true },
};

export const Disabled: Story = {
  args: { label: 'Locked setting', value: false, disabled: true },
};

export const NoLabel: Story = {
  args: { value: true },
};
