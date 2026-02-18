import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { Table } from './Table';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

const sampleColumns = [
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status' },
];

const sampleData = [
  { name: 'Alice', role: 'Engineer', status: 'Active' },
  { name: 'Bob', role: 'Designer', status: 'Active' },
  { name: 'Charlie', role: 'PM', status: 'Away' },
];

export const Default: Story = {
  args: { columns: sampleColumns, data: sampleData },
};

export const Clickable: Story = {
  args: {
    columns: sampleColumns,
    data: sampleData,
    onRowPress: (row) => console.log('Pressed row:', row),
  },
};
