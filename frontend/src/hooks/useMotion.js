import { useEffect, useRef, useState } from 'react';
import { animate, createTimeline, onScroll, stagger, utils } from 'animejs';
import {
  DUR,
  EASE,
  STAGGER,
  canHover,
  framesFlowing,
  headlineTargets,
  motionEnabled,
  revealNow
} from '../lib/motion';

/**
 * The reveal engine.
 *
 * Mark up any descendant with `data-anim` and the engine builds a single
 * anime.js timeline the first time the container enters the viewport:
 *
 *   mask      — headline wiped up from behind a clip box (split into words)
 *   fade-up   — staggered rise + fade
 *   scale-x   — hairline drawn left to right
 *   media     — image panel scaled down into place
 *   stagger   — direct children rise in sequence
 *   rows      — like `stagger` but tighter, for list/bar rows
 *
 * The matching "before" state lives in CSS, scoped to `.motion` — which the
 * inline script in index.html only adds when reduced motion is off.
 */
export function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (!motionEnabled()) {
      revealNow(node);
      return undefined;
    }

    let played = false;

    const play = () => {
      if (played) return;
      played = true;
      // If frames are not flowing at a usable rate (background tab, throttled
      // webview), an anime timeline would freeze at its hidden "before" state.
      // Show the section statically instead — content beats choreography.
      framesFlowing().then((flowing) => {
        if (!flowing) {
          revealNow(node);
          return;
        }
        try {
          const timeline = buildTimeline(node);
          
          const guarded = node.querySelectorAll('[data-anim], [data-anim] > *');
          const force = () => {
            const stuck = [...guarded].some(
              (el) => parseFloat(getComputedStyle(el).opacity) < 0.95
            );
            if (!stuck) return;
            console.warn('[motion] reveal stalled; forcing final state');
            try {
              timeline.revert();
            } catch {
              /* already reverted */
            }
            revealNow(node);
          };
          // 2s is comfortably past the longest reveal (~1.5s including
          // staggers), so a healthy tab always finishes on its own.
          const timer = setTimeout(force, 2000);
          try {
            Promise.resolve(timeline.finished).then(
              () => clearTimeout(timer),
              () => clearTimeout(timer)
            );
          } catch {
            /* no finished promise; the timer alone guards */
          }
        } catch (err) {
          // A broken timeline must never take the content down with it.
          console.error('[motion] reveal failed; showing statically', err);
          revealNow(node);
        }
      });
    };

    if (typeof IntersectionObserver === 'undefined') {
      play();
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        play();
        observer.disconnect();
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(node);

    // Safety net. IntersectionObserver callbacks are delivered during the
    // browser's rendering steps, so on a frame-starved page (background tab,
    // throttled webview) the callback can silently never fire — leaving a
    // section that IS on screen frozen at its hidden state. Geometry is tested
    // directly instead: on mount, on a couple of delayed probes, and on every
    // scroll and resize. Scroll and resize events do not depend on frames, so
    // an anchor jump lands on a section that actually reveals itself.
    const onScreen = () => {
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return rect.top < vh * 0.92 && rect.bottom > vh * 0.08;
    };

    const check = () => {
      if (played) return true;
      if (onScreen()) {
        play();
        return true;
      }
      return false;
    };

    const probes = [400, 1200].map((delay) => setTimeout(check, delay));
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);

    // The last resort, and the only signal left in a fully throttled tab: a
    // page that delivers no frames also delivers no observer callbacks and no
    // scroll events, because all three ride the rendering steps. Timers are
    // never throttled away entirely, so a slow geometry poll guarantees the
    // content appears even then. It stops the moment the section has played.
    const poll = setInterval(() => {
      if (check()) clearInterval(poll);
    }, 600);

    return () => {
      clearInterval(poll);
      probes.forEach(clearTimeout);
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      observer.disconnect();
    };
  }, []);

  return ref;
}

