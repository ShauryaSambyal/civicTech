import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { DUR, motionEnabled } from '../lib/motion';

/** Header height in px, read from the same token the CSS uses. */
export const headerOffset = () => {
  if (typeof window === 'undefined') return 64;
  const value = getComputedStyle(document.documentElement).getPropertyValue('--header-h');
  const parsed = parseFloat(value);
  if (!Number.isFinite(parsed)) return 64;
  return value.includes('rem') ? parsed * 16 : parsed;
};

let instance = null;

/** The live Lenis instance, or null when smooth scrolling is off. */
export const getLenis = () => instance;

/** Pause/resume inertia — used while the issue modal owns the scroll. */
export const stopScroll = () => instance?.stop();
export const startScroll = () => instance?.start();

/**
 * Inertial smooth scrolling for the whole page, plus anchor navigation between
 * sections. Disabled entirely under reduced motion, where the browser's native
 * scroll (and `scroll-behavior: smooth` for anchors) takes over.
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (!motionEnabled()) return undefined;

    const offset = headerOffset();

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: true,
      // Hash links scroll through Lenis so the easing matches the rest of the page.
      anchors: {
        offset: -offset,
        duration: DUR.scroll / 1000,
        easing: (t) => 1 - Math.pow(1 - t, 4)
      }
    });

    instance = lenis;

    // Land on the right section when the page is opened at a hash. Not inside
    // requestAnimationFrame: a frame-starved page would defer this forever and
    // the visitor would land at the top of the page instead of their target.
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        try {
          lenis.scrollTo(target, { offset: -offset, immediate: true });
        } catch {
          target.scrollIntoView();
        }
      }
    }

    return () => {
      lenis.destroy();
      instance = null;
    };
  }, []);
}

/** Scrolls to a section (or any element/offset) with the page's easing. */
export function scrollToTarget(target, { immediate = false } = {}) {
  const node = typeof target === 'string' ? document.querySelector(target) : target;
  if (!node) return;

  if (instance) {
    instance.scrollTo(node, { offset: -headerOffset(), immediate });
    return;
  }

  const top = node.getBoundingClientRect().top + window.scrollY - headerOffset();
  window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' });
}
