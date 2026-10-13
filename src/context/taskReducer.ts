import type { Task, TaskStatus } from "../types/task";
import type { Board } from "../types/board";

export interface TaskState {
    tasks: Task[];
    boards: Board[];
    activeBoardId: string;
    editingTask: Task | null;
}

export type Action =
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

// Kept in its own module (rather than inside TaskContext.tsx) so it can be
// unit tested in isolation from React — see src/context/TaskContext.test.ts.
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
