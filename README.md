# Concert Tickets — Full-Stack Assignment

Free concert ticket reservation platform built with **Next.js 16** (frontend) and **NestJS** (backend).

---

## Architecture Overview

```
d:\Code\
├── data-wow-font/          ← Next.js 16 frontend  (port 3000)
├── data-wow-backend/       ← NestJS backend        (port 4000)
└── docker-compose.yml      ← Orchestrates all services
```

### Backend modules

| Module | Responsibility |
|---|---|
| `auth` | JWT login/register, passport strategy |
| `users` | User entity, bcrypt password hashing |
| `concerts` | CRUD — Admin only (create/delete) |
| `reservations` | Reserve/cancel logic with pessimistic locking |

### Database

PostgreSQL 16 managed via Docker Compose. Schema managed by TypeORM migrations.

```
users ──< reservations >── concerts
```

---

## Library List

### Frontend (`data-wow-font`)
| Library | Purpose |
|---|---|
| Next.js 16 | App Router, SSR |
| React 19 | UI components |
| Tailwind CSS v4 | Utility styles |
| `axios`/`fetch` | API calls (native fetch used) |

### Backend (`data-wow-backend`)
| Library | Purpose |
|---|---|
| NestJS 11 | Framework |
| TypeORM | ORM + migrations |
| `pg` | PostgreSQL driver |
| `@nestjs/jwt` + `passport-jwt` | JWT authentication |
| `class-validator` | DTO validation |
| `bcryptjs` | Password hashing |
| Jest + `@nestjs/testing` | Unit testing |

---

## Quick Start (Docker)

> Requires Docker Desktop running.

```bash
# From d:\Code\
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

---

## Local Development (without Docker)

### 1. Start PostgreSQL

```bash
docker run -d \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=datawow \
  -p 5432:5432 \
  postgres:16-alpine
```

### 2. Backend

```bash
cd data-wow-backend
cp .env.example .env   # or edit .env directly
npm install
npm run start:dev      # http://localhost:4000
```

### 3. Frontend

```bash
cd data-wow-font
cp .env.local.example .env.local  # NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev            # http://localhost:3000
```

---

## Running Tests

```bash
cd data-wow-backend
npm test              # run all unit tests
npm run test:cov      # with coverage report
```

Tests cover:
- `ConcertsService` — create, findAll, findOne (not found), remove (not found)
- `ReservationsService` — reserve (success, concert not found, already reserved, fully booked), cancel (success, not found, wrong user, already cancelled)

---

## API Endpoints

### Auth
| Method | Path | Role |
|---|---|---|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |

### Concerts
| Method | Path | Role |
|---|---|---|
| GET | `/concerts` | ADMIN, USER |
| POST | `/concerts` | ADMIN only |
| DELETE | `/concerts/:id` | ADMIN only |

### Reservations
| Method | Path | Role |
|---|---|---|
| POST | `/reservations/:concertId` | USER only |
| DELETE | `/reservations/:id` | USER only |
| GET | `/reservations/my/history` | USER only |
| GET | `/reservations/admin/all` | ADMIN only |

---

## Bonus: Theory & Strategy

### 1. Performance Optimization (High Traffic / Large Dataset)

- **Database indexing** — Add indexes on `reservations.userId`, `reservations.concertId`, and `reservations.status` to speed up frequent queries.
- **Query caching** — Cache `GET /concerts` responses in Redis with a short TTL (e.g. 5s). Invalidate on concert create/delete.
- **CDN** — Serve static Next.js assets via a CDN (Cloudfront, Vercel Edge). Static pages can be ISR-cached at the edge.
- **Connection pooling** — Use PgBouncer in front of PostgreSQL to handle thousands of short-lived DB connections.
- **Read replicas** — Route read queries (concert list, history) to read replicas; writes go to primary.

### 2. Concurrency Control (Race Condition — 1,000 users, last 10 seats)

The reservation endpoint uses **pessimistic write locking** (`SELECT ... FOR UPDATE`) inside a database transaction:

```ts
// reservations.service.ts
const concert = await manager
  .getRepository(Concert)
  .createQueryBuilder('concert')
  .setLock('pessimistic_write')   // ← blocks concurrent reads until commit
  .where('concert.id = :id', { id: concertId })
  .getOne();
```

**Flow:**
1. Transaction begins.
2. Lock the concert row — concurrent requests queue here.
3. Re-count active reservations inside the transaction.
4. If `reserved >= totalSeats` → throw `BadRequestException('Concert is fully booked')`.
5. Otherwise insert reservation and commit (lock released).

This guarantees **no over-booking** without a message queue. For even higher throughput, a Redis atomic decrement (`DECR seats:<id>`) could gate reservations before hitting the DB.

