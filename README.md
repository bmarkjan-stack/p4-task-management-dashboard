# TaskFlow — Task Management Dashboard

A responsive task management dashboard built with React, TypeScript, and Vite, inspired by tools like Trello and Jira. Organize tasks across boards, move them through To Do, In Progress, and Completed, and search, filter, and sort as the list grows.

It runs fully in the browser with no backend. An optional Express API adds shared, persistent storage.

![TaskFlow live demo](live-demo/task-management-dashboard-live-demo.gif)

---

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [Running the Backend (Optional)](#running-the-backend-optional)
- [Environment Variables](#environment-variables)
- [How It Works](#how-it-works)
- [Testing](#testing)
- [Deployment](#deployment)
- [React Concepts Demonstrated](#react-concepts-demonstrated)
- [Project Structure](#project-structure)
- [Author](#author)

---

## Features

**Boards**

- Create, switch between, and delete boards
- Deleting a board also deletes its tasks, after a confirmation dialog

**Tasks**

- Create, edit, and delete tasks, with form validation
- Priority levels: high, medium, and low
- Due dates, with **Overdue** and **Due soon** badges on cards (due within the next two days). Completed tasks are never flagged.
- **Optimistic delete** with a 5-second **Undo** toast

**Board views**

- Three columns: **To Do**, **In Progress**, and **Completed**
- Drag and drop between columns with a mouse, touch, or keyboard (via [@dnd-kit](https://dndkit.com/))
- A **Move to** menu on every card, as an accessible alternative to dragging
- Sort by due date, priority, creation date, or manual order
- Search tasks, and filter by priority
- A completion percentage for each board

**Storage and UX**

- Data persists in `localStorage` by default
- Optional backend for shared, persistent storage
- Empty-state messages and a responsive layout for phones, tablets, and desktops

---

## Technologies

- **React 19** and **TypeScript**, built with **Vite**
- **@dnd-kit** for accessible drag and drop
- **Lucide React** for icons
- **Vitest** and **React Testing Library** for tests
- Optional backend: **Node.js**, **Express**, and a JSON file on disk (see [`server/`](./server))

---

## Getting Started

**Requirements:** a current Node.js LTS release and npm.

```bash
npm install
npm run dev
```

Open the local URL that Vite prints. The app runs client-side, and your data stays in the browser.

---

## Running the Backend (Optional)

To store data on a server instead of in the browser, run the included API and point the frontend at it.

```bash
# Terminal 1: the API
cd server
npm install
npm run dev              # http://localhost:4000

# Terminal 2: the frontend
cp .env.example .env     # sets VITE_API_URL=http://localhost:4000/api
npm run dev
```

When `VITE_API_URL` is set, the app loads and saves boards and tasks through the API. See [server/README.md](./server/README.md) for the endpoints.

---

## Environment Variables

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_API_URL` | _(unset)_ | Base URL of a running TaskFlow API. Leave it unset to run fully in the browser. |

The variable is read at build time by Vite. Put it in `.env` (copy `.env.example`) or in your host's environment settings.

---

## How It Works

**State.** `TaskContext` holds all boards and tasks in a `useReducer`. Components read the state and call actions through the `useTaskContext` hook, so no props are passed down through several levels.

**Persistence.**

- **Local mode (default):** the full state is saved to `localStorage` under the key `taskflow-state-v2` on every change. If the saved data is missing or malformed, the app starts with a fresh board. If storage is unavailable, such as in private browsing, the app keeps working without saving.
- **API mode:** when `VITE_API_URL` is set, each change is sent to the server. The server stores everything in `server/data/db.json`.

**Undo.** Deleting a task removes it from the screen at once. The task is restored if you press **Undo** within 5 seconds. After that, the deletion is final.

**Due dates.** `getDueStatus()` compares a task's due date with today's date and returns one of four states: `overdue`, `due-soon` (today, tomorrow, or the day after), `normal`, or `none`.

---

## Testing

```bash
npm run test             # run once
npm run test:watch       # watch mode
npm run test:coverage    # with coverage
```

The suite covers:

- **Utilities:** search and priority filtering, all four sort orders, and the due-date classifier
- **Reducer:** add, update, move, delete, restore (undo), and board deletion, including reassigning the active board
- **App flows (React Testing Library):** adding a task, searching, deleting with undo, and moving a task with the Move to menu

---

## Deployment

**Frontend.** Any static host works, because this is a Vite app.

1. Run `npm run build`. The output goes to `dist/`.
2. Deploy the project to [Vercel](https://vercel.com) or [Netlify](https://netlify.com). Both detect Vite automatically.
3. If you use the backend, set `VITE_API_URL` to your deployed API's address in the host's environment settings. Vite reads it at build time, so rebuild after changing it.

**Backend (optional).** The API is a plain Node and Express app. It runs on any Node host that has a persistent filesystem, such as [Render](https://render.com), [Railway](https://railway.app), Fly.io, or a small VPS. Serverless platforms usually don't keep local files between requests, so they need a real database instead of `db.json`. See [server/README.md](./server/README.md).

---

## React Concepts Demonstrated

- Components, composition, props, and children
- `useState`, `useEffect`, `useMemo`, `useReducer`, and `useContext`
- A custom hook (`useTaskContext`) backed by a context and a reducer
- Controlled forms, conditional rendering, and lists rendered with `map()`
- Accessible drag and drop with pointer, touch, and keyboard sensors
- TypeScript interfaces, union types, and a discriminated-union action type for the reducer
- Client-server communication with `fetch`, and a fallback to local-only mode
- Testing pure logic with unit tests, and user flows with integration tests

---

## Project Structure

```text
task-management-dashboard/
├── src/
│   ├── api/                  # fetch-based client for the optional backend
│   │   ├── boardsApi.ts
│   │   ├── client.ts
│   │   ├── config.ts         # reads VITE_API_URL
│   │   └── tasksApi.ts
│   ├── components/
│   │   ├── Board.tsx         # the three status columns
│   │   ├── BoardTabs.tsx     # switch, create, and delete boards
│   │   ├── Column.tsx
│   │   ├── ConfirmModal.tsx
│   │   ├── Header.tsx
│   │   ├── SearchBar.tsx
│   │   ├── TaskCard.tsx
│   │   ├── TaskForm.tsx
│   │   └── Toast.tsx         # the undo toast
│   ├── context/
│   │   ├── TaskContext.tsx   # provider: state, persistence, and mutations
│   │   ├── taskReducer.ts    # reducer and action types
│   │   ├── taskContextObject.ts
│   │   └── useTaskContext.ts
│   ├── storage/
│   │   └── localStorage.ts
│   ├── types/
│   │   ├── board.ts
│   │   └── task.ts
│   ├── utils/
│   │   ├── dueDate.ts
│   │   ├── taskFilters.ts
│   │   └── taskSort.ts
│   ├── App.tsx
│   └── main.tsx
├── server/                   # optional Express API backed by a JSON file
│   ├── routes/
│   │   ├── boards.js
│   │   └── tasks.js
│   ├── data/db.json          # sample data
│   ├── db.js                 # read and write the JSON file
│   └── index.js
├── live-demo/                # demo recording used in this README
├── .env.example
├── package.json
├── vite.config.ts
└── vitest.config.ts
```

---

## Author

- GitHub: https://github.com/bmarkjan-stack
- Repository: https://github.com/bmarkjan-stack/p4-task-management-dashboard