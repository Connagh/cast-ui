/**
 * CodeBlock — a block of monospaced code on a subtle surface.
 *
 * Maps 1:1 to the Figma <CodeBlock> component (code-block):
 *   size → small | default | large   (padding, gap, mono type scale)
 *
 * Renders code in JetBrains Mono via the mono font family. An optional header
 * row shows a title/filename and a language tag; an optional copy button copies
 * the code. Copy uses the web Clipboard API when available, so the package keeps
 * zero dependencies, and always calls the `onCopy` callback so a native host can
 * wire its own clipboard. Optional line numbers render in a muted gutter. Long
 * lines scroll horizontally rather than wrapping.
 *
 * Colours: the surface is surface/subtle with the shared overlay border; code
 * text is text/primary; the gutter, title, language tag, and copy icon use
 * text/description. Tokens: code-block/{size}/{padding,gap} (density-varying)
 * and a constant code-block/border-radius. Typography uses the body scale in the
 * mono family, constant across densities. Fonts are consumer-loaded.
 */

import React, { useCallback, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';
import { fontFamily, fontWeight, body, caption } from '../../tokens';
import { Icon } from '../Icon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type CodeBlockSize = 'small' | 'default' | 'large';

export type CodeBlockProps = {
  /** The code to display. Newlines split into lines. */
  children: string;
  /** Size variant — controls padding, gap, and the mono type scale. */
  size?: CodeBlockSize;
  /** Language tag shown in the header (e.g. "tsx"). Display only. */
  language?: string;
  /** Title/filename shown in the header. */
  title?: string;
  /** Show the copy button. Defaults to true. */
  showCopy?: boolean;
  /** Show a line-number gutter. Defaults to false. */
  showLineNumbers?: boolean;
  /** Called with the code when the copy button is pressed. */
  onCopy?: (code: string) => void;
  /** Outer style — use for positioning (margin, width, alignSelf). */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label. */
  accessibilityLabel?: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maps size → body typography scale (rendered in the mono family). */
const MONO_SCALE: Record<CodeBlockSize, typeof body.sm> = {
  small: body.sm,
  default: body.md,
  large: body.lg,
};

/** How long the "copied" check stays visible. */
const COPIED_RESET_MS = 1500;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CodeBlock({
  children,
  size = 'default',
  language,
  title,
  showCopy = true,
  showLineNumbers = false,
  onCopy,
  style,
  accessibilityLabel,
}: CodeBlockProps) {
  const { components, scheme } = useTheme();
  const tokens = components.codeBlock[size];
  const radius = components.codeBlock.borderRadius;
  const mono = MONO_SCALE[size];

  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    try {
      if (
        typeof navigator !== 'undefined' &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === 'function'
      ) {
        navigator.clipboard.writeText(children);
      }
    } catch {
      // Clipboard unavailable (native / insecure context) — onCopy still fires.
    }
    onCopy?.(children);
    setCopied(true);
    setTimeout(() => setCopied(false), COPIED_RESET_MS);
  }, [children, onCopy]);

  const lines = children.split('\n');
  const gutterDigits = String(lines.length).length;

  const codeTextStyle = {
    fontFamily: fontFamily.mono,
    fontWeight: fontWeight.regular,
    fontSize: mono.fontSize,
    lineHeight: mono.lineHeight,
    color: scheme.text.primary,
  } as const;

  const showHeader = Boolean(title) || Boolean(language) || showCopy;

  return (
    <View
      accessibilityLabel={accessibilityLabel || title || 'Code block'}
      style={[
        {
          backgroundColor: scheme.surface.subtle,
          borderWidth: 1,
          borderColor: scheme.surface.overlay.border,
          borderRadius: radius,
          padding: tokens.padding,
          gap: tokens.gap,
        },
        style,
      ]}
    >
      {showHeader ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: tokens.gap,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.gap, flexShrink: 1 }}>
            {title ? (
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: fontFamily.mono,
                  fontWeight: fontWeight.medium,
                  fontSize: body.sm.fontSize,
                  lineHeight: body.sm.lineHeight,
                  color: scheme.text.description,
                }}
              >
                {title}
              </Text>
            ) : null}
            {language ? (
              <Text
                style={{
                  fontFamily: fontFamily.mono,
                  fontWeight: fontWeight.medium,
                  fontSize: caption.fontSize,
                  lineHeight: caption.lineHeight,
                  letterSpacing: caption.letterSpacing,
                  color: scheme.text.description,
                  textTransform: 'uppercase',
                }}
              >
                {language}
              </Text>
            ) : null}
          </View>

          {showCopy ? (
            <Pressable
              onPress={handleCopy}
              accessibilityRole="button"
              accessibilityLabel={copied ? 'Copied' : 'Copy code'}
              hitSlop={8}
            >
              <Icon
                name={copied ? 'check' : 'content_copy'}
                size="small"
                color={copied ? scheme.text.primary : scheme.text.description}
              />
            </Pressable>
          ) : null}
        </View>
      ) : null}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} bounces={false}>
        {showLineNumbers ? (
          <View>
            {lines.map((line, i) => (
              <View key={i} style={{ flexDirection: 'row' }}>
                <Text
                  selectable={false}
                  style={{
                    ...codeTextStyle,
                    color: scheme.text.description,
                    textAlign: 'right',
                    minWidth: gutterDigits * (mono.fontSize * 0.62),
                    marginRight: tokens.gap,
                  }}
                >
                  {String(i + 1)}
                </Text>
                <Text selectable style={codeTextStyle}>
                  {line.length ? line : ' '}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text selectable style={codeTextStyle}>
            {children}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
