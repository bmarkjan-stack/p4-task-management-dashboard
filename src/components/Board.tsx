import { CheckCircle2, Circle, Clock3,
} from "lucide-react";

import type { Task, TaskStatus } from "../types/task";
import Column from "./Column";

interface BoardProps {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onDrop: (
        event: React.DragEvent<HTMLElement>,
        status: TaskStatus
    ) => void;
}

function Board({
    tasks,
    onEdit,
    onDelete,
    onDrop,
}: BoardProps) {
    const todoTasks = tasks.filter(
        (task) => task.status === "todo"
    );
    const inProgressTasks = tasks.filter(
        (task) => task.status === "in-progress"
    );
    const completedTasks = tasks.filter(
        (task) => task.status === "completed"
    );
    return (
        <main className="board">
            <Column
                title="To Do"
                status="todo"
                tasks={todoTasks}
                count={todoTasks.length}
                icon={<Circle size={19} />}
                onEdit={onEdit}
                onDelete={onDelete}
                onDrop={onDrop}
            />
            <Column
                title="In Progress"
                status="in-progress"
                tasks={inProgressTasks}
                count={inProgressTasks.length}
                icon={<Clock3 size={19} />}
                onEdit={onEdit}
                onDelete={onDelete}
                onDrop={onDrop}
            />
            <Column
                title="Completed"
                status="completed"
                tasks={completedTasks}
                count={completedTasks.length}
                icon={<CheckCircle2 size={19} />}
                onEdit={onEdit}
                onDelete={onDelete}
                onDrop={onDrop}
            />
        </main>
    );
}

export default Board;