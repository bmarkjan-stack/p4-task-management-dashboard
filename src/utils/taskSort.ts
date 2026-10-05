import type { Task } from "../types/task";

export type SortOption = "manual" | "dueDate" | "priority" | "createdAt";

const PRIORITY_WEIGHT: Record<Task["priority"], number> = {
    high: 0,
    medium: 1,
    low: 2,
};

/**
 * Returns a new, sorted array — the input array is never mutated.
 * "manual" preserves whatever order the tasks were already in.
 */
export function sortTasks(tasks: Task[], sortBy: SortOption): Task[] {
    if (sortBy === "manual") {
        return tasks;
    }

    const sorted = [...tasks];

    switch (sortBy) {
        case "dueDate":
            sorted.sort((a, b) => {
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return a.dueDate.localeCompare(b.dueDate);
            });
            break;
        case "priority":
            sorted.sort(
                (a, b) => PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]
            );
            break;
        case "createdAt":
            sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
            break;
    }

    return sorted;
}
