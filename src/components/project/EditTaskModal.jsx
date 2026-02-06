import React, { useState, useEffect } from "react";
import "./EditTaskModal.css";

const EditTaskModal = ({ isOpen, onClose, task, onSubmit }) => {
  const [formData, setFormData] = useState({
    role: "",
    assigneeName: "",
    assigneeEmail: "",
    description: "",
    status: "",
    deadline: "",
    priority: "",
  });

  useEffect(() => {
    if (task) {
      setFormData({
        role: task.role || "",
        assigneeName: task.assignee?.name || "",
        assigneeEmail: task.assignee?.email || "",
        description: task.description || "",
        status: task.status || "",
        deadline: task.deadline || "",
        priority: task.priority || "",
      });
    }
  }, [task]);

  const roles = ["Writer", "Layout", "Photographer", "Editor"];
  const statuses = ["Pending", "In Progress", "Review", "Completed"];
  const priorities = ["Low", "Medium", "High"];

  const teamMembers = [
    { id: 1, name: "Sarah Johnson", email: "sarah.j@university.edu" },
    { id: 2, name: "Michael Chen", email: "michael.c@university.edu" },
    { id: 3, name: "Emma Rodriguez", email: "emma.r@university.edu" },
    { id: 4, name: "David Kim", email: "david.k@university.edu" },
    { id: 5, name: "Jessica Martinez", email: "jessica.m@university.edu" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "assignee") {
      const member = teamMembers.find((m) => m.name === value);
      if (member) {
        setFormData((prev) => ({
          ...prev,
          assigneeName: member.name,
          assigneeEmail: member.email,
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...task,
      role: formData.role,
      assignee: {
        name: formData.assigneeName,
        email: formData.assigneeEmail,
      },
      description: formData.description,
      status: formData.status,
      deadline: formData.deadline,
      priority: formData.priority,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal edit-task-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">Edit Task</h2>
          <button className="modal-close" onClick={onClose}>
            <svg
              width="20"
              height="20"
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

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Assign To</label>
              <select
                name="assignee"
                className="form-select"
                value={formData.assigneeName}
                onChange={handleChange}
                required
              >
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.name}>
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Task Description</label>
              <textarea
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  name="priority"
                  className="form-select"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input
                  type="text"
                  name="deadline"
                  className="form-input"
                  value={formData.deadline}
                  onChange={handleChange}
                  placeholder="e.g., March 10, 2025"
                  required
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
