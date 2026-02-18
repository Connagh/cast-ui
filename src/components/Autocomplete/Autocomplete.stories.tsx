import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Autocomplete } from './Autocomplete';

const meta: Meta<typeof Autocomplete> = {
  title: 'Components/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Autocomplete>;

const countries = [
  { label: 'United States', value: 'us' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Canada', value: 'ca' },
  { label: 'Australia', value: 'au' },
  { label: 'Germany', value: 'de' },
];

export const Default: Story = {
  args: { label: 'Country', placeholder: 'Search countries...', options: countries },
};

export const WithValue: Story = {
  args: { label: 'Country', options: countries, value: 'ca' },
};
