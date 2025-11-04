import React, { useState, useEffect } from "react";
import "./FilterModal.css";

const FilterModal = ({ isOpen, onClose, onApply, currentFilters }) => {
  const [filters, setFilters] = useState(currentFilters);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters, isOpen]);

  if (!isOpen) return null;

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleApply = () => {
    onApply(filters);
  };

  const handleReset = () => {
    const resetFilters = { status: "all", deadline: "all" };
    setFilters(resetFilters);
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === "modal-overlay") {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal filter-modal">
        <div className="modal-header">
          <h2>Filter Projects</h2>
          <button className="close-button" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="filter-section">
            <label className="filter-label">Status</label>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="status"
                  value="all"
                  checked={filters.status === "all"}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                />
                <span>All Statuses</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="status"
                  value="Pending"
                  checked={filters.status === "Pending"}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                />
                <span>Pending</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="status"
                  value="In Progress"
                  checked={filters.status === "In Progress"}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                />
                <span>In Progress</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="status"
                  value="Review"
                  checked={filters.status === "Review"}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                />
                <span>Review</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="status"
                  value="Completed"
                  checked={filters.status === "Completed"}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                />
                <span>Completed</span>
              </label>
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-label">Deadline</label>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="deadline"
                  value="all"
                  checked={filters.deadline === "all"}
                  onChange={(e) =>
                    handleFilterChange("deadline", e.target.value)
                  }
                />
                <span>All Deadlines</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="deadline"
                  value="overdue"
                  checked={filters.deadline === "overdue"}
                  onChange={(e) =>
                    handleFilterChange("deadline", e.target.value)
                  }
                />
                <span>Overdue</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="deadline"
                  value="thisWeek"
                  checked={filters.deadline === "thisWeek"}
                  onChange={(e) =>
                    handleFilterChange("deadline", e.target.value)
                  }
                />
                <span>This Week</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="deadline"
                  value="thisMonth"
                  checked={filters.deadline === "thisMonth"}
                  onChange={(e) =>
                    handleFilterChange("deadline", e.target.value)
                  }
                />
                <span>This Month</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="deadline"
                  value="upcoming"
                  checked={filters.deadline === "upcoming"}
                  onChange={(e) =>
                    handleFilterChange("deadline", e.target.value)
                  }
                />
                <span>More than 30 Days</span>
              </label>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={handleReset}>
            Reset
          </button>
          <button className="btn btn-primary" onClick={handleApply}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
