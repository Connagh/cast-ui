import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { Badge, Input, Text, useTheme } from '@castui/cast-ui';
import { byCategory, categories, registry } from '../../data/registry';
import { Page, PageHeader } from '../../ui/Page';
import { CodeSnippet } from '../../ui/CodeSnippet';

function ComponentCard({ slug, name, summary }: { slug: string; name: string; summary: string }) {
  const { scheme } = useTheme();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  return (
    <Pressable
      accessibilityRole="link"
      onPress={() => navigate(`/components/${slug}`)}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={{
        width: 300,
        borderWidth: 1,
        borderColor: hovered ? scheme.intents.brand.default.default.border : scheme.surface.overlay.border,
        borderRadius: 12,
        padding: 16,
        gap: 6,
        backgroundColor: hovered ? scheme.surface.subtle : scheme.surface.base,
      }}
    >
      <Text type="title-sm">{name}</Text>
      <Text type="body-sm" color={scheme.text.description}>
        {summary}
      </Text>
    </Pressable>
  );
}

export default function ComponentsIndex() {
  const { scheme } = useTheme();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return registry.filter(
      (c) => c.name.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <Page wide>
      <PageHeader
        eyebrow="Components"
        title={`${registry.length} components, one import`}
        lede="Every component runs on iOS, Android, and the web from the same code. Each page has live editable examples, the full prop set, and guidance on when to reach for it."
      />
      <View style={{ gap: 12, maxWidth: 420 }}>
        <Input
          placeholder={`Search ${registry.length} components…`}
          leadingIcon="search"
          value={query}
          onChangeText={setQuery}
          accessibilityLabel="Search components"
        />
        <CodeSnippet code="npm install @castui/cast-ui" language="bash" />
      </View>

      {filtered ? (
        <View style={{ gap: 16 }}>
          <Text type="body-sm" color={scheme.text.description}>
            {filtered.length === 0 ? 'Nothing matches. Try a different word.' : `${filtered.length} match${filtered.length === 1 ? '' : 'es'}`}
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
            {filtered.map((c) => (
              <ComponentCard key={c.slug} slug={c.slug} name={c.name} summary={c.summary} />
            ))}
          </View>
        </View>
      ) : (
        categories.map((category) => {
          const items = byCategory(category);
          if (items.length === 0) return null;
          return (
            <View key={category} style={{ gap: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text type="heading-sm">{category}</Text>
                <Badge size="small">{String(items.length)}</Badge>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
                {items.map((c) => (
                  <ComponentCard key={c.slug} slug={c.slug} name={c.name} summary={c.summary} />
                ))}
              </View>
            </View>
          );
        })
      )}
    </Page>
  );
}
