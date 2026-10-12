import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Runs after every test: unmounts anything RTL rendered and clears
// localStorage so state doesn't leak between tests (TaskProvider persists
// to localStorage on every change).
afterEach(() => {
    cleanup();
    localStorage.clear();
});
