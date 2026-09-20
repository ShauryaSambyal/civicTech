import React from 'react';
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
 * Section 01. One declarative sentence at hero scale, then supporting copy on a
 * hairline — the reference site's opening move: type does the work, no chrome.
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
        paddingTop: 'calc(var(--header-h) + clamp(3rem, 7vw, 6rem))',
        paddingBottom: 'var(--space-section)'
      }}
    >
      <div ref={ref}>
        <span className="eyebrow" data-anim="fade-up">01 — Overview</span>

        <h1
          id="overview-title"
          className="mt-6 text-body display"
          style={{ fontSize: 'var(--fs-hero)', maxWidth: '22ch' }}
          data-anim="mask"
        >
          Every issue you raise moves the city forward.
        </h1>

        <div className="rule mt-10 sm:mt-14" data-anim="scale-x" aria-hidden="true" />

        <div className="pt-8 flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-16">
          <p className="lead" data-anim="fade-up">
            Browse what your neighbours have reported, back the problems that matter most,
            and watch them move from reported to resolved. Nothing is filed away — every
            report stays visible until someone closes it.
          </p>

          <div className="flex flex-wrap items-center gap-3 md:pt-1 md:flex-shrink-0" data-anim="fade-up">
            <Magnetic as="a" href="#report" className="btn btn-primary" strength={5}>
              Report an issue
            </Magnetic>
            <Magnetic as="button" type="button" className="btn btn-ghost" strength={5}
              onClick={() => scrollToTarget('#issues')}
            >
              Browse the registry
            </Magnetic>
          </div>
        </div>

        <p
          className="tabular mt-14"
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
