# TaskFlow — Task Management Dashboard

A responsive task management dashboard built with React, TypeScript, and Vite.

The application is inspired by project management tools such as Trello and Jira and allows users to create, organize, search, edit, delete, and move tasks between workflow stages.

## Features

- Create tasks
- Edit tasks
- Delete tasks
- Drag and drop tasks between columns
- To Do column
- In Progress column
- Completed column
- High, medium, and low priority levels
- Task due dates
- Task descriptions
- Search tasks
- Filter tasks by priority
- Persistent data using LocalStorage
- Project completion percentage
- Responsive design
- Empty-state messages
- Form validation
- Confirmation before deleting tasks

## React Concepts Demonstrated

This project demonstrates:

- React components
- Component composition
- Props
- State
- useState
- useEffect
- useMemo
- Forms
- Controlled inputs
- Event handling
- Conditional rendering
- Rendering lists with map()
- Drag and drop events
- LocalStorage
- TypeScript interfaces
- TypeScript union types

## Technologies

- React
- TypeScript
- Vite
- CSS
- Lucide React
- Browser LocalStorage API
- HTML5 Drag and Drop API

## Project Structure

```text
src/
├── components/
│   ├── Board.tsx
│   ├── Column.tsx
│   ├── Header.tsx
│   ├── SearchBar.tsx
│   ├── TaskCard.tsx
│   └── TaskForm.tsx
├── types/
│   └── task.ts
├── App.tsx
├── main.tsx
└── styles.css