import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { useTaskContext } from "../context/TaskContext";

function BoardTabs() {
    const { boards, activeBoardId, setActiveBoard, addBoard } =
        useTaskContext();

    const [isAdding, setIsAdding] = useState(false);
    const [newBoardName, setNewBoardName] = useState("");

    function handleAddBoard(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!newBoardName.trim()) {
            return;
        }
        addBoard(newBoardName);
        setNewBoardName("");
        setIsAdding(false);
    }

    return (
        <nav className="board-tabs" aria-label="Boards">
            {boards.map((board) => (
                <div
                    key={board.id}
                    className={`board-tab${
                        board.id === activeBoardId ? " active" : ""
                    }`}
                >
                    <button type="button" onClick={() => setActiveBoard(board.id)}>
                        {board.name}
                    </button>
                    {boards.length > 1 && (
                        <button
                            type="button"
                            className="board-tab-delete"
                            aria-label={`Delete board ${board.name}`}
                            title="Delete board"
                            onClick={() => (board.id)}
                        >
                            <Trash2 size={13} />
                        </button>
                    )}
                </div>
            ))}

            {isAdding ? (
                <form className="board-tab-form" onSubmit={handleAddBoard}>
                    <input
                        autoFocus
                        type="text"
                        placeholder="Board name"
                        value={newBoardName}
                        onChange={(event) => setNewBoardName(event.target.value)}
                        aria-label="New board name"
                    />
                    <button type="submit" className="primary-button">
                        Add
                    </button>
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() => {
                            setIsAdding(false);
                            setNewBoardName("");
                        }}
                    >
                        Cancel
                    </button>
                </form>
            ) : (
                <button
                    type="button"
                    className="board-tab-add"
                    onClick={() => setIsAdding(true)}
                >
                    <Plus size={15} />
                    New board
                </button>
            )}
        </nav>
    );
}

export default BoardTabs;
