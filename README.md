# SaaS Notes App

**Simple multi-tenant Notes SaaS** — backend + minimal frontend, ready to deploy on Vercel.

---

## Overview

This repository contains a multi-tenant Notes application (backend API + minimal frontend). The app supports multiple tenants (companies), role-based access control, JWT auth, and a subscription gating system (Free / Pro). The app was designed to pass automated validation tests that verify endpoints, tenant isolation, role enforcement, subscription gating, and frontend availability.


## 🚀Tech Stack

**🔹 Frontend**

Framework: React 19 + Vite
Styling: TailwindCSS 4, autoprefixer
Icons: Lucide React
Routing: React Router DOM 7
HTTP Client: Axios
Notifications: React Toastify
Linting: ESLint 9, React hooks plugin

➡️ Optimized for fast builds, DX, and Vercel hosting.

**🔹 Backend**

Runtime: Node.js (ESM modules enabled)
Framework: Express
Database: MongoDB + Mongoose
Auth: JWT + bcryptjs
Email: Nodemailer
Misc: CORS, dotenv, uuid
Dev tools: Nodemon

➡️ Ready for REST APIs with authentication, multi-tenant handling, and email workflows.

**⚙️ Features**

Multi-tenant: Users belong to a company (e.g., Acme, Globex)
Authentication: Register, Login, JWT-based sessions
Notes CRUD per tenant & per user
Email verification and password reset via Nodemailer
Toast notifications for frontend feedback
Protected routes with tenant isolation



## Chosen Multi-Tenancy Approach

**Shared schema with tenantId column (single database).**

Rationale:

* Simpler to deploy on Vercel and to run automated tests.
* The existing code already stores `tenantId` on users, notes, invitations and asserts tenant isolation in middleware/controllers.
* Tenant isolation is enforced throughout the API by checking `req.tenant._id` or `req.user.tenantId` before returning or modifying any resource.

This approach stores all tenant data in the same collections but requires every query and controller to filter by `tenantId`. The README documents where that enforcement occurs and what to review if you change the approach.

---

## Predefined Test Accounts (mandatory)

All accounts use password: `password`

* `admin@acme.test` — role: **admin**, tenant: **Acme**
* `user@acme.test` — role: **member**, tenant: **Acme**
* `admin@globex.test` — role: **admin**, tenant: **Globex**
* `user@globex.test` — role: **member**, tenant: **Globex**

> A seed script is expected to create these accounts when the database is initialised. See **Seeding** below.

---

## Features

* JWT authentication (`/auth/login`) and admin registration (`/auth/register`)
* Role-based access: `admin` and `member`

  * Admin: invite users, toggle user status, upgrade tenant subscription
  * Member: create, read, update, delete their own notes (within tenant)
* Tenant subscription gating:

  * `free` plan limited to **3 notes per tenant**
  * `pro` plan allows unlimited notes
  * Admins can upgrade via: `POST /tenants/:slug/upgrade`
* Notes CRUD with tenant isolation
* Health endpoint: `GET /health` → `{ "status": "ok" }`
* CORS enabled for access from automated scripts and dashboards
* Minimal frontend (hosted on Vercel) for login, list/create/delete notes, and showing upgrade CTA when limit reached

---

## API Endpoints (summary)

**Auth & Users**

* `POST /api/auth/login` — login, returns JWT and user
* `POST /api/auth/register` — register admin (used for creating new tenant & admin)
* `GET /api/auth/me` — get profile (protected)
* `GET /api/auth/users` — list users in tenant (admin only)
* `PATCH /api/auth/:userId/toggle-status` — toggle user active/inactive (admin only)

**Invitations**

* `POST /api/invitations/invite` — send invite (admin only)
* `GET /api/invitations` — list invites (admin only)
* `POST /api/invitations/:id/resend` — resend invite (admin only)
* `DELETE /api/invitations/:id` — cancel invite (admin only)
* `POST /api/invitations/member` — register using an invitation

**Notes**

* `POST /api/notes` — create note (auth required)
* `GET /api/notes` — list notes for tenant (auth required)
* `GET /api/notes/:id` — get note by id (auth required)
* `PUT /api/notes/:id` — update note (auth required)
* `DELETE /api/notes/:id` — delete note (auth required)

**Tenants / Subscription**

* `GET /api/tenants/me` — get tenant info (auth required)
* `POST /api/tenants/:slug/upgrade` — upgrade tenant to Pro (admin only)
* `GET /api/tenants` — list all tenants (optional)

**Health / Misc**

* `GET /health` — `{ "status": "ok" }`


---

## Security & Tenant Isolation

* JWT payload contains `{ id, tenantId, role }`.
* `auth` middleware verifies token and loads `req.user` and `req.tenant` from DB (populating `tenantId`).
* All resource controllers (notes, invitations, users) filter by `tenantId` and check tenant equality before returning or modifying resources.
* Role enforcement via `requireRole('admin')` middleware for admin-only routes.

**Important checks included in controllers:**

