# TaskFlow API

A minimal Express REST API for TaskFlow's boards and tasks, backed by a JSON
file on disk (`server/data/db.json`). Optional — the frontend runs fine
without it, using `localStorage` instead. Point the frontend at this server
via `VITE_API_URL` (see the root `.env.example`) to get shared, persistent
storage instead.

## Run it

```bash
cd server
npm install
npm run dev   # http://localhost:4000, restarts on file changes
```

## Endpoints

| Method | Path                      | Description                         |
| ------ | ------------------------- | ------------------------------------ |
| GET    | `/api/health`             | Health check                         |
| GET    | `/api/boards`              | List boards                          |
| POST   | `/api/boards`              | Create a board `{ name }`            |
| DELETE | `/api/boards/:id`          | Delete a board and its tasks         |
| GET    | `/api/tasks?boardId=`      | List tasks, optionally by board      |
| POST   | `/api/tasks`                | Create a task                        |
| PUT    | `/api/tasks/:id`            | Update a task                        |
| PATCH  | `/api/tasks/:id/status`     | Update just a task's status          |
| DELETE | `/api/tasks/:id`            | Delete a task                        |

## Deploying

This is a plain Node/Express app, so it deploys to any Node host — Render,
Railway, Fly.io, a small VPS, etc. Set the `PORT` environment variable if
your host requires it (most inject it automatically). Because the "database"
is a JSON file on disk, pick a host with a persistent filesystem, or swap
`db.js` for a real database client if you deploy somewhere with an ephemeral
filesystem (e.g. most serverless platforms).
