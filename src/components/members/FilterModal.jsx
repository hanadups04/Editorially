import { useState } from "react";
import "./FilterModal.css";

const sections = ["Technology", "Design", "Marketing", "Sales", "Operations"];
const roles = ["admin", "editor", "member"];

export const FilterModal = ({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  if (!open) return null;

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    setLocalFilters({ section: "", role: "" });
  };

  return (
    <div className="filter-modal-overlay" onClick={() => onOpenChange(false)}>
      <div
        className="filter-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="filter-modal-header">
          <h2>Filter Members</h2>
          <p className="filter-modal-description">
            Select filters to narrow down the member list
          </p>
        </div>

        <div className="filter-modal-body">
          <div className="filter-form-group">
            <label htmlFor="section-select">Section</label>
            <select
              id="section-select"
              value={localFilters.section}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, section: e.target.value })
              }
              className="filter-select"
            >
              <option value="">All sections</option>
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-form-group">
            <label htmlFor="role-select">Role</label>
            <select
              id="role-select"
              value={localFilters.role}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, role: e.target.value })
              }
              className="filter-select"
            >
              <option value="">All roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-modal-footer">
          <button className="filter-reset-button" onClick={handleReset}>
            Reset
          </button>
          <button className="filter-apply-button" onClick={handleApply}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
