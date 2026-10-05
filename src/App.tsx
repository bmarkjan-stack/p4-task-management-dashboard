import { useMemo, useState } from "react";
import { ClipboardCheck } from "lucide-react";

import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import Board from "./components/Board";
import SearchBar from "./components/SearchBar";
import BoardTabs from "./components/BoardTabs";
import Toast from "./components/Toast";

import { useTaskContext } from "./context/TaskContext";
import { filterTasks } from "./utils/taskFilters";
import type { SortOption } from "./utils/taskSort";

function App() {
    const { tasks, boards, activeBoardId } = useTaskContext();

    const [searchTerm, setSearchTerm] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [sortBy, setSortBy] = useState<SortOption>("manual");

    // All tasks on the active board, ignoring search/priority — used for the
    // "X of Y tasks displayed" count and the completion percentage.
    const boardTasks = useMemo(
        () =>
            filterTasks(tasks, {
                searchTerm: "",
                priorityFilter: "all",
                boardId: activeBoardId,
            }),
        [tasks, activeBoardId]
    );

    const filteredTasks = useMemo(
        () =>
            filterTasks(tasks, {
                searchTerm,
                priorityFilter,
                boardId: activeBoardId,
            }),
        [tasks, searchTerm, priorityFilter, activeBoardId]
    );

    const completedCount = boardTasks.filter(
        (task) => task.status === "completed"
    ).length;

    const completionPercentage =
        boardTasks.length > 0
            ? Math.round((completedCount / boardTasks.length) * 100)
            : 0;

    const activeBoard = boards.find((board) => board.id === activeBoardId);

    return (
        <div className="app">
            <Header taskCount={boardTasks.length} />
            <div className="container">
                <BoardTabs />

                <section className="welcome-section">
                    <div>
                        <p className="eyebrow">PROJECT</p>
                        <h2>{activeBoard ? activeBoard.name : "Development Dashboard"}</h2>
                        <p>
                            Organize your development tasks and track your
                            progress.
                        </p>
                    </div>

                    <div className="progress-card">
                        <div className="progress-icon">
                            <ClipboardCheck size={22} />
                        </div>
                        <div>
                            <strong>{completionPercentage}%</strong>
                            <span>Project completed</span>
                        </div>
                    </div>
                </section>

                <SearchBar
                    searchTerm={searchTerm}
                    priorityFilter={priorityFilter}
                    sortBy={sortBy}
                    onSearchChange={setSearchTerm}
                    onPriorityChange={setPriorityFilter}
                    onSortChange={setSortBy}
                    onClear={() => setSearchTerm("")}
                />

                <TaskForm />

                <section className="board-section">
                    <div className="board-heading">
                        <div>
                            <h2>Project Tasks</h2>
                            <p>
                                {filteredTasks.length} of {boardTasks.length}{" "}
                                tasks displayed
                            </p>
                        </div>
                    </div>

                    <Board tasks={filteredTasks} sortBy={sortBy} />
                </section>
            </div>

            <Toast />
        </div>
    );
}

export default App;