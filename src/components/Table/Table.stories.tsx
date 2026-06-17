import React, { useState } from 'react';
import { View, Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Table, TableHead, TableBody, TableRow, TableCell } from './Table';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  decorators: [
    (Story) => (
      <View style={{ padding: 24, width: 520 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    size: { control: 'select', options: ['small', 'default', 'large'] },
    striped: { control: 'boolean' },
    hoverable: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

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

const ROWS = [
  { name: 'Ada Lovelace', role: 'Engineer', commits: 128 },
  { name: 'Alan Turing', role: 'Researcher', commits: 342 },
  { name: 'Grace Hopper', role: 'Admiral', commits: 87 },
];

const HeaderRow = () => (
  <TableRow>
    <TableCell>Name</TableCell>
    <TableCell>Role</TableCell>
    <TableCell numeric>Commits</TableCell>
  </TableRow>
);

/** Interactive playground. */
export const Playground: Story = {
  args: { size: 'default', striped: false, hoverable: true },
  render: (args) => (
    <Table {...args}>
      <TableHead>
        <HeaderRow />
      </TableHead>
      <TableBody>
        {ROWS.map((r) => (
          <TableRow key={r.name}>
            <TableCell>{r.name}</TableCell>
            <TableCell>{r.role}</TableCell>
            <TableCell numeric>{String(r.commits)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/** Plain table. */
export const Basic: Story = {
  render: () => (
    <Table>
      <TableHead>
        <HeaderRow />
      </TableHead>
      <TableBody>
        {ROWS.map((r) => (
          <TableRow key={r.name}>
            <TableCell>{r.name}</TableCell>
            <TableCell>{r.role}</TableCell>
            <TableCell numeric>{String(r.commits)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/** Striped rows. */
export const Striped: Story = {
  render: () => (
    <Table striped>
      <TableHead>
        <HeaderRow />
      </TableHead>
      <TableBody>
        {ROWS.map((r) => (
          <TableRow key={r.name}>
            <TableCell>{r.name}</TableCell>
            <TableCell>{r.role}</TableCell>
            <TableCell numeric>{String(r.commits)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

/** Selectable rows — click to select. */
export const Selectable: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => {
    const Demo = () => {
      const [selected, setSelected] = useState<string | null>('Alan Turing');
      return (
        <Table hoverable>
          <TableHead>
            <HeaderRow />
          </TableHead>
          <TableBody>
            {ROWS.map((r) => (
              <TableRow
                key={r.name}
                selected={selected === r.name}
                onPress={() => setSelected(r.name)}
              >
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.role}</TableCell>
                <TableCell numeric>{String(r.commits)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    };
    return <Demo />;
  },
};

/** Sizes — small, default, large. */
export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 20 }}>
      {(['small', 'default', 'large'] as const).map((size) => (
        <View key={size} style={{ gap: 6 }}>
          <SectionLabel>{size}</SectionLabel>
          <Table size={size} striped>
            <TableHead>
              <HeaderRow />
            </TableHead>
            <TableBody>
              {ROWS.slice(0, 2).map((r) => (
                <TableRow key={r.name}>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.role}</TableCell>
                  <TableCell numeric>{String(r.commits)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </View>
      ))}
    </View>
  ),
};

/** Dark mode. */
export const DarkMode: Story = {
  render: () => (
    <ThemeProvider colorMode="dark">
      <View style={{ padding: 16, backgroundColor: '#111827' }}>
        <Table striped hoverable>
          <TableHead>
            <HeaderRow />
          </TableHead>
          <TableBody>
            {ROWS.map((r) => (
              <TableRow key={r.name}>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.role}</TableCell>
                <TableCell numeric>{String(r.commits)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </View>
    </ThemeProvider>
  ),
};

/** Density changes cell padding. */
export const DensityComparison: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => (
    <View style={{ gap: 20 }}>
      {(['compact', 'default', 'comfortable'] as const).map((density) => (
        <ThemeProvider key={density} density={density}>
          <View style={{ gap: 6 }}>
            <SectionLabel>{density}</SectionLabel>
            <Table>
              <TableHead>
                <HeaderRow />
              </TableHead>
              <TableBody>
                {ROWS.slice(0, 2).map((r) => (
                  <TableRow key={r.name}>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.role}</TableCell>
                    <TableCell numeric>{String(r.commits)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </View>
        </ThemeProvider>
      ))}
    </View>
  ),
};
