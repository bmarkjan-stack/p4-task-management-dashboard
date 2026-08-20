import { ClipboardList } from "lucide-react";

interface HeaderProps {
    taskCount: number;
}

function Header({ taskCount }: HeaderProps) {
    return (
        <header className="header">
            <div className="header-content">
                <div className="brand">
                    <div className="brand-icon">
                        <ClipboardList size={24} />
                    </div>
                    <div>
                        <h1>TaskFlow</h1>
                        <p>Task Management Dashboard</p>
                    </div>
                </div>
                <div className="task-summary">
                    <strong>{taskCount}</strong>
                    <span>Total Tasks</span>
                </div>
            </div>
        </header>
    );
}

export default Header;