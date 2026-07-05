import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, type LayoutChangeEvent } from 'react-native';
import {
  Alert,
  Badge,
  Button,
  Progress,
  Skeleton,
  Slider,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Text,
  ThemeProvider,
  easingBezier,
  useMotion,
  useTheme,
  type EasingName,
} from '@castui/cast-ui';
import { Page, PageHeader, Prose, Section } from '../../ui/Page';
import { CodeSnippet } from '../../ui/CodeSnippet';

/** A dot that runs its track on a loop, at a given duration and easing. */
function TrackDot({ durationMs, easing }: { durationMs: number; easing: (v: number) => number }) {
  const { colors, scheme } = useTheme();
  const motion = useMotion();
  const progress = useRef(new Animated.Value(0)).current;
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    if (motion.reduceMotion) return;
    progress.setValue(0);
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(progress, { toValue: 1, duration: durationMs, easing, useNativeDriver: false }),
        Animated.delay(600),
        Animated.timing(progress, { toValue: 0, duration: 0, useNativeDriver: false }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [progress, durationMs, easing, motion.reduceMotion]);

  const travel = Math.max(trackWidth - 26, 0);
  return (
    <View
      onLayout={(e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width)}
      style={{ height: 30, borderRadius: 15, backgroundColor: scheme.surface.subtle, justifyContent: 'center' }}
    >
      <Animated.View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          marginLeft: 2,
          backgroundColor: colors.brand.bold.default.bg,
          transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, travel] }) }],
        }}
      />
    </View>
  );
}

/** Plot a cubic bezier as sampled dots — no canvas, no SVG, just Views. */
function CurvePlot({ name }: { name: EasingName }) {
  const { colors, scheme } = useTheme();
  const motion = useMotion();
  const size = 72;
  const fn = motion.easing[name];
  const points = Array.from({ length: 22 }, (_, i) => {
    const t = i / 21;
    return { x: t * size, y: (1 - fn(t)) * size };
  });
  return (
    <View style={{ width: size, height: size, backgroundColor: scheme.surface.subtle, borderRadius: 8, overflow: 'hidden' }}>
      {points.map((p, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: p.x - 1.5,
            top: Math.min(Math.max(p.y - 1.5, -6), size + 6),
            width: 3,
            height: 3,
            borderRadius: 1.5,
            backgroundColor: colors.brand.bold.default.bg,
          }}
        />
      ))}
    </View>
  );
}

function RetimeDemo() {
  const { scheme } = useTheme();
  const [base, setBase] = useState(220);
  const [spin, setSpin] = useState(800);
  return (
    <View style={{ gap: 16, borderWidth: 1, borderColor: scheme.surface.overlay.border, borderRadius: 14, padding: 20 }}>
      <View style={{ gap: 10, maxWidth: 420 }}>
        <Text type="label-md">{`duration/base: ${base} ms`}</Text>
        <Slider min={80} max={800} step={10} value={base} onValueChange={setBase} accessibilityLabel="Base duration" />
        <Text type="label-md">{`cycle/spin: ${spin} ms`}</Text>
        <Slider min={300} max={2400} step={50} value={spin} onValueChange={setSpin} accessibilityLabel="Spin cycle" />
      </View>
      <ThemeProvider motion={{ duration: { base }, cycle: { spin } }}>
        <RetimedRow />
      </ThemeProvider>
      <Text type="caption" color={scheme.text.description}>
        A nested ThemeProvider with a motion override. The dot reads transition/standard, the spinner reads loop/spin. This is exactly what a cast-theme.json motion block does to a whole app.
      </Text>
    </View>
  );
}

function RetimedRow() {
  const motion = useMotion();
  return (
    <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center' }}>
      <View style={{ flex: 1 }}>
        <TrackDot durationMs={motion.transition.standard.duration} easing={motion.transition.standard.easing} />
      </View>
      <Spinner intent="brand" size="large" />
    </View>
  );
}

const ROLES: Array<[string, string, string]> = [
  ['transition/standard', 'base · standard', 'Backdrop fades, Drawer and BottomSheet scrims'],
  ['transition/enter', 'fast · entrance', 'Something appearing'],
  ['transition/exit', 'fast · exit', 'Something leaving'],
  ['transition/expand', 'fast · standard', 'Accordion chevron, height reveals'],
  ['feedback/press', 'instant · standard · scale 0.97', 'Press-down on a pressable'],
  ['feedback/shake', 'base · standard · 4 px', 'Input rejection'],
  ['feedback/pop', 'fast · emphasized', 'Check, badge, or toast pop-in'],
  ['loop/spin', '800 ms · linear', 'Spinner rotation'],
  ['loop/pulse', '700 ms · standard', 'Skeleton fade'],
  ['loop/indeterminate', '1200 ms · standard', 'Progress sweep'],
];

