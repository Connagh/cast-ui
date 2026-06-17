import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { AppBar } from './AppBar';
import { Icon } from '../Icon';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof AppBar> = {
  title: 'Components/AppBar',
  component: AppBar,
  decorators: [
    (Story) => (
      <View style={{ width: 420 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    title: { control: 'text' },
    leadingIcon: { control: 'text' },
    intent: { control: 'select', options: ['neutral', 'brand', 'danger'] },
    prominence: { control: 'select', options: ['default', 'bold', 'subtle'] },
    size: { control: 'select', options: ['small', 'default', 'large'] },
    align: { control: 'select', options: ['start', 'center'] },
  },
};

export default meta;
type Story = StoryObj<typeof AppBar>;

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

const Action = ({ name, color }: { name: string; color: string }) => (
  <Pressable accessibilityRole="button" accessibilityLabel={name} hitSlop={8}>
    <Icon name={name} size="large" color={color} />
  </Pressable>
);

/** Interactive playground. */
export const Playground: Story = {
  args: {
    title: 'Inbox',
    leadingIcon: 'menu',
    intent: 'neutral',
    prominence: 'default',
    size: 'default',
    align: 'start',
  },
  render: (args) => (
    <AppBar
      {...args}
      trailing={
        <>
          <Action name="search" color={args.prominence === 'bold' ? '#FFFFFF' : '#374151'} />
          <Action name="more_vert" color={args.prominence === 'bold' ? '#FFFFFF' : '#374151'} />
        </>
      }
    />
  ),
};

/** Prominence — default (divider), bold (filled), subtle (transparent). */
export const Prominence: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <View style={{ gap: 6 }}>
        <SectionLabel>default</SectionLabel>
        <AppBar title="Default bar" leadingIcon="menu" />
      </View>
      <View style={{ gap: 6 }}>
        <SectionLabel>bold</SectionLabel>
        <AppBar
          title="Bold bar"
          leadingIcon="menu"
          intent="brand"
          prominence="bold"
          trailing={<Action name="more_vert" color="#FFFFFF" />}
        />
      </View>
      <View style={{ gap: 6 }}>
        <SectionLabel>subtle</SectionLabel>
        <AppBar title="Subtle bar" leadingIcon="arrow_back" prominence="subtle" />
      </View>
    </View>
  ),
};

/** Bold bars in each intent. */
export const Intents: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      {(['neutral', 'brand', 'danger'] as const).map((intent) => (
        <View key={intent} style={{ gap: 6 }}>
          <SectionLabel>{intent}</SectionLabel>
          <AppBar
            title={`${intent} bar`}
            leadingIcon="menu"
            intent={intent}
            prominence="bold"
            trailing={<Action name="more_vert" color="#FFFFFF" />}
          />
        </View>
      ))}
    </View>
  ),
};

/** Sizes — small, default, large. */
export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      {(['small', 'default', 'large'] as const).map((size) => (
        <View key={size} style={{ gap: 6 }}>
          <SectionLabel>{size}</SectionLabel>
          <AppBar
            title="Documents"
            leadingIcon="menu"
            size={size}
            trailing={<Action name="search" color="#374151" />}
          />
        </View>
      ))}
    </View>
  ),
};

/** Centered title (common on mobile). */
export const CenterTitle: Story = {
  render: () => (
    <AppBar
      title="Profile"
      leadingIcon="arrow_back"
      align="center"
      trailing={<Action name="more_vert" color="#374151" />}
    />
  ),
};

/** Dark mode. */
export const DarkMode: Story = {
  render: () => (
    <ThemeProvider colorMode="dark">
      <View style={{ gap: 16, backgroundColor: '#111827', padding: 16 }}>
        <AppBar title="Default" leadingIcon="menu" trailing={<Action name="search" color="#E5E7EB" />} />
        <AppBar title="Bold brand" leadingIcon="menu" intent="brand" prominence="bold" trailing={<Action name="search" color="#FFFFFF" />} />
      </View>
    </ThemeProvider>
  ),
};

function DensityColumn({
  density,
}: {
  density: 'compact' | 'default' | 'comfortable';
}) {
  return (
    <ThemeProvider density={density}>
      <View style={{ gap: 6 }}>
        <SectionLabel>{density}</SectionLabel>
        <AppBar title="Settings" leadingIcon="menu" trailing={<Action name="more_vert" color="#374151" />} />
      </View>
    </ThemeProvider>
  );
}

/** Density changes the bar padding and gap. */
export const DensityComparison: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => (
    <View style={{ gap: 20 }}>
      <DensityColumn density="compact" />
      <DensityColumn density="default" />
      <DensityColumn density="comfortable" />
    </View>
  ),
};
