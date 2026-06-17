import React from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs, Breadcrumb } from './Breadcrumbs';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  decorators: [
    (Story) => (
      <View style={{ padding: 24 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    separator: { control: 'text', description: 'Symbol name or literal string.' },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size variant — typography, icon size, and gap.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

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

/** Interactive playground. */
export const Playground: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Breadcrumbs {...args}>
      <Breadcrumb onPress={noop}>Home</Breadcrumb>
      <Breadcrumb onPress={noop}>Library</Breadcrumb>
      <Breadcrumb onPress={noop}>Data</Breadcrumb>
      <Breadcrumb>Current page</Breadcrumb>
    </Breadcrumbs>
  ),
  args: { size: 'default', separator: 'chevron_right' },
};

/** The last item is automatically the current (plain text) item. */
export const Default: Story = {
  render: () => (
    <Breadcrumbs>
      <Breadcrumb onPress={noop}>Home</Breadcrumb>
      <Breadcrumb onPress={noop}>Projects</Breadcrumb>
      <Breadcrumb>Cast UI</Breadcrumb>
    </Breadcrumbs>
  ),
};

/** Sizes — small, default, large. */
export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      {(['small', 'default', 'large'] as const).map((size) => (
        <View key={size} style={{ gap: 6 }}>
          <SectionLabel>{size}</SectionLabel>
          <Breadcrumbs size={size}>
            <Breadcrumb onPress={noop}>Home</Breadcrumb>
            <Breadcrumb onPress={noop}>Library</Breadcrumb>
            <Breadcrumb>Current</Breadcrumb>
          </Breadcrumbs>
        </View>
      ))}
    </View>
  ),
};

/** Separators — icon (default), a slash, and a custom dot symbol. */
export const Separators: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      <View style={{ gap: 6 }}>
        <SectionLabel>chevron_right</SectionLabel>
        <Breadcrumbs separator="chevron_right">
          <Breadcrumb onPress={noop}>Home</Breadcrumb>
          <Breadcrumb onPress={noop}>Docs</Breadcrumb>
          <Breadcrumb>Page</Breadcrumb>
        </Breadcrumbs>
      </View>
      <View style={{ gap: 6 }}>
        <SectionLabel>slash</SectionLabel>
        <Breadcrumbs separator="/">
          <Breadcrumb onPress={noop}>Home</Breadcrumb>
          <Breadcrumb onPress={noop}>Docs</Breadcrumb>
          <Breadcrumb>Page</Breadcrumb>
        </Breadcrumbs>
      </View>
      <View style={{ gap: 6 }}>
        <SectionLabel>chevron icon</SectionLabel>
        <Breadcrumbs separator="arrow_forward_ios">
          <Breadcrumb onPress={noop}>Home</Breadcrumb>
          <Breadcrumb onPress={noop}>Docs</Breadcrumb>
          <Breadcrumb>Page</Breadcrumb>
        </Breadcrumbs>
      </View>
    </View>
  ),
};

/** With leading icons and a disabled middle link. */
export const WithIcons: Story = {
  render: () => (
    <Breadcrumbs>
      <Breadcrumb onPress={noop} leadingIcon="home">
        Home
      </Breadcrumb>
      <Breadcrumb onPress={noop} leadingIcon="folder" disabled>
        Archived
      </Breadcrumb>
      <Breadcrumb leadingIcon="description">Report</Breadcrumb>
    </Breadcrumbs>
  ),
};

/** A long trail wraps onto multiple lines. */
export const Wrapping: Story = {
  render: () => (
    <View style={{ width: 280 }}>
      <Breadcrumbs>
        <Breadcrumb onPress={noop}>Home</Breadcrumb>
        <Breadcrumb onPress={noop}>Organisation</Breadcrumb>
        <Breadcrumb onPress={noop}>Workspace</Breadcrumb>
        <Breadcrumb onPress={noop}>Projects</Breadcrumb>
        <Breadcrumb>Current item</Breadcrumb>
      </Breadcrumbs>
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
      <View style={{ gap: 6 }}>
        <SectionLabel>{density}</SectionLabel>
        <Breadcrumbs>
          <Breadcrumb onPress={noop}>Home</Breadcrumb>
          <Breadcrumb onPress={noop}>Library</Breadcrumb>
          <Breadcrumb>Current</Breadcrumb>
        </Breadcrumbs>
      </View>
    </ThemeProvider>
  );
}

/** Density only changes the gap between items and separators. */
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
