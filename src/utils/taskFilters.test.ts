import { describe, expect, it } from "vitest";
import { filterTasks } from "./taskFilters";
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
        boardId: "board-a",
        ...overrides,
    };
}

describe("filterTasks", () => {
    const tasks = [
        makeTask({
            id: "1",
            title: "Build portfolio",
            description: "Portfolio site",
            priority: "high",
            boardId: "board-a",
        }),
        makeTask({
            id: "2",
            title: "Write tests",
            description: "Add unit tests to the app",
            priority: "low",
            boardId: "board-a",
        }),
        makeTask({
            id: "3",
            title: "Ship it",
            description: "Deploy to production",
            priority: "high",
            boardId: "board-b",
        }),
    ];

    it("only returns tasks from the active board", () => {
        const result = filterTasks(tasks, {
            searchTerm: "",
            priorityFilter: "all",
            boardId: "board-a",
        });
        expect(result.map((t) => t.id)).toEqual(["1", "2"]);
    });

    it("matches search terms case-insensitively against title and description", () => {
        const result = filterTasks(tasks, {
            searchTerm: "UNIT",
            priorityFilter: "all",
            boardId: "board-a",
        });
        expect(result.map((t) => t.id)).toEqual(["2"]);
    });

    it("filters by priority", () => {
        const result = filterTasks(tasks, {
            searchTerm: "",
            priorityFilter: "high",
            boardId: "board-a",
        });
        expect(result.map((t) => t.id)).toEqual(["1"]);
    });

    it("combines search and priority filters", () => {
        const result = filterTasks(tasks, {
            searchTerm: "ship",
            priorityFilter: "high",
            boardId: "board-b",
        });
        expect(result.map((t) => t.id)).toEqual(["3"]);
    });
});
