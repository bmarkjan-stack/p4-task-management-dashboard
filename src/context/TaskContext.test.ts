import { describe, expect, it } from "vitest";
import { taskReducer } from "./TaskContext";
import type { Task } from "../types/task";
import type { Board } from "../types/board";

const board: Board = {
    id: "board-1",
    name: "Board 1",
    createdAt: "2026-01-01T00:00:00.000Z",
};

const task: Task = {
    id: "task-1",
    title: "Sample task",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
    createdAt: "2026-01-01T00:00:00.000Z",
    boardId: board.id,
};

const initialState = {
    tasks: [task],
    boards: [board],
    activeBoardId: board.id,
    editingTask: null,
};

describe("taskReducer", () => {
    it("adds a task", () => {
        const newTask: Task = { ...task, id: "task-2", title: "Another task" };
        const state = taskReducer(initialState, { type: "ADD_TASK", task: newTask });
        expect(state.tasks).toHaveLength(2);
        expect(state.tasks[1].title).toBe("Another task");
    });

    it("updates a task and clears editingTask", () => {
        const editingState = { ...initialState, editingTask: task };
        const state = taskReducer(editingState, {
            type: "UPDATE_TASK",
            id: task.id,
            updates: {
                title: "Updated title",
                description: task.description,
                status: task.status,
                priority: task.priority,
                dueDate: task.dueDate,
                boardId: task.boardId,
            },
        });
        expect(state.tasks[0].title).toBe("Updated title");
        expect(state.editingTask).toBeNull();
    });

    it("moves a task to a new status", () => {
        const state = taskReducer(initialState, {
            type: "MOVE_TASK",
            id: task.id,
            status: "in-progress",
        });
        expect(state.tasks[0].status).toBe("in-progress");
    });

    it("removes a task, clearing editingTask if it was the one deleted", () => {
        const editingState = { ...initialState, editingTask: task };
        const state = taskReducer(editingState, {
            type: "REMOVE_TASK",
            id: task.id,
        });
        expect(state.tasks).toHaveLength(0);
        expect(state.editingTask).toBeNull();
    });

    it("restores a task (undo)", () => {
        const empty = { ...initialState, tasks: [] };
        const state = taskReducer(empty, { type: "RESTORE_TASK", task });
        expect(state.tasks).toEqual([task]);
    });

    it("removing a board also removes its tasks and reassigns the active board", () => {
        const secondBoard: Board = {
            id: "board-2",
            name: "Board 2",
            createdAt: "2026-01-02T00:00:00.000Z",
        };
        const state = taskReducer(
            { ...initialState, boards: [board, secondBoard] },
            { type: "REMOVE_BOARD", id: board.id }
        );
        expect(state.boards).toEqual([secondBoard]);
        expect(state.tasks).toHaveLength(0);
        expect(state.activeBoardId).toBe(secondBoard.id);
    });
});
