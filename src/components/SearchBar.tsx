import { Search, X } from "lucide-react";

import type { SortOption } from "../utils/taskSort";

interface SearchBarProps {
    searchTerm: string;
    priorityFilter: string;
    sortBy: SortOption;
    onSearchChange: (value: string) => void;
    onPriorityChange: (value: string) => void;
    onSortChange: (value: SortOption) => void;
    onClear: () => void;
}

function SearchBar({
    searchTerm,
    priorityFilter,
    sortBy,
    onSearchChange,
    onPriorityChange,
    onSortChange,
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

            <div className="filter-container">
                <label htmlFor="sort-by">Sort by:</label>
                <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(event) =>
                        onSortChange(event.target.value as SortOption)
                    }
                >
                    <option value="manual">Manual</option>
                    <option value="dueDate">Due date</option>
                    <option value="priority">Priority</option>
                    <option value="createdAt">Date created</option>
                </select>
            </div>
        </section>
    );
}

export default SearchBar;
