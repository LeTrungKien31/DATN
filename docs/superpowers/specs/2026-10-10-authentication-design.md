# Authentication Design

## Goal

Implement a complete registration and login flow for English Assessment AI,
covering the React frontend and Express/Mongoose backend while preserving the
project's existing architecture and visual language.

## Scope

Included:

- Student registration with full name, email, password, and password
  confirmation.
- Login with email, password, and an optional "remember me" setting.
- JWT-based authentication using the project's existing dependencies.
- Shared frontend authentication state and protected dashboard routing.
- Responsive login and registration interfaces consistent with the home page.
- Frontend and backend validation with friendly error messages.

Excluded:

- Google OAuth or any other social login.
- Password reset and email verification.
- Refresh tokens and token revocation.
- Teacher or administrator self-registration.
- Changes to question, assessment, or AI features.

## Architecture

The backend follows the repository's required flow:

```text
Route -> Validation Middleware -> Controller -> Service -> User Model -> MongoDB
```

Routes only declare endpoints and middleware. Controllers translate HTTP
requests and responses. The authentication service owns registration and login
rules. The Mongoose model is the only layer that accesses the user collection.

The frontend follows this flow:

```text
Login/Register Page -> AuthContext -> authService -> Axios API -> Backend
```

Shared form components own presentation and accessibility. Pages own form
state and client validation. `AuthContext` owns the authenticated user, token
storage, login, registration, and logout behavior.

## Backend Design

### User model

Create `backend/src/models/user.model.js` with:

- `fullName`: required trimmed string, 2-100 characters.
- `email`: required unique lowercase trimmed string with an index.
- `passwordHash`: required string, excluded from ordinary query results with
  `select: false`.
- `role`: enum `STUDENT`, `TEACHER`, `ADMIN`; defaults to `STUDENT`.
- `isActive`: boolean; defaults to `true`.
- Mongoose timestamps.

Registration never accepts a role from the client. Public registration always
creates a `STUDENT`.

### Validation

`backend/src/validators/auth.validator.js` exports middleware for login and
registration. It selects known fields rather than forwarding `req.body`.

Registration requires:

- A trimmed full name between 2 and 100 characters.
- A syntactically valid email address.
- A password of at least 8 characters and at most 72 UTF-8 bytes, matching
  bcrypt's safe input boundary.

Login requires a valid email and a non-empty password no longer than 72 UTF-8
bytes. Validation failures use
HTTP 422 and the standard error response with field-level errors.

Password confirmation and terms acceptance are frontend-only fields and are
not sent to the backend.

### Password handling

`backend/src/utils/password.js` exports password hashing and comparison
functions backed by bcrypt. Passwords use 12 salt rounds. Plaintext passwords
are never stored, returned, or logged.

### JWT handling

`backend/src/utils/jwt.js` exports token signing and verification functions.
Tokens contain only the user ID and role. Signing uses `JWT_SECRET` and
`JWT_EXPIRES_IN` from the existing environment configuration.

### Authentication service

`backend/src/services/auth.service.js` exports:

- `registerUser({ fullName, email, password })`
- `loginUser({ email, password })`

Registration normalizes the email, rejects an existing account with HTTP 409,
hashes the password, creates the user, signs a token, and returns a safe user
plus token.

Login queries the password hash explicitly, compares the password, rejects
unknown email and wrong password with the same HTTP 401 message, rejects an
inactive account with HTTP 403, then returns a safe user plus token.

Duplicate key errors caused by concurrent registrations are translated to the
same HTTP 409 response as the pre-check.

### Controller, routes, and app integration

`backend/src/controllers/auth.controller.js` returns the repository's standard
response shape. Registration returns HTTP 201 and login returns HTTP 200.
Errors are forwarded to centralized error middleware.

`backend/src/routes/auth.routes.js` exposes:

- `POST /register`
- `POST /login`

The router applies a stricter authentication rate limiter using the existing
`express-rate-limit` dependency and is mounted at `/api/auth` in `app.js`.

### API responses

Successful authentication returns:

```json
{
  "success": true,
  "message": "Authentication succeeded",
  "data": {
    "user": {
      "id": "...",
      "fullName": "...",
      "email": "...",
      "role": "STUDENT"
    },
    "token": "..."
  }
}
```

Responses never include `passwordHash`. Production responses never expose a
stack trace or database/JWT implementation details.

## Frontend Design

### Shared components

