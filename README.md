# English Assessment AI

## Backend setup

Requirements:

- Node.js 20 or newer
- MongoDB running locally on port 27017

Install and run the backend:

```bash
cd backend
npm install
npm run dev
```

The development API runs at `http://localhost:5000`. Check it with:

```text
GET http://localhost:5000/api/health
```

Copy values from `backend/.env.example` when creating an environment for another
machine. Replace `JWT_SECRET` before deploying and configure an AI API key only
when the related integration is implemented.

## Frontend setup

Install and run the React development server:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and uses the API URL configured in
`frontend/.env`. Create production assets with `npm run build`.

## Authentication

Student authentication is available at:

```text
POST /api/auth/register
POST /api/auth/login
```

Registration accepts `fullName`, `email`, and `password`. Login accepts `email`
and `password`. Passwords must contain at least 8 characters and no more than
72 UTF-8 bytes. Both endpoints return a safe user object and a JWT; password
hashes are never returned.

The frontend routes are:

```text
/login
/register
/dashboard
```

The dashboard requires authentication. Selecting "Ghi nhớ đăng nhập" stores
the session in local storage; otherwise login uses session storage. Passwords
are never stored in the browser.

Run backend tests with `npm test` inside `backend`, and frontend validation and
session tests with `npm test` inside `frontend`.
