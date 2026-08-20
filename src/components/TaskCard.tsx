import { CalendarDays, GripVertical, Pencil, Trash2 } from "lucide-react";
import type { Task } from "../types/task";

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

function TaskCard({
    task,
    onEdit,
    onDelete,
}: TaskCardProps) {
    function handleDragStart(
        event: React.DragEvent<HTMLDivElement>
    ) {
        event.dataTransfer.setData("taskId", task.id);
        event.dataTransfer.effectAllowed = "move";
    }

    function formatDueDate(date: string) {
        if (!date) {
            return "No due date";
        }

        return new Date(`${date}T00:00:00`).toLocaleDateString(
            undefined,
            {
                month: "short",
                day: "numeric",
                year: "numeric",
            }
        );
    }

    return (
        <article
            className="task-card"
            draggable
            onDragStart={handleDragStart}
        >
            <div className="task-card-header">
                <div className="drag-handle" title="Drag task">
                    <GripVertical size={18} />
                </div>
                <span className={`priority-badge ${task.priority}`}>
                    {task.priority}
                </span>
            </div>
            <h3>{task.title}</h3>
            {task.description && (
                <p className="task-description">
                    {task.description}
                </p>
            )}

            <div className="task-card-footer">
                <div className="due-date">
                    <CalendarDays size={15} />
                    <span>{formatDueDate(task.dueDate)}</span>
                </div>

                <div className="task-actions">
                    <button
                        type="button"
                        onClick={() => onEdit(task)}
                        aria-label={`Edit ${task.title}`}
                        title="Edit task"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(task.id)}
                        aria-label={`Delete ${task.title}`}
                        title="Delete task"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </article>
    );
}

export default TaskCard;