Create focused components under `frontend/src/components/auth`:

- `AuthLayout.jsx`: responsive two-column shell, brand introduction, feature
  list, and centered form panel. The introduction panel is hidden on mobile.
- `AuthInput.jsx`: accessible labeled text/email input with icon and inline
  field error.
- `PasswordInput.jsx`: password input with an accessible show/hide control.
- `AuthHeader.jsx`: form title and description.

The layout reuses the home page's blue palette, restrained border radius,
light border/shadow treatment, typography, and spacing. It avoids futuristic
effects and excessive gradients.

### Login page

`frontend/src/pages/auth/Login.jsx` contains:

- Email and current-password fields.
- Remember-me checkbox.
- Password-reset link displayed as unavailable navigation until that feature
  exists; it must not trigger a fake flow.
- Submit button with disabled/loading state.
- Link to `/register`.

Client validation requires a syntactically valid email and a non-empty password
no longer than 72 UTF-8 bytes.

### Registration page

`frontend/src/pages/auth/Register.jsx` contains:

- Full name, email, password, and password-confirmation fields.
- Terms acceptance checkbox.
- Submit button with disabled/loading state.
- Link to `/login`.

Client validation requires a full name between 2 and 100 characters, valid
email, password of at least 8 characters and at most 72 UTF-8 bytes, matching
confirmation, and accepted terms.

### Authentication service and state

`frontend/src/services/authService.js` calls the real backend endpoints through
the existing Axios instance:

- `login(credentials)` posts to `/auth/login`.
- `register(details)` posts to `/auth/register`.

`frontend/src/context/AuthContext.jsx` provides:

- `user`
- `isAuthenticated`
- `isInitializing`
- `login(credentials, remember)`
- `register(details)`
- `logout()`

Remembered sessions use `localStorage`; non-remembered sessions use
`sessionStorage`. The token and safe user object stay in the same storage.
Only one storage is active at a time, and logout clears both. Passwords are
never stored.

The Axios request interceptor reads the token from either storage. API error
messages are mapped to friendly Vietnamese copy before display; raw stack
traces and infrastructure errors are not shown.

### Routing

Wrap application routes with `AuthProvider` in `App.jsx`.

Add routes:

- `/login`
- `/register`

Implement the existing `PrivateRoute.jsx` placeholder and protect
`/dashboard`. Unauthenticated users are redirected to `/login`. An
authenticated user visiting `/login` or `/register` is redirected to
`/dashboard` after context initialization.

Successful login and registration navigate to `/dashboard`.

## Error Handling

- Field validation errors appear directly below the relevant input.
- Authentication and network errors appear in an accessible form-level alert.
- Unknown email and wrong password share one message.
- Buttons remain disabled during an active request to prevent duplicate
  submissions.
- The frontend does not use `alert()` or log credentials.
- Backend validation, conflict, authentication, and inactive-account failures
  use HTTP 422, 409, 401, and 403 respectively.

## Accessibility and Responsive Behavior

- Every input has a linked label and appropriate autocomplete value.
- Password visibility buttons expose an accessible label and pressed state.
- Focus rings have sufficient contrast.
- Error summaries use `role="alert"`; field errors use `aria-describedby` and
  `aria-invalid`.
- Desktop and large tablet layouts use two columns.
- Small tablets and phones display only the form panel at a safe maximum width.
- Form actions remain full-width and content never overflows narrow screens.
- Motion respects the existing `prefers-reduced-motion` handling.

## Verification

Use existing dependencies and Node's built-in test runner where automated
coverage is practical. Verification covers:

- Frontend validation for malformed email, short password, mismatched
  confirmation, and missing terms acceptance.
- Backend validation and service rules for registration, duplicate email,
  successful login, wrong credentials, and inactive users.
- Password hashes are stored and never returned.
- JWT payload and expiration configuration.
- API response status and shape for both endpoints.
- Protected-route behavior and both storage modes.
- Frontend lint and production build.
- Backend syntax checks and end-to-end API requests against local MongoDB.
- Visual inspection at desktop, tablet, and mobile dimensions.

## Security Constraints

- No password, secret, or API key is stored in frontend storage or committed.
- No raw `req.body` is passed to a Mongoose query or model constructor.
- No role supplied by public registration is trusted.
- No `passwordHash` appears in JSON responses.
- JWT secrets remain backend-only.
- Authentication errors reveal no account existence beyond the registration
  conflict required by the product flow.
