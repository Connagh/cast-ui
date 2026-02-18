import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Link } from './Link';

const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: { children: 'Click here', onPress: () => {} },
};

export const WithHref: Story = {
  args: { children: 'Visit website', href: 'https://example.com' },
};
