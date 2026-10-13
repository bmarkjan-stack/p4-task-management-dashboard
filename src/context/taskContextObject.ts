import { createContext } from "react";

import type { Task, TaskStatus } from "../types/task";
import type { TaskState } from "./taskReducer";

export interface PendingDelete {
    task: Task;
}

export interface TaskContextValue extends TaskState {
    pendingDelete: PendingDelete | null;
    isSyncing: boolean;
    addTask: (data: Omit<Task, "id" | "createdAt">) => void;
    updateTask: (id: string, updates: Omit<Task, "id" | "createdAt">) => void;
    deleteTask: (id: string) => void;
    undoDeleteTask: () => void;
    moveTask: (id: string, status: TaskStatus) => void;
    setEditingTask: (task: Task | null) => void;
    cancelEdit: () => void;
    addBoard: (name: string) => void;
    deleteBoard: (id: string) => void;
    setActiveBoard: (id: string) => void;
}

// Shared by TaskProvider (TaskContext.tsx) and the useTaskContext hook.
export const TaskContext = createContext<TaskContextValue | null>(null);
