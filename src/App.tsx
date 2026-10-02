import { useState } from "react";
import { ClipboardCheck } from "lucide-react";

import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import SearchBar from "./components/SearchBar";

function App() {

    const [searchTerm, setSearchTerm] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("all");

    // All tasks on the active board, ignoring search/priority — used for the
    // "X of Y tasks displayed" count and the completion percentage.

    return (
        <div className="app">
            <Header taskCount={1} />
            <div className="container">

                <section className="welcome-section">
                    <div>
                        <p className="eyebrow">PROJECT</p>
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
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default App;