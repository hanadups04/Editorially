import React, { useState, useEffect } from "react";
import "./RequestChangesModa.css";

const RequestChangesModal = ({
  isOpen,
  onClose,
  content,
  onSubmit,
  owner_id,
}) => {
  const [formData, setFormData] = useState({
    content: "",
    is_urgent: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      article_id: content?.article_id,
      owner_id: owner_id,
      ...formData,
    });
    setFormData({ content: "", is_urgent: false });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal request-changes-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">Request Changes</h2>
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
            {content && (
              <div className="request-article-info">
                <span className="info-label">Article:</span>
                <span className="info-value">{content.headline}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">What changes should be made?</label>
              <textarea
                name="content"
                className="form-textarea"
                value={formData.content}
                onChange={handleChange}
                placeholder="Describe the changes you'd like to request..."
                rows={5}
                required
              />
            </div>

            <div className="form-group urgency-group">
              <label className="urgency-label">
                <input
                  type="checkbox"
                  name="is_urgent"
                  checked={formData.is_urgent}
                  onChange={handleChange}
                  className="urgency-checkbox"
                />
                <span className="urgency-indicator"></span>
                <span className="urgency-text">
                  Mark as urgent
                  <span className="urgency-hint">
                    This will prioritize the request
                  </span>
                </span>
              </label>
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
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestChangesModal;
