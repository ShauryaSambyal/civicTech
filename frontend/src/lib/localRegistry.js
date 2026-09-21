/**
 * The registry's offline stand-in.
 *
 * This is what runs while `VITE_FIREBASE_*` is still blank, and it is the
 * reason a half-configured checkout is still a working product: browse, file a
 * report, back someone else's — all of it persists in this browser. Nothing is
 * shared and no account exists, so writes are attributed to a single local
 * identity. The moment the keys are filled in, `registry.js` routes to
 * Firestore instead and this module goes quiet.
 */
import { MOCK_ISSUES, PLACEHOLDER_IMAGE, issueRef } from '../components/constants';

const STORAGE_KEY = 'civictech:registry:v1';

/** The identity demo mode files reports under. Not an account — a placeholder. */
export const DEMO_USER = {
  uid: 'local-session',
  displayName: 'Local resident',
  email: null,
  photoURL: null,
  isDemo: true
};

const listeners = new Set();

const clone = (value) => JSON.parse(JSON.stringify(value));

/** Next free ISS-#### number for the given list. */
const nextSequence = (list) =>
  list.reduce((highest, issue) => {
    const parsed = Number(String(issue.code || '').replace(/\D/g, ''));
    return Number.isFinite(parsed) && parsed > highest ? parsed : highest;
  }, 0) + 1;

function load() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {
    /* storage unavailable — fall through to the seed */
  }
  return clone(MOCK_ISSUES);
}

let issues = load();

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
  } catch {
    /* private mode: keep the session in memory only */
  }
}

function emit() {
  persist();
  const snapshot = clone(issues);
  listeners.forEach((listener) => listener(snapshot));
}

/** Subscribe to the local registry. Fires immediately with the current list. */
export function subscribeLocal(onChange) {
  listeners.add(onChange);
  onChange(clone(issues));
  return () => listeners.delete(onChange);
}

export function createLocalIssue(draft) {
  const code = issueRef(null, nextSequence(issues));
  const issue = {
    id: code,
    code,
    title: draft.title.trim(),
    description: draft.description.trim(),
    category: draft.category,
    status: 'reported',
    location: { address: draft.location.trim() },
    image: draft.imageUrl || PLACEHOLDER_IMAGE,
    imagePath: null,
    upvotes: 0,
    likedBy: [],
    createdAt: new Date().toISOString(),
    reportedBy: DEMO_USER.displayName,
    authorId: DEMO_USER.uid,
    authorPhoto: null
  };

  issues = [issue, ...issues];
  emit();
  return issue;
}

export function toggleLocalLike(issueId, uid) {
  issues = issues.map((issue) => {
    if (issue.id !== issueId) return issue;
    const liked = (issue.likedBy || []).includes(uid);
    return {
      ...issue,
      likedBy: liked
        ? issue.likedBy.filter((entry) => entry !== uid)
        : [...(issue.likedBy || []), uid],
      upvotes: Math.max(0, issue.upvotes + (liked ? -1 : 1))
    };
  });
  emit();
}

export function removeLocalIssue(issueId) {
  issues = issues.filter((issue) => issue.id !== issueId);
  emit();
}

/** Restore the shipped example reports. */
export function resetLocalRegistry() {
  issues = clone(MOCK_ISSUES);
  emit();
  return issues.length;
}
