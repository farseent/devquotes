# 💬 DevQuotes

A full-stack MERN app where developers can post and browse inspiring dev quotes — built as a hands-on project to learn and implement a complete CI/CD pipeline from scratch.

![CI/CD Pipeline](https://img.shields.io/github/actions/workflow/status/farseent/devquotes/ci-cd.yml?label=CI%2FCD&logo=github-actions)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker)
![Render](https://img.shields.io/badge/Deployed-Render-46E3B7?logo=render)

---

## 🌐 Live Demo

**Frontend:** https://devquotes-frontend.onrender.com

> Note: Free tier services may take ~30 seconds to wake up on first load.

---

## 🛠️ Tech Stack

| Layer            | Technology             |
| ---------------- | ---------------------- |
| Frontend         | React 19, Vite, Axios  |
| Backend          | Node.js, Express       |
| Database         | MongoDB, Mongoose      |
| Testing          | Jest, Supertest        |
| Containerization | Docker, Docker Compose |
| CI/CD            | GitHub Actions         |
| Deployment       | Render                 |
| Registry         | Docker Hub             |

---

## ⚙️ CI/CD Pipeline

Every push to `main` triggers the full pipeline automatically:

```
Push to main
      ↓
┌──────────────────┐   ┌──────────────────┐
│  test-backend    │   │  build-frontend  │  ← run in parallel
│  (Jest + MongoDB)│   │  (Vite build)    │
└────────┬─────────┘   └────────┬─────────┘
         └──────────┬───────────┘
                    ↓
           docker-build-push
       (build + push images to Docker Hub)
                    ↓
                 deploy
           (trigger Render redeploy)
                    ↓
              🚀 Live
```

Key pipeline features:

- Tests run automatically on every push and pull request
- Docker images only build if all tests pass
- Deploy only triggers on pushes to `main`, never on PRs
- Concurrency control prevents overlapping deployments
- GitHub Actions cache speeds up Docker layer rebuilds

---

## 🐳 Docker Architecture

**Backend** — single stage, lean Node Alpine image:

```
node:22-alpine → install deps → copy source → expose 5000
```

**Frontend** — multi-stage build:

```
Stage 1: node:22-alpine → npm install → vite build → /dist
Stage 2: nginx:alpine   → serve /dist as static files (~25MB final image)
```

---

## 🚀 Running Locally

### Prerequisites

- Docker Desktop installed and running
- Node.js 22+

### With Docker Compose (recommended)

```bash
git clone https://github.com/farseent/devquotes.git
cd devquotes
docker-compose up --build
```

| Service     | URL                   |
| ----------- | --------------------- |
| Frontend    | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| MongoDB     | localhost:27017       |

### Without Docker

**Backend:**

```bash
cd backend
cp .env.example .env   # add your MONGO_URI
npm install
npm run dev
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Running Tests

```bash
cd backend
npm test
```

Tests use an isolated in-memory MongoDB instance via Docker's service container — no real database touched.

Test coverage:

- `GET /api/quotes` — returns all quotes, newest first
- `POST /api/quotes` — creates a quote with valid body
- `POST /api/quotes` — returns 400 if `text` is missing
- `POST /api/quotes` — returns 400 if `author` is missing

---

## 📁 Project Structure

```
devquotes/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions pipeline
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── index.js               # Express server
│   ├── models/
│   │   └── Quote.js           # Mongoose schema
│   ├── routes/
│   │   └── quotes.js          # API routes
│   ├── tests/
│   │   └── quotes.test.js     # Jest + Supertest
│   └── package.json
├── frontend/
│   ├── Dockerfile             # Multi-stage build
│   ├── .dockerignore
│   ├── nginx.conf             # Nginx config for React Router
│   ├── src/
│   │   └── App.jsx
│   └── package.json
└── docker-compose.yml
```

---

## 📡 API Reference

### `GET /api/quotes`

Returns all quotes, sorted newest first.

**Response:**

```json
[
  {
    "_id": "...",
    "text": "Code is poetry",
    "author": "Farseen",
    "createdAt": "2026-06-30T15:21:47.494Z"
  }
]
```

### `POST /api/quotes`

Creates a new quote.

**Body:**

```json
{
  "text": "Code is poetry",
  "author": "Farseen"
}
```

**Responses:**

- `201 Created` — quote saved successfully
- `400 Bad Request` — missing `text` or `author`
- `500 Internal Server Error` — server-side failure

### `GET /health`

Health check endpoint used by Render to confirm the server is running.

---

## 🔑 Environment Variables

**Backend (`.env`):**

```
MONGO_URI=mongodb://localhost:27017/devquotes
PORT=5000
```

For production, these are set as environment variables in Render's dashboard — never committed to the repo.

---

## 🧠 What I Learned

This project was built specifically to understand CI/CD hands-on. Key lessons:

- **Node version must match between local dev and Docker** — platform-specific native binaries (like Rolldown in Vite 8) silently break when the versions differ
- **Docker layer caching order matters** — copying `package.json` before source code avoids invalidating the `npm install` cache on every code change
- **Multi-stage builds** keep production images small by discarding build tools after compilation
- **`needs:` vs `depends_on:` vs `context:`** are three separate mechanisms for three separate problems (CI job order, container start order, and build file scope)
- **Frontend validation is UX; backend validation is security** — never trust the client

---

## 👤 Author

**Farseen T**

- GitHub: [@farseent](https://github.com/farseent)
- LinkedIn: [linkedin.com/in/farseent](https://linkedin.com/in/farseent)
- Portfolio: [farseen-pi.vercel.app](https://farseen-pi.vercel.app)
