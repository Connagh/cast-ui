import type { ComponentDoc } from './types';

export const inputs: ComponentDoc[] = [
  {
    slug: 'radio',
    name: 'Radio',
    category: 'Actions & inputs',
    summary: 'One choice from a visible set.',
    description:
      'Radio picks exactly one option from a set the user can see. RadioGroup owns the selection; each Radio carries a value and a label.',
    importNames: 'RadioGroup, Radio',
    props: [
      { name: 'value', type: 'string', description: 'RadioGroup: the selected value.' },
      { name: 'onValueChange', type: '(value: string) => void', description: 'RadioGroup: selection handler.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Ring and label scale.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the whole group.' },
    ],
    subProps: [
      {
        title: 'Radio',
        rows: [
          { name: 'value', type: 'string', description: 'The value this option represents.' },
          { name: 'children', type: 'string', description: 'The option label.' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables just this option.' },
        ],
      },
    ],
    examples: [
      {
        title: 'Pick a plan',
        code: `function Demo() {
  const [plan, setPlan] = useState('pro');
  return (
    <RadioGroup value={plan} onValueChange={setPlan}>
      <Radio value="free">Free — 3 projects</Radio>
      <Radio value="pro">Pro — unlimited projects</Radio>
      <Radio value="team">Team — SSO and roles</Radio>
    </RadioGroup>
  );
}`,
      },
    ],
    dos: ['Use radios when the user should compare all options at a glance (2 to 5).'],
    donts: ["Don't use radios past five options. Switch to Select.", "Don't leave a group with nothing selected unless empty is a real state."],
    related: ['checkbox', 'select', 'toggle-button-group'],
  },
  {
    slug: 'toggle',
    name: 'Toggle',
    category: 'Actions & inputs',
    summary: 'An on/off switch that applies immediately.',
    description:
      'Toggle switches a setting on or off with immediate effect. If the change only applies after a Save button, use a Checkbox instead.',
    importNames: 'Toggle',
    props: [
      { name: 'checked', type: 'boolean', default: 'false', description: 'The state.' },
      { name: 'onChange', type: '(checked: boolean) => void', description: 'Change handler.' },
      { name: 'children', type: 'string', description: 'The label beside the switch.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Track and label scale.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Blocks interaction.' },
    ],
    examples: [
      {
        title: 'Instant settings',
        code: `function Demo() {
  const [dark, setDark] = useState(false);
  const [sounds, setSounds] = useState(true);
  return (
    <View style={{ gap: 12 }}>
      <Toggle checked={dark} onChange={setDark}>Dark mode</Toggle>
      <Toggle checked={sounds} onChange={setSounds}>Sounds</Toggle>
      <Toggle checked={false} onChange={() => {}} disabled>Beta features</Toggle>
    </View>
  );
}`,
      },
    ],
    dos: ['Reserve toggles for settings that take effect the moment they flip.'],
    donts: ["Don't use a toggle inside a form that ends in Save. That's a Checkbox."],
    related: ['checkbox', 'toggle-button-group'],
  },
  {
    slug: 'slider',
    name: 'Slider',
    category: 'Actions & inputs',
    summary: 'Drag a thumb to pick a number.',
    description:
      'Slider picks a number in a range by dragging. Built on PanResponder, so it behaves the same on web and native with zero dependencies.',
    importNames: 'Slider',
    props: [
      { name: 'value / defaultValue', type: 'number', description: 'Controlled / uncontrolled value.' },
      { name: 'onValueChange', type: '(value: number) => void', description: 'Fires while dragging and on tap.' },
      { name: 'min / max', type: 'number', default: '0 / 100', description: 'The range.' },
      { name: 'step', type: 'number', default: '1', description: 'Snap increment.' },
      { name: 'intent', type: "'neutral' | 'brand' | 'danger'", default: "'brand'", description: 'Fill and thumb-ring colour.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Track thickness and thumb size.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Blocks interaction.' },
    ],
    examples: [
      {
        title: 'Volume',
        code: `function Demo() {
  const [volume, setVolume] = useState(60);
  return (
    <View style={{ gap: 8, width: 320 }}>
      <Text type="label-md">{'Volume: ' + volume}</Text>
      <Slider value={volume} onValueChange={setVolume} accessibilityLabel="Volume" />
    </View>
  );
}`,
      },
    ],
    dos: ['Show the current value next to the slider. A thumb alone is vague.'],
    donts: ["Don't use a slider for precise entry like a year. Use an Input."],
    related: ['input', 'progress'],
  },
  {
    slug: 'chip',
    name: 'Chip',
    category: 'Actions & inputs',
    summary: 'Compact element for filters, tags, and selections.',
    description:
      'Chip is the small pressable pill: a filter that toggles, a tag that can be removed, a compact choice. Selected state and a remove affordance are built in.',
    importNames: 'Chip',
    props: [
      { name: 'children', type: 'string', description: 'The chip label.' },
      { name: 'intent', type: "'neutral' | 'brand' | 'danger'", default: "'neutral'", description: 'Colour when selected.' },
      { name: 'variant', type: "'outline' | 'subtle'", default: "'outline'", description: 'Border or tinted fill.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Padding and label scale.' },
      { name: 'selected', type: 'boolean', default: 'false', description: 'Selected styling.' },
      { name: 'leadingIcon', type: 'string | ReactNode', description: 'Icon before the label.' },
      { name: 'onPress', type: '() => void', description: 'Makes the chip pressable.' },
      { name: 'onRemove', type: '() => void', description: 'Shows a remove affordance.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Blocks interaction.' },
    ],
    examples: [
      {
        title: 'Filter row',
        code: `function Demo() {
  const [active, setActive] = useState<string[]>(['new']);
  const toggle = (id: string) =>
    setActive((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));
  const filters = ['new', 'popular', 'sale', 'limited'];
  return (
    <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
      {filters.map((f) => (
        <Chip key={f} intent="brand" selected={active.includes(f)} onPress={() => toggle(f)}>
          {f[0].toUpperCase() + f.slice(1)}
        </Chip>
      ))}
    </View>
  );
}`,
      },
      {
        title: 'Removable tags',
        code: `<View style={{ flexDirection: 'row', gap: 8 }}>
  <Chip variant="subtle" onRemove={() => {}}>design</Chip>
  <Chip variant="subtle" onRemove={() => {}}>tokens</Chip>
  <Chip variant="subtle" leadingIcon="bolt" onRemove={() => {}}>motion</Chip>
</View>`,
      },
    ],
    dos: ['Use chips for compact many-of-many filtering above a list or grid.'],
    donts: ["Don't use a chip as the main action on a screen. That's a Button."],
    related: ['badge', 'button', 'toggle-button-group'],
  },
  {
    slug: 'toggle-button-group',
    name: 'ToggleButtonGroup',
    category: 'Actions & inputs',
    summary: 'A segmented row of buttons for one-of or many-of choices.',
    description:
      'ToggleButtonGroup is the segmented control: joined buttons where the selection fills with the intent colour. Exclusive mode picks one; multi mode picks several.',
    importNames: 'ToggleButtonGroup, ToggleButton',
    props: [
      { name: 'exclusive', type: 'boolean', default: 'true', description: 'Single-select (true) or multi-select (false).' },
      { name: 'value / onValueChange', type: 'string | null', description: 'Selection in exclusive mode.' },
      { name: 'values / onValuesChange', type: 'string[]', description: 'Selection in multi mode.' },
      { name: 'intent', type: "'neutral' | 'brand' | 'danger'", default: "'brand'", description: 'Selected segment colour.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Padding and label scale.' },
    ],
    subProps: [
      {
        title: 'ToggleButton',
        rows: [
          { name: 'value', type: 'string', description: 'The value this segment represents.' },
          { name: 'children', type: 'string', description: 'The segment label.' },
          { name: 'leadingIcon', type: 'string | ReactNode', description: 'Icon before (or instead of) the label.' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables this segment.' },
        ],
      },
    ],
    examples: [
      {
        title: 'View switcher',
        code: `function Demo() {
  const [view, setView] = useState<string | null>('list');
  return (
    <ToggleButtonGroup value={view} onValueChange={setView}>
      <ToggleButton value="list" leadingIcon="list">List</ToggleButton>
      <ToggleButton value="grid" leadingIcon="grid_view">Grid</ToggleButton>
      <ToggleButton value="map" leadingIcon="map">Map</ToggleButton>
    </ToggleButtonGroup>
  );
}`,
      },
      {
        title: 'Multi-select formatting',
        code: `function Demo() {
  const [styles, setStyles] = useState<string[]>(['bold']);
  return (
    <ToggleButtonGroup exclusive={false} values={styles} onValuesChange={setStyles}>
      <ToggleButton value="bold" leadingIcon="format_bold" accessibilityLabel="Bold" />
      <ToggleButton value="italic" leadingIcon="format_italic" accessibilityLabel="Italic" />
      <ToggleButton value="underline" leadingIcon="format_underlined" accessibilityLabel="Underline" />
    </ToggleButtonGroup>
  );
}`,
      },
    ],
    dos: ['Use it for 2 to 5 always-visible choices, like view switchers.'],
    donts: ["Don't exceed five segments. Move to Select or Tabs.", "Don't mix it up with Tabs: Tabs change what's on screen, this holds a value."],
    related: ['tabs', 'radio', 'chip'],
  },
];
