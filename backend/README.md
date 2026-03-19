# Smarty Backend (Firebase Admin)

This folder includes a minimal Express backend to store user data in Firestore via Firebase Admin.

## Setup

1. `cd backend`
2. `npm install`
3. Create a Firebase service account key JSON and download it.
4. Set `GOOGLE_APPLICATION_CREDENTIALS` to the path, e.g.:
   - Windows: `set GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\service-account.json`
   - macOS/Linux: `export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json`
5. `npm start`

## Endpoints
- `GET /health` - simple health check.
- `POST /user` - insert/update user docs in `users` collection.
  - JSON body: `{ "uid": "...", "email": "...", "name": "..." }`
