import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, GripVertical, Pencil, Trash2 } from "lucide-react";

import type { Task, TaskStatus } from "../types/task";
import { useTaskContext } from "../context/TaskContext";

interface TaskCardProps {
    task: Task;
}

const STATUS_OPTIONS: Array<{ value: TaskStatus; label: string }> = [
    { value: "todo", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
];

function formatDueDate(date: string) {
    if (!date) {
        return "No due date";
    }
    return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function TaskCard({ task }: TaskCardProps) {
    const { setEditingTask, deleteTask, moveTask } = useTaskContext();
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({ id: task.id });

    // Completed tasks are never flagged overdue/due-soon — there's nothing
    // left to be late on.

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <article
            ref={setNodeRef}
            style={style}
            className={[
                "task-card",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div className="task-card-header">
                <button
                    type="button"
                    className="drag-handle"
                    aria-label={`Drag ${task.title} to reorder`}
                    title="Drag task (or use the Move to menu below)"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical size={18} />
                </button>
                <div className="task-badges">
                    <span className={`priority-badge ${task.priority}`}>
                        {task.priority}
                    </span>
                </div>
            </div>

            <h3>{task.title}</h3>
            {task.description && (
                <p className="task-description">{task.description}</p>
            )}

            <div className="task-card-footer">
                <div className="due-date">
                    <CalendarDays size={15} />
                    <span>{formatDueDate(task.dueDate)}</span>
                </div>

                <div className="task-actions">
                    <select
                        className="move-select"
                        value={task.status}
                        aria-label={`Move ${task.title} to a different column`}
                        onChange={(event) =>
                            moveTask(task.id, event.target.value as TaskStatus)
                        }
                    >
                        {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        className="edit-button"
                        onClick={() => setEditingTask(task)}
                        aria-label={`Edit ${task.title}`}
                        title="Edit task"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        type="button"
                        className="delete-button"
                        onClick={() => deleteTask(task.id)}
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