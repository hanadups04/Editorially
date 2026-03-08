import { useEffect, useState } from "react";
import "./EditDetailModal.css";
import * as ReadFunctions from "../../context/functions/ReadFunctions";
import * as auth from "../../context/auth";
import * as UpdateFunctions from "../../context/functions/UpdateFunctions";

const sections = ["Technology", "Design", "Marketing", "Sales", "Operations"];
const roles = ["admin", "editor", "member"];

export const EditMemberModal = ({
  open,
  onOpenChange,
  member,
  onUpdate,
  isProfile,
}) => {
  const [formData, setFormData] = useState({
    username: member.username,
    section: member.sections_tbl.section_name,
    role: member.roles_tbl.role_name,
  });
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
    currentPassword: "",
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

    if (isProfile) {
      // PROFILE: only username + password fields
      if (
        passwordForm.password &&
        passwordForm.password !== passwordForm.confirmPassword
      ) {
        alert("Passwords do not match");
        return;
      }

      const updateData = {
        username: formData.username,
      };

      if (passwordForm.password) {
        await auth.changePass(passwordForm.password);
      }

      const updateUser = await UpdateFunctions.updateUser(
        member.uid,
        updateData,
      );

      onUpdate(updateData);
    } else {
      // MEMBERS: only section + role
      const updateData = {
        section_id: formData.section,
        role_id: formData.role,
      };

      console.log("userinfo udpate is", member.uid, updateData);

      const updateUser = await UpdateFunctions.updateUser(
        member.uid,
        updateData,
      );

      onUpdate(updateData);
    }

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
          <>
            <form onSubmit={handleSubmit}>
              <div className="edit-modal-body">
                {isProfile ? (
                  <>
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
                        value={passwordForm.password}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            password: e.target.value,
                          })
                        }
                        className="edit-input"
                        placeholder="Enter new password"
                      />
                    </div>

                    <div className="edit-form-group">
                      <label htmlFor="confirmPassword">
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="edit-input"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </>
                ) : (
                  <></>
                )}

                {isProfile ? (
                  <></>
                ) : (
                  <>
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
                          <option
                            key={section.section_id}
                            value={section.section_id}
                          >
                            {section.section_name}
                          </option>
                        ))}
                      </select>
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
                          <option key={role.role_id} value={role.role_id}>
                            {role.role_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
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
          </>
        )}
      </div>
    </div>
  );
};
