import { useState, useEffect } from "react";
import "./AddMembersModal.css";
import * as ReadFunctions from "../../context/functions/ReadFunctions";
import * as auth from "../../context/auth";

export const AddMemberModal = ({ open, onOpenChange, onAdd }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    section_id: "",
    role_id: "",
  });
  const [sections, setSections] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function roles() {
      try {
        const getRoles = await ReadFunctions.fetchAllRoles();
        const sections = await ReadFunctions.fetchAllSections();

        if (mounted) {
          setSections(sections);
          setRoles(getRoles);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    roles();

    return () => {
      mounted = false;
    };
  }, []);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.section_id ||
      !formData.role_id
    ) {
      alert("Please fill in all fields");
      return;
    }

    const createUser = await auth.createUser(formData);
    console.log("formdata new user: ", formData);
    console.log("user created: ", createUser);

    // onAdd(formData);
    setFormData({
      username: "",
      email: "",
      password: "",
      section_id: "",
      role_id: "",
    });
    onOpenChange(false);
  };

  const handleClose = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      section_id: "",
      role_id: "",
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

        {loading ? (
          <div
            className="content-detail"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Loading...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="add-modal-body">
              <div className="add-form-group">
                <label htmlFor="username">Full Name</label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="add-input"
                  placeholder="Enter Username"
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
                  value={formData.section_id}
                  onChange={(e) =>
                    setFormData({ ...formData, section_id: e.target.value })
                  }
                  className="add-select"
                  required
                >
                  <option value="" disabled>
                    Select a section
                  </option>
                  {sections.map((section) => (
                    <option key={section.section_id} value={section.section_id}>
                      {section.section_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="add-form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  value={formData.role_id}
                  onChange={(e) =>
                    setFormData({ ...formData, role_id: e.target.value })
                  }
                  className="add-select"
                  required
                >
                  <option value="" disabled>
                    Select a role
                  </option>
                  {roles.map((role) => (
                    <option key={role.role_id} value={role.role_id}>
                      {role.role_name}
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
        )}
      </div>
    </div>
  );
};
