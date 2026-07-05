import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from '@castui/cast-ui';
import { Page, PageHeader, Section } from '../../ui/Page';
import { LiveDemo } from '../../ui/LiveDemo';

const CHAT_THREAD = `function Demo() {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState([
    { from: 'user', text: "Where's my order?" },
    { from: 'ai', text: 'Order #1043 shipped this morning and lands tomorrow by 8pm.' },
  ]);
  const send = () => {
    if (!draft.trim()) return;
    setMessages((m) => [...m, { from: 'user', text: draft.trim() }]);
    setDraft('');
  };
  const { scheme, colors } = useTheme();
  return (
    <Card variant="elevated" style={{ width: 360 }}>
      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Avatar initials="AI" size="small" />
          <Text type="label-md">Assistant</Text>
          <Badge intent="brand" size="small" dot>Online</Badge>
        </View>
        <Divider />
        <View style={{ gap: 8, minHeight: 120 }}>
          {messages.map((m, i) =>
            m.from === 'ai' ? (
              <View key={i} style={{ alignSelf: 'flex-start', maxWidth: 260, backgroundColor: scheme.surface.subtle, borderRadius: 12, padding: 10 }}>
                <Text type="body-sm">{m.text}</Text>
              </View>
            ) : (
              <View key={i} style={{ alignSelf: 'flex-end', maxWidth: 260, backgroundColor: colors.brand.bold.default.bg, borderRadius: 12, padding: 10 }}>
                <Text type="body-sm" color={colors.brand.bold.default.fg}>{m.text}</Text>
              </View>
            ),
          )}
        </View>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <Chip size="small" onPress={() => {}}>Track order</Chip>
          <Chip size="small" onPress={() => {}}>Start a return</Chip>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Input size="small" placeholder="Message…" value={draft} onChangeText={setDraft} onSubmitEditing={send} style={{ flex: 1 }} />
          <Button size="small" intent="brand" prominence="bold" leadingIcon="send" accessibilityLabel="Send" onPress={send}>{''}</Button>
        </View>
      </View>
    </Card>
  );
}`;

const TOOL_CALL = `function Demo() {
  const [running, setRunning] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setRunning(false), 2600);
    return () => clearTimeout(t);
  }, []);
  const { scheme } = useTheme();
  return (
    <Card style={{ width: 360 }}>
      <View style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="terminal" size="small" />
          <Text type="label-md">search_orders</Text>
          {running ? <Spinner size="small" intent="brand" /> : <Badge intent="brand" size="small" leadingIcon="check">Done</Badge>}
        </View>
        <CodeBlock size="small" showCopy={false}>{'{ "customer": "ami", "status": "in_transit" }'}</CodeBlock>
        {running ? (
          <View style={{ gap: 6 }}>
            <Skeleton width="90%" />
            <Skeleton width="65%" />
          </View>
        ) : (
          <Text type="body-sm" color={scheme.text.description}>1 order found · UPS 1Z 999 AA1 · arriving tomorrow</Text>
        )}
        <Button size="small" prominence="subtle" leadingIcon="replay" onPress={() => setRunning(true)}>Run again</Button>
      </View>
    </Card>
  );
}`;

const STAT_ROW = `<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
  {[
    { label: 'REVENUE', value: '£18.2k', delta: '+12%', up: true },
    { label: 'ORDERS', value: '312', delta: '+4%', up: true },
    { label: 'REFUNDS', value: '9', delta: '-2%', up: false },
  ].map((s) => (
    <Card key={s.label} style={{ minWidth: 160, flex: 1 }}>
      <View style={{ gap: 6 }}>
        <Text type="label-sm">{s.label}</Text>
        <Text type="heading-md">{s.value}</Text>
        <Badge size="small" intent={s.up ? 'brand' : 'danger'} leadingIcon={s.up ? 'trending_up' : 'trending_down'}>
          {s.delta}
        </Badge>
      </View>
    </Card>
  ))}
</View>`;

const SIGN_IN = `function Demo() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState(false);
  const submit = () => setError(!email.includes('@'));
  return (
    <Card variant="elevated" style={{ width: 340 }}>
      <View style={{ gap: 14 }}>
        <Text type="heading-sm">Welcome back</Text>
        <Input label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail}
          error={error ? 'That does not look like an email.' : undefined} keyboardType="email-address" leadingIcon="mail" />
        <Input label="Password" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry leadingIcon="lock" />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Checkbox size="small" checked={remember} onChange={setRemember}>Remember me</Checkbox>
          <Link size="small" onPress={() => {}}>Forgot?</Link>
        </View>
        <Button intent="brand" prominence="bold" onPress={submit}>Sign in</Button>
      </View>
    </Card>
  );
}`;

