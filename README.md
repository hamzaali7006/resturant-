# Saffron & Stone Restaurant

The repository contains a Vite/React/TypeScript frontend in `frontend/` and uses
the existing Firebase project for authentication and Firestore. There is no
custom Node.js/Express API in this project; Firebase remains the backend.

## Frontend setup

Prerequisite: Node.js.

```sh
cd frontend
npm install
npm run dev
```

The Vite development server listens on port `3000`. To create and preview a
production build:

```sh
cd frontend
npm run build
npm run preview
```

The frontend's npm manifest and lockfile are in `frontend/`. The existing
`frontend/bun.lock` is preserved; npm is the documented package manager.

## Firebase

The frontend uses the existing Firebase project configured in
`frontend/src/firebase/config.ts`. Firebase client configuration is intended
for browser use; do not put service-account credentials or other private
secrets in the frontend. Guest checkout requires Anonymous Authentication to be
enabled in the Firebase console.

`firebase.json` and `firestore.rules` remain at the repository root, so deploy
the existing rules from the root directory after signing in to the Firebase
CLI:

```sh
npx firebase-tools deploy --only firestore:rules --project myresturent-36f45
```

Orders are written directly to the Firestore `orders` collection. The rules
continue to enforce the existing access controls; no database schema or
server-side order API was added.

## Backend

See [`backend/README.md`](./backend/README.md). No separate Node.js server is
required for the current Firebase-backed application.
