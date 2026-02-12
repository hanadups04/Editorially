import React, { useState, useEffect } from "react";
import "./EditProjectModal.css";

const EditProjectModal = ({ isOpen, onClose, project, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    publicationDate: "",
    issue: "",
    category: "",
    status: "",
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        details: project.details || "",
        deadline: project.deadline || "",
        issue: project.issue || "",
        section_id: project.section_id || "",
        status: project.status || "",
      });
    }
  }, [project]);

  const categories = [
    "Feature Article",
    "News",
    "Opinion",
    "Sports",
    "Entertainment",
    "Editorial",
  ];

  const statuses = ["Draft", "In Progress", "Review", "Completed"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal edit-project-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">Edit Project Details</h2>
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
              <label className="form-label">Project Title</label>
              <input
                type="text"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="details"
                className="form-textarea"
                value={formData.details}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Publication Date</label>
                <input
                  type="text"
                  name="deadline"
                  className="form-input"
                  value={formData.deadline}
                  onChange={handleChange}
                  placeholder="e.g., March 15, 2025"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Issue</label>
                <input
                  type="text"
                  name="issue"
                  className="form-input"
                  value={formData.issue}
                  onChange={handleChange}
                  placeholder="e.g., Vol. 45, Issue 3"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="section_id"
                  className="form-select"
                  value={formData.section_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
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
                  <option value="">Select status</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
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

export default EditProjectModal;
