import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/templates/AdminTemplate";
import FilterModal from "./FilterModal";
import "./TaskList.css";

const TaskList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    deadline: "all",
  });
  const [isCreateProjModalOpen, setIsCreateProjModalOpen] = useState(false);

  // Sample projects data
  const allProjects = [
    {
      id: 1,
      name: "Spring 2025 Feature: Campus Sustainability Initiative",
      deadline: "March 15, 2025",
      status: "In Progress",
      section: "Features",
    },
    {
      id: 2,
      name: "Student Government Elections Coverage",
      deadline: "February 28, 2025",
      status: "Review",
      section: "News",
    },
    {
      id: 3,
      name: "Arts & Culture: Spring Theater Production",
      deadline: "April 5, 2025",
      status: "Pending",
      section: "Arts & Culture",
    },
    {
      id: 4,
      name: "Sports: Basketball Season Recap",
      deadline: "March 20, 2025",
      status: "In Progress",
      section: "Sports",
    },
    {
      id: 5,
      name: "Opinion: Campus Mental Health Resources",
      deadline: "February 25, 2025",
      status: "Completed",
      section: "Opinion",
    },
    {
      id: 6,
      name: "Technology: AI in Education",
      deadline: "March 30, 2025",
      status: "Pending",
      section: "Technology",
    },
    {
      id: 7,
      name: "Community: Local Business Spotlight",
      deadline: "March 12, 2025",
      status: "In Progress",
      section: "Community",
    },
    {
      id: 8,
      name: "Special Report: Student Housing Crisis",
      deadline: "April 15, 2025",
      status: "Pending",
      section: "Special Reports",
    },
  ];

  // Filter and search projects
  const filteredProjects = allProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.section.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filters.status === "all" || project.status === filters.status;

    let matchesDeadline = true;
    if (filters.deadline !== "all") {
      const projectDate = new Date(project.deadline);
      const today = new Date();
      const diffTime = projectDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (filters.deadline === "overdue") {
        matchesDeadline = diffDays < 0;
      } else if (filters.deadline === "thisWeek") {
        matchesDeadline = diffDays >= 0 && diffDays <= 7;
      } else if (filters.deadline === "thisMonth") {
        matchesDeadline = diffDays >= 0 && diffDays <= 30;
      } else if (filters.deadline === "upcoming") {
        matchesDeadline = diffDays > 30;
      }
    }

    return matchesSearch && matchesStatus && matchesDeadline;
  });

  const handleProjectClick = (projectId) => {
    navigate("/tasks");
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setIsFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({ status: "all", deadline: "all" });
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== "all",
  ).length;

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-text">
            <h1>Projects</h1>
            <p>Manage all your publication projects</p>
          </div>
        </div>

        <div className="dashboard-controls">
          <div className="search-box">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <button
              className="btn btn-secondary"
              onClick={() => setIsFilterModalOpen(true)}
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
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              Filters
              {activeFiltersCount > 0 && (
                <span className="filter-badge">{activeFiltersCount}</span>
              )}
            </button>
            {activeFiltersCount > 0 && (
              <button className="btn btn-text" onClick={handleClearFilters}>
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="projects-stats">
          <span className="stats-text">
            Showing {filteredProjects.length} of {allProjects.length} projects
          </span>

          <button
            className="btn btn-primary"
            onClick={() => setIsCreateProjModalOpen(true)}
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
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create Project
          </button>
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="project-card"
              onClick={() => handleProjectClick(project.id)}
            >
              <div className="project-card-header">
                <h3 className="project-title">{project.name}</h3>
                <span
                  className={`task-status ${project.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {project.status}
                </span>
              </div>
              <div className="project-card-body">
                <div className="project-info-row">
                  <div className="project-info-item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>{project.deadline}</span>
                  </div>
                </div>
                <div className="project-info-row">
                  <div className="project-info-item">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>{project.section}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="empty-state">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <h3>No projects found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
      />
    </Layout>
  );
};

export default TaskList;
