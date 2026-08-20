import type { ReactNode } from "react";
import type { Task, TaskStatus } from "../types/task";
import TaskCard from "./TaskCard";

interface ColumnProps {
    title: string;
    status: TaskStatus;
    tasks: Task[];
    count: number;
    icon: ReactNode;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onDrop: (event: React.DragEvent<HTMLElement>, status: TaskStatus) => void;
}

function Column({
    title,
    status,
    tasks,
    count,
    icon,
    onEdit,
    onDelete,
    onDrop,
}: ColumnProps) {
    function handleDragOver(
        event: React.DragEvent<HTMLDivElement>
    ) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }

    return (
        <section
            className={`column column-${status}`}
            onDragOver={handleDragOver}
            onDrop={(event) => onDrop(event, status)}
        >
            <div className="column-header">
                <div className="column-title">
                    {icon}
                    <h2>{title}</h2>
                    <span className="task-count">{count}</span>
                </div>
            </div>
            <div className="task-list">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))
                ) : (
                    <div className="empty-column">
                        <p>No tasks here</p>
                        <span>Drag a task into this column</span>
                    </div>
                )}
            </div>
        </section>
    );
}

export default Column;