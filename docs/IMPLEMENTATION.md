# Implementation Plan

## Step-by-step Plan

1. Create hospital tenant, super admin, and staff onboarding flows.
2. Configure MongoDB indexes and seed the demo super admin.
3. Implement authentication, refresh-token rotation, password reset, and role-based protected routes.
4. Build patient, doctor, appointment, EMR, prescription, lab, pharmacy, inpatient, billing, and payment modules.
5. Add PDF generation for prescriptions and bills.
6. Add Cloudinary-backed upload endpoints for reports and EMR documents.
7. Add dashboards with operational analytics and role-specific views.
8. Harden production security, logging, monitoring, backups, and CI/CD.

## Installation

```bash
cp .env.example .env
npm install
npm run seed
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000/health`

Demo credentials after seeding:

```text
admin@demo-hms.local
Admin@12345
```

For the smoothest local workflow:

```bash
npm run dev:full
```

This starts MongoDB with Docker Compose, then launches the backend and frontend together.

## Tests

```bash
npm run test --workspace backend
npm run test --workspace frontend
```

The backend suite covers login/RBAC and appointment workflow transitions. The frontend suite verifies the auth/protected router surface.

## Docker

```bash
cp .env.example .env
docker compose up --build
```

## Environment Variables

Use `.env.example` as the source of truth. Production must override JWT secrets, MongoDB URI, CORS client URL, SMTP credentials, and Cloudinary credentials.

## Firebase Setup

1. Create a Firebase project.
2. Enable Email/Password Authentication.
3. Add a Web App and copy the web config into the `VITE_FIREBASE_*` variables.
4. Set `FIREBASE_PROJECT_ID` on the backend. The API verifies Firebase ID tokens against Google's public Firebase certificates, so a service account key is not required for authentication.
5. Start the backend and frontend. The frontend signs users in with Firebase and exchanges the Firebase ID token at `/api/v1/auth/firebase-session` so the backend can apply MongoDB-backed RBAC.
