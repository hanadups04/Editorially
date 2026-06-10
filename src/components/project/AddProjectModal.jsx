import React, { useState, useEffect, useRef } from "react";
// import "./Add.css";
// import Close from "../assets/images/close.png";
// import InfoB from "../assets/images/InfoB.png";
// import InputTemplate from "./InputTemplate.jsx";
// import ModalTemplate from "./ModalTemplate.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import UpdateFunctions from "../context/functions/UpdateFunctions.js";
import * as ReadFunctions from "../../context/functions/ReadFunctions.js";
import { supabase } from "../../supabaseClient.js";
import { isAuthenticated } from "../../context/auth.js";

import * as AddFunctions from "../../context/functions/AddFunctions.js";
// import { useAdminContext } from "../../context/Context.jsx";
import { Key } from "slate-dom";
// import OverlayTrigger from "react-bootstrap/OverlayTrigger";
// import Tooltip from "react-bootstrap/Tooltip";
// import Form from "react-bootstrap/Form";
// import AlertsNConfirmsModal from "../alertsNConfirmations/AlertsNConfirmsModal.jsx";

export default function CreateParentTaskModal({
  onClose,
  sectionType,
  topicId,
  isEditing = false,
  topicInfo = {},
  hideCancel = false,
  branchData,
  secType,
  onAdd,
}) {
  const [sections, setSections] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const dateModified = useRef(false);

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

  const [formData, setFormData] = useState({
    title: "",
    details: "",
    deadline: new Date(),
    section_id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setSelectedDateTime(date);
    setFormData((prev) => ({ ...prev, deadline: date }));
    dateModified.current = true;
  };

  const [error, setError] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("formdataaaa", formData);

    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      console.error("Not authenticated:", userErr);
      return;
    }

    const data = {
      owner_id: userData.user.id,
      step_id: 1,
      section_id: Number(formData.section_id),
      title: formData.title,
      deadline: selectedDateTime?.toISOString(),
      details: formData.details,
    };

    // console.log(data);

    const { error } = await supabase.from("projects_tbl").insert({
      owner_id: userData.user.id,
      step_id: 1,
      section_id: Number(formData.section_id),
      title: formData.title,
      deadline: selectedDateTime?.toISOString(),
      details: formData.details,
      // status: "Proposed",
    });

    if (error) {
      console.error(error);
      // setShowAlertError(true);
      return;
    }

    // setShowAlertSuccess(true);
    if (onAdd) onAdd();
    onClose();
  };

  return (
    <>
      <div className="CreateParentTaskModal-Parent admin-overlay">
        <div className="CreateParentTaskModal-Parent admin-modal">
          <div className="admin-header">
            <h2 className="admin-title">Create New Project</h2>
            <button className="admin-close" onClick={onClose}>
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

          <div className="admin-body">
            <div className="form-group">
              <label className="form-label">Project Title</label>
              <input
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                placeholder="Add a project title..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Deadline</label>
              <DatePicker
                selected={selectedDateTime}
                onChange={handleDateChange}
                minDate={new Date()}
                minTime={
                  selectedDateTime &&
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

            <div className="form-group">
              <label className="form-label">Details</label>
              <textarea
                name="details"
                className="form-input"
                value={formData.details}
                onChange={handleChange}
                placeholder="Add project details..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Section</label>
              <select
                name="section_id"
                className="form-select"
                value={formData.section_id}
                onChange={handleChange}
              >
                <option>Select A Section</option>
                {sections.map((section) => (
                  <option key={section.section_id} value={section.section_id}>
                    {section.section_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="admin-footer">
            <button
              type="button"
              className="admin-btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="admin-btn btn-primary"
            >
              Create Project
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
