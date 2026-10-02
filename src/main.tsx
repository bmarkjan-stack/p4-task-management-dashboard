import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { TaskProvider } from "./context/TaskContext";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <TaskProvider>
            <App />
        </TaskProvider>
    </StrictMode>
);