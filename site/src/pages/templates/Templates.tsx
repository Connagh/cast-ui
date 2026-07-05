import React from 'react';
import { View } from 'react-native';
import { useNavigate } from 'react-router-dom';
import { Button, Text, useTheme } from '@castui/cast-ui';
import { Page, PageHeader } from '../../ui/Page';
import { TEMPLATES } from './screens';

function TemplateCard({ slug, name, summary, children }: { slug: string; name: string; summary: string; children: React.ReactNode }) {
  const { scheme } = useTheme();
  const navigate = useNavigate();
  return (
    <View style={{ width: 380, gap: 12 }}>
      <View
        style={{
          height: 560,
          borderWidth: 1,
          borderColor: scheme.surface.overlay.border,
          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: scheme.surface.base,
        }}
      >
        {children}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text type="title-sm">{name}</Text>
          <Text type="body-sm" color={scheme.text.description}>{summary}</Text>
        </View>
        <Button size="small" trailingIcon="open_in_full" onPress={() => navigate(`/templates/${slug}/full`)}>
          Full screen
        </Button>
      </View>
    </View>
  );
}

export default function Templates() {
  return (
    <Page wide>
      <PageHeader
        eyebrow="Templates"
        title="Whole screens, plug in your content"
        lede="Each template is a working screen built from the components on this site, in a phone-sized frame. They respond to the global theme controls, and every one has a full-screen route you can walk through."
      />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 32 }}>
        {TEMPLATES.map((t) => {
          const Screen = t.component;
          return (
            <TemplateCard key={t.slug} slug={t.slug} name={t.name} summary={t.summary}>
              <Screen />
            </TemplateCard>
          );
        })}
      </View>
    </Page>
  );
}
