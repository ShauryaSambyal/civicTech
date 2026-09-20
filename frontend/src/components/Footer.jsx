import React from 'react';
import { SECTIONS } from './constants';
import { useReveal } from '../hooks/useMotion';

/**
 * The page's closing move, mirroring the reference site's structure: one
 * aphoristic statement set large, then the people behind the product, then a
 * quiet footer bar. The statement is wiped up word by word as it comes into view.
 */
export default function Footer({ issues }) {
  const ref = useReveal();

  const resolved = issues.filter((issue) => issue.status === 'resolved').length;

  return (
    <footer style={{ borderTop: '1px solid var(--rule)' }}>
      <div ref={ref} className="container" style={{ paddingBlock: 'var(--space-section)' }}>
        <span className="eyebrow" data-anim="fade-up">Closing</span>

        <p
          className="display text-body mt-7"
          style={{ fontSize: 'var(--fs-h2)', maxWidth: '30ch' }}
          data-anim="mask"
        >
          A street is only fixed when the people living on it stop having to ask twice.
        </p>

        <div className="rule my-12" data-anim="scale-x" aria-hidden="true" />

        <div className="grid gap-10 md:grid-cols-3" data-anim="stagger">
          <div>
            <h2 className="text-body" style={{ fontSize: 'var(--fs-h3)', letterSpacing: '-0.02em' }}>
              Who keeps this running
            </h2>
            <p className="text-soft mt-4 measure" style={{ fontSize: 'var(--fs-small)' }}>
              Residents, ward engineers and municipal officers — working from the same registry.
              Every report is public, every status change is visible, and nothing is closed
              without a record.
            </p>
          </div>

          <nav aria-label="Sections">
            <h2 className="label">Sections</h2>
            <ul className="flex flex-col gap-3">
              {SECTIONS.map(({ id, label, index }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="link-sweep text-soft transition-colors duration-200 hover:text-body"
                    style={{ fontSize: 'var(--fs-small)' }}
                  >
                    <span className="tabular" style={{ color: 'var(--ink-faint)', marginRight: '0.75rem' }}>{index}</span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="label">Registry status</h2>
            <dl className="flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-4" style={{ borderBottom: '1px solid var(--rule)', paddingBottom: '0.75rem' }}>
                <dt className="text-faint" style={{ fontSize: 'var(--fs-small)' }}>Reports on record</dt>
                <dd className="tabular text-body">{String(issues.length).padStart(2, '0')}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4" style={{ borderBottom: '1px solid var(--rule)', paddingBottom: '0.75rem' }}>
                <dt className="text-faint" style={{ fontSize: 'var(--fs-small)' }}>Closed and verified</dt>
                <dd className="tabular text-body">{String(resolved).padStart(2, '0')}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-faint" style={{ fontSize: 'var(--fs-small)' }}>Ward</dt>
                <dd className="tabular text-body">CHN-041</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--rule)' }}>
        <div className="container py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-baseline gap-[2px]" style={{ fontSize: 'var(--fs-small)' }}>
            <span
              className="text-body"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '-0.03em' }}
            >
              Civic
            </span>
            <span className="text-faint" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '-0.03em' }}>
              Tech
            </span>
            <span className="text-faint ml-2">— built so neighbours can fix things together.</span>
          </p>
          <p className="tabular" style={{ fontSize: 'var(--fs-micro)', color: 'var(--ink-faint)', letterSpacing: '0.14em' }}>
            REPORT · TRACK · RESOLVE
          </p>
        </div>
      </div>
    </footer>
  );
}
