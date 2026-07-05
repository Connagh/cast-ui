import type { ComponentDoc } from './types';

export const dataComponents: ComponentDoc[] = [
  {
    slug: 'table',
    name: 'Table',
    category: 'Data',
    summary: 'Rows and columns, striped and hoverable.',
    description:
      'Table lays out real columnar data. Compose head, body, rows, and cells; stripe long bodies, highlight on hover, and make rows pressable when they lead somewhere.',
    importNames: 'Table, TableHead, TableBody, TableRow, TableCell',
    props: [
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Cell padding and type scale.' },
      { name: 'striped', type: 'boolean', default: 'false', description: 'Alternate body row tint.' },
      { name: 'hoverable', type: 'boolean', default: 'false', description: 'Row highlight under the pointer.' },
    ],
    subProps: [
      {
        title: 'TableRow / TableCell',
        rows: [
          { name: 'TableRow onPress', type: '() => void', description: 'Makes the row selectable.' },
          { name: 'TableCell flex', type: 'number', default: '1', description: 'Column width share.' },
          { name: 'TableCell width', type: 'number', description: 'Fixed column width.' },
          { name: 'TableCell numeric', type: 'boolean', default: 'false', description: 'Right-aligns numbers.' },
          { name: 'TableCell align', type: "'left' | 'center' | 'right'", description: 'Explicit alignment.' },
        ],
      },
    ],
    examples: [
      {
        title: 'An inventory table',
        code: `<View style={{ width: 460 }}>
  <Table size="small" striped hoverable>
    <TableHead>
      <TableRow>
        <TableCell flex={2}><Text type="label-sm">Item</Text></TableCell>
        <TableCell numeric><Text type="label-sm">Stock</Text></TableCell>
        <TableCell><Text type="label-sm">Status</Text></TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow onPress={() => {}}>
        <TableCell flex={2}><Text type="body-sm">Butter croissant</Text></TableCell>
        <TableCell numeric><Text type="body-sm">64</Text></TableCell>
        <TableCell><Badge intent="brand" size="small">Fresh</Badge></TableCell>
      </TableRow>
      <TableRow onPress={() => {}}>
        <TableCell flex={2}><Text type="body-sm">Belgian waffle</Text></TableCell>
        <TableCell numeric><Text type="body-sm">51</Text></TableCell>
        <TableCell><Badge size="small">New</Badge></TableCell>
      </TableRow>
      <TableRow onPress={() => {}}>
        <TableCell flex={2}><Text type="body-sm">Buttered toast</Text></TableCell>
        <TableCell numeric><Text type="body-sm">12</Text></TableCell>
        <TableCell><Badge intent="danger" size="small" dot>Low</Badge></TableCell>
      </TableRow>
    </TableBody>
  </Table>
</View>`,
        centered: false,
      },
    ],
    dos: ['Right-align numbers with the numeric prop so magnitudes line up.'],
    donts: ["Don't reach for Table when rows are really list items with one value."],
    related: ['list', 'card', 'code-block'],
  },
  {
    slug: 'code-block',
    name: 'CodeBlock',
    category: 'Data',
    summary: 'Monospaced code on a subtle surface, with copy.',
    description:
      'CodeBlock shows code: JetBrains Mono, optional header with a title and language tag, a copy button, and optional line numbers. Long lines scroll instead of wrapping. Every snippet on this site renders through it.',
    importNames: 'CodeBlock',
    props: [
      { name: 'children', type: 'string', description: 'The code. Newlines split into lines.' },
      { name: 'title', type: 'string', description: 'Filename or label in the header.' },
      { name: 'language', type: 'string', description: 'Language tag in the header. Display only.' },
      { name: 'showCopy', type: 'boolean', default: 'true', description: 'The copy button.' },
      { name: 'showLineNumbers', type: 'boolean', default: 'false', description: 'A line-number gutter.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Padding and mono scale.' },
      { name: 'onCopy', type: '(code: string) => void', description: 'Called with the code on copy.' },
    ],
    examples: [
      {
        title: 'With a header',
        code: `<CodeBlock title="App.tsx" language="tsx" showLineNumbers style={{ width: 420 }}>
{\`import { ThemeProvider, Button } from '@castui/cast-ui';

export function App() {
  return (
    <ThemeProvider>
      <Button intent="brand" prominence="bold">Save</Button>
    </ThemeProvider>
  );
}\`}
</CodeBlock>`,
        centered: false,
      },
    ],
    dos: ['Give blocks a title when the filename matters.'],
    donts: ["Don't use CodeBlock for one inline identifier inside a sentence."],
    related: ['table', 'text'],
  },
];
