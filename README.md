# Enterprise Hospital Management System

A full-stack HMS built with React, TypeScript, Tailwind CSS, Redux Toolkit, Express, MongoDB/Mongoose, JWT refresh-token authentication, RBAC, PDFKit, Cloudinary integration points, Recharts dashboards, and Docker.

## Quick Start

```bash
cp .env.example .env
npm install
npm run seed
npm run dev
```

See [Architecture](./docs/ARCHITECTURE.md), [API Documentation](./docs/API.md), and [Implementation Guide](./docs/IMPLEMENTATION.md).

Portfolio assets:

- [Feature matrix](./docs/FEATURE_MATRIX.md)
- [Postman collection](./docs/POSTMAN_COLLECTION.json)
- [Architecture diagrams](./docs/ARCHITECTURE.md)

Production-style upgrades included:

- Firebase email verification and backend role session bridge
- Staff approval workflow and pending approval screen
- Tenant-aware backend queries using `hospitalId`
- Audit logs for mutations
- Workflow transitions for appointments, lab, pharmacy, inpatient, and billing
- Responsive sidebar, toasts, skeleton loading, empty states, status badges, and richer forms
- Role-specific dashboards for admin, doctor, receptionist, pharmacist, lab technician, and patient
- Staff approval and audit log admin screens
- Searchable appointment booking with doctor/patient selectors and slot conflict warnings
- Patient profile tabs for overview, appointments, reports, bills, history, and documents
- Starter backend and frontend test suites

Run everything locally:

```bash
npm run dev:full
```

This starts MongoDB through Docker Compose plus the backend and frontend dev servers.
