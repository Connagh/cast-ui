import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, Text as RNText, View } from 'react-native';
import {
  Alert,
  Badge,
  Button,
  Divider,
  Icon,
  Text,
  ThemeProvider,
  applyCastTheme,
  useMinWidth,
  useTheme,
  type CastThemeFile,
} from '@castui/cast-ui';
import { Page, PageHeader, Section } from '../../ui/Page';
import { CodeSnippet } from '../../ui/CodeSnippet';
import { ThemeShowcase } from './ThemeShowcase';
import { galleryThemes, downloadThemeFile, type GalleryTheme } from './themeGallery';

const FIGMA_KIT_URL =
  'https://www.figma.com/community/file/1648821010844688421/cast-ui-kit-for-react-native';

type PreviewMode = 'light' | 'dark';
type Selection = { kind: 'gallery'; id: string } | { kind: 'imported' };

/** A single theme in the left library rail. */
function ThemeCard({
  theme,
  active,
  onSelect,
}: {
  theme: GalleryTheme;
  active: boolean;
  onSelect: () => void;
}) {
  const { scheme, colors } = useTheme();
  const [hover, setHover] = useState(false);
  const borderColor = active ? colors.brand.default.default.border : scheme.surface.overlay.border;
  const bg = active
    ? colors.brand.subtle.hover.bg
    : hover
      ? scheme.surface.subtle
      : scheme.surface.overlay.bg;

  return (
    <Pressable
      onPress={onSelect}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderRadius: 14,
        borderWidth: active ? 2 : 1,
        borderColor,
        backgroundColor: bg,
      }}
    >
      {/* Brand swatch — base with hover/active pips */}
      <View style={{ width: 44, height: 44, borderRadius: 11, backgroundColor: theme.seed.base, padding: 5, justifyContent: 'flex-end', gap: 3 }}>
        <View style={{ flexDirection: 'row', gap: 3 }}>
          <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: theme.seed.hover ?? theme.seed.base }} />
          <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: theme.seed.active ?? theme.seed.base }} />
        </View>
      </View>

      <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
        <RNText
          style={{ fontFamily: theme.fonts.display, fontSize: 17, fontWeight: '600', color: scheme.text.primary }}
          numberOfLines={1}
        >
          {theme.name}
        </RNText>
        <Text type="caption" color={scheme.text.description} numberOfLines={2}>{theme.tagline}</Text>
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
          <RNText style={{ fontFamily: theme.fonts.display, fontSize: 11, color: scheme.text.description }} numberOfLines={1}>
            {`Aa ${theme.fontLabel.display}`}
          </RNText>
          <RNText style={{ fontFamily: theme.fonts.sans, fontSize: 11, color: scheme.text.description }} numberOfLines={1}>
            {`· ${theme.fontLabel.body}`}
          </RNText>
        </View>
      </View>

      <Button
        intent="neutral"
        prominence="subtle"
        size="small"
        leadingIcon="download"
        accessibilityLabel={`Download ${theme.name} theme`}
        onPress={() => downloadThemeFile(theme)}
      >
        {''}
      </Button>
    </Pressable>
  );
}

/** Fake browser chrome so the preview reads as a real product window. */
function WindowFrame({ url, children }: { url: string; children: React.ReactNode }) {
  const { scheme } = useTheme();
  return (
    <View
      style={{
        borderRadius: 16,
        borderWidth: 1,
        borderColor: scheme.surface.overlay.border,
        overflow: 'hidden',
        backgroundColor: scheme.surface.base,
        // Soft product-shot shadow (web only).
        boxShadow: '0 24px 60px -24px rgba(2, 6, 23, 0.35)' as unknown as undefined,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          paddingHorizontal: 14,
          paddingVertical: 10,
          backgroundColor: scheme.surface.overlay.bg,
          borderBottomWidth: 1,
          borderBottomColor: scheme.surface.overlay.border,
        }}
      >
        {/* Decorative traffic lights — deliberately fixed colours, not themed. */}
        <View style={{ flexDirection: 'row', gap: 7 }}>
          <View style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: '#FF5F57' }} />
          <View style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: '#FEBC2E' }} />
          <View style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: '#28C840' }} />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            maxWidth: 320,
            alignSelf: 'center',
            backgroundColor: scheme.surface.subtle,
            borderRadius: 8,
            paddingVertical: 4,
            paddingHorizontal: 10,
          }}
        >
          <Icon name="lock" size="xs" color={scheme.text.description} />
          <Text type="caption" color={scheme.text.description} numberOfLines={1}>{url}</Text>
        </View>
        <Icon name="more_horiz" size="small" color={scheme.text.description} />
      </View>
      {children}
    </View>
  );
}

