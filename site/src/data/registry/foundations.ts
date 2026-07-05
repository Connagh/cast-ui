import type { ComponentDoc } from './types';

export const foundations: ComponentDoc[] = [
  {
    slug: 'text',
    name: 'Text',
    category: 'Foundations',
    summary: 'The type ramp. Every piece of text on this site goes through it.',
    description:
      'Text renders the shared type ramp: caption, label, body, title, heading, and display scales. Using it everywhere keeps line heights, weights, and letter spacing consistent, and lets a future font theme land in one place.',
    importNames: 'Text',
    props: [
      { name: 'type', type: "'caption' | 'label-sm|md|lg' | 'body-sm|md|lg' | 'title-sm|md|lg' | 'heading-sm|md|lg' | 'display-sm|md|lg'", default: "'body-md'", description: 'Which step of the type ramp to render.' },
      { name: 'children', type: 'string', description: 'The text. Strings only, so the ramp stays consistent.' },
      { name: 'color', type: 'string', default: 'text/primary', description: 'Overrides the text colour. Prefer theme colours.' },
      { name: 'numberOfLines', type: 'number', description: 'Truncates with an ellipsis after this many lines.' },
      { name: 'selectable', type: 'boolean', default: 'false', description: 'Lets the user select and copy the text.' },
    ],
    examples: [
      {
        title: 'The ramp',
        code: `<View style={{ gap: 8 }}>
  <Text type="display-sm">Display</Text>
  <Text type="heading-md">Heading</Text>
  <Text type="title-md">Title</Text>
  <Text type="body-md">Body, for paragraphs and general copy.</Text>
  <Text type="label-md">Label, for controls and small headings.</Text>
  <Text type="caption">Caption, for fine print.</Text>
</View>`,
      },
      {
        title: 'Muted secondary text',
        code: `function Demo() {
  const { scheme } = useTheme();
  return (
    <View style={{ gap: 4 }}>
      <Text type="title-sm">Payments</Text>
      <Text type="body-sm" color={scheme.text.description}>
        Last synced 2 minutes ago
      </Text>
    </View>
  );
}`,
      },
    ],
    dos: [
      'Pick the step by meaning: body for copy, label for controls, heading for page structure.',
      'Use scheme.text.description for secondary copy so it adapts to dark mode.',
      'Cap long paragraphs at a readable width with a maxWidth style.',
    ],
    donts: [
      "Don't set raw fontSize on a Text. If a step is missing, that's a token conversation.",
      "Don't pass JSX children. Compose layout around Text, not inside it.",
      "Don't hardcode hex colours for text. Use the theme.",
    ],
    related: ['icon', 'link'],
  },
  {
    slug: 'icon',
    name: 'Icon',
    category: 'Foundations',
    summary: 'Material Symbols by name, sized and coloured for you.',
    description:
      'Icon renders any Material Symbols Outlined glyph by its name string, through a font ligature. No SVG imports, no icon packages: pass a name, get the glyph. Every component with an icon prop accepts the same name strings.',
    importNames: 'Icon',
    props: [
      { name: 'name', type: 'string', description: 'The Material Symbols name, like "star" or "chevron_right".' },
      { name: 'size', type: "'xs' | 'small' | 'default' | 'large' | number", default: "'default'", description: 'Named scale (12/16/20/24) or exact pixels.' },
      { name: 'color', type: 'string', default: 'text/primary', description: 'Glyph colour. Hosts pass their resolved foreground.' },
      { name: 'fill', type: 'boolean', default: 'false', description: 'The filled style of the glyph.' },
      { name: 'weight', type: '100–700', default: '400', description: 'Stroke weight axis.' },
      { name: 'grade', type: 'number', default: '0', description: 'Grade axis for fine emphasis.' },
      { name: 'opticalSize', type: 'number', description: 'Optical size axis. Defaults to match the pixel size.' },
    ],
    examples: [
      {
        title: 'Names, sizes, colour',
        code: `<View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
  <Icon name="rocket_launch" size="xs" />
  <Icon name="rocket_launch" size="small" />
  <Icon name="rocket_launch" />
  <Icon name="rocket_launch" size="large" color="#2563EB" />
  <Icon name="favorite" size="large" fill color="#E11D48" />
</View>`,
      },
      {
        title: 'Inside other components',
        code: `<View style={{ gap: 12, alignItems: 'flex-start' }}>
  <Button intent="brand" prominence="bold" leadingIcon="add" onPress={() => {}}>
    New project
  </Button>
  <Chip leadingIcon="filter_list" onPress={() => {}}>Filters</Chip>
</View>`,
      },
    ],
    dos: [
      'Browse names at fonts.google.com/icons and pass them as strings.',
      "Pass the host's resolved foreground colour so the icon tracks state.",
      'Use the named sizes. They match the icon variables in the Figma kit.',
    ],
    donts: [
      "Don't install an icon package. The whole glyph set is already available.",
      "Don't hardcode icon hex colours inside components.",
      "If you see the icon's name rendered as a word, the Material Symbols font isn't loaded. Fix the font, not the icon.",
    ],
    related: ['text', 'button'],
  },
  {
    slug: 'divider',
    name: 'Divider',
    category: 'Foundations',
    summary: 'A hairline that separates content.',
    description:
      'Divider draws a one-pixel separator, horizontal or vertical, using the shared border colour so it holds up in both colour modes.',
    importNames: 'Divider',
    props: [
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Direction of the line.' },
      { name: 'color', type: 'string', default: 'overlay border', description: 'Overrides the line colour.' },
    ],
    examples: [
      {
        title: 'Between sections',
        code: `<View style={{ gap: 12, width: 280 }}>
  <Text type="body-md">Account</Text>
  <Divider />
  <Text type="body-md">Notifications</Text>
  <Divider />
  <Text type="body-md">Sign out</Text>
</View>`,
      },
      {
        title: 'Vertical, in a row',
        code: `<View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, height: 24 }}>
  <Text type="body-sm">Docs</Text>
  <Divider orientation="vertical" />
  <Text type="body-sm">Components</Text>
  <Divider orientation="vertical" />
  <Text type="body-sm">Themes</Text>
</View>`,
      },
    ],
    dos: ['Use it to group related rows in lists, menus, and settings screens.'],
    donts: ["Don't build borders out of Dividers. Use borderWidth styles for boxes."],
    related: ['list', 'menu'],
  },
];
