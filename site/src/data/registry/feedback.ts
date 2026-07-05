import type { ComponentDoc } from './types';

export const feedback: ComponentDoc[] = [
  {
    slug: 'badge',
    name: 'Badge',
    category: 'Display & feedback',
    summary: 'Small pill for status, counts, and labels.',
    description:
      'Badge marks status: a count, a state, a category. It is display-only; if it should respond to a press, reach for Chip.',
    importNames: 'Badge',
    props: [
      { name: 'children', type: 'string', description: 'The badge text.' },
      { name: 'intent', type: "'neutral' | 'brand' | 'danger'", default: "'neutral'", description: 'The status colour.' },
      { name: 'variant', type: "'solid' | 'subtle' | 'outline'", default: "'subtle'", description: 'Fill strength.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Padding and label scale.' },
      { name: 'dot', type: 'boolean', default: 'false', description: 'Leading status dot.' },
      { name: 'leadingIcon / trailingIcon', type: 'string | ReactNode', description: 'Icons around the text.' },
    ],
    examples: [
      {
        title: 'Statuses',
        code: `<View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
  <Badge intent="brand" variant="solid">New</Badge>
  <Badge intent="brand">Beta</Badge>
  <Badge dot>Draft</Badge>
  <Badge intent="danger" dot>2 failing</Badge>
  <Badge variant="outline" leadingIcon="schedule">Pending</Badge>
</View>`,
      },
    ],
    dos: ['Keep badge text to one or two words.', 'Use the dot for live states like online or failing.'],
    donts: ["Don't make badges pressable in spirit. If it filters or removes, it's a Chip."],
    related: ['chip', 'alert'],
  },
  {
    slug: 'alert',
    name: 'Alert',
    category: 'Display & feedback',
    summary: 'Inline message that explains a state.',
    description:
      'Alert sits inside the page flow and explains something the user should know: success, guidance, or a problem. It stays until the situation changes, unlike a Toast.',
    importNames: 'Alert',
    props: [
      { name: 'title', type: 'string', description: 'The headline.' },
      { name: 'description', type: 'string', description: 'Supporting copy.' },
      { name: 'intent', type: "'neutral' | 'brand' | 'danger'", default: "'neutral'", description: 'What kind of message it is.' },
      { name: 'variant', type: "'subtle' | 'outline'", default: "'subtle'", description: 'Tinted fill or border.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Padding and type scale.' },
      { name: 'icon', type: 'string | ReactNode | null', description: 'Override the intent icon, or null to hide it.' },
      { name: 'onClose', type: '() => void', description: 'Shows a close button.' },
    ],
    examples: [
      {
        title: 'The three intents',
        code: `<View style={{ gap: 12, width: 420 }}>
  <Alert intent="brand" title="Sync complete" description="All 54 motion tokens match the Figma kit." />
  <Alert title="Heads up" description="Fonts are loaded by your app, not the library." />
  <Alert intent="danger" title="Publish failed" description="The npm token has expired." onClose={() => {}} />
</View>`,
        centered: false,
      },
    ],
    dos: ['Say what happened and what to do next in the description.'],
    donts: ["Don't stack more than one alert per state. Merge them.", "Don't use an Alert for a fleeting confirmation. That's a Toast."],
    related: ['toast', 'badge', 'dialog'],
  },
  {
    slug: 'toast',
    name: 'Toast',
    category: 'Display & feedback',
    summary: 'Brief confirmation that something happened.',
    description:
      'Toast confirms an action just happened: saved, sent, copied. It is the card itself; your app positions it and decides how long it stays.',
    importNames: 'Toast',
    props: [
      { name: 'title', type: 'string', description: 'The headline.' },
      { name: 'children', type: 'string', description: 'Optional body copy.' },
      { name: 'intent', type: "'neutral' | 'brand' | 'danger'", default: "'neutral'", description: 'The tone.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Padding and type scale.' },
      { name: 'icon', type: 'string | ReactNode | null', description: 'Override the intent icon.' },
      { name: 'onClose', type: '() => void', description: 'Shows a dismiss button.' },
    ],
    examples: [
      {
        title: 'Confirmations',
        code: `<View style={{ gap: 12 }}>
  <Toast intent="brand" title="Theme exported" onClose={() => {}}>
    cast-theme.json is in your downloads.
  </Toast>
  <Toast intent="danger" title="Copy failed" onClose={() => {}} />
</View>`,
      },
    ],
    dos: ['Keep toasts to one line where you can. They are glanced at, not read.'],
    donts: ["Don't put required actions in a toast. If the user must act, use a Dialog."],
    related: ['alert', 'dialog'],
  },
  {
    slug: 'card',
    name: 'Card',
    category: 'Display & feedback',
    summary: 'The content container: image, title, body, actions.',
    description:
      'Card groups related content on a surface: an image or icon, a title and subtitle, body copy, and an action row. Or hand it children and use it as a plain surface.',
    importNames: 'Card',
    props: [
      { name: 'variant', type: "'outline' | 'elevated'", default: "'outline'", description: 'Border or shadow.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Padding and type scale.' },
      { name: 'image', type: 'ImageSource', description: 'Cover image on top.' },
      { name: 'icon', type: 'string | ReactNode', description: 'Leading icon in the header.' },
      { name: 'title / subtitle', type: 'string', description: 'Header text.' },
      { name: 'body', type: 'string', description: 'Main copy.' },
      { name: 'actions', type: 'ReactNode', description: 'Action row, usually Buttons.' },
      { name: 'children', type: 'ReactNode', description: 'Custom content instead of the structured slots.' },
    ],
    examples: [
      {
        title: 'A product card',
        code: `<Card
  variant="elevated"
  title="Canvas backpack"
  subtitle="Water resistant"
  body="A weekend bag that shrugs off rain, with a padded 16-inch laptop sleeve."
  actions={
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <Button intent="brand" prominence="bold" size="small" onPress={() => {}}>Add to cart</Button>
      <Button prominence="subtle" size="small" onPress={() => {}}>Details</Button>
    </View>
  }
  style={{ width: 320 }}
/>`,
      },
      {
        title: 'As a plain surface',
        code: `<Card style={{ width: 320 }}>
  <View style={{ gap: 8 }}>
    <Text type="label-sm">MONTHLY REVENUE</Text>
    <Text type="display-sm">£18,240</Text>
    <Badge intent="brand" leadingIcon="trending_up">+12% on last month</Badge>
  </View>
</Card>`,
      },
    ],
    dos: ['Give every card in a grid the same structure so the eye can scan.'],
    donts: ["Don't nest cards inside cards. Flatten or use Dividers."],
    related: ['list', 'table', 'dialog'],
  },
  {
    slug: 'avatar',
    name: 'Avatar',
    category: 'Display & feedback',
    summary: 'A person or entity: image, initials, or icon.',
    description:
      'Avatar shows who: an image when you have one, initials when you have a name, an icon as the last resort. It falls back across the three gracefully.',
    importNames: 'Avatar',
    props: [
      { name: 'source', type: 'ImageSource', description: 'Profile image.' },
      { name: 'initials', type: 'string', description: 'Up to two letters, shown when there is no image.' },
      { name: 'icon', type: 'string | ReactNode', default: "'person'", description: 'Fallback glyph.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Diameter.' },
    ],
    examples: [
      {
        title: 'The three fallbacks',
        code: `<View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
  <Avatar source={{ uri: 'https://i.pravatar.cc/96?img=5' }} />
  <Avatar initials="CB" />
  <Avatar />
  <Avatar initials="XL" size="large" />
</View>`,
      },
    ],
    dos: ['Always provide initials when you know the name, so the image failing still reads.'],
    donts: ["Don't stretch avatars to arbitrary sizes with styles. Use the size prop."],
    related: ['badge', 'list'],
  },
  {
    slug: 'skeleton',
    name: 'Skeleton',
    category: 'Display & feedback',
    summary: 'Loading placeholder in the shape of the content.',
    description:
      'Skeleton holds space while content loads, pulsing gently. Match the shape to what will appear: text lines, a circle for an avatar, a rectangle for an image. The pulse reads its timing from loop/pulse and stops when the OS asks for reduced motion.',
    importNames: 'Skeleton',
    props: [
      { name: 'shape', type: "'text' | 'circle' | 'rectangle'", default: "'text'", description: 'The placeholder shape.' },
      { name: 'width / height', type: 'number | string', description: 'Dimensions. Text defaults to a line height.' },
      { name: 'radius', type: 'number', description: 'Corner radius for rectangles.' },
      { name: 'animated', type: 'boolean', default: 'true', description: 'The pulse. Honours reduce-motion.' },
    ],
    examples: [
      {
        title: 'A loading list row',
        code: `<View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', width: 320 }}>
  <Skeleton shape="circle" width={40} height={40} />
  <View style={{ flex: 1, gap: 8 }}>
    <Skeleton width="60%" />
    <Skeleton width="90%" />
  </View>
</View>`,
      },
    ],
    dos: ['Mirror the final layout so nothing jumps when content lands.'],
    donts: ["Don't mix skeletons and spinners in one view. Pick one loading story."],
    motionRole: 'loop/pulse: 700 ms half-cycle, opacity 1 to 0.5, honours reduce-motion.',
    related: ['spinner', 'progress'],
  },
  {
    slug: 'progress',
    name: 'Progress',
    category: 'Display & feedback',
    summary: 'Linear progress, determinate or sweeping.',
    description:
      'Progress shows how far along something is. Give it a value for a percentage, or omit the value for the indeterminate sweep while duration is unknown.',
    importNames: 'Progress',
    props: [
      { name: 'value', type: 'number | null', description: '0–100 for determinate. Omit or null for the sweep.' },
      { name: 'intent', type: "'neutral' | 'brand' | 'danger'", default: "'brand'", description: 'Fill colour.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Track thickness.' },
    ],
    examples: [
      {
        title: 'Determinate and indeterminate',
        code: `<View style={{ gap: 16, width: 320 }}>
  <Progress value={72} />
  <Progress value={100} intent="brand" size="small" />
  <Progress />
</View>`,
      },
    ],
    dos: ['Prefer a real value the moment you can compute one.'],
    donts: ["Don't fake progress with a timer. Use the sweep instead."],
    motionRole: 'loop/indeterminate: 1200 ms sweep, honours reduce-motion.',
    related: ['spinner', 'skeleton', 'slider'],
  },
  {
    slug: 'spinner',
    name: 'Spinner',
    category: 'Display & feedback',
    summary: 'Indeterminate circular loader for short waits.',
    description:
      'Spinner is the small rotating arc for a short or unknown wait. Use Progress when you can show a percentage; use Skeleton when the page shape is known.',
    importNames: 'Spinner',
    props: [
      { name: 'intent', type: "'neutral' | 'brand' | 'danger'", default: "'neutral'", description: 'Arc colour.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Diameter and stroke.' },
      { name: 'accessibilityLabel', type: 'string', default: "'Loading'", description: 'Announced to screen readers.' },
    ],
    examples: [
      {
        title: 'Sizes and intents',
        code: `<View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
  <Spinner size="small" />
  <Spinner intent="brand" />
  <Spinner intent="brand" size="large" />
</View>`,
      },
      {
        title: 'In a loading veil',
        code: `<View style={{ width: 320, height: 140 }}>
  <Card style={{ flex: 1 }}>
    <Text type="body-md">Content behind the veil</Text>
  </Card>
  <Backdrop open invisible={false} style={{ position: 'absolute', borderRadius: 12 }}>
    <Spinner intent="brand" size="large" />
  </Backdrop>
</View>`,
      },
    ],
    dos: ['Pair it with a short label when the wait can pass three seconds.'],
    donts: ["Don't rotate your own icons for loading. This is the loading story."],
    motionRole: 'loop/spin: 800 ms rotation, linear. The loop never starts under reduce-motion.',
    related: ['progress', 'skeleton', 'backdrop'],
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    category: 'Display & feedback',
    summary: 'A short hint on hover or focus.',
    description:
      'Tooltip names or explains a control in a few words. It is the smallest overlay: text only, no actions, gone on blur.',
    importNames: 'Tooltip',
    props: [
      { name: 'children', type: 'string', description: 'The hint text.' },
      { name: 'direction', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Where the bubble sits.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Padding and type scale.' },
      { name: 'hasArrow', type: 'boolean', default: 'true', description: 'The pointer arrow.' },
    ],
    examples: [
      {
        title: 'Directions',
        code: `<View style={{ flexDirection: 'row', gap: 24 }}>
  <Tooltip direction="top">Copy to clipboard</Tooltip>
  <Tooltip direction="bottom" hasArrow={false}>No arrow</Tooltip>
</View>`,
      },
    ],
    dos: ['Keep it under about eight words. It is a label, not a paragraph.'],
    donts: ["Don't hide required information in a tooltip. Mobile users may never see it."],
    related: ['popover', 'toast'],
  },
];
