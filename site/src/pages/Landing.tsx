import React, { useState } from 'react';
import { View, Text as RNText } from 'react-native';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  Chip,
  Divider,
  Icon,
  Input,
  Link,
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
import HeroArt from '../ui/HeroArt';

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
  const { scheme, colors, colorMode } = useTheme();
  const [demoTab, setDemoTab] = useState('buttons');

  // Frosted readability halo behind the hero copy: a light surface tint plus a
  // backdrop blur, feathered with a radial mask so it's strongest behind the
  // letters and dissolves into the sharp, moving wave at the edges.
  const frost = colorMode === 'dark' ? 'rgba(10, 14, 22, 0.30)' : 'rgba(255, 255, 255, 0.38)';
  const heroBlurMask = 'radial-gradient(120% 96% at 50% 44%, #000 56%, rgba(0,0,0,0) 86%)';

  return (
    <View>
      {/* Hero band — the animated wave runs full-bleed behind the hero and the
          controls. A frosted backdrop-blur sits behind the copy so the title and
          text stay readable while the wave keeps moving behind them. */}
      <View style={{ position: 'relative', overflow: 'hidden' }}>
        <HeroArt />
        <View style={{ position: 'relative', zIndex: 1 }}>
          <Page wide style={{ paddingTop: 112, paddingBottom: 56, alignItems: 'center', gap: 36 }}>
            {/* Hero — centred over the wave */}
            <View style={{ maxWidth: 820, alignItems: 'center', position: 'relative' }}>
              {/* Frosted halo: blurs the wave directly behind the copy and
                  feathers out, so the letters read crisp but the animation
                  stays visible around them. */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: -48,
                  bottom: -40,
                  left: '-10%',
                  right: '-10%',
                  zIndex: 0,
                  borderRadius: 48,
                  backgroundColor: frost,
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  maskImage: heroBlurMask,
                  WebkitMaskImage: heroBlurMask,
                  pointerEvents: 'none',
                }}
              />
              <View style={{ gap: 22, alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <Badge intent="brand" variant="subtle" leadingIcon="bolt">v4.11 · motion tokens just landed</Badge>
                {/* "Agents welcome." picks up the live brand colour, so it rethemes
                    with the switcher and stays mode-correct in light and dark. */}
                <RNText style={{ textAlign: 'center' }}>
                  <Text type="display-lg">One design system. Every platform. </Text>
                  <Text type="display-lg" color={colors.brand.subtle.default.fg}>Agents welcome.</Text>
                </RNText>
                <Text type="body-lg" color={scheme.text.description} style={{ maxWidth: 640, textAlign: 'center' }}>
                  Cast UI is an open source React Native design system: 37 components that run on iOS, Android, and the web from one codebase, themed at runtime by tokens that live in Figma and ship as code.
                </Text>
                <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Button intent="brand" prominence="bold" size="large" leadingIcon="rocket_launch" onPress={() => navigate('/docs/getting-started')}>
                    Get started
                  </Button>
                  <Button size="large" onPress={() => navigate('/components')}>Browse components</Button>
                </View>
                <Text type="caption" color={scheme.text.description} style={{ textAlign: 'center' }}>
                  MIT licensed · zero runtime dependencies · react + react-native as peers
                </Text>
              </View>
            </View>

            <View style={{ maxWidth: 720, width: '100%' }}>
              <HeroControls />
            </View>
          </Page>
        </View>
      </View>

      <Page wide>
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
