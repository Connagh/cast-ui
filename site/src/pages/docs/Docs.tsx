import React from 'react';
import { View } from 'react-native';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Alert, Divider, Link, List, ListItem, Text, useMinWidth, useTheme } from '@castui/cast-ui';
import { Page, PageHeader, Prose, Section } from '../../ui/Page';
import { CodeSnippet } from '../../ui/CodeSnippet';
import { LiveDemo } from '../../ui/LiveDemo';

const DOC_PAGES = [
  { slug: 'getting-started', label: 'Getting started' },
  { slug: 'theming', label: 'Theming' },
  { slug: 'design-tokens', label: 'Design tokens' },
  { slug: 'icons-and-fonts', label: 'Icons and fonts' },
  { slug: 'breakpoints', label: 'Breakpoints' },
  { slug: 'cast-sync', label: 'cast-sync' },
  { slug: 'agents', label: 'Building with agents' },
];

function GettingStarted() {
  return (
    <View style={{ gap: 40 }}>
      <PageHeader
        eyebrow="Docs"
        title="Getting started"
        lede="Install one package, wrap your app once, load two fonts. That's the whole setup."
      />
      <Section title="1. Install">
        <CodeSnippet code="npm install @castui/cast-ui" language="bash" />
        <Prose>
          The package has zero runtime dependencies. It asks for react 18+ and react-native 0.72+ as peers, which your app already has. The same import works in Expo, bare React Native, and on the web through react-native-web.
        </Prose>
      </Section>
      <Section title="2. Wrap your app in ThemeProvider">
        <Prose>
          The one rule of Cast UI: mount a ThemeProvider once, near the root. Every component reads its colours, spacing, and motion from that context.
        </Prose>
        <CodeSnippet
          title="App.tsx"
          code={`import { ThemeProvider, Button } from '@castui/cast-ui';

export function App() {
  return (
    <ThemeProvider>
      <Button intent="brand" prominence="bold" onPress={save}>
        Save changes
      </Button>
    </ThemeProvider>
  );
}`}
        />
      </Section>
      <Section title="3. Load the fonts">
        <Prose>
          Cast UI ships no font files. Load Geist for text and Material Symbols Outlined for icons. If icons render as words, the symbols font is missing. In Expo:
        </Prose>
        <CodeSnippet
          code={`import { useFonts } from 'expo-font';

const [fontsLoaded] = useFonts({
  Geist: require('./assets/Geist.ttf'),
  MaterialSymbolsOutlined: require('./assets/MaterialSymbolsOutlined.ttf'),
});`}
        />
        <Prose>
          On the plain web, add the two Google Fonts stylesheets to your HTML head instead. The Icons and fonts page has the exact tags.
        </Prose>
      </Section>
      <Section title="4. Build something">
        <LiveDemo
          code={`function Demo() {
  const [plan, setPlan] = useState('pro');
  return (
    <Card style={{ width: 340 }}>
      <View style={{ gap: 12 }}>
        <Text type="title-md">Choose a plan</Text>
        <RadioGroup value={plan} onValueChange={setPlan}>
          <Radio value="free">Free</Radio>
          <Radio value="pro">Pro</Radio>
        </RadioGroup>
        <Button intent="brand" prominence="bold" onPress={() => {}}>
          Continue
        </Button>
      </View>
    </Card>
  );
}`}
        />
      </Section>
    </View>
  );
}

