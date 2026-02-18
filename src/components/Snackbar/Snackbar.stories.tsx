import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Snackbar } from './Snackbar';

const meta: Meta<typeof Snackbar> = {
  title: 'Components/Snackbar',
  component: Snackbar,
  tags: ['autodocs'],
  argTypes: {
    message: { control: 'text' },
    action: { control: 'text' },
    visible: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Snackbar>;

export const Default: Story = {
  args: { message: 'Item saved successfully.', visible: true },
};

export const WithAction: Story = {
  args: { message: 'Item deleted.', action: 'Undo', visible: true, onAction: () => {} },
};

export const Hidden: Story = {
  args: { message: 'Not visible', visible: false },
};
