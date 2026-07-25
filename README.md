# Data Room

Full-stack dataroom: NestJS + MongoDB Atlas backend, React (Vite) frontend.

Auth: email / password with JWT (7 days when “Remember me” is checked, otherwise browser session).

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- A MongoDB Atlas connection string (or credentials provided for review)

## Project layout

```
.
├── docker-compose.yml
├── dataroom-management-system-back/   # NestJS API
└── dataroom-management-system-front/  # React SPA
```

## Run with Docker

### 1. Create backend env

```bash
cp dataroom-management-system-back/.env.example dataroom-management-system-back/.env
```

Edit `dataroom-management-system-back/.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/dataroom?retryWrites=true&w=majority
JWT_SECRET=<long-random-string>
JWT_EXPIRES_REMEMBER=7d
JWT_EXPIRES_DEFAULT=1d
```

In Atlas → **Network Access**, allow your current IP (or `0.0.0.0/0` for a short review window).

Do not commit `.env` — it is gitignored. Only `.env.example` is in the repo.

### 2. Start

From this folder (where `docker-compose.yml` lives):

```bash
docker compose up --build
```

Wait until logs show: `Nest application successfully started`.

### 3. Open the app

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000/api |

### 4. Smoke test

1. Open http://localhost:5173 — you should land on **Sign in**
2. Go to **Sign up**, create an account (password at least 8 characters)
3. Create a folder and/or upload a PDF
4. Sign out, then sign in again (optional: enable **Remember me for 7 days**)

### 5. Stop

```bash
docker compose down
```

## Notes

- Frontend serves via nginx and proxies `/api` to the backend container
- Each user only sees their own folders and files
- First build may take a few minutes while images are created
