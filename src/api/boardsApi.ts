import type { Board } from "../types/board";
import { apiRequest } from "./client";

export function getBoards(): Promise<Board[]> {
    return apiRequest<Board[]>("/boards");
}

export function createBoard(board: Board): Promise<Board> {
    return apiRequest<Board>("/boards", {
        method: "POST",
        body: JSON.stringify(board),
    });
}

export function deleteBoard(id: string): Promise<void> {
    return apiRequest<void>(`/boards/${id}`, { method: "DELETE" });
}
