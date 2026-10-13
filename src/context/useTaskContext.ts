import { useContext } from "react";

import { TaskContext, type TaskContextValue } from "./taskContextObject";

export function useTaskContext(): TaskContextValue {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error("useTaskContext must be used within a TaskProvider");
    }
    return context;
}
