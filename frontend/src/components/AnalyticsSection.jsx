import React, { useEffect, useRef } from 'react';
import { animate } from 'animejs';
import { CATEGORIES, STATUS_CONFIG, STATUS_ORDER } from './constants';
import { useCountUp } from '../hooks/useAnimation';
import { useInView, useReveal } from '../hooks/useMotion';
import { EASE, motionEnabled } from '../lib/motion';

/** One labelled hairline bar. */
function BarRow({ code, name, count, total, status, ready }) {
  const pct = total ? (count / total) * 100 : 0;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="flex items-baseline gap-3 min-w-0">
          <span className="tabular shrink-0" style={{ fontSize: 'var(--fs-micro)', color: 'var(--ink-faint)', letterSpacing: '0.14em' }}>
            {code}
          </span>
          {status ? (
            <span className="flex items-center gap-2 min-w-0 chip chip-status" data-status={status}>
              <span className="dot" aria-hidden="true" />
              {name}
            </span>
          ) : (
            <span className="text-soft line-clamp-1" style={{ fontSize: 'var(--fs-small)' }}>{name}</span>
          )}
        </span>
        <span className="flex items-baseline gap-3 shrink-0">
          <span className="tabular text-body" style={{ fontSize: 'var(--fs-body)' }}>{count}</span>
          <span className="tabular" style={{ fontSize: 'var(--fs-micro)', color: 'var(--ink-faint)' }}>
            {Math.round(pct)}%
          </span>
        </span>
      </div>
      <div className="track mt-2.5">
        <div className="track-fill" style={{ width: ready ? `${pct}%` : '0%' }} />
      </div>
    </div>
  );
}

/** Thin resolution ring, drawn by anime.js the first time it is seen. */
function ResolutionRing({ pct }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const circleRef = useRef(null);
  const shown = useCountUp(pct, { active: inView, delay: 200 });

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * pct) / 100;

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle || !inView) return;

    if (!motionEnabled()) {
      circle.style.strokeDashoffset = offset;
      return;
    }

    animate(circle, {
      strokeDashoffset: [circumference, offset],
      duration: 1400,
      delay: 160,
      ease: EASE.expo
    });
  }, [inView, circumference, offset]);

  return (
    <div ref={ref} className="relative grid place-items-center shrink-0" style={{ width: 128, height: 128 }}>
      <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90" aria-hidden="true">
        <circle cx="64" cy="64" r={radius} fill="none" strokeWidth="2" stroke="var(--rule)" />
        <circle
          ref={circleRef}
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          strokeWidth="2"
          strokeLinecap="butt"
          stroke="var(--accent)"
          strokeDasharray={circumference}
          strokeDashoffset={motionEnabled() ? circumference : offset}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="tabular text-body leading-none" style={{ fontSize: '1.75rem' }}>{shown}%</p>
          <p className="label" style={{ margin: '0.5rem 0 0' }}>Resolved</p>
        </div>
      </div>
    </div>
  );
}

function Figure({ label, value, suffix = '' }) {
  const [ref, inView] = useInView();
  const shown = useCountUp(value, { active: inView, delay: 100 });

  return (
    <div className="stat-cell" ref={ref}>
      <p className="tabular leading-none text-body" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
        {shown}{suffix}
      </p>
      <p className="label" style={{ margin: '0.75rem 0 0' }}>{label}</p>
    </div>
  );
}

