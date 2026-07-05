/**
 * Motion tokens — the single source for animation timing across Cast UI.
 *
 * Two layers, mirroring the colour and spacing token system:
 *   Primitive  raw durations, cubic-bezier easings, spring configs.
 *   Semantic   named roles (transition / feedback / loop) that components read.
 *
 * Motion is constant across density and colour mode. Density changes spacing
 * only. Easings are real cubic-beziers, so the same numbers map 1:1 to the
 * `motion` variable collection in the Figma kit and to CSS.
 *
 * Components never read a raw number. They read a semantic role through
 * useMotion(), for example motion.transition.standard or motion.loop.spin.
 *
 * Theming: a cast-theme.json can carry a `motion` block (exported by the
 * cast-sync plugin from the kit's `motion` variable collection). ThemeProvider
 * accepts those primitive-level overrides via its `motion` prop and
 * `resolveMotion` rebuilds every semantic role from them, so a brand can
 * re-tune timing with no code changes.
 */

import { Easing } from 'react-native';

type EasingFn = (value: number) => number;

export type EasingName = 'standard' | 'entrance' | 'exit' | 'emphasized' | 'linear';

/** Cubic-bezier control points as [x1, y1, x2, y2]. */
export type EasingBezierPoints = readonly [number, number, number, number];

export type MotionDurations = {
  /** Micro feedback, e.g. a press. */
  instant: number;
  /** Small enters/exits and expands. */
  fast: number;
  /** The general state-to-state duration. */
  base: number;
  /** Large surfaces or long distances. */
  slow: number;
};

export type MotionCycles = {
  /** Skeleton fade half-cycle. */
  pulse: number;
  /** Spinner full rotation. */
  spin: number;
  /** Progress indeterminate sweep. */
  sweep: number;
};

export type SpringConfig = { damping: number; stiffness: number; mass: number };

export type MotionTransition = { duration: number; easing: EasingFn };

export type MotionTokens = {
  duration: MotionDurations;
  cycle: MotionCycles;
  easing: Record<EasingName, EasingFn>;
  easingBezier: Record<EasingName, EasingBezierPoints>;
  spring: { overlay: SpringConfig };
  transition: {
    standard: MotionTransition;
    enter: MotionTransition;
    exit: MotionTransition;
    expand: MotionTransition;
  };
  feedback: {
    press: MotionTransition & { scale: number };
    shake: MotionTransition & { amplitude: number };
    pop: MotionTransition;
  };
  loop: {
    spin: MotionTransition;
    pulse: MotionTransition & { from: number; to: number };
    indeterminate: MotionTransition;
  };
};

/**
 * Primitive-level motion overrides, the shape a cast-theme.json `motion`
 * block maps onto. Only numbers and beziers — semantic roles are rebuilt
 * from these by `resolveMotion`, never overridden directly.
 */
export type MotionOverrides = {
  duration?: Partial<MotionDurations>;
  cycle?: Partial<MotionCycles>;
  easingBezier?: Partial<Record<EasingName, EasingBezierPoints>>;
  spring?: { overlay?: Partial<SpringConfig> };
  feedback?: {
    press?: { scale?: number };
    shake?: { amplitude?: number };
  };
  loop?: {
    pulse?: { from?: number; to?: number };
  };
};

/** Primitive: transition durations in ms (state to state). */
export const duration: MotionDurations = {
  instant: 100,
  fast: 150,
  base: 220,
  slow: 320,
};

/** Primitive: loop cycle lengths in ms (continuous, not state to state). */
export const cycle: MotionCycles = {
  pulse: 700,
  spin: 800,
  sweep: 1200,
};

/**
 * Primitive: easing control points as cubic-bezier [x1, y1, x2, y2].
 * This is the design-side value. The `motion` collection in the Figma kit
 * carries these exact numbers (easing/{name}/{x1,y1,x2,y2}).
 */
export const easingBezier: Record<EasingName, EasingBezierPoints> = {
  standard: [0.4, 0, 0.2, 1],
  entrance: [0, 0, 0.2, 1],
  exit: [0.4, 0, 1, 1],
  emphasized: [0.7, -0.4, 0.4, 1.4],
  linear: [0, 0, 1, 1],
};

/**
 * Build a lazy easing function from bezier points. The Easing function is
 * only created when an animation actually runs, so importing the tokens
 * never touches the native Easing API. That keeps the library safe to
 * import in any environment.
 */
function lazyEasing(points: EasingBezierPoints, linear: boolean): EasingFn {
  let fn: EasingFn | null = null;
  return (value: number) => {
    if (!fn) {
      fn = linear ? Easing.linear : Easing.bezier(points[0], points[1], points[2], points[3]);
    }
    return fn(value);
  };
}

function isLinear(points: EasingBezierPoints): boolean {
  return points[0] === 0 && points[1] === 0 && points[2] === 1 && points[3] === 1;
}

