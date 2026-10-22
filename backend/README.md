# Backend

This application currently uses its existing Firebase project as its backend.
Authentication and Firestore access are implemented in the frontend through
the Firebase client SDK; Firestore security rules and Firebase CLI
configuration are kept at the repository root.

There is no custom Node.js/Express server, API, or server-side model layer in
the existing project, so this folder intentionally contains no server code or
backend dependencies. No API behavior is implied by this documentation.
