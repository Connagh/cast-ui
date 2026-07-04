import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import {
  Alert,
  Badge,
  Button,
  Card,
  Chip,
  Divider,
  Input,
  Progress,
  Text,
  ThemeProvider,
  Toggle,
  applyCastTheme,
  easingBezier,
  motionTokens,
  useTheme,
  type CastThemeFile,
} from '@castui/cast-ui';
import { brandPresets, useSiteTheme } from '../../theme/SiteTheme';
import { Page, PageHeader, Prose, Section } from '../../ui/Page';
import { CodeSnippet } from '../../ui/CodeSnippet';

/** A swatch of components used to preview a theme. */
function PreviewSlice({ label }: { label: string }) {
  const { scheme } = useTheme();
  return (
    <Card variant="elevated" style={{ flex: 1, minWidth: 280 }}>
      <View style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="label-md">{label}</Text>
          <Badge intent="brand" size="small" dot>Active</Badge>
        </View>
        <Input size="small" label="Email" placeholder="you@example.com" />
        <Progress value={64} size="small" />
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="small" intent="brand" prominence="bold" onPress={() => {}}>Save</Button>
          <Button size="small" onPress={() => {}}>Cancel</Button>
          <Chip size="small" intent="brand" selected onPress={() => {}}>Pinned</Chip>
        </View>
        <Toggle size="small" checked onChange={() => {}}>Notifications</Toggle>
        <Text type="caption" color={scheme.text.description}>Everything above reads one theme object.</Text>
      </View>
    </Card>
  );
}

function downloadJson(name: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Themes() {
  const site = useSiteTheme();
  const { scheme } = useTheme();
  const [imported, setImported] = useState<CastThemeFile | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importedMode, setImportedMode] = useState<'light' | 'dark'>('light');
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    file
      .text()
      .then((text) => {
        const parsed = JSON.parse(text) as CastThemeFile;
        setImported(parsed);
        setImportError(null);
      })
      .catch(() => setImportError('That file is not valid JSON. Export it again from cast-sync.'));
  };

  const exportCurrent = () => {
    const preset = brandPresets.find((p) => p.id === site.brandId) ?? brandPresets[0];
    const brand = preset.colors?.brand;
    const file = {
      name: `cast-ui site · ${preset.label}`,
      description: 'Example theme exported from the Cast UI docs site. Shaped like a cast-sync export.',
      generatedAt: new Date().toISOString(),
      version: 4,
      colors: brand ? { light: { brand }, dark: { brand } } : {},
      motion: {
        duration: motionTokens.duration,
        cycle: motionTokens.cycle,
        easing: easingBezier,
        spring: motionTokens.spring,
      },
    };
    downloadJson('cast-theme.json', file);
  };

  return (
    <Page wide>
      <PageHeader
        eyebrow="Themes"
        title="One theme object, everywhere"
        lede="Colour, surfaces, and motion are all runtime theme inputs. Change a preset here and the whole site follows, or load a cast-theme.json straight from the Figma kit."
      />

      <Section title="Presets" lede="These drive the global theme controls in the top bar. The same object could ship to an app unchanged.">
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {brandPresets.map((preset) => (
            <Chip
              key={preset.id}
              intent="brand"
              selected={site.brandId === preset.id}
              onPress={() => site.setBrandId(preset.id)}
            >
              {preset.label}
            </Chip>
          ))}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          <PreviewSlice label="Your current theme" />
          <ThemeProvider colorMode={site.colorMode === 'light' ? 'dark' : 'light'} colors={(brandPresets.find((p) => p.id === site.brandId) ?? brandPresets[0]).colors}>
            <PreviewSlice label={site.colorMode === 'light' ? 'Same theme, dark' : 'Same theme, light'} />
          </ThemeProvider>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button size="small" leadingIcon="download" onPress={exportCurrent}>Download as cast-theme.json</Button>
        </View>
      </Section>

      <Section
        title="Load a cast-theme.json"
        lede="Run cast-sync in the Figma kit, download the file, and drop it here. The preview below applies it with applyCastTheme, exactly as an app would."
      >
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button intent="brand" leadingIcon="upload_file" onPress={() => fileRef.current?.click()}>
            Choose file
          </Button>
          {imported ? (
            <>
              <Badge intent="brand" leadingIcon="check">{imported.name ?? 'theme loaded'}</Badge>
              <Chip size="small" selected={importedMode === 'light'} onPress={() => setImportedMode('light')}>light</Chip>
              <Chip size="small" selected={importedMode === 'dark'} onPress={() => setImportedMode('dark')}>dark</Chip>
              <Button size="small" prominence="subtle" leadingIcon="close" onPress={() => setImported(null)}>Clear</Button>
            </>
          ) : null}
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </View>
        {importError ? <Alert intent="danger" title="Couldn't read that file" description={importError} /> : null}
        {imported ? (
          <ThemeProvider {...applyCastTheme(imported, importedMode)}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
              <PreviewSlice label="Imported theme" />
            </View>
          </ThemeProvider>
        ) : (
          <Text type="body-sm" color={scheme.text.description}>
            No file yet. The Download button above gives you a valid example to try.
          </Text>
        )}
      </Section>

      <Section title="Apply it in an app">
        <CodeSnippet
          title="App.tsx"
          code={`import theme from './cast-theme.json';
import { ThemeProvider, applyCastTheme } from '@castui/cast-ui';

<ThemeProvider {...applyCastTheme(theme, mode)}>
  <App />
</ThemeProvider>`}
        />
        <Prose>
          applyCastTheme maps the file's colours onto the intent system, its text, surface, and focus ring onto the scheme, and its motion block onto the motion tokens. Old files without newer sections load without complaint.
        </Prose>
        <Divider />
        <Prose>
          The full pipeline: variables in Figma, cast-sync export, one JSON file in your repo, ThemeProvider at the root. Recolour and retime a shipped app without a build.
        </Prose>
      </Section>
    </Page>
  );
}