const CONFIRM_DELETE = `function Demo() {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(false);
  return (
    <View style={{ gap: 12, alignItems: 'flex-start' }}>
      <Button intent="danger" leadingIcon="delete" onPress={() => setOpen(true)}>Delete workspace</Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        icon="delete_forever"
        title="Delete this workspace?"
        description="14 projects and all their history go with it. This cannot be undone."
        primaryAction={{ label: 'Delete', onPress: () => { setOpen(false); setToast(true); } }}
        secondaryAction={{ label: 'Cancel', onPress: () => setOpen(false) }}
      />
      {toast ? <Toast intent="brand" title="Workspace deleted" onClose={() => setToast(false)} /> : null}
    </View>
  );
}`;

const EMPTY_STATE = `function Demo() {
  const { scheme } = useTheme();
  return (
    <Card style={{ width: 340, alignItems: 'center' }}>
      <View style={{ gap: 10, alignItems: 'center', paddingVertical: 12 }}>
        <Icon name="folder_open" size={40} color={scheme.text.description} />
        <Text type="title-sm">No projects yet</Text>
        <Text type="body-sm" color={scheme.text.description} style={{ textAlign: 'center' }}>
          Projects you create or join show up here.
        </Text>
        <Button intent="brand" prominence="bold" size="small" leadingIcon="add" onPress={() => {}}>New project</Button>
      </View>
    </Card>
  );
}`;

const ERROR_STATE = `function Demo() {
  const { scheme } = useTheme();
  return (
    <Card style={{ width: 340, alignItems: 'center' }}>
      <View style={{ gap: 10, alignItems: 'center', paddingVertical: 12 }}>
        <Icon name="cloud_off" size={40} color={scheme.error.fg} />
        <Text type="title-sm">Couldn't load activity</Text>
        <Text type="body-sm" color={scheme.text.description} style={{ textAlign: 'center' }}>
          Check your connection and try again.
        </Text>
        <Button size="small" leadingIcon="refresh" onPress={() => {}}>Retry</Button>
      </View>
    </Card>
  );
}`;

/** Exported for the SSR smoke test, which evaluates every snippet. */
export const PATTERN_EXAMPLES = { CHAT_THREAD, TOOL_CALL, STAT_ROW, SIGN_IN, CONFIRM_DELETE, EMPTY_STATE, ERROR_STATE };

export default function Patterns() {
  const { scheme } = useTheme();
  return (
    <Page wide>
      <PageHeader
        eyebrow="Patterns"
        title="Recipes, ready to steal"
        lede="Small compositions that come up in every product, written the way the library wants them written. Every example is live: edit the code, or send it to a device."
      />
      <Text type="body-sm" color={scheme.text.description} style={{ marginTop: -24 }}>
        The kit's Patterns page in Figma mirrors these same states, built from the same components.
      </Text>

      <Section title="AI chat thread" lede="Message bubbles from surface and intent colours, suggestion chips, a composer row. The assistant pattern behind the landing page hero.">
        <LiveDemo code={CHAT_THREAD} title="Chat thread" />
      </Section>
      <Section title="Tool call card" lede="An agent doing work: name, arguments, skeleton while running, result when done.">
        <LiveDemo code={TOOL_CALL} title="Tool call" />
      </Section>
      <Section title="Stat cards" lede="The dashboard opener: a row of numbers with deltas that read at a glance.">
        <LiveDemo code={STAT_ROW} title="Stat cards" centered={false} />
      </Section>
      <Section title="Sign in" lede="Labels over placeholders, one bold action, errors set on submit.">
        <LiveDemo code={SIGN_IN} title="Sign in" />
      </Section>
      <Section title="Destructive confirm" lede="Danger button, consequence named in the dialog, quiet toast on completion.">
        <LiveDemo code={CONFIRM_DELETE} title="Confirm delete" />
      </Section>
      <Section title="Empty and error states" lede="A glyph, a plain sentence, one action. Same skeleton for both; only the tone changes.">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          <View style={{ flex: 1, minWidth: 320 }}>
            <LiveDemo code={EMPTY_STATE} title="Empty state" />
          </View>
          <View style={{ flex: 1, minWidth: 320 }}>
            <LiveDemo code={ERROR_STATE} title="Error state" />
          </View>
        </View>
      </Section>
    </Page>
  );
}
