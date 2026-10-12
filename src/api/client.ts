import { API_URL } from "./config";

export async function apiRequest<T>(
    path: string,
    options?: RequestInit
): Promise<T> {
    if (!API_URL) {
        throw new Error("API_URL is not configured.");
    }

    const response = await fetch(`${API_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    if (!response.ok) {
        throw new Error(
            `Request to ${path} failed with status ${response.status}`
        );
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return (await response.json()) as T;
}
