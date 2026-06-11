import React, { useState } from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { List, ListItem, ListSubheader, ListDivider } from './List';
import { ThemeProvider } from '../../theme';

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof ListItem> = {
  title: 'Components/List',
  component: ListItem,
  decorators: [
    (Story) => (
      <ThemeProvider density="default">
        <View style={{ padding: 24, maxWidth: 360 }}>
          <Story />
        </View>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    children: { control: 'text', description: 'Primary label text.' },
    description: { control: 'text', description: 'Supporting description text.' },
    icon: { control: 'text', description: 'Material Symbols icon name.' },
    selected: { control: 'boolean', description: 'Highlights the item.' },
    disabled: { control: 'boolean', description: 'Disables interaction.' },
  },
};

export default meta;
type Story = StoryObj<typeof ListItem>;

// Reusable surface so the white List reads against the page background.
const Card = ({ children }: { children: React.ReactNode }) => (
  <View
    style={{
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 8,
      overflow: 'hidden',
      width: 318,
    }}
  >
    {children}
  </View>
);

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

/** Interactive playground — tweak a single item via the controls panel. */
export const Playground: Story = {
  render: (args) => (
    <Card>
      <List>
        <ListItem {...args} />
      </List>
    </Card>
  ),
  args: {
    children: 'All Mail',
    description: 'View all incoming messages',
    icon: 'star',
    selected: false,
    disabled: false,
  },
};

/** The canonical Figma example — sectioned inbox navigation. */
export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState('all-mail');
    return (
      <Card>
        <List accessibilityLabel="Mailboxes">
          <ListSubheader>Inbox</ListSubheader>
          <ListItem
            icon="star"
            description="View all incoming messages"
            selected={selected === 'all-mail'}
            onPress={() => setSelected('all-mail')}
          >
            All Mail
          </ListItem>
          <ListItem
            icon="star"
            description="Important and bookmarked items"
            selected={selected === 'starred'}
            onPress={() => setSelected('starred')}
          >
            Starred
          </ListItem>
          <ListDivider />
          <ListSubheader>Labels</ListSubheader>
          <ListItem
            icon="star"
            description="Team and project messages"
            selected={selected === 'work'}
            onPress={() => setSelected('work')}
          >
            Work
          </ListItem>
          <ListItem icon="star" disabled>
            Personal
          </ListItem>
        </List>
      </Card>
    );
  },
};

/** All item states side by side: default, selected, hover (web), disabled. */
export const ItemStates: Story = {
  render: () => (
    <Card>
      <List>
        <ListItem icon="inbox" onPress={() => {}}>
          Default
        </ListItem>
        <ListItem icon="check_circle" selected onPress={() => {}}>
          Selected
        </ListItem>
        <ListItem icon="block" disabled>
          Disabled
        </ListItem>
      </List>
    </Card>
  ),
};

/** Simple single-line items with no description. */
export const SingleLine: Story = {
  render: () => {
    const [selected, setSelected] = useState('profile');
    return (
      <Card>
        <List>
          <ListItem
            icon="person"
            selected={selected === 'profile'}
            onPress={() => setSelected('profile')}
          >
            Profile
          </ListItem>
          <ListItem
            icon="notifications"
            selected={selected === 'notifications'}
            onPress={() => setSelected('notifications')}
          >
            Notifications
          </ListItem>
          <ListItem
            icon="lock"
            selected={selected === 'privacy'}
            onPress={() => setSelected('privacy')}
          >
            Privacy
          </ListItem>
          <ListItem
            icon="palette"
            selected={selected === 'appearance'}
            onPress={() => setSelected('appearance')}
          >
            Appearance
          </ListItem>
        </List>
      </Card>
    );
  },
};

/** Items with leading and trailing icons. */
export const WithTrailingIcon: Story = {
  render: () => (
    <Card>
      <List>
        <ListItem icon="folder" trailingIcon="chevron_right" onPress={() => {}}>
          Documents
        </ListItem>
        <ListItem icon="image" trailingIcon="chevron_right" onPress={() => {}}>
          Photos
        </ListItem>
        <ListItem icon="cloud" trailingIcon="chevron_right" onPress={() => {}}>
          Backups
        </ListItem>
      </List>
    </Card>
  ),
};

// ---------------------------------------------------------------------------
// Density comparison
// ---------------------------------------------------------------------------

function DensityColumn({
  density,
}: {
  density: 'compact' | 'default' | 'comfortable';
}) {
  const [selected, setSelected] = useState('all-mail');
  return (
    <ThemeProvider density={density}>
      <View style={{ gap: 8 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '600',
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          {density}
        </Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 8,
            overflow: 'hidden',
            width: 280,
          }}
        >
          <List>
            <ListSubheader>Inbox</ListSubheader>
            <ListItem
              icon="star"
              description="View all incoming messages"
              selected={selected === 'all-mail'}
              onPress={() => setSelected('all-mail')}
            >
              All Mail
            </ListItem>
            <ListItem
              icon="star"
              description="Important and bookmarked items"
              selected={selected === 'starred'}
              onPress={() => setSelected('starred')}
            >
              Starred
            </ListItem>
            <ListDivider />
            <ListSubheader>Labels</ListSubheader>
            <ListItem icon="star" disabled>
              Personal
            </ListItem>
          </List>
        </View>
      </View>
    </ThemeProvider>
  );
}

/** Compare compact, default, and comfortable densities (padding + icon size). */
export const DensityComparison: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 32, flexWrap: 'wrap' }}>
      <DensityColumn density="compact" />
      <DensityColumn density="default" />
      <DensityColumn density="comfortable" />
    </View>
  ),
};
