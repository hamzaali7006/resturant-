<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/491af157-1ca8-488d-bfe5-fe42ab37db49

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Firebase Orders

The app uses the existing Firebase project configured in `src/firebase/config.ts`.
Guest checkout signs in with Firebase Anonymous Authentication so every order has
an authenticated owner. Enable **Authentication → Sign-in method → Anonymous**
for the existing project to allow guest checkout.

Deploy the secured Firestore rules from this repository after signing in to the
Firebase CLI:

```sh
npx firebase-tools deploy --only firestore:rules --project myresturent-36f45
```

Orders are written to the `orders` collection. Verify a successful checkout in
the Firebase console under **Firestore Database → orders**. Each document uses
its Firestore document ID as the order ID and includes a server timestamp.
