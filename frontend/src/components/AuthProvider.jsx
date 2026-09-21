import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, createGoogleProvider, isFirebaseConfigured } from '../lib/firebase';
import { friendlyError } from '../lib/firebaseErrors';
import { DEMO_USER } from '../lib/localRegistry';
import { AuthContext } from '../hooks/useAuth';
import { toast } from './toastBus';

/**
 * Owns the session for the whole page.
 *
 * Two modes, one interface. With Firebase configured it mirrors
 * `onAuthStateChanged`, so a Google session survives refreshes and closing the
 * tab. Without it there is no account to have, so the page runs on a single
 * local identity — which is what keeps reporting and backings working while
 * the keys are still blank. `isDemo` is what the UI reads to say so plainly
 * instead of pretending an account exists.
 */
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (isFirebaseConfigured ? null : DEMO_USER));
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined;

    return onAuthStateChanged(
      auth,
      (nextUser) => {
        setUser(nextUser);
        setLoading(false);
      },
      (failure) => {
        setError(friendlyError(failure, 'The session could not be restored.'));
        setLoading(false);
      }
    );
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!isFirebaseConfigured) return null;

    setPending(true);
    setError(null);
    try {
      const credential = await signInWithPopup(auth, createGoogleProvider());
      toast.success(
        `Signed in as ${credential.user.displayName || credential.user.email || 'you'}.`
      );
      return credential.user;
    } catch (failure) {
      // A cancelled popup is not a failure worth shouting about.
      setError(friendlyError(failure, 'Sign-in failed. Please try again.'));
      return null;
    } finally {
      setPending(false);
    }
  }, []);

  const signOutUser = useCallback(async () => {
    if (!isFirebaseConfigured) {
      toast.info('There is no account to sign out of until Firebase keys are added.');
      return;
    }
    try {
      await signOut(auth);
      toast.success('Signed out. Your reports stay on the registry.');
    } catch (failure) {
      toast.error(friendlyError(failure, 'Could not sign out. Please try again.'));
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      pending,
      error,
      isConfigured: isFirebaseConfigured,
      isDemo: Boolean(user?.isDemo),
      signInWithGoogle,
      signOutUser,
      clearError: () => setError(null)
    }),
    [user, loading, pending, error, signInWithGoogle, signOutUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
