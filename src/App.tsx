import { useMemo, useState } from "react";
import type { DragEvent } from "react";

import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import Board from "./components/Board";
import SearchBar from "./components/SearchBar";

import type { Task, TaskStatus } from "./types/task";

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
    const [tasks, setTasks] = useState<Task[]>(() => {
        return initialTasks;
    });

    const [editingTask, setEditingTask] =
        useState<Task | null>(null);

    function addTask(
        taskData: Omit<Task, "id" | "createdAt">
    ) {
        const newTask: Task = {
            ...taskData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };

        setTasks((currentTasks) => [
            ...currentTasks,
            newTask,
        ]);
    }

    function updateTask(
        id: string,
        updates: Omit<Task, "id" | "createdAt">
    ) {
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === id
                    ? {
                        ...task,
                        ...updates,
                    }
                    : task
            )
        );
        setEditingTask(null);
    }

    function deleteTask(id: string) {
        const taskToDelete = tasks.find(
            (task) => task.id === id
        );
        if (!taskToDelete) {
            return;
        }
        const confirmed = window.confirm(
            `Delete "${taskToDelete.title}"?`
        );
        if (!confirmed) {
            return;
        }
        setTasks((currentTasks) =>
            currentTasks.filter((task) => task.id !== id)
        );
        if (editingTask?.id === id) {
        setEditingTask(null);
        }
    }

    function handleDrop(
        event: DragEvent<HTMLElement>,
        status: TaskStatus
    ) {
        event.preventDefault();
        const taskId = event.dataTransfer.getData("taskId");
        if (!taskId) {
            return;
        }
        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === taskId
                    ? {
                        ...task,
                        status,
                    }
                    : task
            )
        );
    }

    const [searchTerm, setSearchTerm] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("all");

    const filteredTasks = useMemo(() => {
        const normalizedSearch = searchTerm
            .toLowerCase()
            .trim();
        return tasks.filter((task) => {
            const matchesSearch =
                normalizedSearch === "" ||
                    task.title
                        .toLowerCase()
                        .includes(normalizedSearch) ||
                    task.description
                        .toLowerCase()
                        .includes(normalizedSearch);

            const matchesPriority =
                priorityFilter === "all" ||
                    task.priority === priorityFilter;
        return matchesSearch && matchesPriority;
        });
    }, [tasks, searchTerm, priorityFilter]);

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

                <SearchBar
                    searchTerm={searchTerm}
                    priorityFilter={priorityFilter}
                    onSearchChange={setSearchTerm}
                    onPriorityChange={setPriorityFilter}
                    onClear={() => setSearchTerm("")}
                />

                <TaskForm
                    editingTask={editingTask}
                    onAddTask={addTask}
                    onUpdateTask={updateTask}
                    onCancelEdit={() => setEditingTask(null)}
                />

                <section className="board-section">
                    <div className="board-heading">
                        <div>
                            <h2>Project Tasks</h2>
                            <p>
                                {filteredTasks.length} of {tasks.length}{" "}
                                tasks displayed
                            </p>
                        </div>
                    </div>

                    <Board
                        tasks={filteredTasks}
                        onEdit={setEditingTask}
                        onDelete={deleteTask}
                        onDrop={handleDrop}
                    />
                </section>
            </div>
        </div>
    );
}

export default App;