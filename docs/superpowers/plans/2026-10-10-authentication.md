# Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver working student registration and login across the React frontend and Express/Mongoose backend, including JWT sessions, validation, protected routing, and responsive forms.

**Architecture:** The backend uses Route -> Validation -> Controller -> Service -> Mongoose Model, with password and JWT details isolated in utilities. The frontend uses page forms -> AuthContext -> authService -> Axios, with shared accessible form components and local/session storage selected by the remember-me option.

**Tech Stack:** React 19, React Router 7, Axios, Tailwind CSS 4, Node.js 24, Express 5, Mongoose 8, bcrypt 6, jsonwebtoken 9, Node built-in test runner.

**Spec:** `docs/superpowers/specs/2026-10-10-authentication-design.md`

## Global Constraints

- Do not add a dependency unless the existing stack cannot implement a requirement.
- Do not change the AI, assessment, question, result, or unrelated home-page behavior.
- Public registration always creates role `STUDENT`.
- Passwords must never be stored, returned, logged, or placed in frontend storage.
- Backend responses use `{ success, message, data }` or `{ success, message, errors }`.
- Login failures for unknown email and wrong password use the same message.
- Automated database tests use only `english_assessment_ai_test`, never the development database.
- The workspace has no `.git` metadata, so commit steps are unavailable; each task ends with a verified checkpoint instead.

## Review Focus

- Concurrent registration with the same normalized email must return 409 without exposing a MongoDB error.
- A user with `isActive: false` must receive 403 even with a correct password.
- Switching between remembered and session-only login must leave the token in exactly one storage.
- Refreshing a protected route must wait for context initialization before redirecting.
- Backend connection or malformed backend responses must produce friendly Vietnamese form errors without leaking technical details.

---

### Task 1: Backend authentication domain

**Files:**

- Create: `backend/src/models/user.model.js`
- Modify: `backend/src/utils/password.js`
- Modify: `backend/src/utils/jwt.js`
- Modify: `backend/src/validators/auth.validator.js`
- Modify: `backend/src/services/auth.service.js`
- Create: `backend/test/auth.service.test.js`
- Modify: `backend/package.json`

**Interfaces:**

- Produces: `User` Mongoose model.
- Produces: `hashPassword(password) -> Promise<string>` and `comparePassword(password, hash) -> Promise<boolean>`.
- Produces: `signAccessToken({ userId, role }) -> string` and `verifyAccessToken(token) -> payload`.
- Produces: `validateLogin(req, res, next)` and `validateRegister(req, res, next)` middleware.
- Produces: `registerUser({ fullName, email, password }) -> { user, token }` and `loginUser({ email, password }) -> { user, token }`.

- [ ] **Step 1: Add failing service and validation tests**

Use Node's `node:test` and strict assertions. Each test file dynamically
configures a distinct `english_assessment_ai_test_*` MongoDB database before
importing backend modules so Node's parallel file runner cannot delete another
file's fixtures. Cover valid registration, normalized duplicate email, two
concurrent registrations for the same normalized email, hashed password, safe
user output, correct login, generic wrong-password/unknown-email response,
inactive user, password length boundaries, role injection, and JWT
payload/expiration configuration.

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `node --test test/auth.service.test.js`

Expected: FAIL because the model, utilities, validators, and service functions are not implemented.

- [ ] **Step 3: Implement the User model and security utilities**

Implement the exact schema and security rules from the spec. Use 12 bcrypt rounds. JWT payload contains `sub` and `role`, signed with existing environment values.

- [ ] **Step 4: Implement backend validation and service rules**

Validation selects only known fields and returns HTTP 422 field errors. Service normalizes email, translates duplicate conflicts to 409, creates only `STUDENT`, selects `passwordHash` only during login, and maps users through one safe serializer.

- [ ] **Step 5: Add the backend test script and verify the checkpoint**

Add `"test": "node --test"` to backend scripts.

Run: `npm test -- --test-name-pattern="auth service"`

