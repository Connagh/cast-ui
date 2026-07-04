import type { ComponentDoc } from './types';

export const actions: ComponentDoc[] = [
  {
    slug: 'button',
    name: 'Button',
    category: 'Actions & inputs',
    summary: 'The workhorse action: intent, prominence, size.',
    description:
      'Button triggers an action. Its three style props are the vocabulary of the whole library: intent says what it means, prominence says how loud it is, size sets spacing and type. A screen usually gets one bold action and quieter companions.',
    importNames: 'Button',
    props: [
      { name: 'children', type: 'string', description: 'The label. Strings only.' },
      { name: 'intent', type: "'neutral' | 'brand' | 'danger'", default: "'neutral'", description: 'What the action means. Pick by meaning, not colour.' },
      { name: 'prominence', type: "'default' | 'bold' | 'subtle'", default: "'default'", description: 'Outlined, filled, or ghost.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Padding and label scale.' },
      { name: 'leadingIcon', type: 'string | ReactNode', description: 'Icon before the label. Material Symbols name or your own node.' },
      { name: 'trailingIcon', type: 'string | ReactNode', description: 'Icon after the label.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Blocks interaction with shared muted styling.' },
      { name: 'onPress', type: '() => void', description: 'The action.' },
    ],
    examples: [
      {
        title: 'Intent × prominence',
        code: `<View style={{ gap: 12 }}>
  {(['brand', 'neutral', 'danger'] as const).map((intent) => (
    <View key={intent} style={{ flexDirection: 'row', gap: 8 }}>
      <Button intent={intent} prominence="bold" onPress={() => {}}>Bold</Button>
      <Button intent={intent} onPress={() => {}}>Default</Button>
      <Button intent={intent} prominence="subtle" onPress={() => {}}>Subtle</Button>
    </View>
  ))}
</View>`,
      },
      {
        title: 'Sizes and icons',
        code: `<View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
  <Button size="small" intent="brand" prominence="bold" leadingIcon="add" onPress={() => {}}>New</Button>
  <Button intent="brand" prominence="bold" leadingIcon="add" onPress={() => {}}>New</Button>
  <Button size="large" intent="brand" prominence="bold" leadingIcon="add" onPress={() => {}}>New</Button>
</View>`,
      },
      {
        title: 'An action row',
        code: `<View style={{ flexDirection: 'row', gap: 8 }}>
  <Button prominence="subtle" onPress={() => {}}>Cancel</Button>
  <Button intent="brand" prominence="bold" onPress={() => {}}>Save changes</Button>
</View>`,
      },
    ],
    dos: [
      'One bold action per view. Let the rest be default or subtle.',
      'Use danger intent for destructive actions, and pair it with a Dialog confirm.',
      'Keep labels short and verb-first: Save, Delete, Invite.',
    ],
    donts: [
      "Don't colour a button by hardcoding styles. Recolour through the theme.",
      "Don't put JSX inside the label. Strings keep the ramp consistent.",
      "Don't use a Button where a Link is honest: navigation reads better as a link.",
    ],
    related: ['link', 'chip', 'speed-dial', 'toggle-button-group'],
  },
  {
    slug: 'input',
    name: 'Input',
    category: 'Actions & inputs',
    summary: 'Single-line text field with label, helper, and error states.',
    description:
      'Input is the single-line text field. Label, helper text, icons, and the error state are built in, so forms read the same everywhere. It passes through the usual React Native text-input props.',
    importNames: 'Input',
    props: [
      { name: 'label', type: 'string', description: 'Field label above the input.' },
      { name: 'helperText', type: 'string', description: 'Guidance below the field. Turns red when error is set.' },
      { name: 'placeholder', type: 'string', description: 'Hint text when empty.' },
      { name: 'value / defaultValue', type: 'string', description: 'Controlled / uncontrolled value.' },
      { name: 'onChangeText', type: '(text: string) => void', description: 'Change handler.' },
      { name: 'error', type: 'boolean | string', default: 'false', description: 'Error state. A string also replaces the helper text.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Field height and type scale.' },
      { name: 'leadingIcon / trailingIcon', type: 'string | ReactNode', description: 'Icons inside the field.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Blocks editing with muted styling.' },
      { name: '…TextInput props', type: 'secureTextEntry, keyboardType, …', description: 'The usual React Native text-input props pass through.' },
    ],
    examples: [
      {
        title: 'A field',
        code: `function Demo() {
  const [email, setEmail] = useState('');
  return (
    <Input
      label="Email"
      placeholder="you@example.com"
      helperText="We only use this to sign you in."
      value={email}
      onChangeText={setEmail}
      leadingIcon="mail"
      keyboardType="email-address"
      style={{ width: 320 }}
    />
  );
}`,
      },
      {
        title: 'Error state',
        code: `<Input
  label="Workspace name"
  defaultValue="cast ui!"
  error="Only letters, numbers, and dashes."
  style={{ width: 320 }}
/>`,
      },
    ],
    dos: [
      'Always give a field a label. Placeholders are hints, not labels.',
      'Use the error prop for validation so colour and helper text stay in sync.',
    ],
    donts: [
      "Don't build multi-line notes with Input. It is single-line by design.",
      "Don't validate on every keystroke. Validate on blur or submit, then set error.",
    ],
    related: ['select', 'autocomplete', 'checkbox'],
  },
  {
    slug: 'select',
    name: 'Select',
    category: 'Actions & inputs',
    summary: 'Dropdown with single, multi, and combobox modes.',
    description:
      'Select picks from a list. One component, three modes: single (a classic dropdown), multi (tag pills for several values), and combobox (type to filter). Compose options as children so groups and separators stay declarative.',
    importNames: 'Select, SelectOption, SelectGroup, SelectSeparator',
    props: [
      { name: 'type', type: "'single' | 'multi' | 'combobox'", default: "'single'", description: 'Which mode the field uses.' },
      { name: 'label', type: 'string', description: 'Field label.' },
      { name: 'value / onValueChange', type: 'string', description: 'Selection in single and combobox modes.' },
      { name: 'values / onValuesChange', type: 'string[]', description: 'Selection in multi mode.' },
      { name: 'searchValue / onSearchChange', type: 'string', description: 'The filter text in combobox mode.' },
      { name: 'placeholder', type: 'string', description: 'Hint when nothing is selected.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Field height and type scale.' },
      { name: 'error / disabled', type: 'boolean', default: 'false', description: 'Validation and disabled states.' },
    ],
    subProps: [
      {
        title: 'SelectOption',
        rows: [
          { name: 'value', type: 'string', description: 'The value this option represents.' },
          { name: 'children', type: 'string', description: 'The option label.' },
          { name: 'disabled', type: 'boolean', default: 'false', description: 'Greys out the row.' },
        ],
      },
    ],
    examples: [
      {
        title: 'Single select',
        code: `function Demo() {
  const [country, setCountry] = useState<string | undefined>('uk');
  return (
    <Select type="single" label="Country" value={country} onValueChange={setCountry} style={{ width: 320 }}>
      <SelectOption value="uk">United Kingdom</SelectOption>
      <SelectOption value="us">United States</SelectOption>
      <SelectOption value="jp">Japan</SelectOption>
    </Select>
  );
}`,
      },
      {
        title: 'Multi select with tags',
        code: `function Demo() {
  const [tags, setTags] = useState<string[]>(['design']);
  return (
    <Select type="multi" label="Topics" values={tags} onValuesChange={setTags} style={{ width: 320 }}>
      <SelectOption value="design">Design</SelectOption>
      <SelectOption value="engineering">Engineering</SelectOption>
      <SelectOption value="research">Research</SelectOption>
    </Select>
  );
}`,
      },
    ],
    dos: [
      'Use combobox mode once a list passes about ten options.',
      'Group long lists with SelectGroup and SelectSeparator.',
    ],
    donts: [
      "Don't use Select for two or three options. Radio or ToggleButtonGroup read faster.",
      "Don't put actions in options. A Select holds a value; a Menu fires actions.",
    ],
    related: ['autocomplete', 'menu', 'radio', 'toggle-button-group'],
  },
  {
    slug: 'autocomplete',
    name: 'Autocomplete',
    category: 'Actions & inputs',
    summary: 'Type-to-filter field over a fixed option list.',
    description:
      'Autocomplete is the Select combobox specialised for client-side filtering: pass options as data, it filters as the user types. It reuses the input and select tokens, so it looks like family.',
    importNames: 'Autocomplete',
    props: [
      { name: 'options', type: '{ value: string; label: string }[]', description: 'The options to filter.' },
      { name: 'value / defaultValue', type: 'string | null', description: 'Controlled / uncontrolled selection.' },
      { name: 'onValueChange', type: '(value: string | null) => void', description: 'Selection handler.' },
      { name: 'onInputChange', type: '(text: string) => void', description: 'Fires as the user types.' },
      { name: 'label / helperText / placeholder', type: 'string', description: 'The usual field furniture.' },
      { name: 'filterOptions', type: '(options, input) => options', description: 'Custom matcher. Defaults to case-insensitive contains.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Field height and type scale.' },
    ],
    examples: [
      {
        title: 'Pick a city',
        code: `function Demo() {
  const [city, setCity] = useState<string | null>(null);
  const options = [
    { value: 'lon', label: 'London' },
    { value: 'nyc', label: 'New York' },
    { value: 'tok', label: 'Tokyo' },
    { value: 'ber', label: 'Berlin' },
    { value: 'syd', label: 'Sydney' },
  ];
  return (
    <Autocomplete
      label="City"
      placeholder="Start typing…"
      options={options}
      value={city}
      onValueChange={setCity}
      style={{ width: 320 }}
    />
  );
}`,
      },
    ],
    dos: ['Use it when the list is known up front and lives on the client.'],
    donts: ["Don't fetch per keystroke through filterOptions. Debounce outside and pass fresh options instead."],
    related: ['select', 'input'],
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    category: 'Actions & inputs',
    summary: 'Binary choice with an indeterminate third state.',
    description:
      'Checkbox toggles one thing on or off. It also supports the indeterminate state for a parent that owns a partly-selected group.',
    importNames: 'Checkbox',
    props: [
      { name: 'checked', type: "boolean | 'indeterminate'", default: 'false', description: 'The state. Indeterminate shows a dash.' },
      { name: 'onChange', type: '(checked: boolean) => void', description: 'Change handler.' },
      { name: 'children', type: 'string', description: 'The label beside the box.' },
      { name: 'size', type: "'small' | 'default' | 'large'", default: "'default'", description: 'Box and label scale.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Blocks interaction.' },
    ],
    examples: [
      {
        title: 'A settings group',
        code: `function Demo() {
  const [prefs, setPrefs] = useState({ email: true, push: false, digest: true });
  const set = (key: string) => (value: boolean) => setPrefs((p) => ({ ...p, [key]: value }));
  return (
    <View style={{ gap: 8 }}>
      <Checkbox checked={prefs.email} onChange={set('email')}>Email notifications</Checkbox>
      <Checkbox checked={prefs.push} onChange={set('push')}>Push notifications</Checkbox>
      <Checkbox checked={prefs.digest} onChange={set('digest')}>Weekly digest</Checkbox>
    </View>
  );
}`,
      },
      {
        title: 'Indeterminate parent',
        code: `<View style={{ gap: 8 }}>
  <Checkbox checked="indeterminate" onChange={() => {}}>All projects</Checkbox>
  <View style={{ paddingLeft: 24, gap: 8 }}>
    <Checkbox checked onChange={() => {}}>cast-ui</Checkbox>
    <Checkbox checked={false} onChange={() => {}}>cast-sync</Checkbox>
  </View>
</View>`,
      },
    ],
    dos: ['Use checkboxes for independent options; each row stands alone.'],
    donts: ["Don't use a checkbox for one-of-many. That's Radio.", "Don't use one for instant on/off settings. That's Toggle."],
    related: ['radio', 'toggle'],
  },
];