export default function Themes() {
  const { scheme, colors } = useTheme();
  const wide = useMinWidth('lg');
  const [selection, setSelection] = useState<Selection>({ kind: 'gallery', id: 'cast' });
  const [previewMode, setPreviewMode] = useState<PreviewMode>('light');
  const [imported, setImported] = useState<CastThemeFile | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const activeTheme: GalleryTheme =
    galleryThemes.find((t) => selection.kind === 'gallery' && t.id === selection.id) ?? galleryThemes[0];

  // Fade + lift the preview whenever the applied theme or mode changes, so the
  // reskin reads as a deliberate transition rather than a jump.
  const anim = useRef(new Animated.Value(1)).current;
  const transitionKey = selection.kind === 'imported' ? `imported-${previewMode}` : `${activeTheme.id}-${previewMode}`;
  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, { toValue: 1, duration: 420, useNativeDriver: false }).start();
  }, [transitionKey, anim]);
  const animStyle = {
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
  };

  const selectGallery = (theme: GalleryTheme) => {
    setSelection({ kind: 'gallery', id: theme.id });
    setPreviewMode(theme.mode);
  };

  const onFile = (file: File | undefined) => {
    if (!file) return;
    file
      .text()
      .then((text) => {
        setImported(JSON.parse(text) as CastThemeFile);
        setImportError(null);
        setSelection({ kind: 'imported' });
      })
      .catch(() => setImportError('That file is not valid JSON. Export it again from cast-sync.'));
  };

  // Preview provider props: gallery themes apply brand + fonts directly (the
  // real consumer API); an imported file goes through applyCastTheme.
  const previewProps =
    selection.kind === 'imported' && imported
      ? applyCastTheme(imported, previewMode)
      : { colorMode: previewMode, brand: activeTheme.seed, fonts: activeTheme.fonts };

  const applyCode = useMemo(
    () =>
      selection.kind === 'imported'
        ? `import theme from './cast-theme.json';
import { ThemeProvider, applyCastTheme } from '@castui/cast-ui';

<ThemeProvider {...applyCastTheme(theme, '${previewMode}')}>
  <App />
</ThemeProvider>`
        : `import theme from './cast-theme-${activeTheme.id}.json';
import { ThemeProvider, applyCastTheme } from '@castui/cast-ui';

// One object drives brand colour, light/dark and the type pairing.
<ThemeProvider {...applyCastTheme(theme, '${previewMode}')}>
  <App />
</ThemeProvider>`,
    [selection.kind, activeTheme.id, previewMode],
  );

  const ModeToggle = (
    <View style={{ flexDirection: 'row', gap: 4, backgroundColor: scheme.surface.subtle, borderRadius: 10, padding: 3 }}>
      {(['light', 'dark'] as const).map((m) => {
        const on = previewMode === m;
        return (
          <Pressable
            key={m}
            onPress={() => setPreviewMode(m)}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 8,
              backgroundColor: on ? scheme.surface.overlay.bg : 'transparent',
            }}
          >
            <Icon name={m === 'light' ? 'light_mode' : 'dark_mode'} size="xs" color={on ? colors.brand.subtle.default.fg : scheme.text.description} />
            <Text type="label-sm" color={on ? scheme.text.primary : scheme.text.description}>{m === 'light' ? 'Light' : 'Dark'}</Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <Page wide>
      <PageHeader
        eyebrow="Themes"
        title="One object. A whole product, reskinned."
        lede="Every theme below is a brand colour and a font pairing in a single object. Pick one and the product on the right restyles live, in light and dark. Download any theme as a cast-theme.json and drop it into your own app."
      />

      <View style={{ flexDirection: wide ? 'row' : 'column', gap: 20, alignItems: 'flex-start' }}>
        {/* Left rail — the theme library */}
        <View style={{ width: wide ? 340 : '100%', gap: 12, ...(wide ? { position: 'sticky' as never, top: 80 } : null) }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text type="label-sm" color={scheme.text.description}>THEME LIBRARY</Text>
            <Badge intent="neutral" variant="subtle" size="small">{`${galleryThemes.length}`}</Badge>
          </View>

          {galleryThemes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              active={selection.kind === 'gallery' && selection.id === theme.id}
              onSelect={() => selectGallery(theme)}
            />
          ))}

          {/* Imported theme, once a file is loaded */}
          {imported ? (
            <Pressable
              onPress={() => setSelection({ kind: 'imported' })}
              accessibilityRole="button"
              accessibilityState={{ selected: selection.kind === 'imported' }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                borderRadius: 14,
                borderWidth: selection.kind === 'imported' ? 2 : 1,
                borderColor: selection.kind === 'imported' ? colors.brand.default.default.border : scheme.surface.overlay.border,
                backgroundColor: selection.kind === 'imported' ? colors.brand.subtle.hover.bg : scheme.surface.overlay.bg,
              }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 11, backgroundColor: scheme.surface.subtle, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="upload_file" color={colors.brand.subtle.default.fg} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text type="label-md" numberOfLines={1}>{imported.name ?? 'Imported theme'}</Text>
                <Text type="caption" color={scheme.text.description}>From your cast-theme.json</Text>
              </View>
              <Button intent="neutral" prominence="subtle" size="small" leadingIcon="close" accessibilityLabel="Clear imported theme" onPress={() => { setImported(null); setSelection({ kind: 'gallery', id: 'cast' }); }}>{''}</Button>
            </Pressable>
          ) : null}

          {/* Create your own — cast-sync callback */}
          <View
            style={{
              gap: 10,
              padding: 16,
              borderRadius: 14,
              borderWidth: 1,
              borderStyle: 'dashed' as const,
              borderColor: scheme.surface.overlay.border,
              backgroundColor: scheme.surface.subtle,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="brush" size="small" color={colors.brand.subtle.default.fg} />
              <Text type="label-md">Create your own</Text>
            </View>
            <Text type="body-sm" color={scheme.text.description}>
              Recolour and swap fonts on the cast-ui kit in Figma, run the cast-sync plugin, and export a cast-theme.json. It drops straight into the preview.
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              <Button intent="brand" prominence="bold" size="small" leadingIcon="open_in_new" onPress={() => window.open(FIGMA_KIT_URL, '_blank', 'noopener')}>
                Open in Figma
              </Button>
              <Button intent="neutral" prominence="default" size="small" leadingIcon="upload_file" onPress={() => fileRef.current?.click()}>
                Import a file
              </Button>
            </View>
            {importError ? <Alert intent="danger" size="small" title="Couldn't read that file" description={importError} /> : null}
            <input ref={fileRef} type="file" accept="application/json,.json" style={{ display: 'none' }} onChange={(e) => onFile(e.target.files?.[0])} />
          </View>
        </View>

        {/* Right — the live product preview */}
        <View style={{ flex: 1, minWidth: 0, width: '100%', gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Text type="title-sm">
                {selection.kind === 'imported' ? (imported?.name ?? 'Imported') : activeTheme.name}
              </Text>
              <Badge intent="brand" variant="subtle" size="small" dot>Live</Badge>
            </View>
            {ModeToggle}
          </View>

          <Animated.View style={animStyle}>
            <ThemeProvider {...previewProps}>
              <WindowFrame url="app.northwind.io">
                <ThemeShowcase />
              </WindowFrame>
            </ThemeProvider>
          </Animated.View>

          <Section title="Apply this theme in your app">
            <CodeSnippet title="App.tsx" code={applyCode} />
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              {selection.kind === 'imported' ? (
                <Text type="body-sm" color={scheme.text.description}>Your imported file applies exactly like a gallery theme.</Text>
              ) : (
                <Button intent="brand" prominence="bold" leadingIcon="download" onPress={() => downloadThemeFile(activeTheme)}>
                  {`Download ${activeTheme.name} theme`}
                </Button>
              )}
              <Button intent="neutral" prominence="subtle" leadingIcon="menu_book" onPress={() => window.open(FIGMA_KIT_URL, '_blank', 'noopener')}>
                About cast-sync
              </Button>
            </View>
            <Text type="body-sm" color={scheme.text.description}>
              The file carries the brand colours for light and dark plus the font families. Load the fonts in your app, then applyCastTheme maps the rest onto ThemeProvider.
            </Text>
          </Section>
        </View>
      </View>
    </Page>
  );
}
