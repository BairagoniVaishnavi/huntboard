# HuntBoard 🚀 — MERN Stack

A full-stack Job & Internship Application Tracker built with MongoDB, Express, React, and Node.js.

## Features

- **Kanban Board** — drag-and-drop applications across Applied, Interview, Offer, Rejected columns
- **Dashboard** — pipeline stats, donut chart, activity feed
- **List View** — sortable table with bulk delete
- **Job Detail** — inline editing, status stepper, notes journal
- **Auth** — JWT-based signup/login with Cloudflare Turnstile human verification
- **Profile** — editable user profile synced to MongoDB
- **Settings** — light/dark theme, 6 accent colors, notification preferences
- **Notifications** — contextual alerts (follow-ups, interviews, offers)

---

## Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works) or local MongoDB
- npm 8+

---

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd huntboard-mern

# Install all dependencies (root + server + client)
npm run install-all
```

### 2. Configure Server Environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/huntboard
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

> **MongoDB Atlas setup:**
> 1. Create free cluster at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
> 2. Create database user (Database Access tab)
> 3. Whitelist your IP (Network Access tab → Add `0.0.0.0/0` for dev)
> 4. Get connection string (Connect → Drivers → copy URI)

### 3. Configure Client Environment

```bash
cd client
cp .env.example .env
```

`client/.env` (default works for local dev):
```env
VITE_API_URL=http://localhost:5000
```

### 4. Seed the Database

```bash
# From the project root:
npm run seed
```

This creates the demo user and 10 sample jobs:
- **Email:** `demo@huntboard.app`
- **Password:** `demo1234`

### 5. Run the App

```bash
# From the project root — starts both server and client:
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend (Vite) | http://localhost:5173 |
| Backend (Express) | http://localhost:5000 |
| API Health Check | http://localhost:5000/api/health |

---

## Project Structure

```
huntboard-mern/
├── package.json              ← root scripts (concurrently)
├── README.md
│
├── server/
│   ├── index.js              ← Express entry point
│   ├── seed.js               ← Database seeder
│   ├── .env.example
│   ├── config/
│   │   └── db.js             ← Mongoose connection
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Notification.js
│   ├── middleware/
│   │   ├── auth.js           ← JWT protect middleware
│   │   └── errorHandler.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   └── notifController.js
│   └── routes/
│       ├── authRoutes.js
│       ├── jobRoutes.js
│       └── notifRoutes.js
│
└── client/
    ├── index.html            ← includes Cloudflare Turnstile script
    ├── vite.config.js        ← proxy /api → localhost:5000
    ├── .env.example
    └── src/
        ├── App.jsx           ← routes, auth guards, data loading
        ├── main.jsx
        ├── lib/
        │   └── api.js        ← Axios instance with JWT interceptor
        ├── store/
        │   ├── useAppStore.js    ← jobs (API-backed, optimistic)
        │   ├── useAuthStore.js   ← JWT auth
        │   ├── useThemeStore.js  ← light/dark + accent colors
        │   └── useNotifStore.js  ← notifications (API-backed)
        ├── pages/
        │   ├── Login.jsx
        │   ├── Signup.jsx
        │   ├── Dashboard.jsx
        │   ├── Board.jsx
        │   ├── ListView.jsx
        │   ├── JobDetail.jsx
        │   ├── Profile.jsx
        │   └── Settings.jsx
        └── components/
            ├── layout/       ← Sidebar, Topbar, NotificationsPanel
            ├── board/        ← KanbanColumn, JobCard
            ├── dashboard/    ← StatsCard, ActivityFeed, ProgressChart
            ├── modals/       ← AddJobModal, ConfirmDeleteModal
            └── shared/       ← Badge, Avatar, EmptyState
```

---

## API Reference

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | — | Register new user |
| POST | `/login` | — | Login + Turnstile verify → returns JWT |
| GET | `/me` |  | Get current user |
| PUT | `/me` |  | Update profile |

### Jobs — `/api/jobs`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all jobs for user |
| POST | `/` | Create job |
| PUT | `/:id` | Update job |
| PATCH | `/:id/move` | Move to new status |
| DELETE | `/:id` | Delete job |
| DELETE | `/bulk` | Bulk delete `{ ids: [] }` |

### Notifications — `/api/notifications`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all (auto-generates on first call) |
| PATCH | `/:id/read` | Mark one read |
| PATCH | `/read-all` | Mark all read |
| DELETE | `/:id` | Delete one |
| DELETE | `/` | Clear all |

---

## Production Deployment

### Build

```bash
npm run build          # builds client/dist
NODE_ENV=production    # server serves client/dist statically
```

### Cloudflare Turnstile (Production)

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Turnstile → Add site
2. Set `TURNSTILE_SECRET_KEY` in server `.env` to your real secret key
3. Set `TURNSTILE_SITE_KEY` in `client/src/pages/Login.jsx` to your real site key

### Recommended Hosts
- **Frontend + Backend together:** Railway, Render, Fly.io
- **Frontend only:** Vercel, Netlify (set `VITE_API_URL` to your backend URL)
- **Database:** MongoDB Atlas (free M0 tier)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, Tailwind CSS 3 |
| State | Zustand 5 |
| Routing | React Router v7 |
| Drag & Drop | @dnd-kit |
| HTTP Client | Axios |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose 8 |
| Auth | JWT + bcryptjs |
| Security | Cloudflare Turnstile |
| Icons | Lucide React |
| Fonts | Sora + DM Sans (Google Fonts) |
