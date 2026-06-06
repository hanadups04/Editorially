import React, { useState, useEffect } from "react";
import "./FilterModal.css";
import { fetchStatus } from "../../context/functions/ReadFunctions";

const FilterModal = ({ isOpen, onClose, onApply, currentFilters }) => {
  const [filters, setFilters] = useState(currentFilters);
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const data = await fetchStatus();
        if (isMounted) {
          setStatus(data);
          console.log("status data: ", data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters, isOpen]);

  if (!isOpen) return null;

  const handleFilterChange = (filterType, value) => {
    console.log("status shit: ", filterType, value);
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleApply = () => {
    onApply(filters);
  };

  const handleReset = () => {
    const resetFilters = { step_id: "all", deadline: "all" };
    setFilters(resetFilters);
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === "admin-overlay") {
      onClose();
    }
  };

  return (
    <div className="admin-overlay" onClick={handleOverlayClick}>
      <div className="admin-modal filter-modal">
        <div className="admin-header">
          <h2>Filter Projects</h2>
          <button className="admin-close" onClick={onClose}>
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

        <div className="admin-body">
          <div className="filter-section">
            <label className="filter-label">Status</label>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="step_id"
                  value="all"
                  checked={filters.step_id === "all"}
                  onChange={(e) =>
                    handleFilterChange("step_id", e.target.value)
                  }
                />
                <span>All Statuses</span>
              </label>
              {status.map((i) => (
                <label className="filter-option">
                  <input
                    type="radio"
                    name="step_id"
                    value={i.step_id}
                    checked={filters.step_id === i.step_id}
                    onChange={(e) =>
                      handleFilterChange("step_id", e.target.value)
                    }
                    key={i.step_id}
                  />
                  <span>{i.step_name}</span>
                </label>
              ))}
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

        <div className="admin-footer">
          <button className="admin-btn btn-secondary" onClick={handleReset}>
            Reset
          </button>
          <button className="admin-btn btn-primary" onClick={handleApply}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
