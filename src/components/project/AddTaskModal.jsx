import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import * as ReadFunctions from "../../context/functions/ReadFunctions.js";
import { supabase } from "../../supabaseClient.js";
import { isAuthenticated } from "../../context/auth.js";
import "./AddTaskModal.css";

const AddTaskModal = ({ isOpen, onClose, onSubmit }) => {
  const [searchParams] = useSearchParams();
  const projectID =
    searchParams.get("project_id") ?? searchParams.get("projectID");

  React.useEffect(() => {
    if (projectID) console.log(`Project ID from URL: ${projectID}`);
  }, [projectID])

  const [formData, setFormData] = useState({
    project_id: "",
    section_id: "",
    assignee_id: "",
    subtask_title: "",
    subtask_details: "",
    subtask_type: "",
    // priority: "Medium",
    subtask_deadline: "",
  });

  const [sections, setSections] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setIsLoading] = useState(true);

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

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      project_id: ( projectID ),
      assignee_id: formData.assignee_id,
      section_id: Number(formData.section_id),
      subtask_title: formData.subtask_title || "sample empty title",
      subtask_details: formData.subtask_details,
      subtask_type: formData.subtask_type,
      assignee_id: formData.assignee_id,
      subtask_deadline: formData.subtask_deadline,
      is_done: false
}

console.log("Inserting subtask data:", payload);

    await supabase.from("project_subtask_tbl").insert({
      project_id: ( projectID ),
      assignee_id: formData.assignee_id,
      section_id: Number(formData.section_id),
      subtask_title: formData.subtask_title || "sample empty title",
      subtask_details: formData.subtask_details,
      subtask_type: formData.subtask_type,
      assignee_id: formData.assignee_id,
      subtask_deadline: formData.subtask_deadline,
      is_done: false
    });

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

        {/* <form onSubmit={handleSubmit}> */}
          <div className="modal-body">
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
          {/* </Form> */}
    
          <div className="form-group">
              <label className="form-label">Section</label>
              <select
                name="section_id"
                className="form-select"
                value={formData.section_id}
                onChange={handleChange}
              >
                {sections.filter((section) =>
                                    (formData.subtask_type !== 1 || section.type !== 2) && 
                                    (formData.subtask_type !== 2 || section.type !== 1))
                                    .map((section) => (
                  <option key={section.section_id} value={section.section_id}>
                    {section.section_name}
                  </option>
                ))}
              </select>
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
                <option value="">Select a team member</option>
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
                name="subtask_deadline"
                className="form-input"
                value={formData.subtask_deadline}
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
        {/* </form> */}
      </div>
    </div>
  );
};

export default AddTaskModal;