function Theming() {
  return (
    <View style={{ gap: 40 }}>
      <PageHeader
        eyebrow="Docs"
        title="Theming"
        lede="ThemeProvider has seven independent controls. All optional, all runtime, no rebuilds."
      />
      <Section title="density" lede="How tight or roomy spacing feels: compact, default, or comfortable. Only padding and gaps change. Colours, radius, and type stay put.">
        <LiveDemo
          centered={false}
          code={`<View style={{ gap: 16 }}>
  {(['compact', 'default', 'comfortable'] as const).map((density) => (
    <ThemeProvider key={density} density={density}>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <Button intent="brand" prominence="bold" onPress={() => {}}>Save</Button>
        <Input placeholder={density} style={{ width: 160 }} />
        <Chip onPress={() => {}}>{density}</Chip>
      </View>
    </ThemeProvider>
  ))}
</View>`}
        />
      </Section>
      <Section title="colorMode" lede="light or dark. Drive it from the OS with useColorScheme.">
        <CodeSnippet
          code={`import { useColorScheme } from 'react-native';

const scheme = useColorScheme();
<ThemeProvider colorMode={scheme === 'dark' ? 'dark' : 'light'}>`}
        />
      </Section>
      <Section title="brand" lede="One seed colour, or a base/hover/active set. ThemeProvider builds a full, mode-correct ramp from it, so a rebrand reads well in light and dark with no per-mode tuning. The easiest way to recolour.">
        <LiveDemo
          code={`<ThemeProvider brand="#7C3AED">
  <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
    <Button intent="brand" prominence="bold" onPress={() => {}}>Save</Button>
    <Button intent="brand" prominence="subtle" onPress={() => {}}>Later</Button>
    <Chip intent="brand" selected onPress={() => {}}>Pinned</Chip>
    <Badge intent="brand">New</Badge>
  </View>
</ThemeProvider>`}
        />
        <Prose>
          Prefer brand over a hand-written colors override. A light-only override leaves selected items and subtle text low-contrast in dark mode; brand builds the dark ramp for you, so it stays legible.
        </Prose>
      </Section>
      <Section title="colors" lede="Deep-partial overrides for the intent colours. Write only the slots you change.">
        <CodeSnippet
          code={`<ThemeProvider
  colors={{
    brand: {
      bold: {
        default: { bg: '#7C3AED', fg: '#FFFFFF', border: '#7C3AED' },
        hover:   { bg: '#6D28D9', fg: '#FFFFFF', border: '#6D28D9' },
        active:  { bg: '#5B21B6', fg: '#FFFFFF', border: '#5B21B6' },
      },
    },
  }}
>`}
        />
      </Section>
      <Section title="scheme" lede="Overrides for everything that isn't an intent: surfaces, text colours, the focus ring. Usually applyCastTheme fills this for you from a Figma export.">
        <CodeSnippet code={`<ThemeProvider scheme={{ surface: { base: '#FAF7F2' } }}>`} />
      </Section>
      <Section title="fonts" lede="Swap the typeface. sans covers body and label text, display the headings, mono code. Omit display and it follows sans. The families must be loaded by your app.">
        <LiveDemo
          code={`<ThemeProvider fonts={{ display: '"Space Grotesk", sans-serif' }}>
  <View style={{ gap: 4 }}>
    <Text type="heading-sm">Ship faster</Text>
    <Text type="body-md">Headings take the display font. Body text stays on sans.</Text>
  </View>
</ThemeProvider>`}
        />
        <Prose>
          Load the font files first (see Icons and fonts). An unloaded family falls back to the system font, with a dev-only warning on the web. A cast-theme.json carries fonts too, so applyCastTheme sets this for you.
        </Prose>
      </Section>
      <Section title="motion" lede="Primitive-level motion overrides: durations, cycle lengths, easing beziers, springs. Semantic roles rebuild from them, so one number retimes every component that uses it.">
        <CodeSnippet
          code={`<ThemeProvider
  motion={{
    duration: { base: 300 },
    easingBezier: { standard: [0.3, 0, 0.1, 1] },
  }}
>`}
        />
        <Prose>
          Like colours, motion usually arrives from Figma: cast-sync exports the kit's motion collection into cast-theme.json and applyCastTheme maps it onto this prop.
        </Prose>
      </Section>
      <Section title="Nesting and reading the theme">
        <Prose>
          Providers nest: a compact data table can live inside a comfortable app. Your own components read the active theme with useTheme(), and animation code reads useMotion().
        </Prose>
        <CodeSnippet
          code={`import { useTheme, useMotion } from '@castui/cast-ui';

const { colors, scheme, density } = useTheme();
const motion = useMotion(); // tokens + reduceMotion + scale()`}
        />
      </Section>
    </View>
  );
}

