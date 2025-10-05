# Purity UI Dashboard — RBAC & Tenant Scoping

This document summarizes the changes we made to add **role-based access control (RBAC)**, **feature-flagged menus**, and **role-aware dashboard content** to the Purity UI Dashboard, plus a small **mock API** for local testing.

> Visual UI was kept intact. All changes are additive: providers, route guards, filtering, and small wrappers around existing components.

---

## Table of Contents

1. [What You Get](#what-you-get)
2. [Folder Map (New/Changed Files)](#folder-map-newchanged-files)
3. [How It Works](#how-it-works)
4. [Front-end Changes](#front-end-changes)
5. [Sidebar Menu RBAC](#sidebar-menu-rbac)
6. [Dashboard RBAC](#dashboard-rbac)
7. [Routes Metadata](#routes-metadata)
8. [Mock Backend (for testing)](#mock-backend-for-testing)
9. [Run & Test](#run--test)
10. [RBAC Matrix](#rbac-matrix)
11. [Troubleshooting](#troubleshooting)
12. [Security Notes](#security-notes)
13. [Extending](#extending)

---

## What You Get

- Authentication bootstrap via `/api/me` with a global React context.
- Role-based menu filtering (OWNER/ADMIN/STAFF/USER) + optional **feature flags**.
- Role-aware Dashboard widgets (Admins/Owners see additional KPIs).
- Route guards: **RequireAuth** for the Admin layout; **RequireRole** available for page-level hard guards.
- Mock Express API to sign in as demo roles and test instantly.

---

## Folder Map (New/Changed Files)

### Added
```
src/auth/AuthContext.js       # Global auth provider; loads /api/me; exposes { user, loading, setUser }
src/auth/RequireAuth.js       # Guard: must be authenticated
src/auth/RequireRole.js       # Guard: must be in specified roles (optional per-page)
backend/server.js             # Mock API (Express, ESM)
backend/package.json          # Mock API dependencies & start script
```

### Modified
```
src/index.js                               # Wraps /admin in <RequireAuth>; default redirect -> /admin/dashboard
src/views/Auth/SignIn.js                   # Programmatic login to API_BASE; robust JSON parsing; redirect by role
src/views/Auth/SignUp.js (optional)        # Programmatic signup -> auto-login (if you kept this)
src/components/Sidebar/SidebarContent.js   # RBAC & feature filtering for routes, with special rules for /auth
src/routes.js                              # Added access/feature metadata for menu filtering and (optional) guards
src/views/Dashboard/Dashboard.js           # KPI tiles wrapped in role check (Owner/Admin only)
```

---

## How It Works

### Auth Flow
- `AuthProvider` calls `GET ${API_BASE}/api/me` on app load.
- If authenticated, `user = { id, name, role, tenant, features }` is set and `tenant.id/name` is cached into `localStorage`.
- Components access `{ user, loading }` via `useAuth()`.

### RBAC & Features
- `routes.js` routes include `access` (roles allowed) and optional `feature` (plan gate).
- `SidebarContent` filters the `routes` array before rendering:
  - **Auth (`/auth`)** items hidden for logged-in users, **except OWNER** (per requirement).
  - **Admin (`/admin`)** items hidden if not logged in.
  - If `access` exists, the user’s role must be included.
  - If `feature` exists, the feature must be present in `user.features`.

### Dashboard Content
- Admin/Owner-only KPI tiles are wrapped in a simple boolean: `isAdminLike`.

---

## Front-end Changes

### `src/auth/AuthContext.js`
- Exposes a global `user` and `loading` flag.
- Uses absolute API base (`API_BASE = http://localhost:4000` by default) to avoid dev proxy pitfalls.
- Guards JSON parsing by checking `content-type`.

### `src/auth/RequireAuth.js`
- Blocks unauthenticated users and redirects to `/auth/signin`.

### `src/auth/RequireRole.js` (optional)
- Wrap individual pages in `routes.js` when you need hard authorization (e.g., Tables: admin-only).

### `src/index.js`
- Admin layout route is available to **any** authenticated role:
  ```jsx
  <Route path="/admin" render={(p) => (
    <RequireAuth><AdminLayout {...p} /></RequireAuth>
  )} />
  ```
- Default redirect goes to `/admin/dashboard`.

### `src/views/Auth/SignIn.js`
- Submits to `${API_BASE}/api/login`, sets session cookie, robustly parses response, stores tenant info, and redirects to `/admin/dashboard` for **all roles** (content/menu differs by RBAC).

### `src/components/Sidebar/SidebarContent.js`
- Filters route list by `access` + `feature`.
- Special rule for `/auth`: hidden for logged-in users **except OWNER** (requirement). Change to `!user` to hide for Owner too.
- Categories auto-hide if all children are filtered.

### `src/views/Dashboard/Dashboard.js`
- The top KPI tile grid is wrapped in an Admin/Owner check; everything else stays visible for all roles:

  ```jsx
  const isAdminLike = user && (user.role === "OWNER" || user.role === "ADMIN");
  {isAdminLike && (<SimpleGrid>...</SimpleGrid>)}
  ```

---

## Sidebar Menu RBAC

- **Admin-only**
  ```js
  { path: "/tables",  layout: "/admin", access: ["OWNER","ADMIN"] }
  { path: "/billing", layout: "/admin", access: ["OWNER","ADMIN"], feature: "billing" }
  ```
- **Signed-in for all roles**
  ```js
  { path: "/dashboard", layout: "/admin", access: ["OWNER","ADMIN","STAFF","USER"] }
  { path: "/profile",   layout: "/admin", access: ["OWNER","ADMIN","STAFF","USER"] }
  ```
- **Auth pages** (Sign In/Up): hidden for logged-in roles (except OWNER by current rule).

---

## Dashboard RBAC

- **KPI tiles** are visible only for Owner/Admin.
- You can gate extra sections by features:
  ```jsx
  const canBilling = user?.features?.includes?.("billing");
  {canBilling && <BillingOverviewCard />}
  ```

---

## Routes Metadata

Example entries in `src/routes.js`:

```jsx
{
  path: "/billing",
  name: "Billing",
  icon: <CreditIcon color="inherit" />,
  component: Billing,
  layout: "/admin",
  access: ["OWNER","ADMIN"],
  feature: "billing",
},
{
  path: "/dashboard",
  name: "Dashboard",
  icon: <HomeIcon color="inherit" />,
  component: Dashboard,
  layout: "/admin",
  access: ["OWNER","ADMIN","STAFF","USER"],
},
```

---

## Mock Backend (for testing)

**File:** `backend/server.js` (ESM)

- Users:
  - `owner@demo.test` / `pass123` → OWNER, `features: ["billing"]`
  - `admin@demo.test` / `pass123` → ADMIN, `features: ["billing"]`
  - `staff@demo.test` / `pass123` → STAFF, `features: []`
  - `user@demo.test`  / `pass123` → USER,  `features: []`
- Endpoints:
  - `POST /api/login`  → sets HttpOnly cookie; returns user JSON
  - `GET  /api/me`     → returns user JSON if logged in; 401 otherwise
  - `POST /api/logout` → clears cookie
  - `POST /api/signup` → creates an OWNER + tenant (demo)

**Run:**
```bash
cd backend
npm i
npm start  # Mock API on http://localhost:4000
```

**Front-end API base:**
- Default `API_BASE` is `http://localhost:4000`. You can set `REACT_APP_API_BASE` to override.

---

## Run & Test

1. **Start the mock API**
   ```bash
   cd backend
   npm start
   ```
2. **Start the React app**
   ```bash
   npm start
   ```
3. **Sign in** with any demo account:
   - OWNER: `owner@demo.test` / `pass123`
   - ADMIN: `admin@demo.test` / `pass123`
   - STAFF: `staff@demo.test` / `pass123`
   - USER:  `user@demo.test`  / `pass123`

**Expected:**
- OWNER/ADMIN → full menu; “Billing” appears if feature enabled.
- USER/STAFF → trimmed menu; no Tables/Billing; no KPI tiles.
- Sign In/Up links disappear when logged in (by rule, still visible for OWNER unless you flip the flag).

---

## RBAC Matrix

| Area / Item       | USER | STAFF | ADMIN | OWNER | Notes |
|-------------------|:----:|:-----:|:-----:|:-----:|-------|
| Admin layout      |  ✅  |  ✅   |  ✅   |  ✅   | Requires auth (RequireAuth) |
| Dashboard KPIs    |  ❌  |  ❌   |  ✅   |  ✅   | Wrapped in role check |
| Tables            |  ❌  |  ❌   |  ✅   |  ✅   | `access: ["OWNER","ADMIN"]` |
| Billing           |  ❌  |  ❌   |  ✅   |  ✅   | `access` + `feature: "billing"` |
| Profile           |  ✅  |  ✅   |  ✅   |  ✅   | All signed-in roles |
| Sign In / Sign Up |  ❌* |  ❌*  |  ❌*  |  ✅   | Hidden for logged-in users, **visible for OWNER** by rule |

\* Change a single line in `hasAccess` to hide for OWNER too.

---

## Troubleshooting

- **“Unexpected token < … not valid JSON”**  
  Your request hit the React dev server (HTML), not the API. Use absolute `${API_BASE}` URLs or configure React’s `proxy` and restart the dev server.

- **Owner/User sees wrong links**  
  Check `routes.js` `access`/`feature` and the `hasAccess` logic in `SidebarContent`. Adjust the special `/auth` rule to your preference.

- **Imports like `auth/…` fail**  
  Use relative imports based on your project’s `jsconfig.json` (e.g., `../auth/AuthContext`).

---

## Security Notes

- Client-side hiding is convenience only. **Always enforce RBAC server-side.**
- Derive tenant from session/domain/header; ignore tenant IDs coming from the client.
- Use `HttpOnly; Secure` cookies, CSRF strategy, and rotate refresh tokens in production.

---

## Extending

- **Per-page guards:** wrap specific components in `routes.js` with `<RequireRole allow={[...]}>`.
- **Feature flags:** add `feature: "reports"` (etc.) on routes and check the same flag in pages.
- **Tenant switcher:** store selected `tenantId` and send `X-Tenant-Id` header; enforce on server.

---

**Done!** If you want this as a Word document too, copy this file’s contents or let me export a `.docx` next.
