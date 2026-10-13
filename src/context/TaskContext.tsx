import { useEffect, useRef, useState, useReducer } from "react";
import type { ReactNode } from "react";

import type { Task, TaskStatus } from "../types/task";
import type { Board } from "../types/board";
import { loadState, saveState } from "../storage/localStorage";
import { USE_API } from "../api/config";
import * as tasksApi from "../api/tasksApi";
import * as boardsApi from "../api/boardsApi";
import { taskReducer } from "./taskReducer";
import type { TaskState } from "./taskReducer";
import { TaskContext } from "./taskContextObject";
import type {
    PendingDelete,
    TaskContextValue,
} from "./taskContextObject";

const DEFAULT_BOARD_ID = "board-default";
const UNDO_WINDOW_MS = 5000;

const defaultBoards: Board[] = [
    {
        id: DEFAULT_BOARD_ID,
        name: "My Board",
        createdAt: new Date().toISOString(),
    },
];

const defaultTasks: Task[] = [
    {
        id: "task-1",
        title: "Build portfolio website",
        description:
            "Create a responsive portfolio to showcase projects and certifications.",
        status: "todo",
        priority: "high",
        dueDate: "2026-08-28",
        createdAt: new Date().toISOString(),
        boardId: DEFAULT_BOARD_ID,
    },
    {
        id: "task-2",
        title: "Weather API integration",
        description: "Connect the weather dashboard to a public weather API.",
        status: "in-progress",
        priority: "high",
        dueDate: "2026-08-24",
        createdAt: new Date().toISOString(),
        boardId: DEFAULT_BOARD_ID,
    },
    {
        id: "task-3",
        title: "Create navigation component",
        description: "Build responsive navigation for the portfolio website.",
        status: "completed",
        priority: "medium",
        dueDate: "2026-08-18",
        createdAt: new Date().toISOString(),
        boardId: DEFAULT_BOARD_ID,
    },
    {
        id: "task-4",
        title: "Database practice project",
        description:
            "Create a relational database project and document the schema.",
        status: "todo",
        priority: "medium",
        dueDate: "2026-09-01",
        createdAt: new Date().toISOString(),
        boardId: DEFAULT_BOARD_ID,
    },
    {
        id: "task-5",
        title: "Python API project",
        description: "Build a small API project using Python.",
        status: "todo",
        priority: "low",
        dueDate: "2026-09-05",
        createdAt: new Date().toISOString(),
        boardId: DEFAULT_BOARD_ID,
    },
];

function initState(): TaskState {
    const saved = loadState();
    if (saved) {
        return saved;
    }
    return {
        tasks: defaultTasks,
        boards: defaultBoards,
        activeBoardId: DEFAULT_BOARD_ID,
        editingTask: null,
    };
}

export function TaskProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(taskReducer, undefined, initState);
    const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(
        null
    );
    const [isSyncing, setIsSyncing] = useState(false);
    const undoTimer = useRef<number | null>(null);

    // Mirror every change to localStorage. This is the sole source of truth
    // in local-only mode, and doubles as an offline cache in API mode.
    useEffect(() => {
        saveState({
            tasks: state.tasks,
            boards: state.boards,
            activeBoardId: state.activeBoardId,
        });
    }, [state.tasks, state.boards, state.activeBoardId]);

    // Optional: hydrate from a backend if VITE_API_URL is configured. Falls
    // back to whatever was loaded from localStorage if the API is unreachable.
    useEffect(() => {
        if (!USE_API) {
            return;
        }
        Promise.all([boardsApi.getBoards(), tasksApi.getTasks()])
            .then(([boards, tasks]) => {
                if (boards.length > 0) {
                    dispatch({ type: "LOAD", tasks, boards });
                }
            })
            .catch((error: unknown) => {
                console.warn(
                    "Could not reach the TaskFlow API, staying in local mode.",
                    error
                );
            })
            .finally(() => setIsSyncing(false));
    }, []);

    function finalizeDelete(id: string) {
        setPendingDelete(null);
        undoTimer.current = null;
        if (USE_API) {
            tasksApi
                .deleteTask(id)
                .catch((error: unknown) => console.warn("Sync failed:", error));
        }
    }

    function addTask(data: Omit<Task, "id" | "createdAt">) {
        const newTask: Task = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };
        dispatch({ type: "ADD_TASK", task: newTask });
        if (USE_API) {
            tasksApi
                .createTask(newTask)
                .catch((error: unknown) => console.warn("Sync failed:", error));
        }
    }

    function updateTask(id: string, updates: Omit<Task, "id" | "createdAt">) {
        dispatch({ type: "UPDATE_TASK", id, updates });
        if (USE_API) {
            tasksApi
                .updateTask(id, updates)
                .catch((error: unknown) => console.warn("Sync failed:", error));
        }
    }

    function moveTask(id: string, status: TaskStatus) {
        dispatch({ type: "MOVE_TASK", id, status });
        if (USE_API) {
            tasksApi
                .updateTaskStatus(id, status)
                .catch((error: unknown) => console.warn("Sync failed:", error));
        }
    }

    function deleteTask(id: string) {
        const task = state.tasks.find((candidate) => candidate.id === id);
        if (!task) {
            return;
        }

        // Only one "undo" toast at a time — finalize any prior pending delete.
        if (pendingDelete && undoTimer.current) {
            window.clearTimeout(undoTimer.current);
            finalizeDelete(pendingDelete.task.id);
        }

        dispatch({ type: "REMOVE_TASK", id });
        setPendingDelete({ task });
        undoTimer.current = window.setTimeout(
            () => finalizeDelete(task.id),
            UNDO_WINDOW_MS
        );
    }

    function undoDeleteTask() {
        if (!pendingDelete) {
            return;
        }
        if (undoTimer.current) {
            window.clearTimeout(undoTimer.current);
            undoTimer.current = null;
        }
        dispatch({ type: "RESTORE_TASK", task: pendingDelete.task });
        setPendingDelete(null);
    }

    function addBoard(name: string) {
        const trimmed = name.trim();
        if (!trimmed) {
            return;
        }
        const board: Board = {
            id: crypto.randomUUID(),
            name: trimmed,
            createdAt: new Date().toISOString(),
        };
        dispatch({ type: "ADD_BOARD", board });
        if (USE_API) {
            boardsApi
                .createBoard(board)
                .catch((error: unknown) => console.warn("Sync failed:", error));
        }
    }

    function deleteBoard(id: string) {
        // Always keep at least one board around.
        if (state.boards.length <= 1) {
            return;
        }
        dispatch({ type: "REMOVE_BOARD", id });
        if (USE_API) {
            boardsApi
                .deleteBoard(id)
                .catch((error: unknown) => console.warn("Sync failed:", error));
        }
    }

    function setActiveBoard(id: string) {
        dispatch({ type: "SET_ACTIVE_BOARD", id });
    }

    function setEditingTask(task: Task | null) {
        dispatch({ type: "SET_EDITING_TASK", task });
    }

    function cancelEdit() {
        dispatch({ type: "SET_EDITING_TASK", task: null });
    }

    const value: TaskContextValue = {
        ...state,
        pendingDelete,
        isSyncing,
        addTask,
        updateTask,
        deleteTask,
        undoDeleteTask,
        moveTask,
        setEditingTask,
        cancelEdit,
        addBoard,
        deleteBoard,
        setActiveBoard,
    };

    return (
        <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
    );
}