import type { Task, TaskStatus } from "../types/task";
import { apiRequest } from "./client";

export function getTasks(): Promise<Task[]> {
    return apiRequest<Task[]>("/tasks");
}

export function createTask(task: Task): Promise<Task> {
    return apiRequest<Task>("/tasks", {
        method: "POST",
        body: JSON.stringify(task),
    });
}

export function updateTask(
    id: string,
    updates: Omit<Task, "id" | "createdAt">
): Promise<Task> {
    return apiRequest<Task>(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
    });
}

export function updateTaskStatus(
    id: string,
    status: TaskStatus
): Promise<Task> {
    return apiRequest<Task>(`/tasks/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });
}

export function deleteTask(id: string): Promise<void> {
    return apiRequest<void>(`/tasks/${id}`, { method: "DELETE" });
}
