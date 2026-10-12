import type { Task } from "../types/task";

export interface TaskFilterOptions {
    searchTerm: string;
    priorityFilter: string;
    boardId: string;
}

/**
 * Extracted from App.tsx so the search/filter logic can be unit tested
 * independently of any rendering.
 */
export function filterTasks(
    tasks: Task[],
    { searchTerm, priorityFilter, boardId }: TaskFilterOptions
): Task[] {
    const normalizedSearch = searchTerm.toLowerCase().trim();

    return tasks.filter((task) => {
        if (task.boardId !== boardId) {
            return false;
        }

        const matchesSearch =
            normalizedSearch === "" ||
            task.title.toLowerCase().includes(normalizedSearch) ||
            task.description.toLowerCase().includes(normalizedSearch);

        const matchesPriority =
            priorityFilter === "all" || task.priority === priorityFilter;

        return matchesSearch && matchesPriority;
    });
}
