import { useCallback, useEffect, useMemo, useState } from 'react';
import { friendlyError } from '../lib/firebaseErrors';
import {
  createIssue,
  deleteIssue,
  seedRegistry,
  subscribeIssues,
  toggleLike
} from '../lib/registry';
import { useAuth } from './useAuth';
import { toast } from '../components/toastBus';

/**
 * The registry, as the page sees it.
 *
 * Holds one live subscription and exposes every write as an async action that
 * reports its own failure and returns a result the caller can branch on. The
 * subscription is what makes the page feel connected: filing a report on one
 * screen appears on every other screen without a refresh, because Firestore
 * pushes the change.
 */
export function useRegistry() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeIssues({
      onChange: (next) => {
        setIssues(next);
        setError(null);
        setLoading(false);
      },
      onError: (failure) => {
        setError(friendlyError(failure, 'The registry could not be loaded.'));
        setLoading(false);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  /** File a report. Resolves to the new id, or null if it was refused. */
  const report = useCallback(
    async (draft) => {
      try {
        const id = await createIssue({ draft, user });
        toast.success('Report filed — it is on the registry now.');
        return id;
      } catch (failure) {
        toast.error(friendlyError(failure, 'The report could not be filed. Please try again.'));
        return null;
      }
    },
    [user]
  );

  /** Back a report, or take the backing back. */
  const toggleBacking = useCallback(
    async (issue) => {
      if (!user) return;
      try {
        await toggleLike({ issueId: issue.id, user });
      } catch (failure) {
        toast.error(friendlyError(failure, 'That backing could not be saved. Please try again.'));
      }
    },
    [user]
  );

  /** Withdraw one of your own reports. */
  const withdraw = useCallback(
    async (issue) => {
      try {
        await deleteIssue({ issueId: issue.id, issue, user });
        toast.success(`${issue.code} withdrawn from the registry.`);
        return true;
      } catch (failure) {
        toast.error(friendlyError(failure, 'That report could not be withdrawn.'));
        return false;
      }
    },
    [user]
  );

  /** Populate an empty registry with the shipped example reports. */
  const seed = useCallback(async () => {
    try {
      const count = await seedRegistry(user);
      if (count) toast.success(`Loaded ${count} example reports into the registry.`);
      else toast.info('The registry already has reports in it.');
      return count;
    } catch (failure) {
      toast.error(friendlyError(failure, 'The example reports could not be loaded.'));
      return 0;
    }
  }, [user]);

  const mine = useMemo(
    () => (user ? issues.filter((issue) => issue.authorId === user.uid) : []),
    [issues, user]
  );

  const backed = useMemo(
    () => (user ? issues.filter((issue) => (issue.likedBy || []).includes(user.uid)) : []),
    [issues, user]
  );

  return {
    issues,
    loading,
    error,
    mine,
    backed,
    report,
    toggleBacking,
    withdraw,
    seed
  };
}
