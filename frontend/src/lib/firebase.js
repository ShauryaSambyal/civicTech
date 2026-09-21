/**
 * Firebase bootstrap.
 *
 * Reads the config from Vite's `VITE_FIREBASE_*` variables and exposes the
 * three SDK entry points the app uses: Auth, Firestore and Storage.
 *
 * The important behaviour here is what happens when the config is incomplete.
 * Every value is filled in by hand, so the app has to stay bootable while the
 * keys are still blank — otherwise a half-configured checkout is a white
 * screen instead of a working demo. When anything required is missing we skip
 * `initializeApp` entirely and export `null` handles plus an `isFirebaseConfigured`
 * flag; the registry layer reads that flag and switches to its local
 * implementation. Nothing else in the app has to know.
 */
import { getApps, initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
  setPersistence
} from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';

/** The Firebase web config, read once from the environment. */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

/** Config keys without which the SDK cannot talk to a project at all. */
const REQUIRED_KEYS = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId'
];

/** Which required values are still blank — surfaced verbatim by the auth modal. */
export const missingEnvKeys = REQUIRED_KEYS.filter((key) => {
  const value = firebaseConfig[key];
  return value === undefined || String(value).trim() === '';
}).map((key) => `VITE_FIREBASE_${key.replace(/[A-Z]/g, (c) => `_${c}`).toUpperCase()}`);

export const isFirebaseConfigured = missingEnvKeys.length === 0;

/** Use the local emulator suite (set VITE_FIREBASE_USE_EMULATORS=true). */
export const useEmulators = String(import.meta.env.VITE_FIREBASE_USE_EMULATORS) === 'true';

let app = null;
let auth = null;
let db = null;
let storage = null;

if (isFirebaseConfigured) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

  auth = getAuth(app);
  // Sessions survive a refresh — a resident filing a report should not be
  // signed out by a reload.
  setPersistence(auth, browserLocalPersistence).catch(() => {
    /* private mode: fall back to the SDK default */
  });

  db = getFirestore(app);
  storage = getStorage(app);

  if (useEmulators) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    connectStorageEmulator(storage, '127.0.0.1', 9199);
  }
}

export { app, auth, db, storage };

/** Provider for Google sign-in. Only built when Auth exists. */
export const createGoogleProvider = () => {
  if (!auth) return null;
  const provider = new GoogleAuthProvider();
  // Always show the account chooser — shared computers are the norm.
  provider.setCustomParameters({ prompt: 'select_account' });
  return provider;
};
