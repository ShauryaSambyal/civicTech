# Firebase setup

CivicTech's backend is Firebase: Google sign-in for accounts, Firestore for the
registry, and Cloud Storage for report photographs. Every report and every
backing is tied to the account that made it.

All of the backend configuration lives in **`backend/`** — the security rules,
the Firebase CLI config, and the environment files. There is no server code;
the browser talks to Firebase directly.

The app boots **without any of this**. Until the variables in
`backend/.env` are filled in it runs in *local session* mode — browsing,
reporting and backing all work and persist in your browser, with a plain
banner saying so. Nothing is shared and no sign-in is offered. Filling in the
keys switches it over; no code changes are needed.

---

## 1. Create the project

1. Go to <https://console.firebase.google.com> and **Add project**.
2. Name it (e.g. `civictech`). Google Analytics is optional — the app only
   reads `VITE_FIREBASE_MEASUREMENT_ID` if you set it.

## 2. Register the web app and collect the variables

1. In the project, click the **web** icon (`</>`) to add a web app.
2. Nickname it `civictech-web`. Do **not** tick Firebase Hosting unless you
   want it.
3. Firebase shows a `firebaseConfig` object. Match it up with `backend/.env`:

| Firebase console key | `backend/.env` variable | Looks like |
| --- | --- | --- |
| `apiKey` | `VITE_FIREBASE_API_KEY` | `AIzaSyD…` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` | `civictech.firebaseapp.com` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` | `civictech` |
| `storageBucket` | `VITE_FIREBASE_STORAGE_BUCKET` | `civictech.firebasestorage.app` |
| `messagingSenderId` | `VITE_FIREBASE_MESSAGING_SENDER_ID` | `123456789012` |
| `appId` | `VITE_FIREBASE_APP_ID` | `1:1234…:web:abcd…` |
| `measurementId` | `VITE_FIREBASE_MEASUREMENT_ID` | `G-XXXXXXXXXX` (optional) |

You can also find all of them later under **Project settings → General → Your
apps → SDK setup and configuration → Config**.

> **These values are not secrets.** Vite inlines every `VITE_*` value into the
> browser bundle, and Firebase hands this same config to every visitor on
> purpose — that is how the SDK works. Your data is protected by the rules in
> `firestore.rules` and `storage.rules`, not by hiding the keys. Never put a
> service-account JSON or an admin private key in a `VITE_*` variable.

## 3. Turn on Google sign-in

**Authentication → Get started → Sign-in method → Google → Enable.** Pick a
support email and save. You do **not** need Anonymous, Email/Password or
anything else.

## 4. Authorise your domains

**Authentication → Settings → Authorized domains.** `localhost` is there by
default. When you deploy, add your real domain (`civictech.example.com`) or
sign-in will fail with `auth/unauthorized-domain`.

## 5. Create the database

**Firestore Database → Create database.** Choose **Production mode** — the
rules in this repo are what grant access, and the default deny-all rule is the
right starting point. Pick a region close to your users; it cannot be changed
later.

## 6. Turn on Storage

**Storage → Get started.** Accept the default bucket. Report photos are stored
here under `issues/{your-uid}/…`.

## 7. Deploy the security rules

This is the step that actually makes the app work. Until it is done, Firestore
in Production mode rejects every read and write, and the registry will show the
permission error.

```bash
npm install -g firebase-tools
firebase login
cd backend
npm run use            # or: firebase use --add — pick your project, alias it "default"
npm run deploy         # or: firebase deploy --only firestore:rules,storage
```

`firestore.indexes.json` is empty on purpose — the registry only orders by
`createdAt`, which is a single-field index Firestore maintains automatically.

## 8. Restart the dev server

Vite only reads `.env` at startup:

```bash
cd frontend
npm run dev
```

Then check: the header should show **Sign in** instead of the local-session
badge, and the Account section should offer a Google button. If the Account
section still names missing `VITE_FIREBASE_*` variables, one of them is still
blank or has a stray space or quote.

---

## What lives where

```
issues/{issueId}
  code          "ISS-0007" — the public reference on the card and in the modal
  title         string, ≤140 chars
  description   string, ≤2000 chars
  category      roads | sanitation | electricity | water | drainage | other
  status        reported | in-progress | resolved
  location      { address }
  image         download URL
  imagePath     storage object path, used to clean up on withdrawal
  upvotes       integer, kept in step with likedBy by the rules
  likedBy       [uid, …] — one entry per account, which is what "backed" reads
  authorId      the account that filed it
  authorName    display name at the time of filing
  authorPhoto   photo URL at the time of filing
  createdAt     timestamp
```

```
counters/registry
  seq           last used number for the ISS-#### reference
```

```
Storage: issues/{uid}/{timestamp}-{filename}
```

**The likes.** `likedBy` is an array of account ids and `upvotes` is its
length, and the rules refuse any write where those two disagree. So "one
account, one backing" is enforced by the database rather than by the UI, and
the Account section's "Reports you backed" is simply every report whose
`likedBy` contains your uid.

---

## Using the emulators instead of production

Handy while you are still wiring things up — nothing touches your real project:

```bash
cd frontend
firebase emulators:start
```

Then set `VITE_FIREBASE_USE_EMULATORS=true` in `backend/.env` and restart
Vite. Sign-in runs against the emulator's fake Google accounts, and the
emulator UI is on <http://127.0.0.1:4000>.

---

## If something goes wrong

Every failure below is already translated into a sentence in the app — these
are the causes behind those sentences.

| What you see | What it means |
| --- | --- |
| "The database refused that change…" | Rules not deployed (step 7), or you are signed out. |
| "The project has hit its free daily quota." | The Spark plan's 20k daily writes are used up. Wait for the reset, or upgrade. |
| "This domain is not authorised for sign-in yet." | Step 4 — add the domain. |
| "Google sign-in is switched off for this project." | Step 3. |
| "Your browser blocked the sign-in window." | Pop-up blocker; allow pop-ups for the site. |
| "That photo was rejected…" | Storage rules not deployed, or the file is not an image or is over 5MB. |
| Account section still lists `VITE_FIREBASE_…` | That variable is blank, or the dev server has not been restarted since you edited `backend/.env`. |

---

## What is stored about a person

Signing in with Google gives the app your **name, email address and profile
photo URL**, which are stored on each report you file (`authorName`,
`authorPhoto`) and in the Auth record. Nothing else is collected, there is no
analytics or tracking script, and no personal data is written to Storage.
Someone's photo lives at `issues/{their-uid}/…` so it can be found and removed
by uid.

To delete a person's account completely: remove their `issues` documents in the
Firestore console (or let them withdraw their own reports in the app), delete
their `issues/{uid}/` folder in Storage, then delete the user under
**Authentication → Users**.

---

## Where the backend lives

```
backend/
├── firebase.json             CLI config — what deploys, which emulator ports
├── firestore.rules           Database security rules (the real boundary)
├── firestore.indexes.json    Composite index manifest (empty on purpose)
├── storage.rules             Photo-bucket security rules
├── .env.example              Committed template of every variable
└── .env                      Your real values — gitignored, never commit
```

The frontend never touches this folder's code (there is none). Its only link is
`envDir` in `frontend/vite.config.js`, which tells Vite to read `backend/.env` so
the `VITE_*` values reach the browser bundle. If you rename or move the backend
folder, update that one line.
