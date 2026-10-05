export type DueStatus = "overdue" | "due-soon" | "normal" | "none";

/**
 * Classifies a task's due date relative to a reference date (defaults to
 * "now"). Tasks due within the next two days (including today) are flagged
 * "due-soon"; anything in the past is "overdue".
 */
export function getDueStatus(
    dueDate: string,
    referenceDate: Date = new Date()
): DueStatus {
    if (!dueDate) {
        return "none";
    }

    const due = new Date(`${dueDate}T00:00:00`);
    const today = new Date(
        referenceDate.getFullYear(),
        referenceDate.getMonth(),
        referenceDate.getDate()
    );

    const msPerDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round((due.getTime() - today.getTime()) / msPerDay);

    if (diffDays < 0) {
        return "overdue";
    }
    if (diffDays <= 2) {
        return "due-soon";
    }
    return "normal";
}