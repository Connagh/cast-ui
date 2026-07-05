import type { ComponentDoc } from './types';

export const navigation: ComponentDoc[] = [
  {
    slug: 'tabs',
    name: 'Tabs',
    category: 'Navigation',
    summary: 'Underline tab bar for switching views in place.',
    description:
      'Tabs switch between views that live in the same place. The container owns the selection; each Tab carries a value. Intent colours only the selected tab, so the bar stays quiet.',
    importNames: 'Tabs, Tab',
    props: [
      { name: 'value', type: 'string', description: 'The selected tab value.' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'Selection handler.' },
      { name: 'intent', type: "'neutral' | 'brand' | 'danger'", default: "'neutral'", description: "Selected tab's label and underline colour." },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Padding and label scale.' },
    ],
    subProps: [
      {
        title: 'Tab',
        rows: [
          { name: 'value', type: 'string', description: 'Identifies the tab.' },
          { name: 'children', type: 'string', description: 'The tab label.' },
          { name: 'leadingIcon', type: 'string | ReactNode', description: 'Icon before the label.' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Locks the tab.' },
        ],
      },
    ],
    examples: [
      {
        title: 'Sections of a page',
        code: `function Demo() {
  const [tab, setTab] = useState('overview');
  return (
    <View style={{ gap: 16, width: 380 }}>
      <Tabs value={tab} onValueChange={setTab} intent="brand">
        <Tab value="overview">Overview</Tab>
        <Tab value="activity" leadingIcon="history">Activity</Tab>
        <Tab value="settings" leadingIcon="settings">Settings</Tab>
      </Tabs>
      <Text type="body-sm">{'Showing: ' + tab}</Text>
    </View>
  );
}`,
      },
    ],
    dos: ['Keep tab labels to one or two words.', 'Preserve state within a tab when the user switches away and back.'],
    donts: ["Don't use tabs as steps in a flow. Steps have order; tabs don't.", "Don't nest tab bars."],
    related: ['toggle-button-group', 'breadcrumbs', 'app-bar'],
  },
  {
    slug: 'breadcrumbs',
    name: 'Breadcrumbs',
    category: 'Navigation',
    summary: 'The trail from home to here.',
    description:
      'Breadcrumbs show where the user is in a hierarchy and let them jump back up. The last item is the current page and renders as plain text.',
    importNames: 'Breadcrumbs, Breadcrumb',
    props: [
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Label scale and gaps.' },
      { name: 'separator', type: 'string', default: "'chevron_right'", description: 'The glyph between entries.' },
    ],
    subProps: [
      {
        title: 'Breadcrumb',
        rows: [
          { name: 'children', type: 'string', description: 'The entry label.' },
          { name: 'current', type: 'boolean', default: 'false', description: 'Marks the current page. Renders as text.' },
          { name: 'onPress', type: '() => void', description: 'Navigate to this level.' },
        ],
      },
    ],
    examples: [
      {
        title: 'Three levels deep',
        code: `<Breadcrumbs>
  <Breadcrumb onPress={() => {}}>Home</Breadcrumb>
  <Breadcrumb onPress={() => {}}>Components</Breadcrumb>
  <Breadcrumb current>Breadcrumbs</Breadcrumb>
</Breadcrumbs>`,
      },
    ],
    dos: ['Show the real hierarchy, not the browsing history.'],
    donts: ["Don't show breadcrumbs on top-level pages. There's nowhere up to go."],
    related: ['app-bar', 'tabs', 'link'],
  },
  {
    slug: 'app-bar',
    name: 'AppBar',
    category: 'Navigation',
    summary: 'Top bar with leading control, title, and actions.',
    description:
      'AppBar heads a screen: a back button or menu on the left, the title, actions on the right. Prominence picks the surface; bold fills with the intent colour.',
    importNames: 'AppBar',
    props: [
      { name: 'title', type: 'string', description: 'The screen title.' },
      { name: 'leadingIcon', type: 'string | ReactNode', description: 'Left control, like arrow_back or menu.' },
      { name: 'onLeadingPress', type: '() => void', description: 'Left control handler.' },
      { name: 'trailing', type: 'ReactNode', description: 'Right-side actions slot.' },
      { name: 'leading', type: 'ReactNode', description: 'Custom leading slot. Wins over leadingIcon.' },
      { name: 'intent', type: "'neutral' | 'brand' | 'danger'", default: "'neutral'", description: 'Colour scheme.' },
      { name: 'prominence', type: "'default' | 'bold' | 'subtle'", default: "'default'", description: 'Plain with divider, filled, or transparent.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Bar padding and title scale.' },
      { name: 'align', type: "'start' | 'center'", default: "'start'", description: 'Title alignment.' },
    ],
    examples: [
      {
        title: 'Detail screen bar',
        code: `<View style={{ width: 380 }}>
  <AppBar
    title="Project settings"
    leadingIcon="arrow_back"
    onLeadingPress={() => {}}
    trailing={<Button size="small" prominence="subtle" leadingIcon="more_vert" accessibilityLabel="More">{''}</Button>}
  />
</View>`,
        centered: false,
      },
      {
        title: 'Bold brand bar',
        code: `<View style={{ width: 380 }}>
  <AppBar intent="brand" prominence="bold" align="center" title="Inbox" leadingIcon="menu" onLeadingPress={() => {}} />
</View>`,
        centered: false,
      },
    ],
    dos: ['Keep to one to three actions. Overflow the rest into a Menu.'],
    donts: ["Don't stack an AppBar inside scrolling content. It heads the screen."],
    related: ['tabs', 'drawer', 'breadcrumbs'],
  },
  {
    slug: 'link',
    name: 'Link',
    category: 'Navigation',
    summary: 'Inline or standalone text link.',
    description:
      'Link navigates. On the web an href renders a real anchor through react-native-web; on native, onPress drives navigation. Brand-coloured by default.',
    importNames: 'Link',
    props: [
      { name: 'children', type: 'string', description: 'The link text.' },
      { name: 'intent', type: "'neutral' | 'brand' | 'danger'", default: "'brand'", description: 'Link colour.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Type scale.' },
      { name: 'underline', type: "'none' | 'hover' | 'always'", default: "'hover'", description: 'When the underline shows.' },
      { name: 'href', type: 'string', description: 'Real anchor destination on web.' },
      { name: 'onPress', type: '() => void', description: 'Navigation handler.' },
      { name: 'leadingIcon / trailingIcon', type: 'string | ReactNode', description: 'Icons around the text.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Muted, inert.' },
    ],
    examples: [
      {
        title: 'Kinds of links',
        code: `<View style={{ gap: 10, alignItems: 'flex-start' }}>
  <Link href="https://github.com/Connagh/cast-ui" trailingIcon="open_in_new">View the source</Link>
  <Link underline="always" onPress={() => {}}>Always underlined</Link>
  <Link intent="neutral" onPress={() => {}}>Quiet neutral link</Link>
  <Link intent="danger" onPress={() => {}}>Remove my account</Link>
</View>`,
      },
    ],
    dos: ['Use links for navigation and buttons for actions. The reader can feel the difference.'],
    donts: ["Don't write 'click here'. Name the destination."],
    related: ['button', 'breadcrumbs', 'text'],
  },
  {
    slug: 'list',
    name: 'List',
    category: 'Navigation',
    summary: 'Vertical list with rows, subheaders, and dividers.',
    description:
      'List renders rows of things: settings, results, navigation. Compose ListItem with icons, descriptions, and press handlers; group with ListSubheader and ListDivider.',
    importNames: 'List, ListItem, ListSubheader, ListDivider',
    props: [
      { name: 'children', type: 'ReactNode', description: 'ListItem, ListSubheader, and ListDivider rows.' },
      { name: 'style', type: 'ViewStyle', description: 'Outer container override. Row spacing follows the density theme.' },
    ],
    subProps: [
      {
        title: 'ListItem',
        rows: [
          { name: 'children', type: 'string', description: 'The row label.' },
          { name: 'description', type: 'string', description: 'Second line of quieter text.' },
          { name: 'icon', type: 'string | ReactNode', description: 'Leading icon.' },
          { name: 'trailingIcon', type: 'string | ReactNode', description: 'Trailing icon, like chevron_right.' },
          { name: 'selected', type: 'boolean', default: 'false', description: 'Selected styling.' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Muted, inert.' },
          { name: 'onPress', type: '() => void', description: 'Makes the row pressable.' },
        ],
      },
    ],
    examples: [
      {
        title: 'A settings list',
        code: `<View style={{ width: 340 }}>
  <List>
    <ListSubheader>Account</ListSubheader>
    <ListItem icon="person" description="Name, avatar, email" trailingIcon="chevron_right" onPress={() => {}}>
      Profile
    </ListItem>
    <ListItem icon="notifications" description="What we send and when" trailingIcon="chevron_right" onPress={() => {}}>
      Notifications
    </ListItem>
    <ListDivider />
    <ListSubheader>Danger zone</ListSubheader>
    <ListItem icon="logout" onPress={() => {}}>Sign out</ListItem>
  </List>
</View>`,
        centered: false,
      },
    ],
    dos: ['Use the description line instead of cramming detail into the label.'],
    donts: ["Don't use List for columnar data. That's a Table."],
    related: ['table', 'menu', 'card'],
  },
];
