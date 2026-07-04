import type { ComponentDoc } from './types';

export const overlays: ComponentDoc[] = [
  {
    slug: 'dialog',
    name: 'Dialog',
    category: 'Overlays',
    summary: 'Modal for confirmations and focused tasks.',
    description:
      'Dialog interrupts on purpose: confirm a destructive action, finish a short focused task. Title, description, icon, and two actions are built in; give it children for custom content.',
    importNames: 'Dialog, DialogContent',
    props: [
      { name: 'open', type: 'boolean', description: 'Controls visibility.' },
      { name: 'onClose', type: '() => void', description: 'Backdrop press and close requests.' },
      { name: 'title', type: 'string', description: 'The headline. Required.' },
      { name: 'description', type: 'string', description: 'Supporting copy.' },
      { name: 'icon', type: 'string | ReactNode', description: 'Leading icon above the title.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Card width and type scale.' },
      { name: 'primaryAction', type: '{ label, onPress }', description: 'The main action button.' },
      { name: 'secondaryAction', type: '{ label, onPress }', description: 'The quiet companion.' },
      { name: 'children', type: 'ReactNode', description: 'Custom body content.' },
    ],
    examples: [
      {
        title: 'A destructive confirm',
        code: `function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Button intent="danger" onPress={() => setOpen(true)}>Delete project</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        icon="delete_forever"
        title="Delete this project?"
        description="All 12 screens and their history go with it. This cannot be undone."
        primaryAction={{ label: 'Delete', onPress: () => setOpen(false) }}
        secondaryAction={{ label: 'Cancel', onPress: () => setOpen(false) }}
      />
    </View>
  );
}`,
      },
    ],
    dos: ['Name the consequence in the description, not just "Are you sure?".', 'Let the backdrop press cancel, never confirm.'],
    donts: ["Don't chain dialogs. If a flow needs steps, it needs a screen.", "Don't use a dialog for passive info. That's an Alert."],
    related: ['bottom-sheet', 'drawer', 'toast'],
  },
  {
    slug: 'bottom-sheet',
    name: 'BottomSheet',
    category: 'Overlays',
    summary: 'A surface that slides up from the bottom edge.',
    description:
      'BottomSheet is the thumb-friendly modal: it slides up, hugs its content to about 90% of the screen, then scrolls. The slide uses the shared overlay spring and the scrim fades with transition/standard.',
    importNames: 'BottomSheet, BottomSheetContent',
    props: [
      { name: 'open', type: 'boolean', description: 'Controls visibility.' },
      { name: 'onClose', type: '() => void', description: 'Scrim press and close requests.' },
      { name: 'title', type: 'string', description: 'Heading at the top of the sheet.' },
      { name: 'showHandle', type: 'boolean', default: 'true', description: 'The drag handle affordance.' },
      { name: 'closeOnBackdropPress', type: 'boolean', default: 'true', description: 'Dismiss when the scrim is pressed.' },
      { name: 'children', type: 'ReactNode', description: 'Sheet content.' },
    ],
    examples: [
      {
        title: 'Share sheet',
        code: `function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Button intent="brand" prominence="bold" leadingIcon="ios_share" onPress={() => setOpen(true)}>
        Share
      </Button>
      <BottomSheet open={open} onClose={() => setOpen(false)} title="Share to">
        <List>
          <ListItem icon="link" onPress={() => setOpen(false)}>Copy link</ListItem>
          <ListItem icon="mail" onPress={() => setOpen(false)}>Email</ListItem>
          <ListItem icon="qr_code" onPress={() => setOpen(false)}>QR code</ListItem>
        </List>
      </BottomSheet>
    </View>
  );
}`,
      },
    ],
    dos: ['Use it on phone-shaped screens for choices and quick forms.'],
    donts: ["Don't fill a sheet with a long journey. Past one screenful, navigate instead."],
    motionRole: 'spring/overlay slide + transition/standard scrim fade. Honours reduce-motion.',
    related: ['dialog', 'drawer', 'list'],
  },
  {
    slug: 'drawer',
    name: 'Drawer',
    category: 'Overlays',
    summary: 'A panel that slides in from any edge.',
    description:
      'Drawer slides a panel in from the left, right, top, or bottom. Side drawers make navigation and filters; the motion matches BottomSheet, one spring for every overlay surface.',
    importNames: 'Drawer, DrawerContent',
    props: [
      { name: 'open', type: 'boolean', description: 'Controls visibility.' },
      { name: 'onClose', type: '() => void', description: 'Scrim press and close requests.' },
      { name: 'anchor', type: "'left' | 'right' | 'top' | 'bottom'", default: "'left'", description: 'Which edge it slides from.' },
      { name: 'title', type: 'string', description: 'Heading above the content.' },
      { name: 'closeOnBackdropPress', type: 'boolean', default: 'true', description: 'Dismiss when the scrim is pressed.' },
      { name: 'style', type: 'ViewStyle', description: 'Panel overrides, like a custom width.' },
    ],
    examples: [
      {
        title: 'Right-hand filters',
        code: `function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Button leadingIcon="filter_list" onPress={() => setOpen(true)}>Filters</Button>
      <Drawer open={open} onClose={() => setOpen(false)} anchor="right" title="Filters">
        <View style={{ gap: 12 }}>
          <Checkbox checked onChange={() => {}}>In stock</Checkbox>
          <Checkbox checked={false} onChange={() => {}}>On sale</Checkbox>
          <Divider />
          <Button intent="brand" prominence="bold" onPress={() => setOpen(false)}>Apply</Button>
        </View>
      </Drawer>
    </View>
  );
}`,
      },
    ],
    dos: ['Use left for navigation, right for contextual tools and filters.'],
    donts: ["Don't open a drawer inside a drawer."],
    motionRole: 'spring/overlay slide + transition/standard scrim fade. Honours reduce-motion.',
    related: ['bottom-sheet', 'menu', 'app-bar'],
  },
  {
    slug: 'menu',
    name: 'Menu',
    category: 'Overlays',
    summary: 'Actions anchored to a trigger.',
    description:
      'Menu drops a list of actions from whatever you hand it as a trigger. Items fire and the menu closes; it never holds a value, which is what separates it from Select.',
    importNames: 'Menu, MenuItem, MenuDivider, MenuLabel',
    props: [
      { name: 'trigger', type: 'ReactNode', description: 'The element that opens the menu. Menu owns the press.' },
      { name: 'placement', type: "'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'", default: "'bottom-start'", description: 'Where the overlay opens.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Row height and type scale.' },
      { name: 'open / onOpenChange', type: 'boolean', description: 'Controlled open state. Omit for uncontrolled.' },
      { name: 'closeOnSelect', type: 'boolean', default: 'true', description: 'Close after an item press.' },
    ],
    subProps: [
      {
        title: 'MenuItem',
        rows: [
          { name: 'children', type: 'string', description: 'The action label.' },
          { name: 'leadingIcon', type: 'string | ReactNode', description: 'Icon before the label.' },
          { name: 'intent', type: "'neutral' | 'brand' | 'danger'", default: "'neutral'", description: 'Danger tints a destructive row.' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Greys out the row.' },
          { name: 'onPress', type: '() => void', description: 'The action.' },
        ],
      },
    ],
    examples: [
      {
        title: 'Row actions',
        code: `<Menu trigger={<Button prominence="subtle" leadingIcon="more_vert" accessibilityLabel="Row actions">{''}</Button>}>
  <MenuLabel>Project</MenuLabel>
  <MenuItem leadingIcon="edit" onPress={() => {}}>Rename</MenuItem>
  <MenuItem leadingIcon="content_copy" onPress={() => {}}>Duplicate</MenuItem>
  <MenuDivider />
  <MenuItem leadingIcon="delete" intent="danger" onPress={() => {}}>Delete</MenuItem>
</Menu>`,
      },
    ],
    dos: ['Put the destructive action last, behind a divider, in danger intent.'],
    donts: ["Don't hold selection state in a Menu. That's Select.", "Don't nest submenus. Flatten or move to a screen."],
    related: ['select', 'popover', 'speed-dial'],
  },
  {
    slug: 'popover',
    name: 'Popover',
    category: 'Overlays',
    summary: 'An anchored floating panel for rich content.',
    description:
      'Popover is the floating bubble for content richer than a tooltip: a small form, a legend, a preview. You position it; it draws the surface and the arrow.',
    importNames: 'Popover',
    props: [
      { name: 'children', type: 'ReactNode', description: 'Panel content.' },
      { name: 'direction', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'The edge the arrow points from.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Content padding.' },
      { name: 'hideArrow', type: 'boolean', default: 'false', description: 'Drop the pointer arrow.' },
    ],
    examples: [
      {
        title: 'A small explainer',
        code: `<Popover direction="bottom" style={{ maxWidth: 280 }}>
  <View style={{ gap: 8 }}>
    <Text type="label-md">Density</Text>
    <Text type="body-sm">Compact, default, or comfortable. Spacing changes; colours and type never do.</Text>
    <Button size="small" prominence="subtle" intent="brand" onPress={() => {}}>Learn more</Button>
  </View>
</Popover>`,
      },
    ],
    dos: ['Use it when a tooltip is too small and a dialog is too much.'],
    donts: ["Don't trap critical flows in a popover. They dismiss easily."],
    related: ['tooltip', 'menu', 'dialog'],
  },
  {
    slug: 'backdrop',
    name: 'Backdrop',
    category: 'Overlays',
    summary: 'The dimming scrim behind overlay surfaces.',
    description:
      'Backdrop dims everything behind it: the loading veil over a busy region, or the scrim under a custom overlay. It fades with the standard transition and can centre a child like a Spinner.',
    importNames: 'Backdrop',
    props: [
      { name: 'open', type: 'boolean', description: 'Controls visibility, with a fade.' },
      { name: 'onPress', type: '() => void', description: 'Scrim press, usually dismiss.' },
      { name: 'invisible', type: 'boolean', default: 'false', description: 'Transparent but still catching presses.' },
      { name: 'children', type: 'ReactNode', description: 'Centred content, like a Spinner.' },
    ],
    examples: [
      {
        title: 'A loading veil',
        code: `function Demo() {
  const [busy, setBusy] = useState(false);
  return (
    <View style={{ width: 320, height: 160 }}>
      <Card style={{ flex: 1 }}>
        <View style={{ gap: 8 }}>
          <Text type="title-sm">Report</Text>
          <Button size="small" onPress={() => { setBusy(true); setTimeout(() => setBusy(false), 1500); }}>
            Regenerate
          </Button>
        </View>
      </Card>
      <Backdrop open={busy} style={{ position: 'absolute', borderRadius: 12 }}>
        <Spinner intent="brand" size="large" />
      </Backdrop>
    </View>
  );
}`,
      },
    ],
    dos: ['Scope the veil to the region that is actually busy.'],
    donts: ["Don't stack backdrops. One scrim per overlay story."],
    motionRole: 'transition/standard fade in and out. Honours reduce-motion.',
    related: ['spinner', 'dialog', 'drawer'],
  },
  {
    slug: 'speed-dial',
    name: 'SpeedDial',
    category: 'Overlays',
    summary: 'A floating action button that fans into actions.',
    description:
      'SpeedDial is the round floating button that expands into a small set of labelled actions. Use it when a screen has one primary verb and two or three companions.',
    importNames: 'SpeedDial, SpeedDialAction',
    props: [
      { name: 'icon / openIcon', type: 'string', default: "'add' / 'close'", description: 'FAB glyphs, closed and open.' },
      { name: 'direction', type: "'up' | 'down' | 'left' | 'right'", default: "'up'", description: 'Which way actions fan out.' },
      { name: 'intent', type: "'neutral' | 'brand' | 'danger'", default: "'brand'", description: 'FAB fill.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'FAB and action sizes.' },
      { name: 'open / onOpenChange', type: 'boolean', description: 'Controlled open state.' },
      { name: 'backdrop', type: 'boolean', default: 'true', description: 'Dimming scrim while open.' },
    ],
    subProps: [
      {
        title: 'SpeedDialAction',
        rows: [
          { name: 'icon', type: 'string', description: 'The action glyph.' },
          { name: 'label', type: 'string', description: 'Label beside the action.' },
          { name: 'onPress', type: '() => void', description: 'The action.' },
        ],
      },
    ],
    examples: [
      {
        title: 'Compose actions',
        code: `<View style={{ height: 260, width: 320, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
  <SpeedDial direction="up" backdrop={false}>
    <SpeedDialAction icon="edit" label="New note" onPress={() => {}} />
    <SpeedDialAction icon="photo_camera" label="New photo" onPress={() => {}} />
    <SpeedDialAction icon="mic" label="New voice memo" onPress={() => {}} />
  </SpeedDial>
</View>`,
        centered: false,
      },
    ],
    dos: ['Keep it to two or four actions with clear icons and labels.'],
    donts: ["Don't hide the screen's only action inside a closed SpeedDial."],
    motionRole: 'transition/enter and transition/exit as the actions fan out and back.',
    related: ['button', 'menu'],
  },
  {
    slug: 'accordion',
    name: 'Accordion',
    category: 'Display & feedback',
    summary: 'Stacked sections that expand and collapse.',
    description:
      'Accordion stacks labelled sections and reveals one or many at a time. Good for FAQs and progressive disclosure; the chevron turns with transition/expand.',
    importNames: 'Accordion, AccordionItem',
    props: [
      { name: 'type', type: "'single' | 'multiple'", default: "'single'", description: 'One section open at a time, or many.' },
      { name: 'value / defaultValue', type: 'string | string[]', description: 'Controlled / initial open sections.' },
      { name: 'onValueChange', type: '(value) => void', description: 'Open-state handler.' },
      { name: 'collapsible', type: 'boolean', default: 'true', description: 'In single mode, allow closing the open section.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Row padding and type scale.' },
    ],
    subProps: [
      {
        title: 'AccordionItem',
        rows: [
          { name: 'value', type: 'string', description: 'Identifies the section.' },
          { name: 'title', type: 'string', description: 'The always-visible header.' },
          { name: 'leadingIcon', type: 'string | ReactNode', description: 'Icon before the title.' },
          { name: 'children', type: 'ReactNode', description: 'The revealed content.' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Locks the section.' },
        ],
      },
    ],
    examples: [
      {
        title: 'FAQ',
        code: `<Accordion type="single" defaultValue="shipping" style={{ width: 380 }}>
  <AccordionItem value="shipping" title="How fast is shipping?">
    <Text type="body-sm">Two to four working days in the UK, tracked from dispatch.</Text>
  </AccordionItem>
  <AccordionItem value="returns" title="What is the returns policy?" leadingIcon="undo">
    <Text type="body-sm">Thirty days, no questions, as long as it still has the tags.</Text>
  </AccordionItem>
  <AccordionItem value="warranty" title="Is there a warranty?">
    <Text type="body-sm">Two years on everything we make.</Text>
  </AccordionItem>
</Accordion>`,
      },
    ],
    dos: ['Write headers as the question the content answers.'],
    donts: ["Don't bury a page's main content in a collapsed section."],
    motionRole: 'transition/expand — the chevron rotation on expand and collapse.',
    related: ['list', 'tabs', 'bottom-sheet'],
  },
];
