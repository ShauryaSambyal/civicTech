import React, { useEffect, useRef } from 'react';
import { Loader2, X } from 'lucide-react';
import { animate, createTimeline, utils } from 'animejs';
import { DUR, EASE, motionEnabled } from '../lib/motion';
import { startScroll, stopScroll } from '../hooks/useSmoothScroll';
import { useAuth } from '../hooks/useAuth';
import { missingEnvKeys } from '../lib/firebase';
import GoogleMark from './GoogleMark';

/**
 * Sign-in, and the honest explanation of why it is being asked for.
 *
 * When the project is configured this is a single Google button. When it is
 * not, the same panel becomes the setup checklist — naming the exact variables
 * that are still blank — instead of failing silently behind a dead button.
 */
export default function AuthModal({ open, onClose, reason }) {
  const { signInWithGoogle, pending, error, clearError, isConfigured } = useAuth();
  const backdropRef = useRef(null);
  const panelRef = useRef(null);

  /* Escape to close, lock the page, and pause inertia scrolling behind it. */
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    stopScroll();

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      startScroll();
    };
  }, [open, onClose]);

  /* Entrance: backdrop, panel, then the rows. */
  useEffect(() => {
    if (!open) return;
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) return;

    if (!motionEnabled()) {
      utils.set([backdrop, panel], { opacity: 1 });
      return;
    }

    animate(backdrop, { opacity: [0, 1], duration: DUR.micro, ease: EASE.out });
    createTimeline({ defaults: { ease: EASE.out } })
      .add(panel, { opacity: [0, 1], y: [24, 0], scale: [0.985, 1], duration: DUR.base }, 0)
      .add(
        panel.querySelectorAll('[data-modal-row]'),
        { opacity: [0, 1], y: [14, 0], duration: DUR.base, delay: (_, i) => i * 60 },
        80
      );
  }, [open]);

  /* A stale error from a previous attempt should not greet the next one. */
  useEffect(() => {
    if (open) clearError();
  }, [open, clearError]);

  if (!open) return null;

  const handleSignIn = async () => {
    const signedIn = await signInWithGoogle();
    if (signedIn) onClose();
  };

  return (
    <div
      ref={backdropRef}
      className="modal-backdrop fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        className="modal-panel modal-scroll max-h-[90vh] w-full max-w-md overflow-y-auto"
        data-lenis-prevent
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4" data-modal-row>
            <span className="eyebrow">Account</span>
            <button type="button" onClick={onClose} aria-label="Close sign-in" className="btn-icon">
              <X size={16} strokeWidth={2} />
            </button>
          </div>

          <h2
            id="auth-title"
            className="text-body mt-6"
            style={{ fontSize: '1.5rem', letterSpacing: '-0.03em' }}
            data-modal-row
          >
            {isConfigured ? 'Sign in to keep your record' : 'Accounts are not connected yet'}
          </h2>

          <p className="text-soft mt-3" style={{ fontSize: 'var(--fs-small)' }} data-modal-row>
            {reason
              ? `${reason} needs an account, so the report can be attributed to the person who filed it and so only you can withdraw it.`
              : 'Your reports and the issues you back live in your account, not in this browser — sign in on any device and they are there.'}
          </p>

          {isConfigured ? (
            <>
              <button
                type="button"
                onClick={handleSignIn}
                disabled={pending}
                className="btn btn-primary mt-7 w-full"
                style={{ paddingBlock: '0.85rem' }}
                data-modal-row
              >
                {pending ? (
                  <Loader2
                    size={15}
                    strokeWidth={2}
                    className="anim-spin-slow"
                    style={{ animationDuration: '0.9s' }}
                    aria-hidden="true"
                  />
                ) : (
                  <GoogleMark size={15} />
                )}
                {pending ? 'Opening Google…' : 'Continue with Google'}
              </button>

              <p className="text-faint mt-4" style={{ fontSize: 'var(--fs-micro)', letterSpacing: '0.08em' }} data-modal-row>
                WE STORE YOUR NAME, EMAIL AND PROFILE PHOTO SO A REPORT CAN BE ATTRIBUTED TO YOU.
              </p>
            </>
          ) : (
            <div className="mt-7" data-modal-row>
              <p className="text-soft" style={{ fontSize: 'var(--fs-small)' }}>
                The app is running on a local session: everything you file stays in this browser.
                Add the values below to <span className="tabular">backend/.env</span> and restart the
                dev server to switch accounts on.
              </p>

              <ul
                className="mt-5 flex flex-col gap-1"
                style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)', paddingBlock: '1rem' }}
              >
                {missingEnvKeys.map((key) => (
                  <li
                    key={key}
                    className="tabular"
                    style={{ fontSize: 'var(--fs-micro)', color: 'var(--accent)', letterSpacing: '0.06em' }}
                  >
                    {key}
                  </li>
                ))}
              </ul>

              <p className="text-faint mt-5" style={{ fontSize: 'var(--fs-small)' }}>
                The full walkthrough — enabling Google sign-in, deploying the security rules, and
                where each value comes from — is in <span className="tabular">FIREBASE_SETUP.md</span>.
              </p>
            </div>
          )}

          {error && (
            <p
              className="mt-5"
              role="status"
              style={{ fontSize: 'var(--fs-small)', color: 'var(--accent)' }}
              data-modal-row
            >
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
