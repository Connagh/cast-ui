import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  Divider,
  Icon,
  Input,
  Link,
  List,
  ListItem,
  Progress,
  Skeleton,
  Spinner,
  Tab,
  Tabs,
  Text,
  Toggle,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from '@castui/cast-ui';
import { brandPresets, useSiteTheme } from '../theme/SiteTheme';
import { Page } from '../ui/Page';

/** A small chat window, assembled from library parts. */
function ChatCard() {
  const { scheme, colors } = useTheme();
  const [draft, setDraft] = useState('');
  return (
    <Card variant="elevated" style={{ width: 300 }}>
      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Avatar initials="AI" size="small" />
          <Text type="label-md">Studio assistant</Text>
          <Badge intent="brand" size="small" dot>Live</Badge>
        </View>
        <Divider />
        <View style={{ gap: 8 }}>
          <View style={{ alignSelf: 'flex-start', maxWidth: 220, backgroundColor: scheme.surface.subtle, borderRadius: 12, padding: 10 }}>
            <Text type="body-sm">Where's my order?</Text>
          </View>
          <View style={{ alignSelf: 'flex-end', maxWidth: 230, backgroundColor: colors.brand.bold.default.bg, borderRadius: 12, padding: 10 }}>
            <Text type="body-sm" color={colors.brand.bold.default.fg}>
              Order #1043 shipped this morning. It lands tomorrow by 8pm.
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Chip size="small" onPress={() => {}}>Track it</Chip>
            <Chip size="small" onPress={() => {}}>Start a return</Chip>
          </View>
        </View>
        <Input
          size="small"
          placeholder="Ask anything…"
          value={draft}
          onChangeText={setDraft}
          trailingIcon="send"
        />
      </View>
    </Card>
  );
}

