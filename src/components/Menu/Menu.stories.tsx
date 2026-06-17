import React from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Menu, MenuItem, MenuDivider, MenuLabel } from './Menu';
import { Button } from '../Button';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  decorators: [
    (Story) => (
      <View style={{ padding: 24, minHeight: 320 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    size: { control: 'select', options: ['small', 'default', 'large'] },
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
    },
    closeOnSelect: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Menu>;

const SectionLabel = ({ children }: { children: string }) => (
  <Text
    style={{
      fontSize: 12,
      fontWeight: '600',
      color: '#6B7280',
      textTransform: 'uppercase',
      letterSpacing: 1,
    }}
  >
    {children}
  </Text>
);

const noop = () => {};

/** Interactive — click the trigger to open. */
export const Playground: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Menu {...args} trigger={<Button trailingIcon="arrow_drop_down">Actions</Button>}>
      <MenuItem leadingIcon="edit" onPress={noop}>
        Edit
      </MenuItem>
      <MenuItem leadingIcon="content_copy" shortcut="⌘D" onPress={noop}>
        Duplicate
      </MenuItem>
      <MenuItem leadingIcon="archive" onPress={noop}>
        Archive
      </MenuItem>
      <MenuDivider />
      <MenuItem leadingIcon="delete" intent="danger" onPress={noop}>
        Delete
      </MenuItem>
    </Menu>
  ),
  args: { size: 'default', placement: 'bottom-start', closeOnSelect: true },
};

/** Open by default — items with icons, a shortcut, and a danger action. */
export const Open: Story = {
  render: () => (
    <Menu defaultOpen trigger={<Button trailingIcon="arrow_drop_down">Actions</Button>}>
      <MenuLabel>Manage</MenuLabel>
      <MenuItem leadingIcon="edit" onPress={noop}>
        Edit
      </MenuItem>
      <MenuItem leadingIcon="content_copy" shortcut="⌘D" onPress={noop}>
        Duplicate
      </MenuItem>
      <MenuItem leadingIcon="link" disabled onPress={noop}>
        Copy link
      </MenuItem>
      <MenuDivider />
      <MenuItem leadingIcon="delete" intent="danger" onPress={noop}>
        Delete
      </MenuItem>
    </Menu>
  ),
};

/** Selectable items show a check and the selected colours. */
export const Selectable: Story = {
  render: () => (
    <Menu defaultOpen trigger={<Button trailingIcon="sort">Sort by</Button>}>
      <MenuItem selected onPress={noop}>
        Newest
      </MenuItem>
      <MenuItem onPress={noop}>Oldest</MenuItem>
      <MenuItem onPress={noop}>Name A–Z</MenuItem>
    </Menu>
  ),
};

/** Sizes — small, default, large. */
export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 24 }}>
      {(['small', 'default', 'large'] as const).map((size) => (
        <View key={size} style={{ gap: 8 }}>
          <SectionLabel>{size}</SectionLabel>
          <Menu size={size} defaultOpen trigger={<Button size={size}>Menu</Button>}>
            <MenuItem leadingIcon="edit" onPress={noop}>
              Edit
            </MenuItem>
            <MenuItem leadingIcon="share" onPress={noop}>
              Share
            </MenuItem>
          </Menu>
        </View>
      ))}
    </View>
  ),
};

function DensityColumn({
  density,
}: {
  density: 'compact' | 'default' | 'comfortable';
}) {
  return (
    <ThemeProvider density={density}>
      <View style={{ gap: 8 }}>
        <SectionLabel>{density}</SectionLabel>
        <Menu defaultOpen trigger={<Button>Menu</Button>}>
          <MenuItem leadingIcon="edit" onPress={noop}>
            Edit
          </MenuItem>
          <MenuItem leadingIcon="share" onPress={noop}>
            Share
          </MenuItem>
          <MenuItem leadingIcon="delete" intent="danger" onPress={noop}>
            Delete
          </MenuItem>
        </Menu>
      </View>
    </ThemeProvider>
  );
}

/** Density changes item padding and gap. */
export const DensityComparison: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => (
    <View style={{ flexDirection: 'row', gap: 32 }}>
      <DensityColumn density="compact" />
      <DensityColumn density="default" />
      <DensityColumn density="comfortable" />
    </View>
  ),
};
