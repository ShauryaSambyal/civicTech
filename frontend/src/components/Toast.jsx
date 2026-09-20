import React, { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { animate } from 'animejs';
import { subscribe } from './toastBus';
import { DUR, EASE, motionEnabled } from '../lib/motion';

/** Tone colour is the only colour: 3px on the left edge, plus the label. */
const TONES = {
  success: { edge: 'var(--ink)', label: 'Done' },
  error: { edge: 'var(--accent)', label: 'Problem' },
  info: { edge: 'var(--ink-faint)', label: 'Note' }
};

function ToastItem({ item, onDismiss }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !motionEnabled()) return;
    animate(node, {
      opacity: [0, 1],
      y: [16, 0],
      scale: [0.98, 1],
      duration: DUR.base,
      ease: EASE.out
    });
  }, []);

  /** Animates out, then asks the host to drop it from state. */
  const dismiss = () => {
    const node = ref.current;
    if (!node || !motionEnabled()) {
      onDismiss(item.id);
      return;
    }
    animate(node, {
      opacity: 0,
      x: 24,
      duration: DUR.micro,
      ease: 'inCubic',
      onComplete: () => onDismiss(item.id)
    });
  };

  const tone = TONES[item.tone] || TONES.info;

  return (
    <div
      ref={ref}
      className="surface-flat pointer-events-auto relative flex items-start gap-3 pl-4 pr-3 py-3.5"
      style={{ boxShadow: 'var(--shadow-overlay)' }}
    >
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-0"
        style={{ width: '3px', backgroundColor: tone.edge }}
      />
      <div className="min-w-0 flex-1">
        <p
          className="tabular"
          style={{ fontSize: 'var(--fs-micro)', color: tone.edge, letterSpacing: '0.16em' }}
        >
          {tone.label.toUpperCase()}
        </p>
        <p className="text-body mt-1" style={{ fontSize: 'var(--fs-small)', lineHeight: 1.5 }}>
          {item.message}
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss notification"
        className="grid h-6 w-6 shrink-0 place-items-center text-faint transition-colors duration-200 hover:text-body"
      >
        <X size={13} strokeWidth={2} />
      </button>
    </div>
  );
}

/**
 * Renders the toast bus. The host lives in App so notifications keep showing
 * even when the component that raised them unmounts (for example the report
 * form, which resets itself after a submit).
 */
export function ToastHost({ duration = 3600 }) {
  const [items, setItems] = useState([]);

  const dismiss = useCallback((id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  useEffect(() => subscribe((entry) => setItems((current) => [...current.slice(-2), entry])), []);

  useEffect(() => {
    if (items.length === 0) return undefined;
    const timers = items.map((item) => setTimeout(() => dismiss(item.id), duration));
    return () => timers.forEach(clearTimeout);
  }, [items, duration, dismiss]);

  if (items.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-4 left-4 right-4 z-[60] flex flex-col gap-3 sm:left-auto sm:max-w-sm"
      role="status"
      aria-live="polite"
    >
      {items.map((item) => (
        <ToastItem key={item.id} item={item} onDismiss={dismiss} />
      ))}
    </div>
  );
}

export default ToastHost;