/** A storefront product card. */
function ProductCard() {
  const { colors, scheme } = useTheme();
  const [qty, setQty] = useState<string | null>('1');
  return (
    <Card variant="elevated" style={{ width: 260 }}>
      <View style={{ gap: 10 }}>
        <View
          style={{
            height: 110,
            borderRadius: 10,
            backgroundColor: scheme.surface.subtle,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="backpack" size={56} color={colors.brand.bold.default.bg} />
        </View>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <Badge intent="brand" size="small">New in</Badge>
          <Badge size="small">Free shipping</Badge>
        </View>
        <Text type="title-sm">Canvas backpack</Text>
        <Text type="body-sm" color={scheme.text.description}>Water resistant. Fits a 16-inch laptop.</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text type="title-md">£64</Text>
          <ToggleButtonGroup size="small" value={qty} onValueChange={setQty}>
            <ToggleButton value="1">1</ToggleButton>
            <ToggleButton value="2">2</ToggleButton>
            <ToggleButton value="3">3</ToggleButton>
          </ToggleButtonGroup>
        </View>
        <Button intent="brand" prominence="bold" size="small" leadingIcon="add_shopping_cart" onPress={() => {}}>
          Add to cart
        </Button>
      </View>
    </Card>
  );
}

/** A slice of dashboard. */
function StatsCard() {
  const { scheme } = useTheme();
  const [notify, setNotify] = useState(true);
  return (
    <Card variant="elevated" style={{ width: 280 }}>
      <View style={{ gap: 10 }}>
        <Text type="label-sm" color={scheme.text.description}>MONTHLY REVENUE</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
          <Text type="display-sm">£18.2k</Text>
          <Badge intent="brand" size="small" leadingIcon="trending_up">+12%</Badge>
        </View>
        <Progress value={72} />
        <Divider />
        <List>
          <ListItem icon="shopping_bag" description="Placed · 1:59 pm" onPress={() => {}}>Order #1043 · £248</ListItem>
          <ListItem icon="undo" description="Refunded · 12:40 pm" onPress={() => {}}>Order #1041 · £89</ListItem>
        </List>
        <Toggle size="small" checked={notify} onChange={setNotify}>Notify on new orders</Toggle>
      </View>
    </Card>
  );
}

function HeroControls() {
  const site = useSiteTheme();
  const { scheme } = useTheme();
  return (
    <View
      style={{
        gap: 12,
        borderWidth: 1,
        borderColor: scheme.surface.overlay.border,
        borderRadius: 14,
        padding: 16,
        backgroundColor: scheme.surface.subtle,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon name="tune" size="small" />
        <Text type="label-md">This hero is live. Retheme it.</Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <ToggleButtonGroup size="small" value={site.colorMode} onValueChange={(v) => v && site.setColorMode(v as 'light' | 'dark')}>
          <ToggleButton value="light" leadingIcon="light_mode">Light</ToggleButton>
          <ToggleButton value="dark" leadingIcon="dark_mode">Dark</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup size="small" value={site.density} onValueChange={(v) => v && site.setDensity(v as 'compact' | 'default' | 'comfortable')}>
          <ToggleButton value="compact">Compact</ToggleButton>
          <ToggleButton value="default">Default</ToggleButton>
          <ToggleButton value="comfortable">Comfy</ToggleButton>
        </ToggleButtonGroup>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {brandPresets.map((preset) => (
            <Chip
              key={preset.id}
              size="small"
              intent="brand"
              selected={site.brandId === preset.id}
              leadingIcon={<Icon name="circle" size="xs" fill color={preset.swatch} />}
              onPress={() => site.setBrandId(preset.id)}
            >
              {preset.label}
            </Chip>
          ))}
        </View>
      </View>
      <Text type="caption" color={scheme.text.description}>
        Every component on this page reads the same theme. Density moves spacing only; brand colour flows from one token.
      </Text>
    </View>
  );
}

function FeatureCard({ icon, title, body, action, onPress }: { icon: string; title: string; body: string; action: string; onPress: () => void }) {
  return (
    <Card style={{ flex: 1, minWidth: 260 }}>
      <View style={{ gap: 10 }}>
        <Icon name={icon} size="large" />
        <Text type="title-md">{title}</Text>
        <Text type="body-sm">{body}</Text>
        <Link size="small" trailingIcon="arrow_forward" onPress={onPress}>{action}</Link>
      </View>
    </Card>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const { scheme } = useTheme();
  const [demoTab, setDemoTab] = useState('buttons');

  return (
    <View>
      <Page wide style={{ paddingTop: 64 }}>
        {/* Hero */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
          <View style={{ flex: 1, minWidth: 320, gap: 20 }}>
            <Badge intent="brand" variant="subtle" leadingIcon="bolt">v4.10 · motion tokens just landed</Badge>
            <Text type="display-md">One design system. Every platform. Agents welcome.</Text>
            <Text type="body-lg" color={scheme.text.description} style={{ maxWidth: 560 }}>
              Cast UI is an open source React Native design system: 37 components that run on iOS, Android, and the web from one codebase, themed at runtime by tokens that live in Figma and ship as code.
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
              <Button intent="brand" prominence="bold" size="large" leadingIcon="rocket_launch" onPress={() => navigate('/docs/getting-started')}>
                Get started
              </Button>
              <Button size="large" onPress={() => navigate('/components')}>Browse components</Button>
            </View>
            <Text type="caption" color={scheme.text.description}>
              MIT licensed · zero runtime dependencies · react + react-native as peers
            </Text>
          </View>
          <View style={{ flex: 1, minWidth: 340, gap: 16 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
              <ChatCard />
              <View style={{ gap: 16 }}>
                <StatsCard />
              </View>
              <ProductCard />
            </View>
          </View>
        </View>

        <HeroControls />

        {/* Numbers */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24, justifyContent: 'space-between' }}>
          {[
            ['37', 'components'],
            ['3', 'platforms, one codebase'],
            ['864', 'design tokens across 4 collections'],
            ['0', 'runtime dependencies'],
          ].map(([n, label]) => (
            <View key={label} style={{ gap: 4, minWidth: 150 }}>
              <Text type="display-sm">{n}</Text>
              <Text type="body-sm" color={scheme.text.description}>{label}</Text>
            </View>
          ))}
        </View>

        <Divider />

        {/* Pillars */}
        <View style={{ gap: 20 }}>
          <Text type="heading-md">Start anywhere. Change anything. Stay in sync.</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            <FeatureCard
              icon="design_services"
              title="Designed in Figma, shipped as code"
              body="The open source Figma kit and the npm package are 1:1 mirrors: same names, same properties, same tokens. The cast-sync plugin turns kit variables into a theme file your app loads at runtime."
              action="See how theming works"
              onPress={() => navigate('/themes')}
            />
            <FeatureCard
              icon="animation"
              title="Motion is a token too"
              body="Durations, easing curves, and springs live in the motion collection, mirror into code, and honour reduce-motion everywhere. Retime the whole library from one place."
              action="Explore the motion system"
              onPress={() => navigate('/motion')}
            />
            <FeatureCard
              icon="smart_toy"
              title="Built for agents"
              body="Component descriptions carry the design-to-code mapping, the npm package ships agent skills, and the docs are structured so an agent can pick the right component, props, and tokens without guessing."
              action="Read the agent guide"
              onPress={() => navigate('/docs/agents')}
            />
            <FeatureCard
              icon="hub"
              title="A system you can see"
              body="Every token, component, and tool in the ecosystem is a node in one live graph: trace a primitive through the semantic layer into a component, or zoom out to the whole pipeline."
              action="Open the graph"
              onPress={() => navigate('/architecture')}
            />
          </View>
        </View>

        <Divider />

        {/* Live sampler */}
        <View style={{ gap: 20 }}>
          <Text type="heading-md">Try the feel of it</Text>
          <Tabs value={demoTab} onValueChange={setDemoTab} intent="brand">
            <Tab value="buttons">Actions</Tab>
            <Tab value="forms">Forms</Tab>
            <Tab value="status">Feedback</Tab>
          </Tabs>
          <View style={{ padding: 24, borderWidth: 1, borderColor: scheme.surface.overlay.border, borderRadius: 14, alignItems: 'flex-start', gap: 16 }}>
            {demoTab === 'buttons' && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                <Button intent="brand" prominence="bold" leadingIcon="add" onPress={() => {}}>New project</Button>
                <Button onPress={() => {}}>Duplicate</Button>
                <Button prominence="subtle" onPress={() => {}}>Share</Button>
                <Button intent="danger" prominence="subtle" leadingIcon="delete" onPress={() => {}}>Delete</Button>
                <Spinner intent="brand" size="small" />
              </View>
            )}
            {demoTab === 'forms' && (
              <View style={{ gap: 12, width: 320 }}>
                <Input label="Project name" placeholder="cast-ui" />
                <Toggle checked onChange={() => {}}>Public project</Toggle>
                <Chip intent="brand" selected onPress={() => {}}>react-native</Chip>
              </View>
            )}
            {demoTab === 'status' && (
              <View style={{ gap: 12, width: 320 }}>
                <Progress value={64} />
                <Skeleton width="80%" />
                <Badge intent="brand" dot>Deploying</Badge>
              </View>
            )}
          </View>
          <Link trailingIcon="arrow_forward" onPress={() => navigate('/playground')}>Open the full playground</Link>
        </View>
      </Page>
    </View>
  );
}
