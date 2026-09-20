import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { CATEGORIES, STATUS_CONFIG, STATUS_ORDER, findCategory, issueRef } from './constants';
import { useReveal, useStaggerIn } from '../hooks/useMotion';

function IssueCard({ issue, onOpen }) {
  const [loaded, setLoaded] = useState(false);
  const category = findCategory(issue.category);
  const status = STATUS_CONFIG[issue.status];

  const activate = () => onOpen(issue);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={activate}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activate();
        }
      }}
      className="surface panel-interactive media-grey group flex flex-col overflow-hidden text-left"
    >
      <div className="relative aspect-[16/10] overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
        <img
          src={issue.image}
          alt={issue.title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className="h-full w-full object-cover"
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.7s var(--ease-out), filter 0.6s var(--ease-out), transform 0.6s var(--ease-out)'
          }}
        />
        <span
          aria-hidden="true"
          className="absolute left-3 top-3 chip"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--bg) 78%, transparent)',
            backdropFilter: 'blur(6px)',
            color: 'var(--ink)'
          }}
        >
          {category.code}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span
          className="tabular"
          style={{ fontSize: 'var(--fs-micro)', color: 'var(--ink-faint)', letterSpacing: '0.14em' }}
        >
          {issueRef(issue.id)}
        </span>

        <h3 className="text-body mt-2.5" style={{ fontSize: 'var(--fs-h3)', letterSpacing: '-0.02em' }}>
          {issue.title}
        </h3>

        <p className="text-soft mt-2 mb-5 line-clamp-2" style={{ fontSize: 'var(--fs-small)' }}>
          {issue.description}
        </p>

        <div className="mt-auto pt-4 flex items-center justify-between gap-3" style={{ borderTop: '1px solid var(--rule)' }}>
          <span className="chip chip-status" data-status={issue.status}>
            <span className="dot" aria-hidden="true" />
            {status.label}
          </span>

          <span className="tabular" style={{ fontSize: 'var(--fs-small)', color: 'var(--ink-muted)' }}>
            {issue.upvotes} <span style={{ color: 'var(--ink-faint)' }}>upvotes</span>
          </span>
        </div>

        <p className="text-faint mt-3 line-clamp-1" style={{ fontSize: 'var(--fs-small)' }}>
          {issue.location.address}
        </p>
      </div>
    </article>
  );
}

/**
 * Section 02. The registry: a quiet filter bar over a grid of hairline panels.
 * Media is monochrome until hover — the one signature image move in the system.
 */
export default function IssuesSection({ index, label, issues, setSelectedIssue }) {
  const ref = useReveal();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = issues.filter((issue) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      issue.title.toLowerCase().includes(query) || issue.description.toLowerCase().includes(query);
    const matchesCategory = filterCategory === 'all' || issue.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Re-stagger the grid whenever the filter changes what is on screen.
  const gridRef = useStaggerIn(filtered.map((issue) => issue.id).join(','));

  const isFiltered = searchTerm !== '' || filterCategory !== 'all' || filterStatus !== 'all';
  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setFilterStatus('all');
  };

  return (
    <section id="issues" aria-labelledby="issues-title" className="container" style={{ paddingBlock: 'var(--space-section)' }}>
      <div ref={ref}>
        <div className="rule-accent" data-anim="scale-x" aria-hidden="true" />

        <div className="pt-6 sm:pt-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="min-w-0">
            <span className="eyebrow" data-anim="fade-up">{index} — {label}</span>
            <h2 id="issues-title" className="mt-4 text-body" style={{ fontSize: 'var(--fs-h2)' }} data-anim="mask">
              The registry
            </h2>
          </div>
          <p className="lead md:text-right md:max-w-[26rem] md:flex-shrink-0" data-anim="fade-up">
            Everything reported in this ward, newest first. Search it, filter it, and open a
            report to back it with an upvote.
          </p>
        </div>

        <div className="mt-10 sm:mt-14">
          {/* Filter bar */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center" data-anim="fade-up">
            <div className="relative flex-1 min-w-0">
              <Search
                size={15}
                strokeWidth={1.8}
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--ink-faint)' }}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search reports by title or description"
                aria-label="Search reports"
                className="field"
                style={{ paddingLeft: '2.25rem' }}
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={filterCategory}
                onChange={(event) => setFilterCategory(event.target.value)}
                aria-label="Filter by category"
                className="field lg:w-auto"
              >
                <option value="all">All categories</option>
                {CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.code} — {category.name}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(event) => setFilterStatus(event.target.value)}
                aria-label="Filter by status"
                className="field lg:w-auto"
              >
                <option value="all">All statuses</option>
                {STATUS_ORDER.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_CONFIG[status].label}
                  </option>
                ))}
              </select>

              {isFiltered && (
                <button type="button" onClick={clearFilters} className="btn btn-ghost shrink-0">
                  <X size={13} strokeWidth={2} aria-hidden="true" />
                  Reset
                </button>
              )}
            </div>
          </div>

          <p className="tabular mt-4" style={{ fontSize: 'var(--fs-micro)', color: 'var(--ink-faint)', letterSpacing: '0.14em' }}>
            {String(filtered.length).padStart(2, '0')} / {String(issues.length).padStart(2, '0')} REPORTS SHOWN
          </p>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div ref={gridRef} data-anim="stagger" className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((issue) => (
                <IssueCard key={issue.id} issue={issue} onOpen={setSelectedIssue} />
              ))}
            </div>
          ) : (
            <div className="surface mt-6 flex flex-col items-start px-6 py-14 sm:px-10" data-anim="fade-up">
              <span className="eyebrow">No matches</span>
              <h3 className="text-body mt-4" style={{ fontSize: '1.375rem' }}>
                Nothing in the registry matches that.
              </h3>
              <p className="text-soft mt-3 measure" style={{ fontSize: 'var(--fs-small)' }}>
                Try a different search term, or widen the category and status filters to see more
                of what has been reported.
              </p>
              <button type="button" onClick={clearFilters} className="btn btn-ghost mt-7">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
