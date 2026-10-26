# PhysioTrack backend

## Setup

1. Copy `.env.example` to `.env`.
2. Set `MONGO_URI` to the MongoDB Atlas URI. Use a database name after the host, for example `/physiotrack`; do not append another `.mongodb.net` path.
3. Set `ADMIN_SETUP_KEY` to a long random secret and keep `.env` private.
4. From this directory run `npm install`, then `npm run dev`.

The API listens on port `5000` by default. `GET /api/health` reports API and database readiness. No demo users or sample records are inserted.

## Authentication

- `POST /api/auth/register` — create a patient or physiotherapist.
- `POST /api/auth/login` — sign in.
- `GET /api/auth/me` — return the current user.
- `POST /api/auth/logout` — revoke the current session.
- `POST /api/auth/password-reset` — returns `501` until email delivery is configured.
- `POST /api/auth/bootstrap-admin` — create the first admin only, using the `x-admin-setup-key` header. This endpoint is disabled after an admin exists.

Authenticated requests use `Authorization: Bearer <access_token>`. Public registration cannot create admin accounts.

## Records

Authenticated users can use `GET` and `POST /api/records/:collection`; records support `PATCH` and `DELETE /api/records/:collection/:id`.
Supported collections: `exercises`, `exercise_sessions`, `pain_logs`, `treatment_plans`, `therapist_patient_assignments`, `appointments`, `therapist_messages`, and `audit_logs`.

List options are `filters` (JSON array of `{ "field", "operator", "value" }`), `sort`, `direction`, `limit`, and `include=patients`. Supported filter operators are `eq`, `gte`, and `lte`. Patient and physiotherapist access is scoped by account/assignment; admin setup is required for administrative access.
