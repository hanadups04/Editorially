import React, { useState } from "react";
import "./TaskCard.css";

const TaskCard = ({ task, onToggleComplete, onUploadClick }) => {
  const [isCompleted, setIsCompleted] = useState(task.status === "Completed");
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getActionButton = (role) => {
    const actions = {
      writer: {
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
        path: "/docs",
      },
      layout: {
        label: "Open Canvas",
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
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        ),
        path: "/canvas",
      },
      editor: {
        label: "Review Content",
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
            <polyline points="9 11 12 14 22 4"></polyline>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
        ),
        path: "/review",
      },
      photographer: {
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

    return actions[role.toLowerCase()] || actions.writer;
  };

  const action = getActionButton(task.role);

  const handleToggleComplete = () => {
    setIsCompleted(!isCompleted);
    if (onToggleComplete) {
      onToggleComplete(task.id, !isCompleted);
    }
  };

  const handleActionClick = () => {
    if (task.role.toLowerCase() === "photographer" && onUploadClick) {
      onUploadClick();
    }
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <span className={`task-role ${task.role.toLowerCase()}`}>
          {task.role}
        </span>
        <span
          className={`task-status ${task.status
            .toLowerCase()
            .replace(" ", "-")}`}
        >
          {task.status}
        </span>
      </div>

      <div className="task-assignee">
        <div className="assignee-avatar">{getInitials(task.assignee.name)}</div>
        <div className="assignee-info">
          <div className="assignee-name">{task.assignee.name}</div>
          <div className="assignee-email">{task.assignee.email}</div>
        </div>
      </div>

      <p className="task-description">{task.description}</p>

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
          <span>Due: {task.deadline}</span>
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
          {task.priority}
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
        <button className="btn btn-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          Comment
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
