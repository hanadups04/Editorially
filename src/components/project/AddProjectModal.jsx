import React, { useState, useEffect, useRef } from "react";
import "./CreateParentTaskModal.css";
import Close from "../assets/images/close.png";
import InfoB from "../assets/images/InfoB.png";
import InputTemplate from "./InputTemplate.jsx";
import ModalTemplate from "./ModalTemplate.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import UpdateFunctions from "../context/functions/UpdateFunctions.js";
import AddFunctions from "../context/functions/AddFunctions.js";
import { useAdminContext } from "../context/AdminContext.jsx";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Form from "react-bootstrap/Form";
import AlertsNConfirmsModal from "../alertsNConfirmations/AlertsNConfirmsModal.jsx";

export default function CreateParentTaskModal({
  onClose,
  sectionType,
  topicId,
  isEditing = false,
  topicInfo = {},
  hideCancel = false,
  branchData,
  secType,
}) {
  const { sections, userRole } = useAdminContext();
  const { createTopic } = AddFunctions();

  const [formData, setFormData] = useState({
    title: "",
    details: "",
    deadline: new Date(),
    submissionType: "",
    // pubmatArtist: "",
    autoCreateSubtasks: false,
    assignedForPubmat: "",
    assignedForWriting: "",
    assignedForPhotography: "",
    secForChecking: "",
    photographySection: "",
    // priority: "",
  });

  const [error, setError] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertError, setShowAlertError] = useState(false);

  return (
    <>
      <div className="CreateParentTaskModal-Parent modal-overlay">
        <div className="CreateParentTaskModal-Parent modal">
          <div className="modal-header">
            <h2 className="modal-title">Create New Project</h2>
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

          <div className="modal-body">
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
          </div>
        </div>
      </div>

      {/* {showAlertSuccess && (
        <AlertsNConfirmsModal
          show={showAlertSuccess}
          onHide={() => onclose()}
          type="success"
          title="Project Created Successfully!"
          message="Project has been Created successfully."
        />
      )}

      {showAlertError && (
        <AlertsNConfirmsModal
          show={showAlertError}
          onHide={() => setShowAlertError(false)}
          type="error"
          title="An Error Occured!"
          message="Unable to create the Project. Please try again."
        />
      )} */}
    </>
  );
}
