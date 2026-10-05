import { useMemo, useState } from "react";
import { ClipboardCheck } from "lucide-react";

import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import SearchBar from "./components/SearchBar";
import BoardTabs from "./components/BoardTabs";

import { useTaskContext } from "./context/TaskContext";

function App() {
    const { tasks, boards, activeBoardId } = useTaskContext();

    const [searchTerm, setSearchTerm] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("all");

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
                    </div>
                </section>

                <SearchBar
                    searchTerm={searchTerm}
                    priorityFilter={priorityFilter}
                    onSearchChange={setSearchTerm}
                    onPriorityChange={setPriorityFilter}
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
                </section>
            </div>
        </div>
    );
}

export default App;