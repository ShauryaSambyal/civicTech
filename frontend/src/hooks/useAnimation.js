import { useEffect, useRef, useState } from 'react';

/** True when the user has asked their OS to reduce motion. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Animates a number from its previously rendered value up to `target`.
 * Re-animates smoothly when the target changes (e.g. a new upvote lands)
 * and snaps straight to the value when reduced motion is requested.
 */
export function useCountUp(target, { duration = 1100, delay = 0, active = true } = {}) {
  const end = Number.isFinite(Number(target)) ? Number(target) : 0;
  const [value, setValue] = useState(() => (prefersReducedMotion() ? end : 0));
  const displayed = useRef(value);
  const rafRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    displayed.current = value;
  }, [value]);

  useEffect(() => {
    // Figures wait until they scroll into view, so the count happens where the
    // reader can actually see it (see useInView in useMotion.js).
    if (!active) return undefined;

    const from = displayed.current;
    if (from === end) return undefined;

    // Reduced motion lands on the value in a single frame rather than setting
    // state synchronously inside the effect body.
    const reduced = prefersReducedMotion();
    const span = reduced ? 0 : duration;

    let startTime = null;
    const step = (now) => {
      if (startTime === null) startTime = now;
      const progress = span === 0 ? 1 : Math.min(1, (now - startTime) / span);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (end - from) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };

    timeoutRef.current = setTimeout(() => {
      rafRef.current = requestAnimationFrame(step);
    }, reduced ? 0 : delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration, delay, active]);

  return value;
}

/**
 * Flips to true one frame after mount. Used to drive width/transform
 * transitions (progress bars, rings) so they animate in from zero.
 */
export function useMountFlag(delay = 80) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(id);
  }, [delay]);

  return ready;
}

/**
 * Tracks which section is currently in view so the nav can mark itself.
 * Deliberately driven by scroll position rather than clicks, so manual
 * scrolling and deep links stay in sync with the highlighted item.
 */
export function useScrollSpy(ids, { offset = 96 } = {}) {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    const resolve = () => {
      let current = ids[0];
      for (const id of ids) {
        const node = document.getElementById(id);
        if (!node) continue;
        if (node.getBoundingClientRect().top - offset <= 1) current = id;
      }
      setActiveId(current);
    };

    resolve();
    window.addEventListener('scroll', resolve, { passive: true });
    window.addEventListener('resize', resolve);
    return () => {
      window.removeEventListener('scroll', resolve);
      window.removeEventListener('resize', resolve);
    };
  }, [ids, offset]);

  return activeId;
}

/** True once the page has scrolled past `threshold` pixels. */
export function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}
