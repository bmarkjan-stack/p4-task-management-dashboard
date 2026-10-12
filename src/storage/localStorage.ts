import type { Task } from "../types/task";
import type { Board } from "../types/board";

const STORAGE_KEY = "taskflow-state-v2";

export interface PersistedState {
    tasks: Task[];
    boards: Board[];
    activeBoardId: string;
}

/**
 * Reads the previously saved app state back out of localStorage.
 * Returns null if nothing is saved yet, storage is unavailable (private
 * browsing, disabled cookies, etc.), or the saved data is malformed.
 */
export function loadState():
    | (PersistedState & { editingTask: null })
    | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return null;
        }
        const parsed = JSON.parse(raw) as Partial<PersistedState>;
        if (!Array.isArray(parsed.tasks) || !Array.isArray(parsed.boards)) {
            return null;
        }
        return {
            tasks: parsed.tasks,
            boards: parsed.boards,
            activeBoardId: parsed.activeBoardId ?? parsed.boards[0]?.id ?? "",
            editingTask: null,
        };
    } catch {
        return null;
    }
}

export function saveState(state: PersistedState): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // Storage might be unavailable (private browsing, quota exceeded).
        // Losing persistence isn't fatal, so we fail silently here.
    }
}
