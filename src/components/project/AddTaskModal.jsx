import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./AddTaskModal.css";

const AddTaskModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    project_id: "",
    assignee_id: "",
    subtask_title: "",
    subtask_type: "",
    details: "",
    // priority: "Medium",
    deadline: "",
  });

  const teamMembers = [
    { id: 1, name: "Sarah Johnson", email: "sarah.j@university.edu" },
    { id: 2, name: "Michael Chen", email: "michael.c@university.edu" },
    { id: 3, name: "Emma Rodriguez", email: "emma.r@university.edu" },
    { id: 4, name: "David Kim", email: "david.k@university.edu" },
    { id: 5, name: "Jessica Martinez", email: "jessica.m@university.edu" },
  ];

  const taskTypes = [
    { value: "writing", label: "Writing" },
    { value: "photography", label: "Submit Photos" },
    { value: "layout", label: "Layout Design" },
    { value: "editing", label: "Review/Editing" },
  ];

   const [searchParams] = useSearchParams();
  const projectID =
    searchParams.get("project_id") ?? searchParams.get("projectID");

  React.useEffect(() => {
    if (projectID) console.log(`Project ID from URL: ${projectID}`);
  }, [projectID])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await supabase.from("project_subtask_tbl").insert({
      subtask_id: "subtask-0001",
      project_id: { project_id },
      subtask_title: formData.subtask_title,
      subtask_type: formData.subtask_type,
      assignee_id: formData.assignee_id,
      deadline: formData.deadline,
    });

    if (error) {
      console.error(error);
      return;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add New Task</h2>
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
            <div className="form-group">
              <label className="form-label">Assign To</label>
              <select
                name="assignee_id"
                className="form-select"
                value={formData.assignee_id}
                onChange={handleChange}
                required
              >
                <option value="">Select a team member</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.name}>
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Task Type</label>
              <select
                name="subtask_type"
                className="form-select"
                value={formData.subtask_type}
                onChange={handleChange}
                required
              >
                <option value="">Select task type</option>
                {taskTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Task Details</label>
              <textarea
                name="description"
                className="form-textarea"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what needs to be done..."
                required
              />
            </div>

            {/* <div className="form-group">
              <label className="form-label">Priority Level</label>
              <select
                name="priority"
                className="form-select"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div> */}

            <div className="form-group">
              <label className="form-label">Deadline</label>
              <input
                type="date"
                name="deadline"
                className="form-input"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
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
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-primary"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
