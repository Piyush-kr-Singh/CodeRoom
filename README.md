# CodeShare Room

Production-oriented anonymous real-time code sharing platform built as a small monorepo:

- `frontend`: Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Monaco
- `backend`: Express, TypeScript, Socket.io, MongoDB, Redis adapter support
- `shared`: shared room, API, and realtime TypeScript contracts

## What it includes

- Anonymous URL-based rooms with no signup or login
- Public and private room creation on first visit
- Bcrypt-hashed passwords for private rooms
- Configurable room expiry with MongoDB TTL cleanup
- Temporary owner token stored in `localStorage`
- Owner controls for privacy, expiry, password reset, and deletion
- Real-time Monaco editor with Socket.io sync
- Presence indicators and anonymous random usernames
- Copy URL, copy code, and read-only viewer link support
- SEO pages for `/`, `/features`, `/private-code-sharing`, `/realtime-code-editor`, `/faq`, and `/blog/[slug]`
- OpenGraph, Twitter card, JSON-LD, FAQ schema, sitemap, and robots support

## Project structure

```text
/frontend
/backend
/shared
```

## Local setup

1. Install dependencies from the repo root:

```bash
npm install
```

2. Create environment files:

- `backend/.env` from `backend/.env.example`
- `frontend/.env.local` from `frontend/.env.example`

3. Start the backend:

```bash
npm run dev:backend
```

4. Start the frontend:

```bash
npm run dev:frontend
```

## Important environment variables

### Backend

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: secret used for short-lived room access tokens
- `CLIENT_URL`: frontend origin, used for CORS and viewer links
- `REDIS_URL`: optional Redis URL for multi-instance Socket.io scaling
- `ROOM_MAX_USERS`: per-room cap for abuse protection
- `ROOM_INACTIVITY_MINUTES`: inactivity timeout before cleanup
- `ROOM_MAX_EXPIRY_HOURS`: upper bound for room lifetime

### Frontend

- `NEXT_PUBLIC_API_URL`: backend base URL
- `NEXT_PUBLIC_SITE_URL`: frontend public URL

## Deployment guide

### Frontend on Vercel

1. Import the repo into Vercel.
2. Set the project root to `frontend`.
3. Add:
   - `NEXT_PUBLIC_API_URL=https://your-backend.example.com`
   - `NEXT_PUBLIC_SITE_URL=https://your-frontend.example.com`
4. Deploy with the default Next.js preset.

### Backend on Render or Railway

1. Point the service root to `backend`.
2. Use `npm install && npm run build` as the build command.
3. Use `npm start` as the start command.
4. Add:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL=https://your-frontend.example.com`
   - `REDIS_URL` if you want multi-instance socket scaling
5. Enable sticky sessions if your platform requires them for websockets.

### MongoDB Atlas

1. Create an Atlas cluster.
2. Whitelist your backend deployment.
3. Use the Atlas connection string for `MONGODB_URI`.
4. The room schema defines TTL indexes for `expiresAt` and `inactiveDeleteAt`, so rooms self-clean after deployment.

## Security notes

- Private room passwords are hashed with bcrypt
- Owner tokens and viewer keys are stored hashed on the backend
- Express rate limiting protects room creation and access attempts
- Room size is capped server-side
- Hard expiry and inactivity cleanup reduce retained data

## Scaling notes

- Room access is stateless after the access handshake because websocket auth uses signed tokens
- Socket.io Redis adapter support is included for horizontal scaling
- MongoDB stays the source of truth for room settings and persisted code snapshots

## Validation commands

```bash
npm run type-check
npm run test
npm run build
```

## Current workspace note

An older `vite/` prototype already existed in the workspace. This build leaves it untouched and creates the requested monorepo in `frontend/`, `backend/`, and `shared/`.
