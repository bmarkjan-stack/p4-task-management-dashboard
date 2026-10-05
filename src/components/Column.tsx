import { useDroppable } from "@dnd-kit/core";
import type { ReactNode } from "react";

import type { Task, TaskStatus } from "../types/task";
import TaskCard from "./TaskCard";

interface ColumnProps {
    title: string;
    status: TaskStatus;
    tasks: Task[];
    icon: ReactNode;
}

function Column({ title, status, tasks, icon }: ColumnProps) {
    // The column's id (its TaskStatus) is what Board.handleDragEnd reads
    // off `over.id` to know which status to move a dropped task into.
    const { setNodeRef, isOver } = useDroppable({ id: status });

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
            </div>
        </section>
    );
}

export default Column;