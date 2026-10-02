import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    useReducer,
} from "react";
import type { ReactNode } from "react";

import type { Task, TaskStatus } from "../types/task";
import type { Board } from "../types/board";

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

interface TaskState {
    tasks: Task[];
    boards: Board[];
    activeBoardId: string;
    editingTask: Task | null;
}

type Action =
    | { type: "LOAD"; tasks: Task[]; boards: Board[] }
    | { type: "ADD_TASK"; task: Task }
    | {
          type: "UPDATE_TASK";
          id: string;
          updates: Omit<Task, "id" | "createdAt">;
      }
    | { type: "REMOVE_TASK"; id: string }
    | { type: "RESTORE_TASK"; task: Task }
    | { type: "MOVE_TASK"; id: string; status: TaskStatus }
    | { type: "ADD_BOARD"; board: Board }
    | { type: "REMOVE_BOARD"; id: string }
    | { type: "SET_ACTIVE_BOARD"; id: string }
    | { type: "SET_EDITING_TASK"; task: Task | null };

// Exported (rather than kept private) so it can be unit tested in isolation
// from React — see src/context/TaskContext.test.ts.
export function taskReducer(state: TaskState, action: Action): TaskState {
    switch (action.type) {
        case "LOAD":
            return { ...state, tasks: action.tasks, boards: action.boards };

        case "ADD_TASK":
            return { ...state, tasks: [...state.tasks, action.task] };

        case "UPDATE_TASK":
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task.id === action.id ? { ...task, ...action.updates } : task
                ),
                editingTask: null,
            };

        case "REMOVE_TASK":
            return {
                ...state,
                tasks: state.tasks.filter((task) => task.id !== action.id),
                editingTask:
                    state.editingTask?.id === action.id ? null : state.editingTask,
            };

        case "RESTORE_TASK":
            return { ...state, tasks: [...state.tasks, action.task] };

        case "MOVE_TASK":
            return {
                ...state,
                tasks: state.tasks.map((task) =>
                    task.id === action.id
                        ? { ...task, status: action.status }
                        : task
                ),
            };

        case "ADD_BOARD":
            return {
                ...state,
                boards: [...state.boards, action.board],
                activeBoardId: action.board.id,
            };

        case "REMOVE_BOARD": {
            const fallbackBoard = state.boards.find(
                (board) => board.id !== action.id
            );
            return {
                ...state,
                boards: state.boards.filter((board) => board.id !== action.id),
                tasks: state.tasks.filter((task) => task.boardId !== action.id),
                activeBoardId:
                    state.activeBoardId === action.id
                        ? fallbackBoard?.id ?? ""
                        : state.activeBoardId,
            };
        }

        case "SET_ACTIVE_BOARD":
            return { ...state, activeBoardId: action.id };

        case "SET_EDITING_TASK":
            return { ...state, editingTask: action.task };

        default:
            return state;
    }
}

interface PendingDelete {
    task: Task;
}

interface TaskContextValue extends TaskState {
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

const TaskContext = createContext<TaskContextValue | null>(null);

function initState(): TaskState {
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
    }, [state.tasks, state.boards, state.activeBoardId]);

    // Optional: hydrate from a backend if VITE_API_URL is configured. Falls
    // back to whatever was loaded from localStorage if the API is unreachable.
    useEffect(() => {
        Promise.all([ ])
            .catch((error: unknown) => {
                console.warn(
                    "Could not reach the TaskFlow API, staying in local mode.",
                    error
                );
            })
            .finally(() => setIsSyncing(false));
    }, []);

    function finalizeDelete() {
        setPendingDelete(null);
        undoTimer.current = null;
    }

    function addTask(data: Omit<Task, "id" | "createdAt">) {
        const newTask: Task = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };
        dispatch({ type: "ADD_TASK", task: newTask });
    }

    function updateTask(id: string, updates: Omit<Task, "id" | "createdAt">) {
        dispatch({ type: "UPDATE_TASK", id, updates });
    }

    function moveTask(id: string, status: TaskStatus) {
        dispatch({ type: "MOVE_TASK", id, status });
    }

    function deleteTask(id: string) {
        const task = state.tasks.find((candidate) => candidate.id === id);
        if (!task) {
            return;
        }

        // Only one "undo" toast at a time — finalize any prior pending delete.
        if (pendingDelete && undoTimer.current) {
            window.clearTimeout(undoTimer.current);
            finalizeDelete();
        }

        dispatch({ type: "REMOVE_TASK", id });
        setPendingDelete({ task });
        undoTimer.current = window.setTimeout(
            () => finalizeDelete(),
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
    }

    function deleteBoard(id: string) {
        // Always keep at least one board around.
        if (state.boards.length <= 1) {
            return;
        }
        dispatch({ type: "REMOVE_BOARD", id });
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

export function useTaskContext(): TaskContextValue {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error("useTaskContext must be used within a TaskProvider");
    }
    return context;
}
