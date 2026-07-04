/**
 * A live, editable example. The preview renders through react-native-web
 * with the full library in scope; the code is the exact text an app would
 * ship. Edit the code and the preview follows.
 */

import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live';
import { themes as prismThemes } from 'prism-react-renderer';
import { Button, Text, useTheme } from '@castui/cast-ui';
import { liveScope } from './scope';
import { openInSnack } from './snack';

export function LiveDemo({
  code,
  title,
  previewPadding = 24,
  centered = true,
  editorOpenByDefault = false,
  snack = true,
}: {
  code: string;
  title?: string;
  previewPadding?: number;
  centered?: boolean;
  editorOpenByDefault?: boolean;
  snack?: boolean;
}) {
  const { scheme, colorMode } = useTheme();
  const [showCode, setShowCode] = useState(editorOpenByDefault);

  // Two authoring styles are supported:
  //   1. A bare JSX expression (inline evaluation).
  //   2. One or more statements defining `Demo`, auto-rendered.
  const { transformed, noInline } = useMemo(() => {
    const definesDemo = /(function|const)\s+Demo\b/.test(code);
    if (definesDemo) {
      return { transformed: `${code}\n\nrender(<Demo />);`, noInline: true };
    }
    return { transformed: code, noInline: false };
  }, [code]);

  return (
    <LiveProvider
      code={transformed}
      scope={liveScope}
      noInline={noInline}
      theme={colorMode === 'dark' ? prismThemes.nightOwl : prismThemes.github}
      language="tsx"
    >
      <View
        style={{
          borderWidth: 1,
          borderColor: scheme.surface.overlay.border,
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        {title ? (
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderBottomWidth: 1,
              borderBottomColor: scheme.surface.overlay.border,
              backgroundColor: scheme.surface.subtle,
            }}
          >
            <Text type="label-sm" color={scheme.text.description}>
              {title}
            </Text>
          </View>
        ) : null}

        <View
          style={{
            padding: previewPadding,
            backgroundColor: scheme.surface.base,
            alignItems: centered ? 'center' : 'stretch',
            justifyContent: 'center',
            minHeight: 96,
          }}
        >
          <LivePreview />
          <LiveError
            style={{
              color: scheme.error.fg,
              fontFamily: 'JetBrains Mono',
              fontSize: 12,
              whiteSpace: 'pre-wrap',
            }}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 4,
            paddingHorizontal: 8,
            paddingVertical: 6,
            borderTopWidth: 1,
            borderTopColor: scheme.surface.overlay.border,
            backgroundColor: scheme.surface.subtle,
          }}
        >
          {snack ? (
            <Button
              intent="neutral"
              prominence="subtle"
              size="small"
              leadingIcon="smartphone"
              onPress={() => openInSnack(code, title)}
            >
              Run on a device
            </Button>
          ) : null}
          <Button
            intent="neutral"
            prominence="subtle"
            size="small"
            leadingIcon={showCode ? 'code_off' : 'code'}
            onPress={() => setShowCode((v) => !v)}
          >
            {showCode ? 'Hide code' : 'Edit code'}
          </Button>
        </View>

        {showCode ? (
          <View style={{ borderTopWidth: 1, borderTopColor: scheme.surface.overlay.border }}>
            <LiveEditor
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: 13,
                lineHeight: 1.55 as never,
              }}
            />
          </View>
        ) : null}
      </View>
    </LiveProvider>
  );
}
