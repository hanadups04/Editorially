import { useState } from "react";
import "./AddMemberModal.css";

const sections = ["Technology", "Design", "Marketing", "Sales", "Operations"];
const roles = ["admin", "editor", "member"];

export const AddMemberModal = ({ open, onOpenChange, onAdd }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    section: "",
    role: "",
  });

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.section ||
      !formData.role
    ) {
      alert("Please fill in all fields");
      return;
    }

    onAdd(formData);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      section: "",
      role: "",
    });
    onOpenChange(false);
  };

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      section: "",
      role: "",
    });
    onOpenChange(false);
  };

  return (
    <div className="add-modal-overlay" onClick={handleClose}>
      <div className="add-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="add-modal-header">
          <h2>Add New Member</h2>
          <p className="add-modal-description">
            Fill in the details to add a new member.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="add-modal-body">
            <div className="add-form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="add-input"
                placeholder="Enter first name"
                required
              />
            </div>

            <div className="add-form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="add-input"
                placeholder="Enter last name"
                required
              />
            </div>

            <div className="add-form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="add-input"
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="add-form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="add-input"
                placeholder="Enter password"
                required
              />
            </div>

            <div className="add-form-group">
              <label htmlFor="section">Section</label>
              <select
                id="section"
                value={formData.section}
                onChange={(e) =>
                  setFormData({ ...formData, section: e.target.value })
                }
                className="add-select"
                required
              >
                <option value="" disabled>
                  Select a section
                </option>
                {sections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>

            <div className="add-form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="add-select"
                required
              >
                <option value="" disabled>
                  Select a role
                </option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="add-modal-footer">
            <button
              type="button"
              className="add-cancel-button"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button type="submit" className="add-save-button">
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
