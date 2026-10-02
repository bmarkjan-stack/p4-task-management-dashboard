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

const DEFAULT_BOARD_ID = "board-default";
const UNDO_WINDOW_MS = 5000;


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
    },
    {
        id: "task-2",
        title: "Weather API integration",
        description: "Connect the weather dashboard to a public weather API.",
        status: "in-progress",
        priority: "high",
        dueDate: "2026-08-24",
        createdAt: new Date().toISOString(),
    },
    {
        id: "task-3",
        title: "Create navigation component",
        description: "Build responsive navigation for the portfolio website.",
        status: "completed",
        priority: "medium",
        dueDate: "2026-08-18",
        createdAt: new Date().toISOString(),
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
    },
    {
        id: "task-5",
        title: "Python API project",
        description: "Build a small API project using Python.",
        status: "todo",
        priority: "low",
        dueDate: "2026-09-05",
        createdAt: new Date().toISOString(),
    },
];

interface TaskState {
    tasks: Task[];
    activeBoardId: string;
    editingTask: Task | null;
}

type Action =
    | { type: "LOAD"; tasks: Task[]; }
    | { type: "ADD_TASK"; task: Task }
    | {
          type: "UPDATE_TASK";
          id: string;
          updates: Omit<Task, "id" | "createdAt">;
      }
    | { type: "REMOVE_TASK"; id: string }
    | { type: "RESTORE_TASK"; task: Task }
    | { type: "MOVE_TASK"; id: string; status: TaskStatus }
    | { type: "REMOVE_BOARD"; id: string }
    | { type: "SET_ACTIVE_BOARD"; id: string }
    | { type: "SET_EDITING_TASK"; task: Task | null };

// Exported (rather than kept private) so it can be unit tested in isolation
// from React — see src/context/TaskContext.test.ts.
export function taskReducer(state: TaskState, action: Action): TaskState {
    switch (action.type) {
        case "LOAD":
            return { ...state, tasks: action.tasks,};

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
        activeBoardId: DEFAULT_BOARD_ID,
        editingTask: null,
    };
}

export function TaskProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(taskReducer, undefined, initState);
    const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(
        null
    );
    const [isSyncing ] = useState(false);
    const undoTimer = useRef<number | null>(null);

    useEffect(() => {
    }, [state.tasks, state.activeBoardId]);

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
    }

    function deleteBoard(id: string) {
        // Always keep at least one board around.
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
