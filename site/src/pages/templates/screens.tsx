/**
 * The template screens: full views assembled from the library, rendered
 * inside phone-ish frames on the index and full-bleed on their own route.
 */

import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  Alert,
  AppBar,
  Badge,
  BottomSheet,
  Button,
  Card,
  Checkbox,
  Chip,
  Divider,
  Icon,
  Input,
  Link,
  List,
  ListItem,
  Progress,
  Radio,
  RadioGroup,
  Select,
  SelectOption,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Text,
  useTheme,
} from '@castui/cast-ui';

export function AssistantTemplate() {
  const { scheme, colors } = useTheme();
  const [draft, setDraft] = useState('');
  return (
    <View style={{ flex: 1, backgroundColor: scheme.surface.base }}>
      <AppBar
        title="Studio AI"
        leadingIcon="menu"
        onLeadingPress={() => {}}
        align="center"
        trailing={<Button size="small" prominence="subtle" leadingIcon="ios_share" accessibilityLabel="Export" onPress={() => {}}>{''}</Button>}
      />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        <Text type="caption" color={scheme.text.description} style={{ alignSelf: 'center' }}>Today</Text>
        <View style={{ alignSelf: 'flex-end', maxWidth: '80%', backgroundColor: colors.brand.bold.default.bg, borderRadius: 14, padding: 12 }}>
          <Text type="body-md" color={colors.brand.bold.default.fg}>Where's my order?</Text>
        </View>
        <View style={{ alignSelf: 'flex-start', maxWidth: '85%', backgroundColor: scheme.surface.subtle, borderRadius: 14, padding: 12, gap: 8 }}>
          <Text type="body-md">Order #1043 shipped this morning and is on track to arrive tomorrow by 8pm.</Text>
          <Card size="small">
            <View style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text type="label-md">Minimalist watch · Linen throw</Text>
                <Text type="label-md">£248</Text>
              </View>
              <Progress value={70} size="small" />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text type="caption" color={scheme.text.description}>In transit</Text>
                <Badge size="small" intent="brand">On time</Badge>
              </View>
            </View>
          </Card>
          <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
            <Chip size="small" onPress={() => {}}>Reschedule</Chip>
            <Chip size="small" onPress={() => {}}>Redirect to pickup</Chip>
            <Chip size="small" onPress={() => {}}>Start a return</Chip>
          </View>
        </View>
      </ScrollView>
      <View style={{ padding: 12, borderTopWidth: 1, borderTopColor: scheme.surface.overlay.border, flexDirection: 'row', gap: 8 }}>
        <Button prominence="subtle" size="small" leadingIcon="attach_file" accessibilityLabel="Attach" onPress={() => {}}>{''}</Button>
        <Input size="small" placeholder="Ask Studio AI…" value={draft} onChangeText={setDraft} style={{ flex: 1 }} />
        <Button intent="brand" prominence="bold" size="small" leadingIcon="send" accessibilityLabel="Send" onPress={() => setDraft('')}>{''}</Button>
      </View>
    </View>
  );
}

