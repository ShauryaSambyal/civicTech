import React from 'react';
import { useReveal } from '../hooks/useMotion';

/**
 * One section of the single page. Draws the numbered eyebrow, the accent-topped
 * hairline, the heading and the optional intro — so every section reads as the
 * same object no matter what it contains.
 *
 * The reveal engine drives it: the rule draws itself in, the eyebrow rises, and
 * the heading is wiped up word by word.
 */
export default function Section({ id, index, label, title, intro, children }) {
  const ref = useReveal();

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="container"
      style={{ paddingBlock: 'var(--space-section)' }}
    >
      <div ref={ref}>
        <div className="rule-accent" data-anim="scale-x" aria-hidden="true" />

        <div className="pt-6 sm:pt-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="min-w-0">
            <span className="eyebrow" data-anim="fade-up">
              {index} — {label}
            </span>
            <h2
              id={`${id}-title`}
              className="mt-4 text-body"
              style={{ fontSize: 'var(--fs-h2)' }}
              data-anim="mask"
            >
              {title}
            </h2>
          </div>

          {intro && (
            <p className="lead md:text-right md:max-w-[26rem] md:flex-shrink-0" data-anim="fade-up">
              {intro}
            </p>
          )}
        </div>

        {children && <div className="mt-10 sm:mt-14">{children}</div>}
      </div>
    </section>
  );
}
