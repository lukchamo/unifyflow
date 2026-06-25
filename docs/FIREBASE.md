# Firebase: Auth + Firestore + Triggers (emulator-first)

UnifyFlow runs on Firebase **Auth**, **Firestore** and **Cloud Functions
(Firestore triggers)**, and it's wired to run end-to-end against the **Firebase
Emulator Suite** with zero cloud setup. A single flag also lets the original
all-mock demo keep working (e.g. on Vercel).

## TL;DR — run it

```bash
npm install
npm run firebase          # emulators + seed + Next dev, all in one
```

Open <http://localhost:3000>, then **/login** (or **/demo**). The Emulator UI is
at <http://localhost:4000>. Press **Ctrl-C** to stop everything.

Requirements: Node 20+ and a **JDK 17+** (the Firestore emulator needs Java).

### Demo accounts (password `unifyflow123`)

| Role          | Email                       | Can…                                            |
| ------------- | --------------------------- | ----------------------------------------------- |
| admin         | `marta-ruiz@robledo.es`     | everything: invite, validate, unlock, export    |
| validador     | `lucia-vidal@robledo.es`    | validate & comment nodes                        |
| entrevistado  | `andres-perez@robledo.es`   | answer the micro-interview (draws a new node)   |

## The two data backends

The app reads `NEXT_PUBLIC_DATA_BACKEND`:

- **`firebase`** — Firestore + Firebase Auth (real lifecycle). This is the
  default in local `.env.local`.
- **`mock`** — the original in-memory + localStorage demo. This is the default
  when the env var is unset, so production builds (Vercel) are unaffected.

Run the old mock demo any time with `npm run dev:mock`.

## Commands

| Command                   | What it does                                                        |
| ------------------------- | ------------------------------------------------------------------- |
| `npm run firebase`        | Emulators (auth+firestore+functions) → seed → `next dev`. One Ctrl-C stops all. |
| `npm run firebase:live`   | `next dev` against the **real** project configured in `.env.local`. |
| `npm run emulators:only`  | Just the emulators + seed (no Next dev). Good for backend work.      |
| `npm run emulators`       | Raw `firebase emulators:start` (no seed).                            |
| `npm run seed`            | Seed the **emulator** with the demo dataset + auth users.           |
| `npm run seed:live`       | Seed the **real** project (needs credentials — see below).          |
| `npm run functions:build` | Compile the Cloud Functions (TypeScript → `functions/lib`).         |
| `npm run dev:mock`        | Run the original mock demo (no Firebase).                           |

`./scripts/run.sh [emulator|live|emulator-only]` is the script behind the first
three; `npm run firebase` is just `./scripts/run.sh emulator`.

## What's in Firestore

Collections mirror the domain (`lib/schemas`): `organizations`, `members`,
`interviews`, `nodes`, `edges`, `opportunities`, `validations`, `agentLogs`,
`subscriptions`, `comments`, plus `users` (uid → member link).

Access is role-gated by `firestore.rules` using **custom claims** (`role`,
`orgId`, `memberId`) carried on each user's ID token.

## The triggers (`functions/src/index.ts`)

1. **`onInterviewWritten`** — when an interview is marked `completada`, the
   function assembles the process **node + handoff + agent log** server-side and
   marks the member done. The app never builds the node itself; it just writes
   the interview, and the node streams back into the live map via the Firestore
   listener (`FirebaseBridge` re-emits the in-app `interview:completed` event so
   the existing reveal animation runs). It's idempotent (a `nodeAssembled` flag).

2. **`onMemberWritten`** — when a member's role/email changes, it syncs the
   matching auth user's **custom claims** and the `users/{uid}` link doc. This is
   how authentication-with-roles stays in lock-step with the team table.

Verify the whole loop in the emulator:

```bash
firebase emulators:exec --only auth,firestore,functions \
  "npm run seed && npx tsx scripts/smoke.ts"
```

`scripts/smoke.ts` submits a fresh interview and asserts the node/edge/log
appear — the end-to-end trigger check used during development.

## How the app is wired

- `lib/firebase/` — `config` (flags), `client` (web SDK + emulator connect),
  `admin` (Admin SDK for scripts), `auth` (email/Google + claims), `repo`
  (typed Firestore CRUD + `onSnapshot` listeners), `collections`.
- `components/auth/AuthProvider.tsx` — auth context; pushes the claim role into
  the Zustand store so every existing role-gated selector keeps working. Inert
  in mock mode.
- `components/auth/AuthGate.tsx` — protects `/app` in firebase mode.
- `components/firebase/FirebaseBridge.tsx` — streams Firestore → store.
- `lib/store/useAppStore.ts` — data mutations branch on the backend: in firebase
  mode they write to Firestore (listeners update state); mock mode is unchanged.

## Pointing at a real Firebase project

1. Create a project + a Web app in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Email/Password and Google) and **Firestore**.
3. Put the web config + `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false` in `.env.local`
   (see `.env.example`), and set the project id in `.firebaserc`.
4. For the seed/Admin SDK, set `GOOGLE_APPLICATION_CREDENTIALS` (service-account
   JSON path) or `FIREBASE_SERVICE_ACCOUNT` (inline JSON), then `npm run seed:live`.
5. Deploy rules + functions: `firebase deploy --only firestore:rules,functions`.

> Note: the default project id is `demo-unifyflow`. The `demo-` prefix tells the
> emulator it's a throwaway project, which is why no real credentials are needed
> for local development.
