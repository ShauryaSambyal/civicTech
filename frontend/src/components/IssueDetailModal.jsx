import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { animate, createTimeline, stagger, utils } from 'animejs';
import { STATUS_CONFIG, findCategory, issueRef } from './constants';
import { DUR, EASE, STAGGER, motionEnabled } from '../lib/motion';
import { startScroll, stopScroll } from '../hooks/useSmoothScroll';

export default function IssueDetailModal({ issue, onClose, onUpvote }) {
  const [burstKey, setBurstKey] = useState(0);
  const backdropRef = useRef(null);
  const panelRef = useRef(null);

  // Escape to close + lock the page behind the modal.
  useEffect(() => {
    if (!issue) return undefined;

    const onKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    // Inertia scrolling has to be paused explicitly, or the page keeps moving
    // behind the panel.
    stopScroll();

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      startScroll();
    };
  }, [issue, onClose]);

  /* Entrance: backdrop fades, panel rises, then the metadata rows follow. */
  useEffect(() => {
    if (!issue) return;
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) return;

    if (!motionEnabled()) {
      utils.set([backdrop, panel], { opacity: 1 });
      return;
    }

    animate(backdrop, { opacity: [0, 1], duration: DUR.micro, ease: EASE.out });

    const timeline = createTimeline({ defaults: { ease: EASE.out } });
    timeline
      .add(panel, { opacity: [0, 1], y: [24, 0], scale: [0.985, 1], duration: DUR.base }, 0)
      .add(
        panel.querySelectorAll('[data-modal-row]'),
        { opacity: [0, 1], y: [14, 0], duration: DUR.base, delay: stagger(STAGGER.base) },
        80
      );
  }, [issue]);

  /* A small confirmation pulse when an upvote lands. */
  const handleUpvote = () => {
    setBurstKey((key) => key + 1);
    onUpvote(issue.id);
  };

  if (!issue) return null;

  const category = findCategory(issue.category);
  const status = STATUS_CONFIG[issue.status];

  const meta = [
    { label: 'Location', value: issue.location.address },
    { label: 'Reported by', value: issue.reportedBy },
    {
      label: 'Filed on',
      value: new Date(issue.createdAt).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }
  ];

  return (
    <div
      ref={backdropRef}
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        className="modal-panel modal-scroll max-h-[90vh] w-full max-w-2xl overflow-y-auto"
        data-lenis-prevent
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${issue.title} — report details`}
      >
        {/* Media header */}
        <div className="relative" data-modal-row>
          <img src={issue.image} alt={issue.title} className="h-56 w-full object-cover sm:h-72 media-grey" />
          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, var(--bg-2) 0%, color-mix(in srgb, var(--bg-2) 55%, transparent) 34%, transparent 78%)'
            }}
          />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close report"
            className="btn-icon absolute right-4 top-4"
            style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 70%, transparent)', backdropFilter: 'blur(6px)' }}
          >
            <X size={16} strokeWidth={2} />
          </button>

          <div className="absolute inset-x-5 bottom-5 sm:inset-x-8">
            <span
              className="tabular"
              style={{ fontSize: 'var(--fs-micro)', color: 'var(--ink-faint)', letterSpacing: '0.16em' }}
            >
              {issueRef(issue.id)} · {category.code}
            </span>
            <h2 className="text-body mt-2.5" style={{ fontSize: 'clamp(1.375rem, 3vw, 1.875rem)' }}>
              {issue.title}
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="chip">
                {category.name}
              </span>
              <span className="chip chip-status" data-status={issue.status}>
                <span className="dot" aria-hidden="true" />
                {status.label}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-8">
          <p className="text-soft measure" style={{ fontSize: 'var(--fs-body)' }} data-modal-row>
            {issue.description}
          </p>

          <dl className="mt-8 grid gap-px sm:grid-cols-3" style={{ background: 'var(--rule)' }} data-modal-row>
            {meta.map((row) => (
              <div key={row.label} className="p-4" style={{ backgroundColor: 'var(--bg-2)' }}>
                <dt className="label" style={{ marginBottom: '0.5rem' }}>{row.label}</dt>
                <dd className="text-body" style={{ fontSize: 'var(--fs-small)', fontWeight: 500 }}>{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 pt-6" style={{ borderTop: '1px solid var(--rule)' }} data-modal-row>
            <button
              type="button"
              onClick={handleUpvote}
              className="btn btn-primary w-full"
              style={{ paddingBlock: '0.9rem' }}
            >
              <span className="relative grid place-items-center">
                {burstKey > 0 && (
                  <span
                    key={burstKey}
                    aria-hidden="true"
                    className="burst absolute h-5 w-5 rounded-full"
                    style={{ backgroundColor: 'currentColor', opacity: 0.4 }}
                  />
                )}
                <span className="relative">Upvote this report</span>
              </span>
              <span className="tabular" style={{ opacity: 0.7 }}>{issue.upvotes}</span>
            </button>

            <p className="text-faint mt-4" style={{ fontSize: 'var(--fs-small)' }}>
              Upvotes tell the ward team which problems matter most to the people living with them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
