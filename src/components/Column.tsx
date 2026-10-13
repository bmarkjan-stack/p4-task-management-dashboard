import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";

import type { Task, TaskStatus } from "../types/task";
import type { SortOption } from "../utils/taskSort";
import { sortTasks } from "../utils/taskSort";
import TaskCard from "./TaskCard";

interface ColumnProps {
    title: string;
    status: TaskStatus;
    tasks: Task[];
    icon: ReactNode;
    sortBy: SortOption;
}

function Column({ title, status, tasks, icon, sortBy }: ColumnProps) {
    // The column's id (its TaskStatus) is what Board.handleDragEnd reads
    // off `over.id` to know which status to move a dropped task into.
    const { setNodeRef, isOver } = useDroppable({ id: status });
    const sortedTasks = sortTasks(tasks, sortBy);

    return (
        <section className={`column column-${status}`}>
            <div className="column-header">
                <div className="column-title">
                    {icon}
                    <h2>{title}</h2>
                    <span className="task-count">{tasks.length}</span>
                </div>
            </div>
            <div
                ref={setNodeRef}
                className={`task-list${isOver ? " task-list-over" : ""}`}
            >
                {sortedTasks.length > 0 ? (
                    sortedTasks.map((task) => <TaskCard key={task.id} task={task} />)
                ) : (
                    <div className="empty-column">
                        <p>No tasks here</p>
                        <span>Drag a task here, or use its "Move to" menu</span>
                    </div>
                )}
            </div>
        </section>
    );
}

export default Column;