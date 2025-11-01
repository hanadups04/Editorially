import React from "react";
import "./ProjectInfo.css";

const ProjectInfo = ({ project }) => {
  return (
    <div className="card project-info">
      <div className="card-header">
        <h1 className="card-title">{project.title}</h1>
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
              className={`task-status ${project.status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {project.status}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
