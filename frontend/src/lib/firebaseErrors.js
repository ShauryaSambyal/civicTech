/**
 * Turns Firebase's error codes into sentences a resident can act on.
 *
 * The SDK speaks in codes like `auth/popup-blocked`; the interface speaks in
 * plain language, on a single accent-coloured line. Anything we do not have a
 * specific message for falls through to the caller's own wording, so an
 * unexpected failure is never swallowed.
 */

const MESSAGES = {
  // --- Auth ---
  'auth/popup-blocked':
    'Your browser blocked the sign-in window. Allow pop-ups for this site, then try again.',
  'auth/popup-closed-by-user': 'Sign-in closed before it finished. Nothing was changed.',
  'auth/network-request-failed': 'No connection to Google. Check your network and try again.',
  'auth/unauthorized-domain':
    'This domain is not authorised for sign-in yet. Add it under Authentication → Settings → Authorized domains in the Firebase console.',
  'auth/operation-not-allowed':
    'Google sign-in is switched off for this project. Enable it under Authentication → Sign-in method.',
  'auth/user-disabled': 'This account has been disabled by an administrator.',
  'auth/too-many-requests':
    'Too many attempts in a row. Wait a moment, then try signing in again.',
  'auth/account-exists-with-different-credential':
    'That email is already linked to a different sign-in method.',
  'auth/internal-error': 'Google returned an unexpected response. Please try again.',

  // --- Firestore ---
  'permission-denied':
    'The database refused that change. Make sure the rules in firestore.rules are deployed and that you are signed in.',
  unavailable: 'Cannot reach the database right now. Check your connection and try again.',
  'failed-precondition':
    'The database needs an index it does not have yet. Check the browser console for the link Firebase provides.',
  'not-found': 'That report no longer exists — it may have been deleted.',
  'resource-exhausted':
    'The project has hit its free daily quota. Try again after the quota resets.',
  'deadline-exceeded': 'The database took too long to answer. Please try again.',

  // --- Storage ---
  'storage/unauthorized':
    'That photo was rejected. Make sure the rules in storage.rules are deployed and that you are signed in.',
  'storage/retry-limit-exceeded': 'The photo upload timed out. Try again, or file the report without one.',
  'storage/canceled': 'The photo upload was cancelled.',
  'storage/unknown': 'The photo could not be uploaded. Try again, or file the report without one.'
};

export const errorCode = (error) => (error && (error.code || error.name)) || '';

/**
 * A message worth showing the user, or `null` when the error is one we
 * deliberately stay quiet about (the user cancelled).
 */
export function friendlyError(error, fallback) {
  const code = errorCode(error);
  if (!code) return fallback || 'Something went wrong. Please try again.';
  if (code === 'auth/cancelled-popup-request') return null;
  return MESSAGES[code] || error?.message || fallback || 'Something went wrong. Please try again.';
}
