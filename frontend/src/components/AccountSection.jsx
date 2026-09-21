import React from 'react';
import { LogOut, Plug, Trash2, UserRound } from 'lucide-react';
import { STATUS_CONFIG, findCategory } from './constants';
import { useReveal } from '../hooks/useMotion';
import { useAuth } from '../hooks/useAuth';

const displayName = (user) =>
  user?.displayName || (user?.email ? user.email.split('@')[0] : 'Resident');

const initials = (user) =>
  displayName(user)
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

/** One report, as a hairline row. */
function RecordRow({ issue, onOpen, onWithdraw }) {
  return (
    <li className="flex items-center gap-4 py-3.5" style={{ borderBottom: '1px solid var(--rule)' }}>
      <button
        type="button"
        onClick={() => onOpen(issue)}
        className="group flex min-w-0 flex-1 items-baseline gap-3 text-left"
      >
        <span
          className="tabular shrink-0"
          style={{ fontSize: 'var(--fs-micro)', color: 'var(--ink-faint)', letterSpacing: '0.12em' }}
        >
          {issue.code}
        </span>
        <span className="min-w-0 flex-1">
          <span
            className="text-body block truncate transition-opacity duration-200 group-hover:opacity-70"
            style={{ fontSize: 'var(--fs-small)', fontWeight: 500 }}
          >
            {issue.title}
          </span>
          <span className="text-faint mt-0.5 block truncate" style={{ fontSize: 'var(--fs-micro)' }}>
            {findCategory(issue.category).name} · {issue.location.address}
          </span>
        </span>
        <span className="tabular shrink-0" style={{ fontSize: 'var(--fs-small)', color: 'var(--ink-muted)' }}>
          {issue.upvotes}
        </span>
        <span className="chip chip-status shrink-0" data-status={issue.status}>
          <span className="dot" aria-hidden="true" />
          {STATUS_CONFIG[issue.status].label}
        </span>
      </button>

      {onWithdraw && (
        <button
          type="button"
          onClick={() => onWithdraw(issue)}
          aria-label={`Withdraw ${issue.code}`}
          title="Withdraw this report"
          className="btn-icon shrink-0"
        >
          <Trash2 size={13} strokeWidth={1.8} aria-hidden="true" />
        </button>
      )}
    </li>
  );
}

/** An empty list, stated plainly rather than left as a gap. */
function EmptyNote({ children }) {
  return (
    <p className="text-faint py-6" style={{ fontSize: 'var(--fs-small)', borderBottom: '1px solid var(--rule)' }}>
      {children}
    </p>
  );
}

/**
 * Section 05. The account's own material: everything this person filed,
 * everything this person backed, and the way out. It exists because the data
 * is theirs — a report belongs to whoever raised it, which is also why only
 * they can withdraw it.
 */