* Create note: checks `tenant.subscription.plan === 'free'` and counts notes for the tenant before allowing creation.
* Fetching a note: ensures `note.tenantId` matches `req.tenant._id` and `member` can only see their own notes.
* Updating/Deleting a note: ensures the note belongs to the tenant and that the user is the author (members) or allowed (admins).

---

## Data Models (high level)

Primary collections (Mongoose models):

* **Tenant** — `{ name, slug, subscription: { plan: 'free'|'pro' }, createdAt, updatedAt }`
* **User** — `{ tenantId, name, email, passwordHash, role: 'admin'|'member', isActive }`
* **Note** — `{ tenantId, authorId, title, sub, content, createdAt, updatedAt }`
* **Invitation** — `{ email, role, tenantId, inviter, referralCode, expiresAt, isUsed }`

---

## Environment & Setup (local)

1. Install dependencies

```bash
pnpm install
# or
npm install
```

2. Environment variables (create a `.env` file)

```
MONGO_URI=mongodb+srv://......user......._db_user:....pass....m@notes.ubjt9zz.mongodb.net/
JWT_SECRET=................................
PORT=5000
EMAIL_PASS=.... .... .... ....
EMAIL_USER=.......@gmail.com
CLIENT_URL=http://localhost:5173
```

* Create Tenant `Acme` with slug `acme` and subscription `free`.
* Create Tenant `Globex` with slug `globex` and subscription `free`.
* Create users: `admin@acme.test` (admin), `user@acme.test` (member), `admin@globex.test` (admin), `user@globex.test` (member). Password: `password` (hashed).
---

## Deploying to Vercel

Both backend and frontend are deployable to Vercel. Use the following notes:

1. Backend (API)

* Create a Vercel project connected to this repository.
* Ensure the backend code is placed under `/api` or configured to serve as Vercel Serverless Functions or an Edge Function depending on your stack.
* Set environment variables in Vercel (MONGO\_URI, JWT\_SECRET, etc.).
* Enable CORS for your frontend domain and for automated test scripts. You can allow `*` for testing but restrict in production.

2. Frontend

* The minimal frontend should be built and deployed under a separate Vercel project or as static pages in the same repo (depending on setup).
* Ensure the frontend `LOGIN` calls the backend URL set via environment variable.

3. Health check

* The `GET /health` endpoint must be reachable from the public internet (no auth).

---

## Frontend

The frontend is intentionally minimal and includes:

* Login screen (email + password)
* Notes list (shows notes belonging to current tenant)
* Create note form
* Delete note action
* If tenant plan is `free` and tenant has 3 notes, UI shows **Upgrade to Pro** CTA (calls `POST /api/tenants/:slug/upgrade` as admin or shows a message to admin)

It uses the JWT token (stored in localStorage) for authenticated API calls. The frontend expects the API to return `tenant` information from `/api/auth/me` or `/api/tenants/me`.

---

## Example curl commands

Login:

```bash
curl -X POST https://<API_URL>/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@acme.test","password":"password"}'
```

Create note:

```bash
curl -X POST https://<API_URL>/api/notes -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"title":"My note", "sub":"" ,content":"hello"}'
```

Upgrade tenant (admin):

```bash
curl -X POST https://<API_URL>/api/tenants/acme/upgrade -H "Authorization: Bearer <ADMIN_TOKEN>"
```

Health:

```bash
curl https://<API_URL>/health
# returns { "status": "ok" }
```

---

## Testing & Validation

Automated tests will check:

* `/health` returns 200 `{ status: 'ok' }`
* Login works for the four test accounts
* Tenant isolation: data created under `acme` cannot be accessed by `globex` users
* Role enforcement: Members cannot access admin-only endpoints
* Free-plan note limit is enforced and removed after calling upgrade endpoint as Admin
* All Notes CRUD operations work as expected
* Frontend is reachable and supports the required flows

If a test fails, check console logs from Vercel serverless functions and validate environment variables.

---

## Common pitfalls & troubleshooting

* **Tenant checks**: if you add new controllers, ensure you always filter by `req.user.tenantId` or `req.tenant._id`.
* **Counting notes for limit**: use `Note.countDocuments({ tenantId: tenant._id })` to enforce the free-plan limit.
* **Token secrets**: if JWT verification fails, ensure `JWT_SECRET` is identical across environments.
* **Seeding**: forgetting to seed test users will cause automated tests to fail.
* **CORS**: tests may run from other domains. Allow CORS during testing or configure allowed origins carefully.

---

## File / Route map (where to look)

* `src/controllers/*Controller.js` — business logic
* `src/middlewares/auth.js` — JWT verification and role helpers
* `src/models/*.js` — Mongoose models: User, Tenant, Note, Invitation
* `src/routes/*` — route definitions (auth, notes, tenants, invitations)
* `frontend/` — minimal React or static frontend

---

## Contributing

Contributions welcome. For changes to tenancy model or subscription logic, add integration tests to ensure tenant isolation remains strict.

---

## License
Tell me which of the above you'd like next.
