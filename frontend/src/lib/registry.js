/**
 * The registry — one API over two backends.
 *
 *   Firestore   when the project is configured. Reports, likes and ownership
 *               all live in the account, and security rules enforce that a
 *               resident can only ever write their own records.
 *   localStorage  while the keys are still blank (see localRegistry.js).
 *
 * Every caller talks to the functions below and never asks which backend is
 * live, so switching Firestore on is a `.env` change and nothing else.
 *
 * Document shape at `issues/{id}`:
 *   code         "ISS-0007" — the public reference, from counters/registry
 *   title, description, category, status
 *   location     { address }
 *   image        download URL          imagePath  storage object path, for cleanup
 *   upvotes      number                likedBy    [uid, ...]
 *   authorId, authorName, authorPhoto
 *   createdAt    Timestamp
 */
import {
  Timestamp,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  writeBatch
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref as objectRef, uploadBytes } from 'firebase/storage';
import { db, isFirebaseConfigured, storage } from './firebase';
import { MOCK_ISSUES, PLACEHOLDER_IMAGE, issueRef } from '../components/constants';
import {
  createLocalIssue,
  removeLocalIssue,
  resetLocalRegistry,
  subscribeLocal,
  toggleLocalLike
} from './localRegistry';

export const REGISTRY_MODE = isFirebaseConfigured ? 'firestore' : 'local';

/** Uploads are capped here, and ReportSection repeats the limit in its copy. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Demo mode keeps images in localStorage, so only small ones are kept. */
const LOCAL_IMAGE_LIMIT = 400 * 1024;

const COUNTER = { collection: 'counters', doc: 'registry' };

/** Firestore Timestamp | Date | ISO string | null → ISO string. */
function toIso(value) {
  if (!value) return new Date().toISOString();
  if (typeof value === 'string') return new Date(value).toISOString();
  if (typeof value?.toDate === 'function') return value.toDate().toISOString();
  return new Date(value).toISOString();
}

/** Firestore document → the shape every component renders. */
function normalizeIssue(id, data) {
  return {
    id,
    code: data.code || issueRef(id),
    title: data.title || '',
    description: data.description || '',
    category: data.category || 'other',
    status: data.status || 'reported',
    location: { address: data.location?.address || 'Location not given' },
    image: data.image || PLACEHOLDER_IMAGE,
    imagePath: data.imagePath || null,
    upvotes: Number(data.upvotes) || 0,
    likedBy: Array.isArray(data.likedBy) ? data.likedBy : [],
    createdAt: toIso(data.createdAt),
    reportedBy: data.authorName || 'Anonymous',
    authorId: data.authorId || null,
    authorPhoto: data.authorPhoto || null
  };
}

/**
 * Live registry. Returns an unsubscribe function that is safe to call twice.
 * Firestore's own latency compensation means a like or a new report shows up
 * in the local snapshot immediately, so no optimistic layer is needed here.
 */
export function subscribeIssues({ onChange, onError }) {
  if (!isFirebaseConfigured) return subscribeLocal(onChange);

  return onSnapshot(
    query(collection(db, 'issues'), orderBy('createdAt', 'desc')),
    (snapshot) => onChange(snapshot.docs.map((entry) => normalizeIssue(entry.id, entry.data()))),
    (error) => {
      if (onError) onError(error);
    }
  );
}

/** Upload a report photo and return its public URL plus its storage path. */
export async function uploadIssueImage(file, uid) {
  if (!file) return null;
  if (file.size > MAX_IMAGE_BYTES) {
    throw Object.assign(new Error('That photo is larger than 5MB.'), { code: 'app/image-too-large' });
  }
  if (!isFirebaseConfigured) {
    // No Storage in demo mode. Small images survive in localStorage; anything
    // larger would blow its quota, so it falls back to the placeholder.
    if (file.size > LOCAL_IMAGE_LIMIT) return null;
    const url = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('That file could not be read.'));
      reader.readAsDataURL(file);
    });
    return { url, path: null };
  }

  const safeName = String(file.name || 'photo').replace(/[^a-zA-Z0-9._-]/g, '_').slice(-48);
  const path = `issues/${uid}/${Date.now()}-${safeName}`;
  const target = objectRef(storage, path);
  await uploadBytes(target, file, { contentType: file.type });
  return { url: await getDownloadURL(target), path };
}

