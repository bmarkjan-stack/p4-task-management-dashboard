import { describe, expect, it } from "vitest";
import { sortTasks } from "./taskSort";
import type { Task } from "../types/task";

function makeTask(overrides: Partial<Task>): Task {
    return {
        id: "id",
        title: "title",
        description: "",
        status: "todo",
        priority: "medium",
        dueDate: "",
        createdAt: "2026-01-01T00:00:00.000Z",
        boardId: "board-default",
        ...overrides,
    };
}

describe("sortTasks", () => {
    const tasks = [
        makeTask({
            id: "a",
            priority: "low",
            dueDate: "2026-09-25",
            createdAt: "2026-01-03T00:00:00.000Z",
        }),
        makeTask({
            id: "b",
            priority: "high",
            dueDate: "2026-09-20",
            createdAt: "2026-01-01T00:00:00.000Z",
        }),
        makeTask({
            id: "c",
            priority: "medium",
            dueDate: "",
            createdAt: "2026-01-02T00:00:00.000Z",
        }),
    ];

    it("leaves the order untouched for 'manual'", () => {
        expect(sortTasks(tasks, "manual").map((t) => t.id)).toEqual([
            "a",
            "b",
            "c",
        ]);
    });

    it("sorts by due date, pushing tasks without one to the end", () => {
        expect(sortTasks(tasks, "dueDate").map((t) => t.id)).toEqual([
            "b",
            "a",
            "c",
        ]);
    });

    it("sorts by priority, high first", () => {
        expect(sortTasks(tasks, "priority").map((t) => t.id)).toEqual([
            "b",
            "c",
            "a",
        ]);
    });

    it("sorts by creation date, oldest first", () => {
        expect(sortTasks(tasks, "createdAt").map((t) => t.id)).toEqual([
            "b",
            "c",
            "a",
        ]);
    });

    it("does not mutate the original array", () => {
        const copy = [...tasks];
        sortTasks(tasks, "priority");
        expect(tasks).toEqual(copy);
    });
});