Expected: PASS, with test database cleanup and Mongoose disconnect completing successfully.

### Task 2: Backend HTTP authentication API

**Files:**

- Modify: `backend/src/controllers/auth.controller.js`
- Modify: `backend/src/routes/auth.routes.js`
- Modify: `backend/src/app.js`
- Create: `backend/test/auth.api.test.js`

**Interfaces:**

- Consumes: validators and service functions from Task 1.
- Produces: `POST /api/auth/register` and `POST /api/auth/login`.

- [ ] **Step 1: Add failing HTTP integration tests**

Start `app` on an ephemeral port with the isolated test database. Assert 201 registration response, 200 login response, safe user shape, token presence, 422 invalid payload, 409 duplicate email, 401 invalid credentials, and 403 inactive user.

- [ ] **Step 2: Run the API test and verify failure**

Run: `node --test test/auth.api.test.js`

Expected: FAIL with 404 because the auth router is not mounted.

- [ ] **Step 3: Implement controller and router**

Controller signatures are `register(req, res, next)` and `login(req, res, next)`. Apply existing `express-rate-limit` to auth endpoints and route validation before controllers.

- [ ] **Step 4: Mount the router in the application**

Mount `authRouter` at `/api/auth` before the not-found handler.

- [ ] **Step 5: Verify the backend API checkpoint**

Run: `npm test`

Run: `npm run check`

Expected: all backend tests pass and syntax checks exit 0.

### Task 3: Frontend authentication state and validation

**Files:**

- Create: `frontend/src/utils/authValidation.js`
- Create: `frontend/src/utils/authValidation.test.js`
- Create: `frontend/src/utils/authStorage.js`
- Create: `frontend/src/utils/authStorage.test.js`
- Modify: `frontend/src/services/authService.js`
- Modify: `frontend/src/services/api.js`
- Modify: `frontend/src/context/AuthContext.jsx`
- Modify: `frontend/src/hooks/useAuth.js`
- Modify: `frontend/src/App.jsx`
- Modify: `frontend/package.json`

**Interfaces:**

- Produces: `validateLogin(values) -> errors` and `validateRegister(values) -> errors`.
- Produces: `readAuthSession(storages)`, `writeAuthSession(session, remember, storages)`, and `clearAuthSession(storages)`.
- Produces: `authService.login(credentials)` and `authService.register(details)`.
- Produces: `AuthProvider` and `useAuth()` with `user`, `isAuthenticated`, `isInitializing`, `login`, `register`, and `logout`.

- [ ] **Step 1: Write failing pure validation tests**

Use Node's built-in test runner. Cover empty and malformed email, empty login password, trimmed full name, password shorter than 8 characters, mismatched confirmation, and missing terms acceptance. Add storage tests with in-memory `Storage` doubles to prove remembered and session-only login are mutually exclusive and logout clears both. Add error-mapping tests for network errors, safe backend messages, and technical backend messages.

- [ ] **Step 2: Run the validation test and verify failure**

Run: `node --test src/utils/authValidation.test.js`

Expected: FAIL because validation exports do not exist.

- [ ] **Step 3: Implement validation and service functions**

Validation returns field-keyed Vietnamese messages. Storage helpers accept explicit storage providers so they remain independently testable. Service returns `response.data.data` from `/auth/login` and `/auth/register` and maps Axios failures through `getAuthErrorMessage(error)` without returning raw technical errors.

- [ ] **Step 4: Implement storage-aware AuthContext**

Use constants `AUTH_TOKEN_KEY` and `AUTH_USER_KEY`. Login chooses local or session storage from `remember`; registration uses local storage for the newly authenticated account. Each write clears the other storage first. Context initialization restores and validates a stored safe-user JSON object without decoding the JWT client-side.

- [ ] **Step 5: Update Axios and application provider**

Axios reads local storage first, then session storage. Wrap `AppRoutes` with `AuthProvider` inside `BrowserRouter`. Implement `useAuth` to reject usage outside the provider.

