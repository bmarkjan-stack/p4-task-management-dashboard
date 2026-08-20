import { Search, X } from "lucide-react";

interface SearchBarProps {
    searchTerm: string;
    priorityFilter: string;
    onSearchChange: (value: string) => void;
    onPriorityChange: (value: string) => void;
    onClear: () => void;
}

function SearchBar({
    searchTerm,
    priorityFilter,
    onSearchChange,
    onPriorityChange,
    onClear,
}: SearchBarProps) {
    return (
        <section className="toolbar">
            <div className="search-container">
                <Search size={19} />

                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(event) => onSearchChange(event.target.value)}
                    aria-label="Search tasks"
                />
                {searchTerm && (
                    <button
                        type="button"
                        className="icon-button"
                        onClick={onClear}
                        aria-label="Clear search"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            <div className="filter-container">
                <label htmlFor="priority-filter">Priority:</label>
                <select
                    id="priority-filter"
                    value={priorityFilter}
                    onChange={(event) => onPriorityChange(event.target.value)}
                >
                    <option value="all">All priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>
        </section>
    );
}

export default SearchBar;