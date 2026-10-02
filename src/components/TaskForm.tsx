import { useEffect, useState } from "react";
import { Plus, Save, X } from "lucide-react";

import type { Priority } from "../types/task";
import { useTaskContext } from "../context/TaskContext";

function TaskForm() {
    const { editingTask, activeBoardId, addTask, updateTask, cancelEdit } =
        useTaskContext();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<Priority>("medium");
    const [dueDate, setDueDate] = useState("");

    // Bug fix: these fields used to be initialized once via useState's
    // initializer (`useState(editingTask?.title ?? "")`), which only runs on
    // the component's first mount. Because TaskForm stays mounted the whole
    // time, clicking "Edit" on task A and then, without cancelling, clicking
    // "Edit" on task B left task A's values showing under task B's edit
    // session. Syncing from `editingTask` in an effect keeps the form
    // correct no matter which task (or none) is being edited.
    useEffect(() => {
        setTitle(editingTask?.title ?? "");
        setDescription(editingTask?.description ?? "");
        setPriority(editingTask?.priority ?? "medium");
        setDueDate(editingTask?.dueDate ?? "");
    }, [editingTask]);

    function resetForm() {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setDueDate("");
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!title.trim()) {
            return;
        }

        const taskData = {
            title: title.trim(),
            description: description.trim(),
            status: editingTask?.status ?? ("todo" as const),
            priority,
            dueDate,
            boardId: editingTask ?? activeBoardId,
        };

        if (editingTask) {
            updateTask(editingTask.id, taskData);
        } else {
            addTask(taskData);
        }
        resetForm();
    }

    function handleCancel() {
        resetForm();
        cancelEdit();
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