/** Builds the timeline for one reveal container. */
function buildTimeline(root) {
  const timeline = createTimeline({ defaults: { ease: EASE.out, duration: DUR.enter } });

  // 01 — headlines, wiped up word by word
  root.querySelectorAll('[data-anim="mask"]').forEach((el, index) => {
    utils.set(el, { opacity: 1 });
    timeline.add(
      headlineTargets(el),
      { opacity: [0, 1], y: ['115%', '0%'], duration: DUR.headline, delay: stagger(STAGGER.tight) },
      index * 120
    );
  });

  // 02 — hairline rules drawn from the left
  const rules = [...root.querySelectorAll('[data-anim="scale-x"]')];
  rules.forEach((el, index) => {
    timeline.add(el, { scaleX: [0, 1], duration: DUR.slow, ease: EASE.expo }, index * 90);
  });

  // 03 — plain rises
  const rises = [...root.querySelectorAll('[data-anim="fade-up"]')];
  if (rises.length) {
    timeline.add(
      rises,
      { opacity: [0, 1], y: [18, 0], delay: stagger(STAGGER.loose) },
      0
    );
  }

  // 04 — media panels
  const media = [...root.querySelectorAll('[data-anim="media"]')];
  media.forEach((el, index) => {
    timeline.add(
      el,
      { opacity: [0, 1], scale: [1.06, 1], duration: DUR.slow, ease: EASE.soft },
      index * 80
    );
  });

  // 05 — staggered groups (cards, choice tiles)
  root.querySelectorAll('[data-anim="stagger"], [data-anim="rows"]').forEach((group) => {
    const kids = [...group.children];
    if (!kids.length) return;
    const tight = group.dataset.anim === 'rows';
    timeline.add(
      kids,
      {
        opacity: [0, 1],
        y: [tight ? 10 : 20, 0],
        duration: tight ? DUR.base : DUR.enter,
        delay: stagger(tight ? 55 : STAGGER.base)
      },
      0
    );
  });

  return timeline;
}

/** True once the element has entered the viewport. Used to gate count-ups. */
export function useInView({ threshold = 0.25, rootMargin = '0px 0px -10% 0px' } = {}) {
  // Without IntersectionObserver, figures are treated as already visible.
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    // Same geometric safety net as useReveal: on a frame-starved page the
    // observer callback can never fire, freezing count-ups at 0. Timers,
    // scroll and resize all keep working when frames do not.
    const check = () => {
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < vh * 0.75 && rect.bottom > 0) {
        setInView(true);
        return true;
      }
      return false;
    };

    const probes = [400, 1200].map((delay) => setTimeout(check, delay));
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    const poll = setInterval(() => {
      if (check()) clearInterval(poll);
    }, 600);

    return () => {
      clearInterval(poll);
      probes.forEach(clearTimeout);
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      observer.disconnect();
    };
  // Deps deliberately exclude `inView`: the observer and probe each run once
  // and disconnect/settle, and repeat setInView(true) calls are React no-ops.
  }, [threshold, rootMargin]);

  return [ref, inView];
}

/**
 * Scroll-linked drift. The element travels a small distance as it crosses the
 * viewport — the reference site's quiet parallax, used only on labels and media.
 */
export function useParallax(distance = 48) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !motionEnabled()) return undefined;

    const animation = animate(node, {
      y: [-distance / 2, distance / 2],
      ease: 'linear',
      autoplay: onScroll({
        target: node,
        enter: 'top bottom',
        leave: 'bottom top',
        sync: true
      })
    });

    return () => animation.revert();
  }, [distance]);

  return ref;
}

/**
 * Magnetic pointer pull for buttons. Off on touch devices and under reduced
 * motion, and clamped so the control never leaves its own hit area.
 */
export function useMagnetic(strength = 6) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !motionEnabled() || !canHover()) return undefined;

    const onMove = (event) => {
      const box = node.getBoundingClientRect();
      const dx = (event.clientX - (box.left + box.width / 2)) / (box.width / 2);
      const dy = (event.clientY - (box.top + box.height / 2)) / (box.height / 2);
      animate(node, {
        x: utils.clamp(dx * strength, -strength, strength),
        y: utils.clamp(dy * strength, -strength, strength),
        duration: 260,
        ease: EASE.out
      });
    };

    const onLeave = () => {
      animate(node, { x: 0, y: 0, duration: 520, ease: EASE.elastic });
    };

    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerleave', onLeave);
    node.addEventListener('blur', onLeave);

    return () => {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
      node.removeEventListener('blur', onLeave);
    };
  }, [strength]);

  return ref;
}

/**
 * Re-staggers a list whenever its contents change (filters, new reports).
 * The first render is left to the section's reveal timeline.
 */
export function useStaggerIn(dependency) {
  const ref = useRef(null);
  const firstRender = useRef(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || !motionEnabled()) return;

    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const children = [...node.children];
    if (!children.length) return;

    animate(children, {
      opacity: [0, 1],
      y: [14, 0],
      duration: DUR.base,
      delay: stagger(STAGGER.base),
      ease: EASE.out
    });
  }, [dependency]);

  return ref;
}

/** A short, one-shot scale pulse — used when an upvote lands. */
export function pulse(target, { scale = 1.06 } = {}) {
  if (!motionEnabled() || !target) return;
  animate(target, { scale: [1, scale], duration: DUR.micro, ease: EASE.out, alternate: true });
}
