import { Undo2 } from "lucide-react";
import { useTaskContext } from "../context/TaskContext";

/**
 * Shows a dismissible "Deleted <task>" toast with an Undo action whenever a
 * task delete is pending finalization (see TaskContext.deleteTask). Renders
 * nothing otherwise.
 */
function Toast() {
    const { pendingDelete, undoDeleteTask } = useTaskContext();

    if (!pendingDelete) {
        return null;
    }

    return (
        <div className="toast" role="status">
            <span>
                Deleted <strong>{pendingDelete.task.title}</strong>
            </span>
            <button type="button" className="toast-undo" onClick={undoDeleteTask}>
                <Undo2 size={16} />
                Undo
            </button>
        </div>
    );
}

export default Toast;