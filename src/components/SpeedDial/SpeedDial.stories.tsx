import React from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { SpeedDial, SpeedDialAction, type SpeedDialDirection } from './SpeedDial';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof SpeedDial> = {
  title: 'Components/SpeedDial',
  component: SpeedDial,
  argTypes: {
    icon: { control: 'text' },
    direction: { control: 'select', options: ['up', 'down', 'left', 'right'] },
    intent: { control: 'select', options: ['neutral', 'brand', 'danger'] },
    size: { control: 'select', options: ['small', 'default', 'large'] },
    backdrop: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof SpeedDial>;

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

/** A framed area so the floating dial and its scrim stay contained. */
const Stage = ({
  children,
  align = 'flex-end',
  justify = 'flex-end',
}: {
  children: React.ReactNode;
  align?: 'flex-start' | 'center' | 'flex-end';
  justify?: 'flex-start' | 'center' | 'flex-end';
}) => (
  <View
    style={{
      width: 320,
      height: 280,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      backgroundColor: '#FFFFFF',
      overflow: 'hidden',
      padding: 16,
      alignItems: align,
      justifyContent: justify,
    }}
  >
    {children}
  </View>
);

const Actions = () => (
  <>
    <SpeedDialAction icon="edit" label="Edit" onPress={noop} />
    <SpeedDialAction icon="content_copy" label="Duplicate" onPress={noop} />
    <SpeedDialAction icon="share" label="Share" onPress={noop} />
  </>
);

/** Interactive — press the FAB to fan out. */
export const Playground: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: (args) => (
    <Stage>
      <SpeedDial {...args}>
        <Actions />
      </SpeedDial>
    </Stage>
  ),
  args: { icon: 'add', direction: 'up', intent: 'brand', size: 'default', backdrop: true },
};

/** Open by default (up). */
export const Open: Story = {
  render: () => (
    <Stage>
      <SpeedDial defaultOpen backdrop={false}>
        <Actions />
      </SpeedDial>
    </Stage>
  ),
};

/** Each fan-out direction. */
export const Directions: Story = {
  render: () => {
    const cfg: { direction: SpeedDialDirection; align: any; justify: any }[] = [
      { direction: 'up', align: 'flex-end', justify: 'flex-end' },
      { direction: 'down', align: 'flex-end', justify: 'flex-start' },
      { direction: 'left', align: 'flex-end', justify: 'flex-end' },
      { direction: 'right', align: 'flex-start', justify: 'flex-end' },
    ];
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
        {cfg.map(({ direction, align, justify }) => (
          <View key={direction} style={{ gap: 6 }}>
            <SectionLabel>{direction}</SectionLabel>
            <Stage align={align} justify={justify}>
              <SpeedDial defaultOpen backdrop={false} direction={direction}>
                <Actions />
              </SpeedDial>
            </Stage>
          </View>
        ))}
      </View>
    );
  },
};

/** Intents (FAB fill). */
export const Intents: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      {(['neutral', 'brand', 'danger'] as const).map((intent) => (
        <View key={intent} style={{ gap: 6 }}>
          <SectionLabel>{intent}</SectionLabel>
          <Stage>
            <SpeedDial intent={intent}>
              <Actions />
            </SpeedDial>
          </Stage>
        </View>
      ))}
    </View>
  ),
};

/** Sizes — small, default, large (closed). */
export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 24, alignItems: 'flex-end' }}>
      {(['small', 'default', 'large'] as const).map((size) => (
        <View key={size} style={{ gap: 6, alignItems: 'center' }}>
          <SectionLabel>{size}</SectionLabel>
          <SpeedDial size={size}>
            <Actions />
          </SpeedDial>
        </View>
      ))}
    </View>
  ),
};

/** Density only changes the gap between the FAB and its actions. */
export const DensityComparison: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      {(['compact', 'default', 'comfortable'] as const).map((density) => (
        <ThemeProvider key={density} density={density}>
          <View style={{ gap: 6 }}>
            <SectionLabel>{density}</SectionLabel>
            <Stage>
              <SpeedDial defaultOpen backdrop={false}>
                <Actions />
              </SpeedDial>
            </Stage>
          </View>
        </ThemeProvider>
      ))}
    </View>
  ),
};
