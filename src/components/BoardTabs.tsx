import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { useTaskContext } from "../context/useTaskContext";
import ConfirmModal from "./ConfirmModal";

function BoardTabs() {
    const { boards, activeBoardId, setActiveBoard, addBoard, deleteBoard } =
        useTaskContext();

    const [isAdding, setIsAdding] = useState(false);
    const [newBoardName, setNewBoardName] = useState("");
    const [boardPendingDeleteId, setBoardPendingDeleteId] = useState<
        string | null
    >(null);

    function handleAddBoard(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!newBoardName.trim()) {
            return;
        }
        addBoard(newBoardName);
        setNewBoardName("");
        setIsAdding(false);
    }

    const boardPendingDelete = boards.find(
        (board) => board.id === boardPendingDeleteId
    );

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
                            onClick={() => setBoardPendingDeleteId(board.id)}
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

            {boardPendingDelete && (
                <ConfirmModal
                    title="Delete this board?"
                    message={`This permanently deletes "${boardPendingDelete.name}" and every task on it. This can't be undone.`}
                    confirmLabel="Delete board"
                    onConfirm={() => {
                        deleteBoard(boardPendingDelete.id);
                        setBoardPendingDeleteId(null);
                    }}
                    onCancel={() => setBoardPendingDeleteId(null)}
                />
            )}
        </nav>
    );
}

export default BoardTabs;
