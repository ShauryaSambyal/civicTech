import { splitText } from 'animejs';

/**
 * One gate for every animation in the app. Reduced motion means the CSS that
 * hides reveal targets is never applied and no timeline is ever built, so the
 * page renders fully static.
 */
export const motionEnabled = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Pointer-capable devices only — magnetic hovers are pointless on touch. */
export const canHover = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Shared timing vocabulary. Mirrors design.md §7. */
export const DUR = {
  micro: 200,
  base: 450,
  enter: 750,
  headline: 900,
  slow: 1100,
  scroll: 1200
};

export const EASE = {
  out: 'outQuart',
  soft: 'outCubic',
  expo: 'outExpo',
  inOut: 'inOutQuart',
  elastic: 'outElastic(1, .55)'
};

export const STAGGER = {
  tight: 18,
  base: 42,
  loose: 75
};

/**
 * Splits a plain-text element into masked words, each wrapped in a clip box, so
 * a headline can be wiped up from behind its own baseline. Idempotent — the
 * splitter is cached on the element, so a React re-render can never double-wrap
 * the text.
 */
export function splitHeadline(el) {
  if (!el || !el.textContent || !el.textContent.trim()) return null;
  if (el.__splitter) return el.__splitter;

  const splitter = splitText(el, {
    words: { wrap: 'clip', class: 'm-word' },
    accessible: true
  });

  el.__splitter = splitter;
  return splitter;
}

/** Words to animate for a split headline, or the element itself as a fallback. */
export function headlineTargets(el) {
  const splitter = splitHeadline(el);
  return splitter && splitter.words.length ? splitter.words : [el];
}

/**
 * True when the page is actually receiving animation frames.
 *
 * A background tab, an occluded webview or a power-saving browser pauses
 * requestAnimationFrame. Building an anime timeline in that state leaves every
 * reveal frozen at its hidden "before" state until frames resume — which can be
 * forever. The reveal engine probes this before animating and falls back to
 * showing the section statically when the page is being starved.
 */
export function framesFlowing(deadlineMs = 120) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
      resolve(false);
      return;
    }
    let settled = false;
    const finish = (flowing) => {
      if (settled) return;
      settled = true;
      resolve(flowing);
    };
    window.requestAnimationFrame(() => finish(true));
    setTimeout(() => finish(false), deadlineMs);
  });
}

/**
 * Skips an element's future animation: clears the CSS-hidden state anime would
 * otherwise never restore (used when a section is revealed before/without an
 * observer).
 */
export function revealNow(root) {
  if (!root) return;
  root.querySelectorAll('[data-anim]').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
    [...el.children].forEach((child) => {
      child.style.opacity = '1';
      child.style.transform = 'none';
    });
  });
}
