/**
 * Reveal — a one-shot entrance for hero content: a soft fade + rise, staggered
 * by `delay`, that plays once on mount.
 *
 * Motion is token-driven. The duration is the library's `duration.slow` and the
 * curve is the `entrance` easing bezier, read through useMotion(), so the hero
 * animates on the same timing the rest of Cast UI uses — and honours
 * reduce-motion from the same place: when reduceMotion is on, scale() collapses
 * the duration to 0 and the content simply renders in place, no transform.
 *
 * It renders a plain flex column div (web only — the docs site runs through
 * react-native-web) with alignItems:center, so wrapped children keep the hero's
 * centred layout and the parent View's `gap` still spaces the items.
 */

import React, { useEffect, useRef } from 'react';
import { useMotion } from '@castui/cast-ui';

export function Reveal({
  children,
  delay = 0,
  distance = 14,
}: {
  children: React.ReactNode;
  /** Stagger offset in ms. */
  delay?: number;
  /** Rise distance in px. */
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const played = useRef(false);
  const motion = useMotion();
  const { reduceMotion } = motion;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduce-motion (or a browser without WAAPI): show in place, never animate.
    const duration = motion.scale(motion.duration.slow);
    if (reduceMotion || duration === 0 || typeof el.animate !== 'function') {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }
    if (played.current) return;
    played.current = true;
    const [x1, y1, x2, y2] = motion.easingBezier.entrance;
    el.animate(
      [
        { opacity: 0, transform: `translateY(${distance}px)` },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      {
        duration,
        delay,
        easing: `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`,
        fill: 'both',
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  return React.createElement(
    'div',
    {
      ref,
      style: {
        // Stretch to the parent's width and centre the content, so wrapping and
        // centring match the hero exactly — the wrapper is invisible to layout.
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'stretch',
        width: '100%',
        // Start hidden so there's no flash before the animation; reduce-motion
        // and no-WAAPI paths flip this to visible synchronously in the effect.
        opacity: 0,
        willChange: 'opacity, transform',
      },
    },
    children,
  );
}

export default Reveal;
