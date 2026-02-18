import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Icon } from './Icon';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    color: { control: 'color' },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Small: Story = {
  args: { name: '\u2605', size: 'small' },
};

export const Medium: Story = {
  args: { name: '\u2605', size: 'medium' },
};

export const Large: Story = {
  args: { name: '\u2605', size: 'large' },
};
