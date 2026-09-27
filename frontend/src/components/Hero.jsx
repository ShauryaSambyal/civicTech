import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useCountUp } from '../hooks/useAnimation';
import { useInView, useReveal } from '../hooks/useMotion';
import { scrollToTarget } from '../hooks/useSmoothScroll';
import Magnetic from './Magnetic';

/** One cell of the hairline stat strip. Figures count up once on first view. */
function HeroStat({ label, value, note, accent = false }) {
  const [ref, inView] = useInView();
  const shown = useCountUp(value, { active: inView, delay: 120 });

  return (
    <div className="stat-cell" ref={ref}>
      <p
        className="tabular leading-none"
        style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          color: accent ? 'var(--accent)' : 'var(--ink)'
        }}
      >
        {shown}
      </p>
      <p className="label" style={{ margin: '0.75rem 0 0' }}>{label}</p>
      {note && (
        <p className="text-faint mt-1" style={{ fontSize: 'var(--fs-small)' }}>{note}</p>
      )}
    </div>
  );
}

/**
 * Section 01. The reference's opening move, rebuilt for a registry: one
 * declarative sentence at display scale in the serif, the supporting copy
 * beneath it, then a single inline action bar with the firm's one filled
 * pill — the prompt on paper, the signal action beside it.
 *
 * The headline is wiped up word by word; everything else rises behind it.
 */
export default function Hero({ issues }) {
  const ref = useReveal();

  const pending = issues.filter((issue) => issue.status === 'reported').length;
  const inProgress = issues.filter((issue) => issue.status === 'in-progress').length;
  const resolved = issues.filter((issue) => issue.status === 'resolved').length;

  return (
    <section
      id="overview"
      aria-labelledby="overview-title"
      className="container"
      style={{
        paddingTop: 'calc(var(--header-h) + clamp(3rem, 6vw, 5rem))',
        paddingBottom: 'var(--space-section)'
      }}
    >
      <div ref={ref}>
        <span className="eyebrow" data-anim="fade-up">01 — Overview</span>

        <h1
          id="overview-title"
          className="mt-6 text-body display"
          style={{ fontSize: 'var(--fs-hero)', maxWidth: '19ch' }}
          data-anim="mask"
        >
          Every issue you raise moves the city forward.
        </h1>

        <p className="lead mt-7 measure" data-anim="fade-up">
          Browse what your neighbours have reported, back the problems that matter most,
          and watch them move from reported to resolved. Nothing is filed away — every
          report stays visible until someone closes it.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4" data-anim="fade-up">
          <div className="hero-action">
            <p className="prompt">Something broken in your neighbourhood?</p>
            <Magnetic as="a" href="#report" className="btn btn-primary shrink-0" strength={5}>
              Report an issue
              <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
            </Magnetic>
          </div>

          <Magnetic
            as="button"
            type="button"
            className="btn btn-ghost"
            strength={5}
            onClick={() => scrollToTarget('#issues')}
          >
            Browse the registry
          </Magnetic>
        </div>

        <div className="rule mt-12 sm:mt-16" data-anim="scale-x" aria-hidden="true" />

        <p
          className="tabular mt-8"
          style={{ fontSize: 'var(--fs-micro)', color: 'var(--ink-faint)', letterSpacing: '0.14em' }}
          data-anim="fade-up"
        >
          LIVE · CHENNAI · {issues.length} {issues.length === 1 ? 'REPORT' : 'REPORTS'} ON RECORD
        </p>

        <div className="stat-strip mt-5" data-anim="stagger">
          <HeroStat label="Total reports" value={issues.length} note="All time" />
          <HeroStat label="Awaiting action" value={pending} note="Nothing assigned yet" />
          <HeroStat label="In progress" value={inProgress} note="With the ward team" />
          <HeroStat label="Resolved" value={resolved} note="Closed and verified" accent />
        </div>
      </div>
    </section>
  );
}
