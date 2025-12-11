import React, { useState } from 'react';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import ReportIssuePage from './components/ReportIssuePage';
import AnalyticsPage from './components/AnalyticsPage';
import IssueDetailModal from './components/IssueDetailModal';
import { MOCK_ISSUES } from './components/constants';

export default function LocalIssueReporter() {
  const [activeTab, setActiveTab] = useState('home');
  const [issues, setIssues] = useState(MOCK_ISSUES);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [user] = useState('Rahul Kumar');

  const handleReportIssue = (newIssue) => {
    const issue = {
      id: issues.length + 1,
      ...newIssue,
      status: 'reported',
      upvotes: 0,
      createdAt: new Date().toISOString().split('T')[0],
      reportedBy: user,
      location: { address: newIssue.location },
      image: newIssue.image ? URL.createObjectURL(newIssue.image) : 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=400'
    };
    setIssues([issue, ...issues]);
    setActiveTab('home');
  };

  const handleUpvote = (issueId) => {
    setIssues(issues.map(issue =>
      issue.id === issueId ? { ...issue, upvotes: issue.upvotes + 1 } : issue
    ));
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue({ ...selectedIssue, upvotes: selectedIssue.upvotes + 1 });
    }
  };

  return (
    <>
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

      {activeTab === 'home' && (
        <HomePage issues={issues} setSelectedIssue={setSelectedIssue} />
      )}

      {activeTab === 'report' && (
        <ReportIssuePage onSubmit={handleReportIssue} />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsPage issues={issues} />
      )}

      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onUpvote={handleUpvote}
      />
    </>
  );
}
