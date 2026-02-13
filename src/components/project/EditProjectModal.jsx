import React, { useState, useEffect, useRef } from "react";
import * as ReadFunctions from "../../context/functions/ReadFunctions.js";
import * as UpdateFunctions from "../../context/functions/UpdateFunctions.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { supabase } from "../../supabaseClient.js";
import "./EditProjectModal.css";

const EditProjectModal = ({ isOpen, onClose, project, onSubmit }) => {

  console.log("aslmsas", project)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        details: project.details || "",
        deadline: project.deadline ? new Date(project.deadline) : null
      });
      console.log("projec data: ", project.title, project.details, project.deadline);
      console.log("prpojectdata: ", project)
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setSelectedDateTime(date);
    setFormData((prev) => ({ ...prev, deadline: date }));
    dateModified.current = true;
  };

  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const dateModified = useRef(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      deadline: selectedDateTime?.toISOString(),
      details: formData.details,
    }

    console.log("data for pudate: ", payload, project.project_id);

    onSubmit(payload);

     await UpdateFunctions.updateProject(
      project.project_id,
      payload
     );
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

        {/* <form onSubmit={handleSubmit}> */}
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
              <label className="form-label">Details</label>
              <textarea
                name="details"
                className="form-textarea"
                value={formData.details}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              {/* <div className="form-group">
                <label className="form-label">Deadline Date</label>
                <input
                  type="date"
                  name="deadline"
                  className="form-input"
                  value={formData.deadline}
                  onChange={handleChange}
                  placeholder="e.g., March 15, 2025"
                />
              </div> */}

            <div className="form-group">
                          <label className="form-label">Deadline</label>
                          <DatePicker
                            selected={formData.deadline}
                            onChange={handleDateChange}
                            minDate={new Date()}
                            minTime={
                              formData.deadline &&
                              new Date(selectedDateTime).toDateString() ===
                                new Date().toDateString()
                                ? new Date()
                                : new Date(0, 0, 0, 0, 0)
                            }
                            maxTime={new Date(0, 0, 0, 23, 59)}
                            showTimeSelect
                            dateFormat="yyyy-MM-dd HH:mm:ss"
                            timeIntervals={15}
                            timeCaption="Time"
                            required
                            className="DeadlineDatePicker"
                          />
                        </div>

              {/* <div className="form-group">
                <label className="form-label">Issue</label>
                <input
                  type="text"
                  name="issue"
                  className="form-input"
                  value={formData.issue}
                  onChange={handleChange}
                  placeholder="e.g., Vol. 45, Issue 3"
                />
              </div> */}
            </div>

            {/* <div className="form-row"> */}
              {/* <div className="form-group">
                <label className="form-label">Section</label>
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
              </div> */}

              {/* <div className="form-group">
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
              </div> */}
            {/* </div> */}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" onClick={handleSubmit} className="btn btn-primary">
              Save Changes
            </button>
          </div>
          
        {/* </form> */}
      </div>
    </div>
  );
};

export default EditProjectModal;
