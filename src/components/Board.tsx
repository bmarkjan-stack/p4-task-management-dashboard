import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    closestCenter,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import type { ReactNode } from "react";

import type { Task, TaskStatus } from "../types/task";
import { useTaskContext } from "../context/TaskContext";
import Column from "./Column";

interface BoardProps {
    tasks: Task[];
}

const COLUMN_META: Array<{ status: TaskStatus; title: string; icon: ReactNode }> = [
    { status: "todo", title: "To Do", icon: <Circle size={19} /> },
    { status: "in-progress", title: "In Progress", icon: <Clock3 size={19} /> },
    { status: "completed", title: "Completed", icon: <CheckCircle2 size={19} /> },
];

function Board({ tasks }: BoardProps) {
    const { moveTask } = useTaskContext();

    // PointerSensor covers mouse/trackpad, TouchSensor covers phones and
    // tablets, and KeyboardSensor makes drag-and-drop reachable without a
    // pointer at all (each TaskCard's drag handle is a focusable button).
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 150, tolerance: 6 },
        }),
        useSensor(KeyboardSensor)
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over) {
            return;
        }
        moveTask(String(active.id), over.id as TaskStatus);
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <main className="board">
                {COLUMN_META.map(({ status, title, icon }) => (
                    <Column
                        key={status}
                        title={title}
                        status={status}
                        icon={icon}
                        sortBy={window.localStorage.getItem("sortBy") as string}
                        tasks={tasks.filter((task) => task.status === status)}
                    />
                ))}
            </main>
        </DndContext>
    );
}

export default Board;