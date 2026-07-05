import React, { useState } from 'react';
import { View } from 'react-native';
import { Chip, Text, useTheme } from '@castui/cast-ui';
import { Page, PageHeader } from '../../ui/Page';
import { LiveDemo } from '../../ui/LiveDemo';

export const STARTERS: Record<string, { label: string; code: string }> = {
  hello: {
    label: 'Hello',
    code: `function Demo() {
  const [count, setCount] = useState(0);
  return (
    <Card variant="elevated" style={{ width: 320 }}>
      <View style={{ gap: 12, alignItems: 'flex-start' }}>
        <Text type="heading-sm">Hello, Cast UI</Text>
        <Text type="body-md">{'Pressed ' + count + ' times'}</Text>
        <Button intent="brand" prominence="bold" leadingIcon="add" onPress={() => setCount((c) => c + 1)}>
          Press me
        </Button>
      </View>
    </Card>
  );
}`,
  },
  form: {
    label: 'A form',
    code: `function Demo() {
  const [name, setName] = useState('');
  const [role, setRole] = useState<string | null>('design');
  const [tos, setTos] = useState(false);
  return (
    <Card style={{ width: 340 }}>
      <View style={{ gap: 12 }}>
        <Text type="title-md">Invite a teammate</Text>
        <Input label="Name" value={name} onChangeText={setName} placeholder="Ada Lovelace" />
        <Select type="single" label="Role" value={role} onValueChange={setRole}>
          <SelectOption value="design">Designer</SelectOption>
          <SelectOption value="eng">Engineer</SelectOption>
          <SelectOption value="pm">Product</SelectOption>
        </Select>
        <Checkbox checked={tos} onChange={setTos}>Can manage billing</Checkbox>
        <Button intent="brand" prominence="bold" disabled={!name} onPress={() => {}}>
          Send invite
        </Button>
      </View>
    </Card>
  );
}`,
  },
  overlay: {
    label: 'Overlays',
    code: `function Demo() {
  const [sheet, setSheet] = useState(false);
  const [dialog, setDialog] = useState(false);
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <Button onPress={() => setSheet(true)}>Bottom sheet</Button>
      <Button intent="danger" onPress={() => setDialog(true)}>Dialog</Button>
      <BottomSheet open={sheet} onClose={() => setSheet(false)} title="Share to">
        <List>
          <ListItem icon="link" onPress={() => setSheet(false)}>Copy link</ListItem>
          <ListItem icon="mail" onPress={() => setSheet(false)}>Email</ListItem>
        </List>
      </BottomSheet>
      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        title="Delete this?"
        description="This cannot be undone."
        primaryAction={{ label: 'Delete', onPress: () => setDialog(false) }}
        secondaryAction={{ label: 'Cancel', onPress: () => setDialog(false) }}
      />
    </View>
  );
}`,
  },
  motion: {
    label: 'Motion',
    code: `function Demo() {
  const motion = useMotion();
  const opacity = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(false);
  const toggle = () => {
    const showing = !visible;
    setVisible(showing);
    Animated.timing(opacity, {
      toValue: showing ? 1 : 0,
      duration: motion.scale(motion.transition[showing ? 'enter' : 'exit'].duration),
      easing: motion.transition[showing ? 'enter' : 'exit'].easing,
      useNativeDriver: motion.useNativeDriver,
    }).start();
  };
  return (
    <View style={{ gap: 12, alignItems: 'flex-start' }}>
      <Button intent="brand" onPress={toggle}>{visible ? 'Exit' : 'Enter'}</Button>
      <Animated.View style={{ opacity }}>
        <Toast intent="brand" title="Moved by motion tokens" />
      </Animated.View>
    </View>
  );
}`,
  },
};

export default function Playground() {
  const { scheme } = useTheme();
  const [starter, setStarter] = useState('hello');
  return (
    <Page wide>
      <PageHeader
        eyebrow="Playground"
        title="Write it here, run it anywhere"
        lede="The editor has the whole library in scope, rendering through react-native-web. When it looks right, send the same code to a real device with Expo Snack."
      />
      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {Object.entries(STARTERS).map(([key, s]) => (
          <Chip key={key} intent="brand" selected={starter === key} onPress={() => setStarter(key)}>
            {s.label}
          </Chip>
        ))}
      </View>
      <LiveDemo key={starter} code={STARTERS[starter].code} title={STARTERS[starter].label} editorOpenByDefault previewPadding={40} />
      <Text type="body-sm" color={scheme.text.description}>
        Tip: define a component called Demo and it renders automatically. Everything from @castui/cast-ui plus View, ScrollView, Animated, and the React hooks are in scope.
      </Text>
    </Page>
  );
}