function buildEasings(
  beziers: Record<EasingName, EasingBezierPoints>,
): Record<EasingName, EasingFn> {
  return {
    standard: lazyEasing(beziers.standard, isLinear(beziers.standard)),
    entrance: lazyEasing(beziers.entrance, isLinear(beziers.entrance)),
    exit: lazyEasing(beziers.exit, isLinear(beziers.exit)),
    emphasized: lazyEasing(beziers.emphasized, isLinear(beziers.emphasized)),
    linear: lazyEasing(beziers.linear, isLinear(beziers.linear)),
  };
}

/** Primitive: easing as runtime functions (the code-side value). */
export const easing: Record<EasingName, EasingFn> = buildEasings(easingBezier);

/** Primitive: spring configs for Animated.spring. */
export const spring: { overlay: SpringConfig } = {
  /** Overlay surfaces sliding in (drawer, bottom sheet). */
  overlay: { damping: 22, stiffness: 220, mass: 0.9 },
};

// --- Semantic roles: what components actually read ---------------------------

type Primitives = {
  duration: MotionDurations;
  cycle: MotionCycles;
  easing: Record<EasingName, EasingFn>;
  press: { scale: number };
  shake: { amplitude: number };
  pulse: { from: number; to: number };
};

function buildRoles(p: Primitives) {
  return {
    transition: {
      /** General state-to-state fade or slide. Backdrops, overlay fades. */
      standard: { duration: p.duration.base, easing: p.easing.standard },
      /** Something appearing. Decelerates as it lands. */
      enter: { duration: p.duration.fast, easing: p.easing.entrance },
      /** Something leaving. Accelerates as it goes. */
      exit: { duration: p.duration.fast, easing: p.easing.exit },
      /** Expand or collapse. Accordion chevron, height reveals. */
      expand: { duration: p.duration.fast, easing: p.easing.standard },
    },
    feedback: {
      /** Press-down scale on a pressable (reserved for future use). */
      press: { duration: p.duration.instant, easing: p.easing.standard, scale: p.press.scale },
      /** Error shake, e.g. input rejection. amplitude in px (future use). */
      shake: { duration: p.duration.base, easing: p.easing.standard, amplitude: p.shake.amplitude },
      /** Pop-in for a check, badge, or toast (future use). */
      pop: { duration: p.duration.fast, easing: p.easing.emphasized },
    },
    loop: {
      /** Spinner rotation. */
      spin: { duration: p.cycle.spin, easing: p.easing.linear },
      /** Skeleton pulse. Fades opacity between from and to. */
      pulse: { duration: p.cycle.pulse, easing: p.easing.standard, from: p.pulse.from, to: p.pulse.to },
      /** Progress indeterminate sweep. */
      indeterminate: { duration: p.cycle.sweep, easing: p.easing.standard },
    },
  };
}

const defaultRoles = buildRoles({
  duration,
  cycle,
  easing,
  press: { scale: 0.97 },
  shake: { amplitude: 4 },
  pulse: { from: 1, to: 0.5 },
});

export const transition = defaultRoles.transition;
export const feedback = defaultRoles.feedback;
export const loop = defaultRoles.loop;

/** The full default motion token set, exposed on the theme as `theme.motion`. */
export const motionTokens: MotionTokens = {
  duration,
  cycle,
  easing,
  easingBezier,
  spring,
  transition,
  feedback,
  loop,
};

/**
 * Resolve a full motion token set from primitive-level overrides.
 * With no overrides this returns the shared default set (no allocation).
 * Semantic roles are always rebuilt from the merged primitives, so a
 * duration override flows into every role that uses it.
 */
export function resolveMotion(overrides?: MotionOverrides): MotionTokens {
  if (!overrides) return motionTokens;

  const mergedDuration: MotionDurations = { ...duration, ...(overrides.duration ?? {}) };
  const mergedCycle: MotionCycles = { ...cycle, ...(overrides.cycle ?? {}) };
  const mergedBezier: Record<EasingName, EasingBezierPoints> = {
    ...easingBezier,
    ...(overrides.easingBezier ?? {}),
  };
  const mergedEasing = overrides.easingBezier ? buildEasings(mergedBezier) : easing;
  const mergedSpring = {
    overlay: { ...spring.overlay, ...(overrides.spring?.overlay ?? {}) },
  };

  const roles = buildRoles({
    duration: mergedDuration,
    cycle: mergedCycle,
    easing: mergedEasing,
    press: { scale: overrides.feedback?.press?.scale ?? 0.97 },
    shake: { amplitude: overrides.feedback?.shake?.amplitude ?? 4 },
    pulse: {
      from: overrides.loop?.pulse?.from ?? 1,
      to: overrides.loop?.pulse?.to ?? 0.5,
    },
  });

  return {
    duration: mergedDuration,
    cycle: mergedCycle,
    easing: mergedEasing,
    easingBezier: mergedBezier,
    spring: mergedSpring,
    ...roles,
  };
}
