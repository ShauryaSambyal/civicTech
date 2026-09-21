import React, { useState } from 'react';
import { ArrowUp, Search, X } from 'lucide-react';
import { CATEGORIES, STATUS_CONFIG, STATUS_ORDER, findCategory, hasLiked } from './constants';
import { useReveal, useStaggerIn } from '../hooks/useMotion';

/**
 * One report in the grid.
 *
 * The card is an `<article>`, not a button: a single transparent overlay
 * button provides "open the report" across the whole surface, and the backing
 * control sits above it in the stacking order. That keeps the whole card
 * clickable without nesting a button inside a button, which is what a
 * role="button" wrapper would have forced.
 */
function IssueCard({ issue, user, onOpen, onToggleLike, onRequestSignIn }) {
  const [loaded, setLoaded] = useState(false);
  const category = findCategory(issue.category);
  const status = STATUS_CONFIG[issue.status];
  const liked = hasLiked(issue, user?.uid);

  const handleBack = () => {
    if (!user) {
      onRequestSignIn('Backing a report');
      return;
    }
    onToggleLike(issue);
  };

  return (
    <article className="surface panel-interactive media-grey group relative flex flex-col overflow-hidden text-left">
      <button
        type="button"
        onClick={() => onOpen(issue)}
        aria-label={`Open ${issue.code}: ${issue.title}`}
        className="card-open"
      />

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
          {issue.code}
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

          <button
            type="button"
            onClick={handleBack}
            aria-pressed={liked}
            aria-label={liked ? `Remove your backing from ${issue.code}` : `Back ${issue.code}`}
            className="back-btn"
            data-backed={liked ? 'true' : 'false'}
          >
            <ArrowUp size={13} strokeWidth={2.2} aria-hidden="true" />
            <span className="tabular">{issue.upvotes}</span>
          </button>
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
export default function IssuesSection({
  index,
  label,
  issues,
  loading,
  error,
  user,
  onOpenIssue,
  onToggleLike,
  onRequestSignIn,
  onSeed
}) {
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
            Everything reported in this ward, newest first. Search it, filter it, and back the
            problems you live with.
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

          {error && (
            <p className="mt-3" style={{ fontSize: 'var(--fs-small)', color: 'var(--accent)' }} role="status">
              {error}
            </p>
          )}

          {/* Grid */}
          {loading ? (
            <div className="surface mt-6 flex flex-col items-start px-6 py-14 sm:px-10">
              <span className="eyebrow">Loading the registry</span>
              <p className="text-soft mt-4" style={{ fontSize: 'var(--fs-small)' }}>
                Fetching reports from the live registry.
              </p>
            </div>
          ) : issues.length === 0 ? (
            /* A brand new registry, not a filtered-out one. */
            <div className="surface mt-6 flex flex-col items-start px-6 py-14 sm:px-10" data-anim="fade-up">
              <span className="eyebrow">Empty registry</span>
              <h3 className="text-body mt-4" style={{ fontSize: '1.375rem' }}>
                Nothing has been reported here yet.
              </h3>
              <p className="text-soft mt-3 measure" style={{ fontSize: 'var(--fs-small)' }}>
                Be the first. Reports are public the moment they are filed, and anyone who lives
                with the same problem can back them.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a href="#report" className="btn btn-primary">Report an issue</a>
                <button type="button" onClick={onSeed} className="btn btn-ghost">
                  Load example reports
                </button>
              </div>
            </div>
          ) : filtered.length > 0 ? (
            <div ref={gridRef} data-anim="stagger" className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  user={user}
                  onOpen={onOpenIssue}
                  onToggleLike={onToggleLike}
                  onRequestSignIn={onRequestSignIn}
                />
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
