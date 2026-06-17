import React from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { CodeBlock } from './CodeBlock';
import { ThemeProvider } from '../../theme';

const SAMPLE = `import { Button } from '@castui/cast-ui';

export function Save() {
  return <Button intent="brand">Save</Button>;
}`;

const meta: Meta<typeof CodeBlock> = {
  title: 'Components/CodeBlock',
  component: CodeBlock,
  decorators: [
    (Story) => (
      <View style={{ padding: 24, width: 480 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    children: { control: 'text' },
    size: { control: 'select', options: ['small', 'default', 'large'] },
    language: { control: 'text' },
    title: { control: 'text' },
    showCopy: { control: 'boolean' },
    showLineNumbers: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof CodeBlock>;

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

/** Interactive playground. */
export const Playground: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  args: {
    children: SAMPLE,
    size: 'default',
    language: 'tsx',
    title: 'Save.tsx',
    showCopy: true,
    showLineNumbers: false,
  },
};

/** Bare block — no header. */
export const Plain: Story = {
  render: () => <CodeBlock showCopy={false}>{`npm install @castui/cast-ui`}</CodeBlock>,
};

/** With a title and language tag. */
export const WithHeader: Story = {
  render: () => (
    <CodeBlock title="Save.tsx" language="tsx">
      {SAMPLE}
    </CodeBlock>
  ),
};

/** With a line-number gutter. */
export const LineNumbers: Story = {
  render: () => (
    <CodeBlock title="Save.tsx" language="tsx" showLineNumbers>
      {SAMPLE}
    </CodeBlock>
  ),
};

/** Sizes — small, default, large. */
export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 16 }}>
      {(['small', 'default', 'large'] as const).map((size) => (
        <View key={size} style={{ gap: 6 }}>
          <SectionLabel>{size}</SectionLabel>
          <CodeBlock size={size} language="bash">
            {`echo "size: ${size}"`}
          </CodeBlock>
        </View>
      ))}
    </View>
  ),
};

/** A long single line scrolls horizontally instead of wrapping. */
export const LongLine: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => (
    <CodeBlock title="config.ts">
      {`export const config = { theme: 'default', density: 'comfortable', colorMode: 'light', brand: '#2563EB' };`}
    </CodeBlock>
  ),
};

/** Dark mode. */
export const DarkMode: Story = {
  render: () => (
    <ThemeProvider colorMode="dark">
      <View style={{ padding: 24, width: 480, backgroundColor: '#111827' }}>
        <CodeBlock title="Save.tsx" language="tsx">
          {SAMPLE}
        </CodeBlock>
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
        <CodeBlock title="Save.tsx" language="tsx">
          {SAMPLE}
        </CodeBlock>
      </View>
    </ThemeProvider>
  );
}

/** Density changes padding and gap only. */
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
