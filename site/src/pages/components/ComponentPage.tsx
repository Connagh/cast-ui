import React from 'react';
import { View } from 'react-native';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Badge, Breadcrumb, Breadcrumbs, Chip, Divider, Link, Text, useTheme } from '@castui/cast-ui';
import { bySlug } from '../../data/registry';
import { Page, Section } from '../../ui/Page';
import { CodeSnippet } from '../../ui/CodeSnippet';
import { LiveDemo } from '../../ui/LiveDemo';
import { PropsTable } from '../../ui/PropsTable';

export default function ComponentPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { scheme, colors } = useTheme();
  const doc = slug ? bySlug(slug) : undefined;

  if (!doc) {
    return (
      <Page>
        <Alert intent="danger" title="Not found" description="No component with that name. Try the index." />
        <Link onPress={() => navigate('/components')}>Back to components</Link>
      </Page>
    );
  }

  const storybookUrl = `https://main--6990f00d7b8682c18d2ed5f3.chromatic.com/?path=/docs/components-${doc.name.toLowerCase()}--docs`;
  const sourceUrl = `https://github.com/Connagh/cast-ui/blob/main/src/components/${doc.name}/${doc.name}.tsx`;

  return (
    <Page>
      <View style={{ gap: 16 }}>
        <Breadcrumbs size="small">
          <Breadcrumb onPress={() => navigate('/')}>Home</Breadcrumb>
          <Breadcrumb onPress={() => navigate('/components')}>Components</Breadcrumb>
          <Breadcrumb current>{doc.name}</Breadcrumb>
        </Breadcrumbs>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Text type="display-sm">{doc.name}</Text>
          <Badge size="small">{doc.category}</Badge>
        </View>
        <Text type="body-lg" color={scheme.text.description} style={{ maxWidth: 720 }}>
          {doc.description}
        </Text>
        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
          <Link size="small" href={storybookUrl} trailingIcon="open_in_new">Storybook</Link>
          <Link size="small" href={sourceUrl} trailingIcon="open_in_new">Source</Link>
          <Link size="small" onPress={() => navigate('/playground')} trailingIcon="science">Playground</Link>
        </View>
        <CodeSnippet code={`import { ${doc.importNames} } from '@castui/cast-ui';`} />
      </View>

      {doc.motionRole ? (
        <Alert
          intent="brand"
          icon="animation"
          title="Motion"
          description={doc.motionRole}
        />
      ) : null}

      {doc.examples.map((example) => (
        <Section key={example.title} title={example.title}>
          <LiveDemo code={example.code} title={example.title} centered={example.centered !== false} />
        </Section>
      ))}

      <Section title="Props">
        <PropsTable rows={doc.props} />
        {doc.subProps?.map((sub) => (
          <View key={sub.title} style={{ gap: 8, marginTop: 8 }}>
            <Text type="title-sm">{sub.title}</Text>
            <PropsTable rows={sub.rows} />
          </View>
        ))}
      </Section>

      <Section title="Use it well">
        <View style={{ flexDirection: 'row', gap: 24, flexWrap: 'wrap' }}>
          <View style={{ flex: 1, minWidth: 280, gap: 8 }}>
            <Text type="label-md" color={colors.brand.subtle.default.fg}>DO</Text>
            {doc.dos.map((line) => (
              <Text key={line} type="body-sm">{`✓  ${line}`}</Text>
            ))}
          </View>
          <View style={{ flex: 1, minWidth: 280, gap: 8 }}>
            <Text type="label-md" color={scheme.error.fg}>DON'T</Text>
            {doc.donts.map((line) => (
              <Text key={line} type="body-sm">{`✕  ${line}`}</Text>
            ))}
          </View>
        </View>
      </Section>

      <Divider />
      <View style={{ gap: 12 }}>
        <Text type="label-md" color={scheme.text.description}>RELATED</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {doc.related.map((rel) => {
            const relDoc = bySlug(rel);
            if (!relDoc) return null;
            return (
              <Chip key={rel} onPress={() => navigate(`/components/${rel}`)}>
                {relDoc.name}
              </Chip>
            );
          })}
        </View>
      </View>
    </Page>
  );
}