export default function Motion() {
  const { scheme } = useTheme();
  const motion = useMotion();
  const durations = [
    ['instant', motion.duration.instant],
    ['fast', motion.duration.fast],
    ['base', motion.duration.base],
    ['slow', motion.duration.slow],
  ] as const;
  const easingNames: EasingName[] = ['standard', 'entrance', 'exit', 'emphasized', 'linear'];

  return (
    <Page>
      <PageHeader
        eyebrow="Motion"
        title="How Cast UI moves"
        lede="Motion is tokenized like colour and spacing: primitive durations, cycles, easings, and springs feed semantic roles that components read through useMotion(). The same numbers live in the kit's motion variable collection, so Figma prototypes and shipped code move identically."
      />

      <Section title="Durations" lede="Four state-to-state durations. Every dot below runs at its real token value.">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          {durations.map(([name, ms]) => (
            <View key={name} style={{ flex: 1, minWidth: 200, gap: 8, borderWidth: 1, borderColor: scheme.surface.overlay.border, borderRadius: 12, padding: 16 }}>
              <Text type="label-md" style={{ fontFamily: 'JetBrains Mono' as never }}>{`duration/${name}`}</Text>
              <Text type="title-md">{`${ms} ms`}</Text>
              <TrackDot durationMs={ms} easing={motion.easing.standard} />
            </View>
          ))}
        </View>
      </Section>

      <Section title="Easings" lede="Cubic-bezier curves, identical in Figma, CSS, and the native driver. Dots play at 600 ms so the character of each curve is readable.">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          {easingNames.map((name) => (
            <View key={name} style={{ flex: 1, minWidth: 180, gap: 8, borderWidth: 1, borderColor: scheme.surface.overlay.border, borderRadius: 12, padding: 16 }}>
              <Text type="label-md" style={{ fontFamily: 'JetBrains Mono' as never }}>{name}</Text>
              <Text type="caption" color={scheme.text.description} style={{ fontFamily: 'JetBrains Mono' as never }}>
                {`[${easingBezier[name].join(', ')}]`}
              </Text>
              <CurvePlot name={name} />
              <TrackDot durationMs={600} easing={motion.easing[name]} />
            </View>
          ))}
        </View>
      </Section>

      <Section title="Loops, in the components that own them" lede="Continuous cycles for waiting states. These are the real components, reading their real roles.">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          <View style={{ flex: 1, minWidth: 200, gap: 12, borderWidth: 1, borderColor: scheme.surface.overlay.border, borderRadius: 12, padding: 16, alignItems: 'center' }}>
            <Spinner intent="brand" size="large" />
            <Badge size="small">loop/spin · 800 ms</Badge>
          </View>
          <View style={{ flex: 1, minWidth: 200, gap: 12, borderWidth: 1, borderColor: scheme.surface.overlay.border, borderRadius: 12, padding: 16, justifyContent: 'center' }}>
            <Skeleton width="100%" />
            <Skeleton width="70%" />
            <Badge size="small" style={{ alignSelf: 'center' }}>loop/pulse · 700 ms</Badge>
          </View>
          <View style={{ flex: 1, minWidth: 200, gap: 12, borderWidth: 1, borderColor: scheme.surface.overlay.border, borderRadius: 12, padding: 16, justifyContent: 'center' }}>
            <Progress />
            <Badge size="small" style={{ alignSelf: 'center' }}>loop/indeterminate · 1200 ms</Badge>
          </View>
        </View>
      </Section>

      <Section title="Semantic roles" lede="Components never read a raw number. They read a role, so retiming one primitive retunes every component that uses it.">
        <Table size="small" striped>
          <TableHead>
            <TableRow>
              <TableCell flex={2}><Text type="label-sm">Role</Text></TableCell>
              <TableCell flex={2}><Text type="label-sm">Recipe</Text></TableCell>
              <TableCell flex={3}><Text type="label-sm">Used by</Text></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ROLES.map(([role, recipe, used]) => (
              <TableRow key={role}>
                <TableCell flex={2}><Text type="body-sm" style={{ fontFamily: 'JetBrains Mono' as never }}>{role}</Text></TableCell>
                <TableCell flex={2}><Text type="body-sm">{recipe}</Text></TableCell>
                <TableCell flex={3}><Text type="body-sm" color={scheme.text.description}>{used}</Text></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section title="Retime the system live" lede="Motion is themeable. Drag, and watch the components follow.">
        <RetimeDemo />
      </Section>

      <Section title="Using it in your own components">
        <CodeSnippet
          code={`import { useMotion } from '@castui/cast-ui';

const motion = useMotion();

Animated.timing(value, {
  toValue: 1,
  duration: motion.scale(motion.transition.enter.duration),
  easing: motion.transition.enter.easing,
  useNativeDriver: motion.useNativeDriver,
}).start();`}
        />
        <Alert
          intent="brand"
          icon="accessibility_new"
          title="Reduce-motion is built in"
          description={`useMotion().reduceMotion tracks the OS setting live. Wrap durations in motion.scale() so they collapse to zero, and skip starting loops when it's on. Every animated component in the library already does both.${motion.reduceMotion ? ' Your system has reduce-motion on right now, which is why the demos above are holding still.' : ''}`}
        />
        <Prose>
          The bezier values are design-side numbers too: the kit's Motion page carries keyframed spec cards using these exact control points, and cast-sync exports the whole collection into cast-theme.json.
        </Prose>
      </Section>
    </Page>
  );
}