- [ ] **Step 6: Verify the frontend state checkpoint**

Add `"test": "node --test src/**/*.test.js"` to frontend scripts.

Run: `npm test`

Expected: all validation tests pass.

### Task 4: Login and registration interface

**Files:**

- Create: `frontend/src/components/auth/AuthLayout.jsx`
- Create: `frontend/src/components/auth/AuthInput.jsx`
- Create: `frontend/src/components/auth/PasswordInput.jsx`
- Create: `frontend/src/components/auth/AuthHeader.jsx`
- Modify: `frontend/src/pages/auth/Login.jsx`
- Modify: `frontend/src/pages/auth/Register.jsx`
- Modify: `frontend/src/routes/PrivateRoute.jsx`
- Create: `frontend/src/routes/PrivateRoute.test.js`
- Modify: `frontend/src/routes/AppRoutes.jsx`

**Interfaces:**

- Consumes: validation, context, and service behavior from Task 3.
- Produces: responsive `/login` and `/register` pages and protected `/dashboard` routing.
- Produces: `getPrivateRouteState({ isInitializing, isAuthenticated }) -> "loading" | "redirect" | "render"` for deterministic guard behavior.

- [ ] **Step 1: Build shared accessible auth components**

`AuthInput` accepts `id`, `label`, `type`, `value`, `onChange`, `placeholder`, `autoComplete`, `error`, and `icon`. `PasswordInput` accepts the same public field props and owns visibility state. `AuthLayout` accepts `children`, `title`, and `description` for its introductory panel.

- [ ] **Step 2: Implement Login page behavior**

Use controlled fields, inline errors, remember checkbox, form-level `role="alert"`, submit loading state, React Router `Link`, and a visibly disabled "Quên mật khẩu?" control marked as coming soon. On success navigate to `/dashboard` with `replace: true`.

- [ ] **Step 3: Implement Register page behavior**

Use controlled fields, inline errors, terms checkbox, both password visibility controls, form-level error, submit loading state, and links to terms/privacy placeholders that do not trigger navigation. On success navigate to `/dashboard`.

- [ ] **Step 4: Implement route guards and routes**

First add Node tests for `getPrivateRouteState` covering all three states. Then implement `PrivateRoute`: render a neutral loading screen during initialization, redirect unauthenticated users to `/login` with the attempted location, and render children when authenticated. Add `/login` and `/register`; redirect authenticated visitors from both pages to `/dashboard`; preserve `/` and fallback behavior.

- [ ] **Step 5: Verify the interface checkpoint**

Run: `npm run lint`

Run: `npm run build`

Expected: both commands exit 0 with no warnings introduced by the auth implementation.

### Task 5: End-to-end verification and documentation

**Files:**

- Modify: `README.md`

**Interfaces:**

- Consumes: completed backend and frontend authentication flows.
- Produces: verified local workflow and concise setup documentation.

- [ ] **Step 1: Run complete automated verification**

Run backend `npm test` and `npm run check`, then frontend `npm test`, `npm run lint`, and `npm run build`.

Expected: every command exits 0.

- [ ] **Step 2: Verify real API behavior against local MongoDB**

Start backend and issue register, duplicate-register, valid-login, and invalid-login requests with a unique test email. Inspect the stored test account to confirm a bcrypt hash exists and plaintext does not. Remove only that exact verification account afterward.

- [ ] **Step 3: Verify the browser flow**

Run both dev servers. Check login and registration at desktop, tablet, and phone widths; verify inline errors, password toggles, loading state, navigation, refresh persistence, session-only storage, logout state, and protected-route redirect.

- [ ] **Step 4: Update README**

Document auth endpoints, required environment variables already present, development startup order, and how remember-me storage behaves. Do not include real secrets or credentials.

- [ ] **Step 5: Run final verification after documentation**

Repeat the complete automated command set and confirm the temporary verification account and browser artifacts are removed.
