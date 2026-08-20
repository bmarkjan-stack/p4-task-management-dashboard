import { useState } from "react";
import { Plus, Save, X } from "lucide-react";
import type { Priority, Task } from "../types/task";

interface TaskFormProps {
    editingTask: Task | null;
    onAddTask: (task: Omit<Task, "id" | "createdAt">) => void;
    onUpdateTask: (
        id: string,
        updates: Omit<Task, "id" | "createdAt">
    ) => void;
    onCancelEdit: () => void;
}

function TaskForm({
    editingTask,
    onAddTask,
    onUpdateTask,
    onCancelEdit,
    }: TaskFormProps) {
        const [title, setTitle] = useState(editingTask?.title ?? "");
        const [description, setDescription] = useState(editingTask?.description ?? "");
        const [priority, setPriority] = useState<Priority>(editingTask?.priority ?? "medium");
        const [dueDate, setDueDate] = useState(editingTask?.dueDate ?? "");

    function resetForm() {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setDueDate("");
    }

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!title.trim()) {
            return;
        }

        const taskData = {
            title: title.trim(),
            description: description.trim(),
            status: editingTask?.status ?? "todo",
            priority,
            dueDate,
        };

        if (editingTask) {
            onUpdateTask(editingTask.id, taskData);
        } else {
            onAddTask(taskData);
        }
        resetForm();
    }

    function handleCancel() {
        resetForm();
        onCancelEdit();
    }

    return (
        <section className="task-form-section">
            <div className="section-heading">
                <div>
                    <h2>{editingTask ? "Edit Task" : "Create New Task"}</h2>
                    <p>
                        {editingTask
                            ? "Update the details of your task."
                            : "Add a new task to your project."}
                    </p>
                </div>
            </div>

            <form className="task-form" onSubmit={handleSubmit}>
                <div className="form-group form-group-large">
                    <label htmlFor="task-title">Task title *</label>
                    <input
                        id="task-title"
                        type="text"
                        placeholder="e.g. Build portfolio website"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="task-priority">Priority</label>
                    <select
                        id="task-priority"
                        value={priority}
                        onChange={(event) =>
                            setPriority(event.target.value as Priority)
                        }
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="task-due-date">Due date</label>
                    <input
                        id="task-due-date"
                        type="date"
                        value={dueDate}
                        onChange={(event) => setDueDate(event.target.value)}
                    />
                </div>
                <div className="form-group form-group-full">
                    <label htmlFor="task-description">Description</label>
                    <textarea
                        id="task-description"
                        placeholder="Add some details about this task..."
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        rows={3}
                    />
                </div>
                <div className="form-actions">
                    <button type="submit" className="primary-button">
                        {editingTask ? <Save size={18} /> : <Plus size={18} />}
                        {editingTask ? "Save Changes" : "Add Task"}
                    </button>
                    {editingTask && (
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={handleCancel}
                        >
                            <X size={18} />
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}

export default TaskForm;