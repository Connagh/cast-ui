import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, Text as RNText, View } from 'react-native';
import {
  Alert,
  Badge,
  Button,
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
import { galleryThemes, buildThemeFile, downloadThemeFile, type GalleryTheme } from './themeGallery';

const FIGMA_KIT_URL =
  'https://www.figma.com/community/file/1648821010844688421/cast-ui-kit-for-react-native';

type PreviewMode = 'light' | 'dark';
type Selection = { kind: 'gallery'; id: string } | { kind: 'imported' };

const DENSITY_ICON: Record<string, string> = {
  compact: 'density_small',
  default: 'density_medium',
  comfortable: 'density_large',
};
const DENSITY_LABEL: Record<string, string> = {
  compact: 'Compact',
  default: 'Cozy',
  comfortable: 'Comfortable',
};

/** Tile colours for a theme in a given mode, with a sensible fallback for
 * themes (Cast) that leave a mode on the library default. */
function swatchOf(theme: GalleryTheme, mode: PreviewMode) {
  const s = theme[mode];
  if (s) return { bg: s.overlayBg, base: s.base, border: s.overlayBorder, fg: s.primary };
  return mode === 'dark'
    ? { bg: '#111827', base: '#0B1220', border: '#1F2937', fg: '#E5E7EB' }
    : { bg: '#FFFFFF', base: '#F9FAFB', border: '#E5E7EB', fg: '#374151' };
}

/** A single theme in the left library rail. The tile is a live specimen: the
 * theme's own surface, brand ramp and display face, all inline-styled. */
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
  const tile = swatchOf(theme, theme.mode);
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
        gap: 10,
        padding: 12,
        borderRadius: 16,
        borderWidth: active ? 2 : 1,
        borderColor,
        backgroundColor: bg,
        transform: [{ translateY: hover && !active ? -2 : 0 }],
        boxShadow: (active
          ? '0 10px 24px -14px rgba(2,6,23,0.45)'
          : hover
            ? '0 8px 20px -16px rgba(2,6,23,0.4)'
            : 'none') as unknown as undefined,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        {/* Specimen tile — the theme's surface + brand + display face */}
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 14,
            backgroundColor: tile.base,
            borderWidth: 1,
            borderColor: tile.border,
            padding: 6,
            justifyContent: 'space-between',
          }}
        >
          <RNText
            style={{ fontFamily: theme.fonts.display, fontSize: 22, lineHeight: 26, fontWeight: '600', color: theme.seed.base }}
            numberOfLines={1}
          >
            Aa
          </RNText>
          <View style={{ flexDirection: 'row', gap: 3 }}>
            {[theme.seed.base, theme.seed.hover ?? theme.seed.base, theme.seed.active ?? theme.seed.base].map((c, i) => (
              <View key={i} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: c }} />
            ))}
          </View>
        </View>

        <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
          <RNText
            style={{ fontFamily: theme.fonts.display, fontSize: 18, fontWeight: '600', color: scheme.text.primary }}
            numberOfLines={1}
          >
            {theme.name}
          </RNText>
          <Text type="caption" color={scheme.text.description} numberOfLines={2}>{theme.tagline}</Text>
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
      </View>

      {/* Meta row — font pairing + the spacing carried in the file */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, flex: 1, minWidth: 0 }}>
          <RNText style={{ fontFamily: theme.fonts.display, fontSize: 12, color: scheme.text.description }} numberOfLines={1}>
            {theme.fontLabel.display}
          </RNText>
          <RNText style={{ fontFamily: theme.fonts.sans, fontSize: 11, color: scheme.text.description }} numberOfLines={1}>
            {`· ${theme.fontLabel.body}`}
          </RNText>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name={DENSITY_ICON[theme.density]} size="xs" color={scheme.text.description} />
          <Text type="caption" color={scheme.text.description}>{DENSITY_LABEL[theme.density]}</Text>
        </View>
      </View>
    </Pressable>
  );
}

/** One pill in the "what's in this file" strip. */
function FilePill({ icon, label, dot }: { icon?: string; label: string; dot?: string }) {
  const { scheme } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: scheme.surface.overlay.border,
        backgroundColor: scheme.surface.overlay.bg,
      }}
    >
      {dot ? (
        <View style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: dot, borderWidth: 1, borderColor: 'rgba(0,0,0,0.12)' }} />
      ) : icon ? (
        <Icon name={icon} size="xs" color={scheme.text.description} />
      ) : null}
      <Text type="label-sm" color={scheme.text.primary}>{label}</Text>
    </View>
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

  // Build the theme file once per selected theme. The preview and the download
  // are the SAME object, applied the same way — nothing diverges.
  const activeFile = useMemo(() => buildThemeFile(activeTheme), [activeTheme]);

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

  // Preview provider props: BOTH gallery and imported themes go through the
  // real consumer API, applyCastTheme(file, mode). Brand, fonts AND spacing all
  // come from the file.
  const previewProps =
    selection.kind === 'imported' && imported
      ? applyCastTheme(imported, previewMode)
      : applyCastTheme(activeFile, previewMode);

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

// One file carries brand colour, the font pairing AND the spacing,
// for light and dark. applyCastTheme maps it onto ThemeProvider.
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

  // The "what's in this file" strip for the active gallery theme.
  const fileStrip =
    selection.kind === 'imported' ? null : (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <FilePill dot={activeTheme.swatch} label={activeTheme.swatch.toUpperCase()} />
        <FilePill icon="text_fields" label={`${activeTheme.fontLabel.display} / ${activeTheme.fontLabel.body}`} />
        <FilePill icon={DENSITY_ICON[activeTheme.density]} label={`${DENSITY_LABEL[activeTheme.density]} spacing`} />
        {activeTheme.tags.map((t) => (
          <FilePill key={t} label={t} />
        ))}
      </View>
    );

  return (
    <Page wide>
      <PageHeader
        eyebrow="Themes"
        title="One file. A whole product, reskinned."
        lede="Every theme here is a single object: brand colour, a font pairing and a spacing rhythm, for light and dark. Pick one and the product on the right restyles live. Download any theme as a cast-theme.json and drop it into your own app. What you see is exactly what you download."
      />

      <View style={{ flexDirection: wide ? 'row' : 'column', gap: 20, alignItems: 'flex-start' }}>
        {/* Left rail — the theme library */}
        <View style={{ width: wide ? 360 : '100%', gap: 12, ...(wide ? { position: 'sticky' as never, top: 80 } : null) }}>
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
                borderRadius: 16,
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
              borderRadius: 16,
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
              Recolour, swap fonts and set the spacing on the cast-ui kit in Figma, run the cast-sync plugin, and export a cast-theme.json. It drops straight into the preview.
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

          {fileStrip}

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
              The file carries the brand colours, surfaces and text for light and dark, the font families, and the spacing density. Load the fonts in your app, then applyCastTheme maps the rest onto ThemeProvider.
            </Text>
          </Section>
        </View>
      </View>
    </Page>
  );
}
