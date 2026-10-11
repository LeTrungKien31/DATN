# SDD ledger — plan: docs/superpowers/plans/2026-10-10-authentication.md

Environment: repository has no Git metadata; worktree and commit steps are unavailable. Working in D:\KLingo as explicitly requested.
Baseline: backend `npm run check` PASS; frontend `npm run lint` PASS; frontend `npm run build` PASS.
Pre-flight: Task 1 produces User/password/JWT/validation/service interfaces consumed by Task 2 — interfaces match.
Pre-flight: Task 3 produces AuthContext/service/storage interfaces consumed by Task 4 — interfaces match.
Pre-flight: Tasks 2 and 3 share `/api/auth/register` and `/api/auth/login` response shape — interfaces match spec.
Ruling: execute without Git workspace tooling because D:\KLingo is not a Git repository — changes remain directly reviewable in the requested workspace — cost if wrong: no automatic branch rollback or commit history.
Task 1: complete (tests: `node --test test/auth.service.test.js` → 7/7 pass).
Task 2: complete (tests: backend `npm test` → 11/11 pass; `npm run check` → pass).
Task 3: Ruling: add `frontend/src/services/authService.test.js` because the plan requires safe error-mapping tests but omitted their file — isolates the security-sensitive mapping as a real exported behavior — cost if wrong: one additional focused test file to maintain.
Task 3: Ruling: add `frontend/src/context/auth-context.js` so the context value and provider stay in separate modules — satisfies Vite Fast Refresh boundaries without disabling lint — cost if wrong: one small internal module.
Task 3: Ruling: make `import.meta.env` optional in `api.js` — Node's built-in test runner does not inject Vite env while the browser build does — cost if wrong: fallback API URL is used when no Vite environment exists.
Task 3: complete (tests: frontend `npm test` → 8/8 pass).
Task 4: Ruling: place `getPrivateRouteState` in `privateRouteState.js` rather than JSX — Node's dependency-free test runner cannot load JSX directly — cost if wrong: one pure helper module next to the route component.
Task 4: Ruling: initialize AuthContext from storage with a lazy state initializer — storage reads are synchronous and React lint rejects synchronous state updates inside effects — cost if wrong: context initialization is immediate rather than displaying a transient loading screen on first paint.
Task 4: complete (tests: frontend `npm test` → 11/11 pass; `npm run lint` → pass; `npm run build` → pass).
Task 5: Ruling: reject technical-looking server messages even when they arrive with a normally safe 4xx status — prevents database/JWT internals from reaching the UI — cost if wrong: an unusual legitimate message containing an error-class name falls back to the generic message.
Task 5: API integration PASS (`register` 201, duplicate 409, `login` 200, wrong password 401); MongoDB record PASS (bcrypt hash, password excluded by default, no plaintext); visual review PASS at desktop, tablet, and scaled mobile viewport.
Task 5: Ruling: isolate API and service test files in separate MongoDB databases — Node runs test files concurrently and shared cleanup caused fixture races — cost if wrong: two empty test database namespaces remain available locally.
Task 5: Independent review found bcrypt input length, malformed success-session, parser secrecy, empty-body, and field-error gaps. All were fixed with regression coverage; focused re-review verdict: Ready, no Critical or Important findings.
Task 5: complete (backend `npm test` → 14/14 pass; backend `npm run check` → pass; frontend `npm test` → 17/17 pass; frontend `npm run lint` → pass; frontend `npm run build` → pass). Exact live verification account and temporary browser artifacts removed.