/**
 * Files a report. Returns the new document's id so the caller can scroll to it
 * or open it. The public code comes from a counter document incremented in the
 * same transaction as the write, which is what keeps ISS-numbers gap-free.
 */
export async function createIssue({ draft, user }) {
  const uploaded = draft.image ? await uploadIssueImage(draft.image, user.uid) : null;
  const image = uploaded?.url || PLACEHOLDER_IMAGE;
  const imagePath = uploaded?.path || null;

  if (!isFirebaseConfigured) {
    return createLocalIssue({ ...draft, imageUrl: image });
  }

  const issueDoc = doc(collection(db, 'issues'));

  await runTransaction(db, async (transaction) => {
    const counterRef = doc(db, COUNTER.collection, COUNTER.doc);
    const counter = await transaction.get(counterRef);
    const seq = (counter.exists() ? Number(counter.data().seq) || 0 : 0) + 1;

    transaction.set(counterRef, { seq }, { merge: true });
    transaction.set(issueDoc, {
      code: issueRef(null, seq),
      title: draft.title.trim(),
      description: draft.description.trim(),
      category: draft.category,
      status: 'reported',
      location: { address: draft.location.trim() },
      image,
      imagePath,
      upvotes: 0,
      likedBy: [],
      authorId: user.uid,
      authorName: user.displayName || 'Resident',
      authorPhoto: user.photoURL || null,
      // A client timestamp rather than serverTimestamp(): it resolves
      // immediately, so ordering by createdAt is stable in the local snapshot
      // the moment the report is filed.
      createdAt: Timestamp.now()
    });
  });

  return issueDoc.id;
}

/**
 * Back a report, or take the backing back. One account counts once, enforced
 * by the array and by the rules — so this is safe to fire in either direction.
 */
export async function toggleLike({ issueId, user }) {
  if (!isFirebaseConfigured) {
    toggleLocalLike(issueId, user.uid);
    return;
  }

  const issueDoc = doc(db, 'issues', issueId);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(issueDoc);
    if (!snapshot.exists()) return;

    const likedBy = Array.isArray(snapshot.data().likedBy) ? snapshot.data().likedBy : [];
    const liked = likedBy.includes(user.uid);

    transaction.update(issueDoc, {
      likedBy: liked ? arrayRemove(user.uid) : arrayUnion(user.uid),
      upvotes: increment(liked ? -1 : 1)
    });
  });
}

/** Withdraw a report. Rules allow this only for the account that filed it. */
export async function deleteIssue({ issueId, issue, user }) {
  if (!isFirebaseConfigured) {
    removeLocalIssue(issueId);
    return;
  }
  if (issue?.authorId && user?.uid && issue.authorId !== user.uid) {
    throw Object.assign(new Error('You can only withdraw your own report.'), {
      code: 'app/not-owner'
    });
  }

  await deleteDoc(doc(db, 'issues', issueId));

  // Best effort: the report is gone either way, a stranded photo is not fatal.
  if (issue?.imagePath) {
    try {
      await deleteObject(objectRef(storage, issue.imagePath));
    } catch {
      /* already removed, or the rules forbid it — the document is what matters */
    }
  }
}

/**
 * Loads the example reports into an empty registry. Only offered when the
 * collection is empty and someone is signed in, because the write has to be
 * attributed to a real account for the rules to accept it.
 */
export async function seedRegistry(user) {
  if (!isFirebaseConfigured) return resetLocalRegistry();

  const existing = await getDocs(query(collection(db, 'issues'), limit(1)));
  if (!existing.empty) return 0;

  const batch = writeBatch(db);
  MOCK_ISSUES.forEach((issue, index) => {
    batch.set(doc(collection(db, 'issues')), {
      ...issue,
      code: issueRef(null, index + 1),
      authorId: user.uid,
      authorName: user.displayName || 'Resident',
      authorPhoto: user.photoURL || null,
      createdAt: Timestamp.fromDate(new Date(issue.createdAt))
    });
  });
  batch.set(doc(db, COUNTER.collection, COUNTER.doc), { seq: MOCK_ISSUES.length }, { merge: true });

  await batch.commit();
  return MOCK_ISSUES.length;
}