/** Section 04. The numbers, drawn with rules and 2px bars instead of cards. */
export default function AnalyticsSection({ index, label, issues }) {
  const ref = useReveal();
  const [barsRef, barsReady] = useInView({ threshold: 0.2 });

  const categoryStats = CATEGORIES.map((category) => ({
    ...category,
    count: issues.filter((issue) => issue.category === category.id).length
  }));

  const resolutionRate = issues.length
    ? Math.round((issues.filter((issue) => issue.status === 'resolved').length / issues.length) * 100)
    : 0;
  const mostUpvoted = issues.length ? Math.max(...issues.map((issue) => issue.upvotes)) : 0;
  const activeCitizens = new Set(issues.map((issue) => issue.reportedBy)).size;
  const busiest = categoryStats.reduce(
    (best, category) => (category.count > best.count ? category : best),
    categoryStats[0] || { name: '—', code: '——', count: 0 }
  );

  return (
    <section id="analytics" aria-labelledby="analytics-title" className="container" style={{ paddingBlock: 'var(--space-section)' }}>
      <div ref={ref}>
        <div className="rule-accent" data-anim="scale-x" aria-hidden="true" />

        <div className="pt-6 sm:pt-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="min-w-0">
            <span className="eyebrow" data-anim="fade-up">{index} — {label}</span>
            <h2 id="analytics-title" className="mt-4 text-body" style={{ fontSize: 'var(--fs-h2)' }} data-anim="mask">
              Where the pressure sits
            </h2>
          </div>
          <p className="lead md:text-right md:max-w-[26rem] md:flex-shrink-0" data-anim="fade-up">
            What is being reported, what is still open, and how fast the ward is closing it out.
          </p>
        </div>

        <div ref={barsRef} className="mt-10 sm:mt-14 grid gap-5 lg:grid-cols-2" data-anim="stagger">

          <div className="surface p-6 sm:p-8">
            <div className="flex items-baseline justify-between gap-4 mb-8">
              <h3 className="text-body" style={{ fontSize: 'var(--fs-h3)', letterSpacing: '-0.02em' }}>By category</h3>
              <span className="tabular" style={{ fontSize: 'var(--fs-micro)', color: 'var(--ink-faint)', letterSpacing: '0.14em' }}>
                {issues.length} REPORTS
              </span>
            </div>
            <div className="flex flex-col gap-6" data-anim="rows">
              {categoryStats.map((category) => (
                <BarRow
                  key={category.id}
                  code={category.code}
                  name={category.name}
                  count={category.count}
                  total={issues.length}
                  ready={barsReady}
                />
              ))}
            </div>
          </div>

          <div className="surface p-6 sm:p-8">
            <div className="flex items-baseline justify-between gap-4 mb-8">
              <h3 className="text-body" style={{ fontSize: 'var(--fs-h3)', letterSpacing: '-0.02em' }}>By status</h3>
              <span className="tabular" style={{ fontSize: 'var(--fs-micro)', color: 'var(--ink-faint)', letterSpacing: '0.14em' }}>
                {resolutionRate}% CLOSED
              </span>
            </div>

            <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:gap-10">
              <ResolutionRing pct={resolutionRate} />

              <div className="flex w-full flex-col gap-6" data-anim="rows">
                {STATUS_ORDER.map((status, i) => (
                  <BarRow
                    key={status}
                    code={String(i + 1).padStart(2, '0')}
                    name={STATUS_CONFIG[status].label}
                    status={status}
                    count={issues.filter((issue) => issue.status === status).length}
                    total={issues.length}
                    ready={barsReady}
                  />
                ))}
              </div>
            </div>

            <div className="mt-9 pt-6 flex items-baseline justify-between gap-4" style={{ borderTop: '1px solid var(--rule)' }}>
              <span className="label" style={{ margin: 0 }}>Busiest category</span>
              <span className="text-body" style={{ fontSize: 'var(--fs-small)', fontWeight: 500 }}>
                <span className="tabular" style={{ color: 'var(--ink-faint)', marginRight: '0.5rem' }}>{busiest.code}</span>
                {busiest.name}
              </span>
            </div>
          </div>
        </div>

        <div className="stat-strip mt-5" data-anim="stagger">
          <Figure label="Reports on record" value={issues.length} />
          <Figure label="Resolution rate" value={resolutionRate} suffix="%" />
          <Figure label="Most upvoted" value={mostUpvoted} />
          <Figure label="Contributors" value={activeCitizens} />
        </div>
      </div>
    </section>
  );
}
