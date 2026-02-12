import React from "react";
import "./ProjectInfo.css";

export default function ProjectInfo({ project, onEditClick }) {
  return (
    <div className="card project-info">
      <div className="card-header">
        <div className="card-header-top">
          <h1 className="card-title">{project.title}</h1>
          <button className="btn btn-secondary btn-sm" onClick={onEditClick}>
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
            Edit Project
          </button>
        </div>
        <p className="card-subtitle">{project.description}</p>
      </div>
      <div className="info-grid">
        <div className="info-item">
          <span className="info-label">Publication Date</span>
          <span className="info-value">{project.publicationDate}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Issue</span>
          <span className="info-value">{project.issue}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Category</span>
          <span className="info-value">{project.category}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Status</span>
          <span className="info-value">
            <span
              className={`task-status ${project.status.toLowerCase().replace(" ", "-")}`}
            >
              {project.status}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
