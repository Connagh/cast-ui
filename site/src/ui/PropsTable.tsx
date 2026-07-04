import React from 'react';
import { View } from 'react-native';
import { Table, TableBody, TableCell, TableHead, TableRow, Text, useTheme } from '@castui/cast-ui';

export type PropRow = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

function Mono({ children, color }: { children: string; color: string }) {
  return (
    <Text type="body-sm" color={color} style={{ fontFamily: 'JetBrains Mono' as never }}>
      {children}
    </Text>
  );
}

export function PropsTable({ rows }: { rows: PropRow[] }) {
  const { scheme, colors } = useTheme();
  return (
    <View>
      <Table size="small" striped>
        <TableHead>
          <TableRow>
            <TableCell width={190}>
              <Text type="label-sm">Prop</Text>
            </TableCell>
            <TableCell flex={2}>
              <Text type="label-sm">Type</Text>
            </TableCell>
            <TableCell width={120}>
              <Text type="label-sm">Default</Text>
            </TableCell>
            <TableCell flex={3}>
              <Text type="label-sm">Description</Text>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell width={190}>
                <Mono color={colors.brand.subtle.default.fg}>{row.name}</Mono>
              </TableCell>
              <TableCell flex={2}>
                <Mono color={scheme.text.description}>{row.type}</Mono>
              </TableCell>
              <TableCell width={120}>
                <Mono color={scheme.text.description}>{row.default ?? '—'}</Mono>
              </TableCell>
              <TableCell flex={3}>
                <Text type="body-sm">{row.description}</Text>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </View>
  );
}
