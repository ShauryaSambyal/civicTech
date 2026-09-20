import React, { useState } from 'react';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import IssuesSection from './components/IssuesSection';
import ReportSection from './components/ReportSection';
import AnalyticsSection from './components/AnalyticsSection';
import Footer from './components/Footer';
import IssueDetailModal from './components/IssueDetailModal';
import ToastHost from './components/Toast';
import { MOCK_ISSUES, SECTIONS } from './components/constants';
import { useSmoothScroll, scrollToTarget } from './hooks/useSmoothScroll';

const [, ISSUES, REPORT, ANALYTICS] = SECTIONS;

/**
 * The entire product is one scrolling page. There is no router and no page
 * switching: the nav moves the viewport between sections, and nothing unmounts.
 *
 * Scroll is driven by Lenis (inertial, with eased anchor navigation); every
 * reveal, stagger and micro-interaction is an anime.js timeline.
 */
export default function CivicTech() {
  const [issues, setIssues] = useState(MOCK_ISSUES);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [user] = useState('Rahul Kumar');

  useSmoothScroll();

  const handleReportIssue = (draft) => {
    const issue = {
      id: issues.length + 1,
      ...draft,
      status: 'reported',
      upvotes: 0,
      createdAt: new Date().toISOString().split('T')[0],
      reportedBy: user,
      location: { address: draft.location },
      image: draft.image
        ? URL.createObjectURL(draft.image)
        : 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800'
    };

    setIssues((current) => [issue, ...current]);

    // The new report lands at the top of the registry — the grid re-staggers
    // and the page carries the reader to it.
    requestAnimationFrame(() => scrollToTarget('#issues'));
  };

  const handleUpvote = (issueId) => {
    setIssues((current) =>
      current.map((issue) =>
        issue.id === issueId ? { ...issue, upvotes: issue.upvotes + 1 } : issue
      )
    );
    setSelectedIssue((current) =>
      current && current.id === issueId ? { ...current, upvotes: current.upvotes + 1 } : current
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar user={user} />

      <main className="flex-1">
        <Hero issues={issues} />

        <IssuesSection
          index={ISSUES.index}
          label={ISSUES.label}
          issues={issues}
          setSelectedIssue={setSelectedIssue}
        />

        <ReportSection index={REPORT.index} label={REPORT.label} onSubmit={handleReportIssue} />

        <AnalyticsSection index={ANALYTICS.index} label={ANALYTICS.label} issues={issues} />
      </main>

      <Footer issues={issues} />

      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onUpvote={handleUpvote}
      />

      <ToastHost />
    </div>
  );
}
