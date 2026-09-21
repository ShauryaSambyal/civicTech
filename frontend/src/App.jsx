import React, { useCallback, useState } from 'react';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import IssuesSection from './components/IssuesSection';
import ReportSection from './components/ReportSection';
import AnalyticsSection from './components/AnalyticsSection';
import AccountSection from './components/AccountSection';
import Footer from './components/Footer';
import IssueDetailModal from './components/IssueDetailModal';
import AuthModal from './components/AuthModal';
import AuthProvider from './components/AuthProvider';
import ToastHost from './components/Toast';
import { section } from './components/constants';
import { useAuth } from './hooks/useAuth';
import { useRegistry } from './hooks/useRegistry';
import { useSmoothScroll, scrollToTarget } from './hooks/useSmoothScroll';

const ISSUES = section('issues');
const REPORT = section('report');
const ANALYTICS = section('analytics');
const ACCOUNT = section('account');

/**
 * The entire product is one scrolling page. There is no router and no page
 * switching: the nav moves the viewport between sections, and nothing unmounts.
 *
 * Data is live. `useRegistry` holds one subscription to the registry — Firestore
 * when the project is configured, localStorage before that — and every write
 * goes through it, so a report filed on one machine appears on every other
 * without a refresh.
 *
 * Scroll is driven by Lenis (inertial, with eased anchor navigation); every
 * reveal, stagger and micro-interaction is an anime.js timeline.
 */
function CivicTech() {
  const { user, loading: authLoading } = useAuth();
  const registry = useRegistry();

  // The open report is held by id, not by value, so it stays in step with the
  // live list: a withdrawal, or a backing from someone else, is reflected in
  // the panel that is already open.
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [authPrompt, setAuthPrompt] = useState({ open: false, reason: null });

  useSmoothScroll();

  const selectedIssue = selectedIssueId
    ? registry.issues.find((issue) => issue.id === selectedIssueId) || null
    : null;

  const openIssue = useCallback((issue) => setSelectedIssueId(issue.id), []);
  const closeIssue = useCallback(() => setSelectedIssueId(null), []);

  const requestSignIn = useCallback((reason) => setAuthPrompt({ open: true, reason: reason || null }), []);
  const closeAuthPrompt = useCallback(() => setAuthPrompt({ open: false, reason: null }), []);

  /* Filing carries the reader to the registry, where the new report now sits. */
  const handleReport = useCallback(
    async (draft) => {
      const createdId = await registry.report(draft);
      if (!createdId) return null;
      requestAnimationFrame(() => scrollToTarget('#issues'));
      return createdId;
    },
    [registry]
  );

  /* Withdrawing closes the panel, because there is nothing left to look at. */
  const handleWithdraw = useCallback(
    async (issue) => {
      const withdrawn = await registry.withdraw(issue);
      if (withdrawn) setSelectedIssueId(null);
      return withdrawn;
    },
    [registry]
  );

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar
        onRequestSignIn={() => requestSignIn()}
        myCount={registry.mine.length}
        backedCount={registry.backed.length}
      />

      <main className="flex-1">
        <Hero issues={registry.issues} />

        <IssuesSection
          index={ISSUES.index}
          label={ISSUES.label}
          issues={registry.issues}
          loading={registry.loading}
          error={registry.error}
          user={user}
          onOpenIssue={openIssue}
          onToggleLike={registry.toggleBacking}
          onRequestSignIn={requestSignIn}
          onSeed={registry.seed}
        />

        <ReportSection
          index={REPORT.index}
          label={REPORT.label}
          onSubmit={handleReport}
          user={user}
          loading={authLoading}
          onRequestSignIn={requestSignIn}
        />

        <AnalyticsSection
          index={ANALYTICS.index}
          label={ANALYTICS.label}
          issues={registry.issues}
        />

        <AccountSection
          index={ACCOUNT.index}
          label={ACCOUNT.label}
          mine={registry.mine}
          backed={registry.backed}
          onOpenIssue={openIssue}
          onWithdraw={handleWithdraw}
          onRequestSignIn={() => requestSignIn()}
          onSeed={registry.seed}
        />
      </main>

      <Footer issues={registry.issues} />

      <IssueDetailModal
        issue={selectedIssue}
        user={user}
        onClose={closeIssue}
        onToggleLike={registry.toggleBacking}
        onWithdraw={handleWithdraw}
        onRequestSignIn={requestSignIn}
      />

      <AuthModal open={authPrompt.open} reason={authPrompt.reason} onClose={closeAuthPrompt} />

      <ToastHost />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CivicTech />
    </AuthProvider>
  );
}
