import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";
import { TaskProvider } from "./context/TaskContext";

function renderApp() {
    return render(
        <TaskProvider>
            <App />
        </TaskProvider>
    );
}

describe("App", () => {
    it("adds a new task to the To Do column", async () => {
        const user = userEvent.setup();
        renderApp();

        await user.type(
            screen.getByLabelText(/task title/i),
            "Write onboarding docs"
        );
        await user.click(screen.getByRole("button", { name: /add task/i }));

        const todoColumn = screen.getByText("To Do").closest("section");
        expect(todoColumn).not.toBeNull();
        expect(
            within(todoColumn as HTMLElement).getByText("Write onboarding docs")
        ).toBeInTheDocument();
    });

    it("filters tasks by search term", async () => {
        const user = userEvent.setup();
        renderApp();

        await user.type(screen.getByPlaceholderText(/search tasks/i), "weather");

        expect(screen.getByText("Weather API integration")).toBeInTheDocument();
        expect(
            screen.queryByText("Build portfolio website")
        ).not.toBeInTheDocument();
    });

    it("deletes a task optimistically and offers an undo", async () => {
        const user = userEvent.setup();
        renderApp();

        await user.click(
            screen.getByRole("button", { name: /delete build portfolio website/i })
        );

        expect(
            screen.queryByText("Build portfolio website")
        ).not.toBeInTheDocument();
        expect(screen.getByRole("status")).toHaveTextContent(/deleted/i);

        await user.click(screen.getByRole("button", { name: /undo/i }));
        expect(screen.getByText("Build portfolio website")).toBeInTheDocument();
    });

    it("moves a task to a new column via its Move to menu", async () => {
        const user = userEvent.setup();
        renderApp();

        const select = screen.getByRole("combobox", {
            name: /move build portfolio website/i,
        });
        await user.selectOptions(select, "In Progress");

        const inProgressColumn = screen.getByText("In Progress").closest("section");
        expect(inProgressColumn).not.toBeNull();
        expect(
            within(inProgressColumn as HTMLElement).getByText(
                "Build portfolio website"
            )
        ).toBeInTheDocument();
    });
});
