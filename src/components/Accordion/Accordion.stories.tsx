import React from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionItem,
  type AccordionSize,
  type AccordionType,
} from './Accordion';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  decorators: [
    (Story) => (
      <View style={{ padding: 24, width: 420, maxWidth: '100%' }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'single opens one section at a time; multiple opens any number.',
    },
    size: {
      control: 'select',
      options: ['small', 'default', 'large'],
      description: 'Size variant — header padding, gap, and typography.',
    },
    collapsible: {
      control: 'boolean',
      description: 'For type="single", allow closing the open section.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

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

/** A sample accordion with three sections. */
function AccordionDemo({
  type = 'single',
  size,
  collapsible,
  defaultValue = 'shipping',
  withIcons = false,
  withDisabled = false,
}: {
  type?: AccordionType;
  size?: AccordionSize;
  collapsible?: boolean;
  defaultValue?: string | string[];
  withIcons?: boolean;
  withDisabled?: boolean;
}) {
  return (
    <Accordion
      type={type}
      size={size}
      collapsible={collapsible}
      defaultValue={defaultValue}
    >
      <AccordionItem
        value="shipping"
        title="Shipping"
        leadingIcon={withIcons ? 'local_shipping' : undefined}
      >
        Free standard delivery on orders over £50. Most orders arrive within
        three to five working days.
      </AccordionItem>
      <AccordionItem
        value="returns"
        title="Returns"
        leadingIcon={withIcons ? 'undo' : undefined}
      >
        Return any unused item within 30 days for a full refund.
      </AccordionItem>
      <AccordionItem
        value="warranty"
        title="Warranty"
        leadingIcon={withIcons ? 'verified' : undefined}
      >
        Every product is covered by a two year manufacturer warranty.
      </AccordionItem>
      {withDisabled ? (
        <AccordionItem value="legacy" title="Archived policy" disabled>
          This section is unavailable.
        </AccordionItem>
      ) : null}
    </Accordion>
  );
}

/** Interactive playground. */
export const Playground: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  args: { type: 'single', size: 'default', collapsible: true },
  render: (args) => (
    <AccordionDemo
      type={args.type}
      size={args.size}
      collapsible={args.collapsible}
    />
  ),
};

/** Single mode — opening one section closes the others. */
export const Single: Story = {
  render: () => <AccordionDemo type="single" />,
};

/** Multiple mode — sections open and close independently. */
export const Multiple: Story = {
  render: () => (
    <AccordionDemo type="multiple" defaultValue={['shipping', 'warranty']} />
  ),
};

/** Size variants — small, default, large. */
export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 24 }}>
      {(['small', 'default', 'large'] as const).map((size) => (
        <View key={size} style={{ gap: 8 }}>
          <SectionLabel>{size}</SectionLabel>
          <AccordionDemo size={size} />
        </View>
      ))}
    </View>
  ),
};

/** Sections with leading icons. */
export const WithIcons: Story = {
  render: () => <AccordionDemo withIcons />,
};

/** A disabled section is muted and non-interactive. */
export const WithDisabled: Story = {
  render: () => <AccordionDemo withDisabled />,
};

// ---------------------------------------------------------------------------
// Density comparison — header spacing grows with density; typography, the
// chevron, and colours stay constant.
// ---------------------------------------------------------------------------

function DensityColumn({
  density,
}: {
  density: 'compact' | 'default' | 'comfortable';
}) {
  return (
    <ThemeProvider density={density}>
      <View style={{ gap: 8 }}>
        <SectionLabel>{density}</SectionLabel>
        <AccordionDemo />
      </View>
    </ThemeProvider>
  );
}

/** Spacing differs across densities; typography + colours are constant. */
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

/** Full matrix — every size, open and closed. */
export const Matrix: Story = {
  render: () => {
    const sizes = ['small', 'default', 'large'] as const;
    return (
      <View style={{ gap: 24 }}>
        {sizes.map((size) => (
          <View key={size} style={{ gap: 8 }}>
            <SectionLabel>{size}</SectionLabel>
            <AccordionDemo size={size} defaultValue="shipping" />
          </View>
        ))}
      </View>
    );
  },
};