function DesignTokens() {
  const { scheme } = useTheme();
  return (
    <View style={{ gap: 40 }}>
      <PageHeader
        eyebrow="Docs"
        title="Design tokens"
        lede="Nothing is hardcoded. Every value resolves down an alias chain that starts in Figma and ends on your screen."
      />
      <Section title="Four collections">
        <Prose>
          The kit holds four variable collections. component tokens alias semantic tokens, semantic tokens alias primitives, and motion stands alongside them, constant across density and colour mode.
        </Prose>
        <CodeSnippet
          language="text"
          code={`component   273 tokens · 3 density modes (compact / default / comfortable)
   ↓ aliases
semantic    235 tokens · 2 colour modes (light / dark)
   ↓ aliases
primitive   302 tokens · raw colour, space, size, radius, type

motion       54 tokens · durations, cycles, easing beziers, springs`}
        />
        <Text type="body-sm" color={scheme.text.description}>
          Committed mirrors live in design-tokens/*.tokens.json in the repo; the lean runtime copies are src/tokens and src/theme/themes.ts.
        </Text>
      </Section>
      <Section title="What density changes" lede="Only spacing: padding, gaps. Around a quarter of the component tokens. Colours, border radius, focus rings, icon sizes, and typography never move.">
        <LiveDemo
          code={`function Demo() {
  const { components, density } = useTheme();
  const b = components.button.default;
  return (
    <View style={{ gap: 4 }}>
      <Text type="label-md">{'density: ' + density}</Text>
      <Text type="body-sm">{'button padding: ' + b.paddingX + ' × ' + b.paddingY + ' · gap: ' + b.gap}</Text>
    </View>
  );
}`}
        />
      </Section>
      <Section title="Reading tokens in code">
        <CodeSnippet
          code={`const { colors, scheme, components } = useTheme();

colors.brand.bold.default.bg      // intent → prominence → state → channel
scheme.surface.subtle             // non-intent colours
components.button.large.gap       // density-varying spacing
const motion = useMotion();
motion.transition.standard        // { duration, easing }`}
        />
      </Section>
      <Section title="See the whole chain">
        <Prose>
          The Architecture page lays the tiers out as a cascade, from component tokens through semantic to primitive. Pick any component and follow its tokens down to the raw value they land on.
        </Prose>
      </Section>
    </View>
  );
}

function IconsAndFonts() {
  return (
    <View style={{ gap: 40 }}>
      <PageHeader
        eyebrow="Docs"
        title="Icons and fonts"
        lede="Three fonts, one icon component, zero icon packages."
      />
      <Section title="The fonts">
        <Prose>
          Geist carries all text. JetBrains Mono carries code. Material Symbols Outlined carries every icon as a font ligature: the Icon component renders a glyph by writing its name in the symbols font. Load them in your app shell; on the web that's two link tags:
        </Prose>
        <CodeSnippet
          language="html"
          code={`<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" rel="stylesheet" />`}
        />
        <Alert
          title="Icons showing as words?"
          description="That's the symbols font missing. There's no error: the ligature just doesn't form. Fix the font link, not the icon."
        />
      </Section>
      <Section title="Using icons">
        <LiveDemo
          code={`<View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
  <Icon name="palette" size="large" />
  <Icon name="favorite" size="large" fill color="#E11D48" />
  <Icon name="bolt" size="large" weight={600} />
  <Button intent="brand" prominence="bold" leadingIcon="add" onPress={() => {}}>New</Button>
</View>`}
        />
        <Prose>
          Anywhere a component takes leadingIcon, trailingIcon, or icon, pass a Material Symbols name string. Browse names at fonts.google.com/icons. Only the Outlined style is loaded; Rounded and Sharp are different fonts.
        </Prose>
      </Section>
    </View>
  );
}

function Breakpoints() {
  return (
    <View style={{ gap: 40 }}>
      <PageHeader
        eyebrow="Docs"
        title="Breakpoints"
        lede="Five width tiers for layouts that span phones to desktops. A fixed foundation: not themeable, not density-dependent."
      />
      <Section title="The scale">
        <CodeSnippet
          language="text"
          code={`base   < 600     phones, portrait
sm     ≥ 600     large phones, small tablets
md     ≥ 840     tablets
lg     ≥ 1200    laptops, desktops
xl     ≥ 1600    large desktops`}
        />
      </Section>
      <Section title="The hooks">
        <LiveDemo
          code={`function Demo() {
  const breakpoint = useBreakpoint();
  const wide = useMinWidth('md');
  const columns = useResponsiveValue({ base: 1, sm: 2, lg: 3 });
  return (
    <View style={{ gap: 4 }}>
      <Text type="body-sm">{'Active tier: ' + breakpoint}</Text>
      <Text type="body-sm">{'At least md wide: ' + String(wide)}</Text>
      <Text type="body-sm">{'Grid columns here: ' + columns}</Text>
    </View>
  );
}`}
        />
        <Prose>
          Resize the window and the values follow. useResponsiveValue falls back to the nearest tier below, so you only write the tiers where the layout actually changes.
        </Prose>
      </Section>
    </View>
  );
}

function CastSync() {
  return (
    <View style={{ gap: 40 }}>
      <PageHeader
        eyebrow="Docs"
        title="cast-sync"
        lede="Recolour and retime the system in Figma, export one file, ship no code."
      />
      <Section title="What it does">
        <Prose>
          cast-sync is the kit's Figma plugin. It reads the file's variables, follows every alias to its final value, and downloads cast-theme.json: colours by mode, text and surface colours, typography and shadows for reference, the motion block (version 4), and the font families (version 5). Everything runs locally inside Figma. The plugin has no network access.
        </Prose>
      </Section>
      <Section title="The round trip">
        <CodeSnippet
          language="text"
          code={`1. Edit variables in the cast-ui-kit file (colours, motion)
2. Run cast-sync → Download cast-theme.json
3. Drop the file into your app
4. <ThemeProvider {...applyCastTheme(theme, mode)}>`}
        />
        <CodeSnippet
          title="App.tsx"
          code={`import theme from './cast-theme.json';
import { ThemeProvider, applyCastTheme } from '@castui/cast-ui';

const [mode, setMode] = useState<'light' | 'dark'>('light');

<ThemeProvider {...applyCastTheme(theme, mode)}>
  <App />
</ThemeProvider>`}
        />
        <Prose>
          applyCastTheme pairs the file's colours with the mode you're rendering, maps text, surface, and focus ring into the scheme prop, and maps the motion block onto the motion prop. Old theme files load fine: missing sections are simply skipped.
        </Prose>
      </Section>
      <Section title="Try it here">
        <Prose>
          The Themes page on this site accepts a cast-theme.json and applies it live, so you can watch an export restyle every component before it goes near an app.
        </Prose>
      </Section>
    </View>
  );
}

function Agents() {
  return (
    <View style={{ gap: 40 }}>
      <PageHeader
        eyebrow="Docs"
        title="Building with agents"
        lede="Cast UI treats agents as first-class consumers. The same 1:1 naming that keeps design and code honest is what lets an agent generate correct code."
      />
      <Section title="Skills ship with the package">
        <Prose>
          npm install @castui/cast-ui brings a skills folder alongside the code. cast-ui-usage teaches an agent how to build app screens with the library: the design language, ThemeProvider, every component's props. cast-ui-component is the maintainer playbook for extending the library itself. cast-ui-docs-site covers extending this site. Point Claude, Cursor, or any skills-aware tool at node_modules/@castui/cast-ui/skills and it knows the system.
        </Prose>
        <CodeSnippet language="bash" code={`ls node_modules/@castui/cast-ui/skills
# cast-ui-usage/  cast-ui-component/  cast-ui-docs-site/`} />
      </Section>
      <Section title="Design to code through MCP">
        <Prose>
          Every Figma component is named char-for-char after its code export, its variant properties match the prop unions exactly, and its description carries the code path and the property mapping. An agent inspecting a kit node through the Figma MCP gets what it needs to emit real Cast UI code, not generic markup. Runtime seams, like a hover variant that is an event in code, are spelled out in the descriptions.
        </Prose>
      </Section>
      <Section title="Why generation stays correct">
        <Prose>
          Strings-only text children, one icon system, and a closed set of intent, prominence, and size values mean there are few wrong turns available. An agent that knows three props can compose most of the library, and the registry that renders this site is itself agent-readable data.
        </Prose>
      </Section>
    </View>
  );
}

export default function Docs() {
  const navigate = useNavigate();
  const location = useLocation();
  const wide = useMinWidth('md');
  const active = location.pathname.split('/')[2] ?? 'getting-started';

  return (
    <Page wide>
      <View style={{ flexDirection: 'row', gap: 40 }}>
        {wide ? (
          <View style={{ width: 220 }}>
            <View style={{ position: 'sticky' as never, top: 80 }}>
              <List>
                {DOC_PAGES.map((page) => (
                  <ListItem
                    key={page.slug}
                    selected={active === page.slug}
                    onPress={() => navigate(`/docs/${page.slug}`)}
                  >
                    {page.label}
                  </ListItem>
                ))}
              </List>
              <Divider style={{ marginVertical: 12 }} />
              <View style={{ gap: 8, paddingHorizontal: 12 }}>
                <Link size="small" href="https://main--6990f00d7b8682c18d2ed5f3.chromatic.com" trailingIcon="open_in_new">Storybook</Link>
                <Link size="small" href="https://github.com/Connagh/cast-ui" trailingIcon="open_in_new">GitHub</Link>
              </View>
            </View>
          </View>
        ) : null}
        <View style={{ flex: 1, minWidth: 0 }}>
          <Routes>
            <Route index element={<Navigate to="/docs/getting-started" replace />} />
            <Route path="getting-started" element={<GettingStarted />} />
            <Route path="theming" element={<Theming />} />
            <Route path="design-tokens" element={<DesignTokens />} />
            <Route path="icons-and-fonts" element={<IconsAndFonts />} />
            <Route path="breakpoints" element={<Breakpoints />} />
            <Route path="cast-sync" element={<CastSync />} />
            <Route path="agents" element={<Agents />} />
            <Route path="*" element={<Navigate to="/docs/getting-started" replace />} />
          </Routes>
        </View>
      </View>
    </Page>
  );
}
