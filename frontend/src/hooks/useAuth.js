import { createContext, useContext } from 'react';

/**
 * The session, as the rest of the app sees it.
 *
 * Deliberately a bare module: the context object and its hook live together so
 * that `AuthProvider` stays a component-only export (React Fast Refresh) and
 * anything — including non-React helpers — can read the session without
 * pulling in JSX.
 *
 * Shape:
 *   user             Firebase User, or the local stand-in in demo mode, or null
 *   loading          still resolving the session on first paint
 *   isConfigured     Firebase keys are present, so real accounts are possible
 *   isDemo           running on the local stand-in identity
 *   pending          a sign-in is in flight
 *   error            last auth failure, already phrased for a human
 */
export const AuthContext = createContext({
  user: null,
  loading: true,
  isConfigured: false,
  isDemo: false,
  pending: false,
  error: null,
  signInWithGoogle: async () => null,
  signOutUser: async () => {},
  clearError: () => {}
});

export const useAuth = () => useContext(AuthContext);
