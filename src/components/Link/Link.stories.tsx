import React from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
  decorators: [
    (Story) => (
      <View style={{ padding: 24 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    children: { control: 'text', description: 'The link text.' },
    intent: {
      control: 'select',
      options: ['neutral', 'brand', 'danger'],
      description: 'Semantic intent — drives the link colour.',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size variant — typography scale, icon size, and gap.',
    },
    underline: {
      control: 'select',
      options: ['none', 'hover', 'always'],
      description: 'When the underline shows.',
    },
    disabled: { control: 'boolean' },
    leadingIcon: { control: 'text', description: 'Material Symbols name.' },
    trailingIcon: { control: 'text', description: 'Material Symbols name.' },
  },
};

export default meta;
type Story = StoryObj<typeof Link>;

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

const Stack = ({ children }: { children: React.ReactNode }) => (
  <View style={{ gap: 12, alignItems: 'flex-start' }}>{children}</View>
);

/** Interactive playground. */
export const Playground: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  args: {
    children: 'View documentation',
    intent: 'brand',
    size: 'default',
    underline: 'hover',
    disabled: false,
    trailingIcon: 'open_in_new',
  },
};

/** The three intents. */
export const Intents: Story = {
  render: () => (
    <Stack>
      <Link intent="brand">Brand link</Link>
      <Link intent="neutral">Neutral link</Link>
      <Link intent="danger">Danger link</Link>
    </Stack>
  ),
};

/** Underline behaviour — none, on hover, always. */
export const Underline: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => (
    <Stack>
      <Link underline="none">No underline</Link>
      <Link underline="hover">Underline on hover</Link>
      <Link underline="always">Always underlined</Link>
    </Stack>
  ),
};

/** Sizes — small, default, large. */
export const Sizes: Story = {
  render: () => (
    <Stack>
      <Link size="small">Small link</Link>
      <Link size="default">Default link</Link>
      <Link size="large">Large link</Link>
    </Stack>
  ),
};

/** With leading and trailing icons. */
export const WithIcons: Story = {
  render: () => (
    <Stack>
      <Link leadingIcon="arrow_back">Back</Link>
      <Link trailingIcon="open_in_new">Open in new tab</Link>
      <Link leadingIcon="download" intent="neutral">
        Download file
      </Link>
    </Stack>
  ),
};

/** Disabled. */
export const Disabled: Story = {
  render: () => (
    <Stack>
      <Link disabled>Disabled link</Link>
      <Link disabled trailingIcon="open_in_new">
        Disabled with icon
      </Link>
    </Stack>
  ),
};

/** Inline within a sentence. */
export const Inline: Story = {
  render: () => (
    <Text style={{ fontSize: 14, color: '#374151', maxWidth: 360 }}>
      Read our{' '}
      <Link size="default" underline="always">
        terms of service
      </Link>{' '}
      before continuing.
    </Text>
  ),
};

/** Full matrix — every intent × size. */
export const Matrix: Story = {
  render: () => {
    const intents = ['neutral', 'brand', 'danger'] as const;
    const sizes = ['small', 'default', 'large'] as const;
    return (
      <View style={{ gap: 24 }}>
        {intents.map((intent) => (
          <View key={intent} style={{ gap: 12, alignItems: 'flex-start' }}>
            <SectionLabel>{intent}</SectionLabel>
            {sizes.map((size) => (
              <Link key={size} intent={intent} size={size} trailingIcon="open_in_new">
                {`${intent} ${size}`}
              </Link>
            ))}
          </View>
        ))}
      </View>
    );
  },
};

function DensityColumn({
  density,
}: {
  density: 'compact' | 'default' | 'comfortable';
}) {
  return (
    <ThemeProvider density={density}>
      <View style={{ gap: 8, alignItems: 'flex-start' }}>
        <SectionLabel>{density}</SectionLabel>
        <Link leadingIcon="link" trailingIcon="open_in_new">
          Link with icons
        </Link>
      </View>
    </ThemeProvider>
  );
}

/** Density only changes the icon/label gap. */
export const DensityComparison: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => (
    <View style={{ gap: 24 }}>
      <DensityColumn density="compact" />
      <DensityColumn density="default" />
      <DensityColumn density="comfortable" />
    </View>
  ),
};
