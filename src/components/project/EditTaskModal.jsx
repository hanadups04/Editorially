import React, { useState, useEffect, useRef } from "react";
import * as ReadFunctions from "../../context/functions/ReadFunctions.js";
import * as UpdateFunctions from "../../context/functions/UpdateFunctions.js";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./EditTaskModal.css";

const EditTaskModal = ({ isOpen, onClose, subtask, onSubmit }) => {
  const [sections, setSections] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    subtask_type: "",
    section_id: "",
    assignee_id: "",
    subtask_title: "",
    subtask_details: "",
    subtask_deadline: "",
  });

  useEffect(() => {
    if (subtask) {
      setFormData({
        subtask_type: subtask.subtask_type ? Number(subtask.subtask_type) : "",
        section_id: subtask.section_id || "",
        assignee_id: subtask.assignee_id || "",
        subtask_title: subtask.subtask_title || "",
        subtask_details: subtask.subtask_details || "",
        subtask_deadline: subtask.subtask_deadline
          ? new Date(subtask.subtask_deadline)
          : null,
        // priority: task.priority || "",
      });
    }
  }, [subtask]);

  useEffect(() => {
    let isMounted = true;

    async function fetchSections() {
      try {
        const data = await ReadFunctions.fetchAllSections();
        if (isMounted) {
          console.log("data is: ", data);
          setSections(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchSections();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchUsers() {
      try {
        const data = await ReadFunctions.fetchAllUsers();
        if (isMounted) {
          console.log("data is: ", data);
          setAllUsers(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" || type === "switch"
          ? checked
          : name === "subtask_type"
            ? parseInt(value)
            : value,
    }));
  };

  const handleDateChange = (date) => {
    setSelectedDateTime(date);
    setFormData((prev) => ({ ...prev, subtask_deadline: date }));
    dateModified.current = true;
  };

  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const dateModified = useRef(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      subtask_type: formData.subtask_type,
      section_id: Number(formData.section_id),
      assignee_id: formData.assignee_id,
      subtask_title: formData.subtask_title || "sample empty title",
      subtask_details: formData.subtask_details,
      subtask_deadline: selectedDateTime?.toISOString(),
    };

    console.log("Updating subtask data:", subtask.subtask_id, payload);
    const subtask_id = subtask.subtask_id;

    onSubmit(subtask_id, payload);

    await UpdateFunctions.updateTask(subtask_id, payload);

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

        {/* <form onSubmit={handleSubmit}> */}
        <div className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Project Submission Type</label>
              {["radio"].map((type) => (
                <div
                  className="TaskSubmissionTypeCont"
                  key={`inline-${type}`}
                  // className="mb-3"
                >
                  <p>Project Submission Type</p>
                  <div className="TaskSubmissionType">
                    <Form.Check
                      className="formType"
                      label="Writing"
                      name="subtask_type"
                      type={type}
                      id={`inline-${type}-1`}
                      value={1}
                      checked={formData.subtask_type === 1}
                      onChange={handleChange}
                      required
                    />

                    {/* <OverlayTrigger
                    placement="left"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip(1)}
                  >
                    <img className="InfoSubType" src={InfoB} />
                  </OverlayTrigger> */}
                  </div>
                  <div className="TaskSubmissionType">
                    <Form.Check
                      className="formType"
                      label="Pubmat"
                      name="subtask_type"
                      type={type}
                      id={`inline-${type}-2`}
                      value={2}
                      checked={formData.subtask_type === 2}
                      onChange={handleChange}
                    />

                    {/* <OverlayTrigger
                    placement="left"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip(2)}
                  >
                    <img className="InfoSubType" src={InfoB} />
                  </OverlayTrigger> */}
                  </div>
                </div>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Section</label>
              <select
                name="section_id"
                className="form-select"
                value={formData.section_id}
                onChange={handleChange}
              >
                {sections
                  .filter(
                    (section) =>
                      (formData.subtask_type !== 1 || section.type !== 2) &&
                      (formData.subtask_type !== 2 || section.type !== 1),
                  )
                  .map((section) => (
                    <option key={section.section_id} value={section.section_id}>
                      {section.section_name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Assign To</label>
            <select
              name="assignee_id"
              className="form-select"
              value={formData.assignee_id}
              onChange={handleChange}
              required
            >
              {allUsers.map((member) => (
                <option key={member.uid} value={member.uid}>
                  {member.username} ({member.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input
              name="subtask_title"
              className="form-input"
              value={formData.subtask_title}
              onChange={handleChange}
              placeholder="Add a task title..."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Task Details</label>
            <textarea
              name="subtask_details"
              className="form-textarea"
              value={formData.subtask_details}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Deadline</label>
              <DatePicker
                selected={formData.subtask_deadline}
                onChange={handleDateChange}
                minDate={new Date()}
                minTime={
                  formData.subtask_deadline &&
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
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-primary"
          >
            Save Changes
          </button>
        </div>
        {/* </form> */}
      </div>
    </div>
  );
};

export default EditTaskModal;
