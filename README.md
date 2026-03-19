Smarty Redesign

## Firebase Authentication Setup

1. In Firebase console, create a project and enable Authentication > Email/Password.
2. Enable Firestore database (production or test mode).
3. Copy config values and create front-end `.env` file from `.env.example`.

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

4. Install dependencies (if not installed):

```bash
cd frontend
npm install
npm install firebase
```

5. Start app:

```bash
npm run dev
```

## Backend (express + firebase-admin)

1. `cd backend`
2. `npm install`
3. Download Firebase service account JSON and configure:
   - Windows: `set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\service-account.json`
   - macOS/Linux: `export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json`
4. `npm start`

## Routes added
- `/login`
- `/signup`

## Component changes
- `src/components/Navbar.tsx`: Sign In/Get Started links wired to new auth routes
- `src/pages/Login.tsx`, `src/pages/Signup.tsx` new pages
- `src/lib/firebase.ts`, `src/lib/auth.ts` for firebase integration