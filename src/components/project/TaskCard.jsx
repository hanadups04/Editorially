import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TaskCard.css";

const TaskCard = ({
  subtask,
  onToggleComplete,
  onUploadClick,
  onEditClick,
  type,
}) => {
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(
    subtask.status === "Completed",
  );
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  console.log("jaisjaijsias", subtask);

  const getActionButton = (type) => {
    const actions = {
      1: {
        label: "Open Document",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
        ),
        path: "/document",
      },
      2: {
        label: "Upload Images",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
        ),
        path: "/gallery",
      },
    };

    return actions[type] || actions[1];
  };

  const action = getActionButton(type);

  const handleToggleComplete = () => {
    setIsCompleted(!isCompleted);
    if (onToggleComplete) {
      onToggleComplete(subtask.subtask_id, !isCompleted);
    }
  };

  const handleActionClick = () => {
    if (subtask.subtask_type === 2 && onUploadClick) {
      onUploadClick(subtask.subtask_id);
    } else {
      // Navigate to document page with task info
      navigate(
        `/document?taskId=${subtask.subtask_id}&role=${encodeURIComponent(type)}`,
      );
    }
  };

  return (
    <div className="task-card">
      <button
        className="task-edit-btn"
        onClick={() => onEditClick && onEditClick(subtask)}
        title="Edit Task"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </button>
      <div className="task-header">
        <span
          // className={`task-role ${subtask.role.toLowerCase()}`}
          className="task-role"
        >
          {subtask.users_tbl.roles_tbl.role_name}
        </span>
        <span
          // className={`task-status ${subtask.status.toLowerCase().replace(" ", "-")}`}
          className="task-status"
        >
          {subtask.status}
        </span>
      </div>

      <div className="task-assignee">
        <div className="assignee-avatar">
          {getInitials(subtask.users_tbl.username)}
        </div>
        <div className="assignee-info">
          <div className="assignee-name">{subtask.users_tbl.username}</div>
          <div className="assignee-email">{subtask.users_tbl.email}</div>
        </div>
      </div>

      <p className="task-description">{subtask.subtask_details}</p>

      <div className="task-meta">
        <div className="task-deadline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>Due: {subtask.subtask_deadline}</span>
        </div>
        <div className="badge badge-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
            <line x1="6" y1="1" x2="6" y2="4"></line>
            <line x1="10" y1="1" x2="10" y2="4"></line>
            <line x1="14" y1="1" x2="14" y2="4"></line>
          </svg>
          {/* {task.priority} */}
        </div>
      </div>

      <label
        className="checkbox-wrapper"
        style={{ marginTop: "var(--spacing-md)" }}
      >
        <input
          type="checkbox"
          className="checkbox-input"
          checked={isCompleted}
          onChange={handleToggleComplete}
        />
        <span className="checkbox-label">Mark as complete</span>
      </label>

      <div className="task-actions">
        <button className="btn btn-primary" onClick={handleActionClick}>
          {action.icon}
          {action.label}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