export function DashboardTemplate() {
  const { scheme } = useTheme();
  const [tab, setTab] = useState('overview');
  return (
    <View style={{ flex: 1, backgroundColor: scheme.surface.base }}>
      <AppBar
        title="Inventory"
        leadingIcon="menu"
        onLeadingPress={() => {}}
        trailing={<Button size="small" intent="brand" prominence="bold" leadingIcon="add" onPress={() => {}}>Add item</Button>}
      />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Tabs value={tab} onValueChange={setTab} intent="brand" size="small">
          <Tab value="overview">Overview</Tab>
          <Tab value="items">Items</Tab>
          <Tab value="orders">Orders</Tab>
        </Tabs>
        <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <Card size="small" style={{ flex: 1, minWidth: 140 }}>
            <View style={{ gap: 4 }}>
              <Text type="label-sm" color={scheme.text.description}>REVENUE</Text>
              <Text type="heading-md">£18.2k</Text>
              <Badge size="small" intent="brand" leadingIcon="trending_up">+12%</Badge>
            </View>
          </Card>
          <Card size="small" style={{ flex: 1, minWidth: 140 }}>
            <View style={{ gap: 4 }}>
              <Text type="label-sm" color={scheme.text.description}>LOW STOCK</Text>
              <Text type="heading-md">2</Text>
              <Badge size="small" intent="danger" dot>Needs a restock</Badge>
            </View>
          </Card>
        </View>
        <Alert intent="danger" size="small" title="2 items are running low" description="Buttered toast and almond croissant are under 20 units." />
        <Table size="small" striped hoverable>
          <TableHead>
            <TableRow>
              <TableCell flex={2}><Text type="label-sm">Item</Text></TableCell>
              <TableCell numeric><Text type="label-sm">Available</Text></TableCell>
              <TableCell><Text type="label-sm">Tag</Text></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              ['Butter croissant', '64', 'Fresh', 'brand'],
              ['Pancakes', '38', 'Popular', 'neutral'],
              ['Belgian waffle', '51', 'New', 'brand'],
              ['Buttered toast', '12', 'Low', 'danger'],
            ].map(([name, count, tag, intent]) => (
              <TableRow key={name} onPress={() => {}}>
                <TableCell flex={2}><Text type="body-sm">{name}</Text></TableCell>
                <TableCell numeric><Text type="body-sm">{count}</Text></TableCell>
                <TableCell><Badge size="small" intent={intent as 'brand' | 'neutral' | 'danger'}>{tag}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollView>
    </View>
  );
}

export function AuthTemplate() {
  const { scheme } = useTheme();
  const [step, setStep] = useState<'signin' | 'plan'>('signin');
  const [plan, setPlan] = useState('pro');
  return (
    <View style={{ flex: 1, backgroundColor: scheme.surface.subtle, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <Card variant="elevated" style={{ width: '100%', maxWidth: 360 }}>
        {step === 'signin' ? (
          <View style={{ gap: 14 }}>
            <View style={{ gap: 4 }}>
              <Text type="heading-sm">Create your account</Text>
              <Text type="body-sm" color={scheme.text.description}>Free for 14 days. No card needed.</Text>
            </View>
            <Input label="Work email" placeholder="you@company.com" keyboardType="email-address" leadingIcon="mail" />
            <Input label="Password" placeholder="8+ characters" secureTextEntry leadingIcon="lock" />
            <Button intent="brand" prominence="bold" onPress={() => setStep('plan')}>Continue</Button>
            <Divider />
            <Button leadingIcon="account_circle" onPress={() => setStep('plan')}>Continue with SSO</Button>
            <Text type="caption" color={scheme.text.description}>By continuing you agree to the terms.</Text>
            <Link size="small" onPress={() => {}}>Sign in instead</Link>
          </View>
        ) : (
          <View style={{ gap: 14 }}>
            <Text type="heading-sm">Pick a plan</Text>
            <RadioGroup value={plan} onValueChange={setPlan}>
              <Radio value="free">Free · 3 projects</Radio>
              <Radio value="pro">Pro · unlimited · £12/mo</Radio>
              <Radio value="team">Team · SSO and roles · £39/mo</Radio>
            </RadioGroup>
            <Checkbox size="small" checked onChange={() => {}}>Email me product updates</Checkbox>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Button prominence="subtle" onPress={() => setStep('signin')}>Back</Button>
              <Button intent="brand" prominence="bold" style={{ flex: 1 }} onPress={() => {}}>Start free trial</Button>
            </View>
          </View>
        )}
      </Card>
    </View>
  );
}

export function StorefrontTemplate() {
  const { scheme, colors } = useTheme();
  const [cartOpen, setCartOpen] = useState(false);
  const [size, setSize] = useState<string | null>('m');
  const [delivery, setDelivery] = useState<string | undefined>('std');
  return (
    <View style={{ flex: 1, backgroundColor: scheme.surface.base }}>
      <AppBar
        title="Studio"
        align="center"
        prominence="subtle"
        leadingIcon="menu"
        onLeadingPress={() => {}}
        trailing={<Button size="small" prominence="subtle" leadingIcon="shopping_bag" accessibilityLabel="Cart" onPress={() => setCartOpen(true)}>{''}</Button>}
      />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View style={{ height: 160, borderRadius: 14, backgroundColor: scheme.surface.subtle, alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Icon name="backpack" size={64} color={colors.brand.bold.default.bg} />
          <Badge intent="brand" size="small">Limited time · free shipping</Badge>
        </View>
        <View style={{ gap: 6 }}>
          <Text type="heading-sm">Canvas backpack</Text>
          <Text type="body-sm" color={scheme.text.description}>
            Water resistant. Padded 16-inch laptop sleeve. Little joys, everywhere you go.
          </Text>
          <Text type="heading-md">£64</Text>
        </View>
        <View style={{ gap: 8 }}>
          <Text type="label-md">Size</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['s', 'm', 'l'].map((s) => (
              <Chip key={s} intent="brand" selected={size === s} onPress={() => setSize(s)}>{s.toUpperCase()}</Chip>
            ))}
          </View>
        </View>
        <Select type="single" label="Delivery" value={delivery} onValueChange={(v) => setDelivery(v)}>
          <SelectOption value="eco">Economy · 5 to 7 days · £4</SelectOption>
          <SelectOption value="std">Standard · 3 to 5 days · £6</SelectOption>
          <SelectOption value="exp">Express · 1 to 2 days · £12</SelectOption>
        </Select>
        <Button intent="brand" prominence="bold" size="large" leadingIcon="add_shopping_cart" onPress={() => setCartOpen(true)}>
          Add to cart
        </Button>
      </ScrollView>
      <BottomSheet open={cartOpen} onClose={() => setCartOpen(false)} title="Your cart">
        <View style={{ gap: 12 }}>
          <List>
            <ListItem icon="backpack" description="Size M · £64" trailingIcon="close" onPress={() => {}}>Canvas backpack</ListItem>
          </List>
          <Divider />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text type="label-md">Total</Text>
            <Text type="title-sm">£64</Text>
          </View>
          <Button intent="brand" prominence="bold" onPress={() => setCartOpen(false)}>Checkout</Button>
        </View>
      </BottomSheet>
    </View>
  );
}

export type TemplateEntry = {
  slug: string;
  name: string;
  summary: string;
  component: () => React.JSX.Element;
};

export const TEMPLATES: TemplateEntry[] = [
  { slug: 'assistant', name: 'AI assistant', summary: 'Chat thread with tool results, suggestion chips, and a composer.', component: AssistantTemplate },
  { slug: 'dashboard', name: 'Dashboard', summary: 'Stats, an alert, tabs, and a live inventory table.', component: DashboardTemplate },
  { slug: 'auth', name: 'Sign up', summary: 'Two-step account creation with plan selection.', component: AuthTemplate },
  { slug: 'storefront', name: 'Storefront', summary: 'Product page with options, delivery select, and a cart sheet.', component: StorefrontTemplate },
];
