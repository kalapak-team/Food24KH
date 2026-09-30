# Food24KH

Modern Cambodian food marketplace and delivery platform.

Food24KH connects customers, restaurants, restaurant staff, delivery operations, and administrators. The product is inspired by marketplace functionality common in the region, with original branding, UI, and implementation.

## Overview

- **Food** — food marketplace
- **24** — convenient / anytime ordering
- **KH** — Cambodia / Khmer

## Features (roadmap)

Phase 1 establishes the monorepo foundation. Later phases add authentication, restaurant discovery, cart/checkout, orders, restaurant dashboards, and admin tools.

Planned capabilities include:

- Customer marketplace (EN / KM, USD / KHR)
- Restaurant menus, options, and add-ons
- Cart, checkout, promotions, and order tracking
- Restaurant owner/staff tools
- Admin approvals, moderation, and reporting

## Architecture

```text
Customer Frontend (Next.js)  →  Rails API  →  PostgreSQL
Admin Frontend (Next.js)     ↗
```

## Tech Stack

| Layer | Stack |
| --- | --- |
| Customer frontend | Next.js, TypeScript, Tailwind CSS, shadcn/ui, Lucide, React Hook Form, Zod, TanStack Query |
| Admin frontend | Same as customer frontend (separate app) |
| Backend | Ruby on Rails API-only, ActiveRecord, PostgreSQL |
| Auth | Token-based JWT between Next.js and Rails (Phase 3) |

## Folder Structure

```text
Food24KH/
├── user-frontend/     # Customer marketplace (port 3001)
├── admin-frontend/    # Admin console (port 3002)
├── backend/           # Rails API (port 3000)
├── README.md
└── .gitignore
```

## Requirements

- Node.js 20+
- npm 10+
- Ruby 3.3+
- Rails 8.x
- PostgreSQL 14+
- Git

## Installation

```bash
# Clone / open the repo
cd Food24KH

# Customer frontend
cd user-frontend
cp .env.example .env.local
npm install

# Admin frontend
cd ../admin-frontend
cp .env.example .env.local
npm install

# Backend
cd ../backend
cp .env.example .env
bundle install
```

Generate a Rails secret for local development:

```bash
cd backend
bundle exec rails secret
```

Put the value into `SECRET_KEY_BASE` and use another long random string for `JWT_SECRET` in `backend/.env`.

## Environment Variables

### Customer / Admin frontends

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### Backend

See `backend/.env.example` for:

- `DATABASE_URL` / PostgreSQL connection fields
- `SECRET_KEY_BASE`
- `JWT_SECRET`
- `CORS_ORIGINS`
- `FRONTEND_URL` / `ADMIN_FRONTEND_URL`

Never commit real `.env` files.

## Database Setup

PostgreSQL can be started with Docker Compose from the repo root:

```bash
docker compose up -d
```

Then create/migrate databases:

```bash
cd backend
bundle exec rails db:create
bundle exec rails db:migrate
bundle exec rails db:seed
```

PostgreSQL defaults (see `backend/.env.example`):

- Host: `127.0.0.1:5432` (local PostgreSQL managed with pgAdmin)
- User: `postgres`, password: the one you chose when installing PostgreSQL
- Database: `food24kh_development` (created by `rails db:create`; refresh pgAdmin to see it)

> Optional: `docker compose up -d` runs a separate Postgres on **5433** (user/password `postgres`/`postgres`). To use it, set `DATABASE_PORT=5433` and `DATABASE_PASSWORD=postgres` in `backend/.env`.

## Running Frontend

```bash
cd user-frontend
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Running Admin

```bash
cd admin-frontend
npm run dev
```

Open [http://localhost:3002](http://localhost:3002).

## Running Backend

```bash
cd backend
bundle exec rails server -p 3000
```

Health check:

- [http://localhost:3000/up](http://localhost:3000/up)
- [http://localhost:3000/api/v1/health](http://localhost:3000/api/v1/health)

## Local Ports

| App | URL |
| --- | --- |
| Rails API | http://localhost:3000 |
| Customer frontend | http://localhost:3001 |
| Admin frontend | http://localhost:3002 |

The master prompt listed customer and API both on 3000. This project uses the split above to avoid conflicts while keeping the API on 3000.

## API Documentation

OpenAPI/Swagger documentation will be added as endpoints land in later phases. Phase 1 exposes:

```text
GET /api/v1/health
```

## Testing

```bash
# Frontends
cd user-frontend && npm run lint
cd ../admin-frontend && npm run lint

# Backend (test suite expands in later phases)
cd ../backend
bundle exec rails runner "puts 'Rails boots OK'"
```

## Security

- Never store plaintext passwords
- Never expose `DATABASE_PASSWORD`, `JWT_SECRET`, `SECRET_KEY_BASE`, or payment secrets to frontends
- CORS is origin-restricted via `CORS_ORIGINS`
- Backend authorization is mandatory (Phase 3+)

## Deployment

Prepare for separate hosting of:

1. Customer Next.js app
2. Admin Next.js app
3. Rails API
4. PostgreSQL

No cloud provider is hard-coded.

## Future Features

Delivery partners, live tracking, wallet/loyalty, push notifications, chat, advertising, and AI recommendations are intentionally deferred.

## Development Phases

1. **Phase 1** — Project initialization (this phase)
2. Phase 2 — Database architecture
3. Phase 3 — Authentication
4. Phase 4 — Customer home page
5. Phase 5 — Restaurant marketplace
6. Phase 6 — Cart and checkout
7. Phase 7 — Orders
8. Phase 8 — Restaurant dashboard
9. Phase 9 — Admin dashboard
10. Phase 10 — Polish

Continue only when instructed with `CONTINUE TO PHASE 2`.
