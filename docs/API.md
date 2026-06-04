# REST API Documentation

Base URL: `/api/v1`

## Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/auth/register` | Register a user |
| POST | `/auth/login` | Login and receive access/refresh tokens |
| POST | `/auth/firebase-session` | Exchange Firebase ID token for HMS RBAC session |
| PATCH | `/auth/users/:id/approve` | Approve pending staff account |
| PATCH | `/auth/users/:id/reject` | Reject pending staff account |
| POST | `/auth/refresh` | Rotate tokens |
| POST | `/auth/logout` | Invalidate refresh token version |
| POST | `/auth/forgot-password` | Send reset email |
| POST | `/auth/reset-password/:token` | Reset password |
| GET | `/auth/me` | Current user |

## Core Resources

Every protected resource supports:

| Method | Pattern | Description |
| --- | --- | --- |
| GET | `/:resource` | List with `page`, `limit`, `sort`, `search`, filters |
| POST | `/:resource` | Create |
| GET | `/:resource/:id` | Get by ID |
| PATCH | `/:resource/:id` | Update |
| DELETE | `/:resource/:id` | Delete |

Resources:

- `/users`
- `/patients`
- `/doctors`
- `/appointments`
- `/medical-records`
- `/prescriptions`
- `/lab-reports`
- `/medicines`
- `/inventory`
- `/rooms`
- `/beds`
- `/admissions`
- `/bills`
- `/payments`

## Dashboards and PDFs

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/dashboard/admin` | Admin analytics |
| GET | `/dashboard/doctor` | Doctor appointments and overview |
| GET | `/dashboard/patient` | Patient appointments and bills |
| GET | `/bills/:id/pdf` | Download invoice PDF |
| GET | `/prescriptions/:id/pdf` | Download prescription PDF |

## Workflow Transitions

| Method | Endpoint | States |
| --- | --- | --- |
| PATCH | `/appointments/:id/transition` | `booked → checked_in → in_consultation → completed` |
| PATCH | `/lab-reports/:id/transition` | `requested → sample_collected → processing → completed` |
| PATCH | `/inventory/:id/transition` | `purchased → received → dispensed → billed` |
| PATCH | `/admissions/:id/transition` | `admitted → bed_allocated → under_treatment → discharged` |
| PATCH | `/bills/:id/transition` | `draft → issued → partially_paid → paid` |

## Security Model

- Access tokens are short-lived JWTs sent in the `Authorization: Bearer <token>` header.
- Refresh tokens are versioned; logout and password reset increment token version.
- Passwords are hashed with bcrypt.
- Request validation uses `express-validator`.
- API hardening uses Helmet, CORS, rate limiting, mongo sanitize, hpp, and centralized error handling.
- Firebase accounts must have verified email before the backend creates an HMS session.
- Staff roles start with `pending` approval and require admin approval.
- Mutations are written to `AuditLog`.
- Tenant queries are scoped by `hospitalId` for non-super-admin users.