export default function AccountSection({
  index,
  label,
  mine,
  backed,
  onOpenIssue,
  onWithdraw,
  onRequestSignIn,
  onSeed
}) {
  const ref = useReveal();
  const { user, isDemo, loading, signOutUser } = useAuth();

  const upvotesReceived = mine.reduce((total, issue) => total + issue.upvotes, 0);
  const resolved = mine.filter((issue) => issue.status === 'resolved').length;

  const stats = [
    { label: 'Reports filed', value: mine.length },
    { label: 'Reports backed', value: backed.length },
    { label: 'Backings received', value: upvotesReceived },
    { label: 'Resolved', value: resolved, accent: true }
  ];

  return (
    <section id="account" aria-labelledby="account-title" className="container" style={{ paddingBlock: 'var(--space-section)' }}>
      <div ref={ref}>
        <div className="rule-accent" data-anim="scale-x" aria-hidden="true" />

        <div className="pt-6 sm:pt-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="min-w-0">
            <span className="eyebrow" data-anim="fade-up">{index} — {label}</span>
            <h2 id="account-title" className="mt-4 text-body" style={{ fontSize: 'var(--fs-h2)' }} data-anim="mask">
              My record
            </h2>
          </div>
          <p className="lead md:text-right md:max-w-[26rem] md:flex-shrink-0" data-anim="fade-up">
            Everything you filed and everything you backed, held against your account rather than
            this browser.
          </p>
        </div>

        <div className="mt-10 sm:mt-14">
          {loading && !user ? (
            <div className="surface px-6 py-14 sm:px-10" data-anim="fade-up">
              <span className="eyebrow">Restoring session</span>
            </div>
          ) : !user ? (
            /* Signed out — say what an account is for, then offer one. */
            <div className="surface flex flex-col items-start px-6 py-14 sm:px-10" data-anim="fade-up">
              <span className="eyebrow">Signed out</span>
              <h3 className="text-body mt-4" style={{ fontSize: '1.375rem' }}>
                Sign in to see your record.
              </h3>
              <p className="text-soft mt-3 measure" style={{ fontSize: 'var(--fs-small)' }}>
                Reports are tied to the person who raised them, so this page fills in once we know
                who you are. Signing in also lets you withdraw a report you no longer stand behind.
              </p>
              <button type="button" onClick={() => onRequestSignIn()} className="btn btn-primary mt-7">
                <UserRound size={14} strokeWidth={1.9} aria-hidden="true" />
                Sign in with Google
              </button>
            </div>
          ) : (
            <>
              {/* Identity strip */}
              <div
                className="flex flex-col gap-5 pb-7 sm:flex-row sm:items-center sm:justify-between"
                style={{ borderBottom: '1px solid var(--rule)' }}
                data-anim="fade-up"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden"
                    style={{
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--rule-strong)',
                      backgroundColor: 'var(--surface)',
                      fontSize: 'var(--fs-small)',
                      letterSpacing: '0.08em'
                    }}
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
                    ) : (
                      initials(user)
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-body truncate" style={{ fontSize: 'var(--fs-h3)', fontWeight: 500, letterSpacing: '-0.02em' }}>
                      {displayName(user)}
                    </p>
                    <p className="text-faint truncate mt-1" style={{ fontSize: 'var(--fs-small)' }}>
                      {user.email || 'Local session'}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="chip">{isDemo ? 'LOCAL SESSION' : 'GOOGLE ACCOUNT'}</span>
                  {!isDemo && (
                    <button type="button" onClick={signOutUser} className="btn btn-ghost">
                      <LogOut size={13} strokeWidth={1.9} aria-hidden="true" />
                      Sign out
                    </button>
                  )}
                </div>
              </div>

              {isDemo && (
                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-faint" style={{ fontSize: 'var(--fs-small)' }}>
                    Firebase keys are not in place yet, so this record lives in this browser only.
                    Add them to <span className="tabular">backend/.env</span> to move it onto an account.
                  </p>
                  <button
                    type="button"
                    onClick={() => onRequestSignIn()}
                    className="btn btn-ghost shrink-0"
                  >
                    <Plug size={13} strokeWidth={1.9} aria-hidden="true" />
                    See what&apos;s missing
                  </button>
                </div>
              )}

              {/* Own figures */}
              <div className="stat-strip mt-8" data-anim="stagger">
                {stats.map((stat) => (
                  <div key={stat.label} className="stat-cell">
                    <p
                      className="tabular leading-none"
                      style={{
                        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                        color: stat.accent ? 'var(--accent)' : 'var(--ink)'
                      }}
                    >
                      {stat.value}
                    </p>
                    <p className="label" style={{ margin: '0.75rem 0 0' }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* The two lists */}
              <div className="mt-12 grid gap-5 lg:grid-cols-2" data-anim="stagger">
                <div className="surface p-6 sm:p-8">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-body" style={{ fontSize: 'var(--fs-h3)', letterSpacing: '-0.02em' }}>
                      Reports you filed
                    </h3>
                    <span className="tabular" style={{ fontSize: 'var(--fs-micro)', color: 'var(--ink-faint)', letterSpacing: '0.14em' }}>
                      {String(mine.length).padStart(2, '0')}
                    </span>
                  </div>

                  <ul className="mt-6">
                    {mine.length ? (
                      mine.map((issue) => (
                        <RecordRow key={issue.id} issue={issue} onOpen={onOpenIssue} onWithdraw={onWithdraw} />
                      ))
                    ) : (
                      <EmptyNote>
                        Nothing filed yet. Anything you report appears here, and only you can
                        withdraw it.
                      </EmptyNote>
                    )}
                  </ul>

                  {!mine.length && (
                    <button type="button" onClick={onSeed} className="btn btn-ghost mt-6">
                      Load example reports
                    </button>
                  )}
                </div>

                <div className="surface p-6 sm:p-8">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-body" style={{ fontSize: 'var(--fs-h3)', letterSpacing: '-0.02em' }}>
                      Reports you backed
                    </h3>
                    <span className="tabular" style={{ fontSize: 'var(--fs-micro)', color: 'var(--ink-faint)', letterSpacing: '0.14em' }}>
                      {String(backed.length).padStart(2, '0')}
                    </span>
                  </div>

                  <ul className="mt-6">
                    {backed.length ? (
                      backed.map((issue) => <RecordRow key={issue.id} issue={issue} onOpen={onOpenIssue} />)
                    ) : (
                      <EmptyNote>
                        Nothing backed yet. Open a report from the registry and back it — this is
                        how a problem climbs the ward&apos;s list.
                      </EmptyNote>
                    )}
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
