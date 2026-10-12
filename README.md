# TaskFlow — Task Management Dashboard

A responsive task management dashboard built with React, TypeScript, and
Vite, inspired by tools like Trello and Jira. Organize tasks across boards,
track them through To Do / In Progress / Completed, and filter, search, and
sort as the list grows.

Built as a portfolio project; see [COMMIT_ROADMAP.md](./COMMIT_ROADMAP.md)
for the sequence of improvements made to it, commit by commit.

## Features

- Multiple boards — create, switch between, and delete boards (deleting one
  removes its tasks too, behind a confirmation dialog)
- Create, edit, and delete tasks
- Drag and drop tasks between columns — works with mouse, touch, and
  keyboard (via [@dnd-kit](https://dndkit.com/)), with an accessible
  "Move to" menu on every card as a fallback
- Optimistic delete with a 5-second "Undo" toast
- To Do / In Progress / Completed columns
- High / medium / low priority levels
- Overdue and due-soon badges on task cards
- Sort each board by due date, priority, creation date, or manual order
- Search tasks, and filter by priority
- Project completion percentage per board
- Persistent data via localStorage, with an optional backend (see below)
- Responsive design, empty-state messages, form validation
- Automated tests (Vitest + React Testing Library)

## Technologies

- React 19, TypeScript, Vite
- [@dnd-kit](https://dndkit.com/) for accessible drag-and-drop
- Lucide React (icons)
- Vitest + React Testing Library (tests)
- Optional backend: Node.js, Express, a JSON file on disk (see `/server`)

## Getting started

```bash
npm install
npm run dev
```

By default the app runs entirely client-side, persisting to `localStorage`
— no backend required.

## Running the backend (optional)

To get shared, persistent storage instead of `localStorage`, run the
included API server and point the frontend at it.

```bash
# terminal 1 — the API
cd server
npm install
npm run dev          # http://localhost:4000

# terminal 2 — the frontend
cp .env.example .env # sets VITE_API_URL=http://localhost:4000/api
npm run dev
```

See [server/README.md](./server/README.md) for the API's endpoints and its
own deployment notes.

## Environment variables

| Variable        | Default   | Description                                                                 |
| ---------------- | --------- | ---------------------------------------------------------------------------- |
| `VITE_API_URL`   | _(unset)_ | Base URL of a running TaskFlow API. Leave unset to run fully client-side.   |

See `.env.example`.

## Testing

```bash
npm run test           # run once
npm run test:watch     # watch mode
npm run test:coverage  # with coverage
```

Covers the search/filter and sort utilities, the due-date classifier, the
task reducer (add/update/move/delete/undo, board deletion), and the core app
flows (adding a task, searching, deleting with undo, moving a task).

## Deployment

**Frontend** — any static host works (it's a Vite app):

1. `npm run build` — outputs to `dist/`
2. Deploy `dist/` to [Vercel](https://vercel.com) or
   [Netlify](https://netlify.com) (both auto-detect Vite; just point them at
   this repo). If you're using the optional backend, set `VITE_API_URL` in
   the host's environment variables to your deployed API's URL.

**Backend** _(optional)_ — a plain Node/Express app, so it deploys to any
Node host with a persistent filesystem — [Render](https://render.com),
[Railway](https://railway.app), Fly.io, or a small VPS. See
[server/README.md](./server/README.md) for details.

Once deployed, put the live link at the top of this README under
[Live demo](#live-demo).

## React concepts demonstrated

- Components, composition, props, and children
- `useState`, `useEffect`, `useMemo`, `useReducer`, `useContext`
- A custom hook (`useTaskContext`) backed by a context + reducer, replacing
  prop drilling for shared state and mutations
- Controlled forms, conditional rendering, list rendering with `map()`
- Accessible drag-and-drop (pointer, touch, and keyboard sensors)
- TypeScript interfaces, union types, and discriminated unions (the reducer's
  action type)
- Client-server communication via `fetch`, with a graceful local-only fallback
- Automated testing (unit tests for pure logic, integration tests with RTL)

## Project structure

```text
src/
├── api/                  # fetch-based client for the optional backend
│   ├── boardsApi.ts
│   ├── client.ts
│   ├── config.ts
│   └── tasksApi.ts
├── components/
│   ├── Board.tsx
│   ├── BoardTabs.tsx
│   ├── Column.tsx
│   ├── ConfirmModal.tsx
│   ├── Header.tsx
│   ├── SearchBar.tsx
│   ├── TaskCard.tsx
│   ├── TaskForm.tsx
│   └── Toast.tsx
├── context/
│   └── TaskContext.tsx   # state, reducer, and all mutations
├── storage/
│   └── localStorage.ts
├── types/
│   ├── board.ts
│   └── task.ts
├── utils/
│   ├── dueDate.ts
│   ├── taskFilters.ts
│   └── taskSort.ts
├── App.tsx
└── main.tsx

server/                   # optional Express + JSON-file backend
```