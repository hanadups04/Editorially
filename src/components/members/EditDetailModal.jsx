import { useState } from "react";
import "./EditDetailModal.css";

const sections = ["Technology", "Design", "Marketing", "Sales", "Operations"];
const roles = ["admin", "editor", "member"];

export const EditMemberModal = ({ open, onOpenChange, member, onUpdate }) => {
  const [formData, setFormData] = useState({
    username: member.username,
    password: "",
    confirmPassword: "",
    section: member.section,
    branch: member.branch,
    role: member.role,
  });

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const updateData = { ...formData };
    if (!formData.password) {
      delete updateData.password;
      delete updateData.confirmPassword;
    }

    onUpdate(updateData);
    onOpenChange(false);
  };

  return (
    <div className="edit-modal-overlay" onClick={() => onOpenChange(false)}>
      <div className="edit-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="edit-modal-header">
          <h2>Edit Member Information</h2>
          <p className="edit-modal-description">
            Update member details. Email cannot be changed.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="edit-modal-body">
            <div className="edit-form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="edit-input"
                required
              />
            </div>

            <div className="edit-form-group">
              <label htmlFor="password">
                New Password (leave blank to keep current)
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="edit-input"
                placeholder="Enter new password"
              />
            </div>

            <div className="edit-form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="edit-input"
                placeholder="Confirm new password"
              />
            </div>

            <div className="edit-form-group">
              <label htmlFor="section">Section</label>
              <select
                id="section"
                value={formData.section}
                onChange={(e) =>
                  setFormData({ ...formData, section: e.target.value })
                }
                className="edit-select"
              >
                {sections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>

            <div className="edit-form-group">
              <label htmlFor="branch">Branch Name</label>
              <input
                id="branch"
                type="text"
                value={formData.branch}
                onChange={(e) =>
                  setFormData({ ...formData, branch: e.target.value })
                }
                className="edit-input"
                required
              />
            </div>

            <div className="edit-form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="edit-select"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="edit-modal-footer">
            <button
              type="button"
              className="edit-cancel-button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button type="submit" className="edit-save-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
