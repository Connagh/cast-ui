import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

const roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Viewer', value: 'viewer' },
];

export const Default: Story = {
  args: { label: 'Role', placeholder: 'Select a role...', options: roles },
};

export const WithValue: Story = {
  args: { label: 'Role', options: roles, value: 'editor' },
};
