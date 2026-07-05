import React from 'react';
import { View } from 'react-native';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, useTheme } from '@castui/cast-ui';
import { TEMPLATES } from './screens';

export default function TemplateScreen() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { scheme } = useTheme();
  const template = TEMPLATES.find((t) => t.slug === slug);
  const Screen = template?.component;

  return (
    <View style={{ minHeight: '100vh' as never, backgroundColor: scheme.surface.base }}>
      <View style={{ position: 'absolute' as never, top: 16, right: 16, zIndex: 50 }}>
        <Button size="small" leadingIcon="close" onPress={() => navigate('/templates')}>
          Back to templates
        </Button>
      </View>
      <View style={{ flex: 1, minHeight: '100vh' as never }}>{Screen ? <Screen /> : null}</View>
    </View>
  );
}
