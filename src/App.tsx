import { useState } from "react";

import Header from "./components/Header";

import type { Task } from "./types/task";

const initialTasks: Task[] = [
    {
        id: "task-1",
        title: "Build portfolio website",
        description: "Create a responsive portfolio to showcase projects and certifications.",
        status: "todo",
        priority: "high",
        dueDate: "2026-08-28",
        createdAt: new Date().toISOString(),
    },
    {
        id: "task-2",
        title: "Weather API integration",
        description: "Connect the weather dashboard to a public weather API.",
        status: "in-progress",
        priority: "high",
        dueDate: "2026-08-24",
        createdAt: new Date().toISOString(),
    },
    {
        id: "task-3",
        title: "Create navigation component",
        description: "Build responsive navigation for the portfolio website.",
        status: "completed",
        priority: "medium",
        dueDate: "2026-08-18",
        createdAt: new Date().toISOString(),
    },
    {
        id: "task-4",
        title: "Database practice project",
        description: "Create a relational database project and document the schema.",
        status: "todo",
        priority: "medium",
        dueDate: "2026-09-01",
        createdAt: new Date().toISOString(),
    },
    {
        id: "task-5",
        title: "Python API project",
        description: "Build a small API project using Python.",
        status: "todo",
        priority: "low",
        dueDate: "2026-09-05",
        createdAt: new Date().toISOString(),
    },
];

function App() {
    const [tasks] = useState<Task[]>(() => {
        return initialTasks;
    });

    return (
        <div className="app">
            <Header taskCount={tasks.length} />
            <div className="container">
                <section className="welcome-section">
                    <div>
                        <p className="eyebrow">PROJECT</p>
                        <h2>Development Dashboard</h2>
                        <p>
                            Organize your development tasks and track
                            your progress.
                        </p>
                    </div>

                </section>
            </div>
        </div>
    );
}

export default App;