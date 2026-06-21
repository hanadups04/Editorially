import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../../components/templates/AdminTemplate";
import FilterModal from "./FilterModal";
import CreateProjectModal from "../../components/project/AddProjectModal.jsx";
import * as ReadFunctions from "../../context/functions/ReadFunctions.js";
import * as DeleteFunctions from "../../context/functions/DeleteFunctions";
import ConfirmationModal from "../../components/ArticleManagement/ConfirmationModal";
import * as auth from "../../context/auth.js";
import "./TaskList.css";
import ReactLoading from "react-loading";
import { supabase } from "../../supabaseClient.js";

const TaskList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    step_id: "all",
    deadline: "all",
  });
  const [isCreateProjModalOpen, setIsCreateProjModalOpen] = useState(false);
  const [loading, setIsLoading] = useState(true);
  const [projects, setAllProjects] = useState([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [projToDelete, setProjToDelete] = useState({});
  const [accessLvl, setAccessLvl] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchProjects() {
      try {
        const data = await ReadFunctions.fetchAllProjects();
        if (isMounted) {
          console.log("ako ang data is: ", data);
          setAllProjects(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    async function fetchAccessLvl() {
      try {
        const user = await auth.isAuthenticated();
        const data = await ReadFunctions.getUserProfile(user.data.id);
        if (isMounted) {
          console.log("data is", data);
          setAccessLvl(data.roles_tbl.access_level);
        }
      } catch (error) {
        console.error("Error", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchProjects();
    fetchAccessLvl();

    const subscription = supabase
      .channel("projects-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects_tbl" },
        async (payload) => {
          console.log("Changes Received: ", payload);
          await fetchProjects();
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(subscription);
    };
  }, []);

  // Filter and search projects
  const filteredProjects = projects.filter((project) => {
    const name = (project.title ?? "").toString().toLowerCase();
    const matchesSearch = name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesStatus =
      filters.step_id === "all" || project.step_id === filters.step_id;

    let matchesDeadline = true;
    if (filters.deadline !== "all") {
      const rawDeadline = project.deadline ?? null;
      const projectDate = rawDeadline ? new Date(rawDeadline) : null;

      if (projectDate && !isNaN(projectDate.getTime())) {
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
      } else {
        // No valid deadline → treat as not matching time-based filters
        matchesDeadline = false;
      }
    }

    return matchesSearch && matchesStatus && matchesDeadline;
  });

  // const [searchParams] = useSearchParams();

  // useEffect(() => {
  //   const projectID = searchParams.get("project_id");
  //   if (projectID) {
  //     setValue(projectID);
  //     console.log(`id value is: ${projectID}`);
  //   }
  // }, [searchParams]);

  const handleProjectClick = (project_id) => {
    navigate(`/tasks?project_id=${project_id}`);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setIsFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({ step_id: "all", deadline: "all" });
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== "all",
  ).length;

  const handleDeleteProject = async (project_id) => {
    const deleteProj = await DeleteFunctions.deleteProject(project_id);
    // setDeleteConfirmOpen(true);
    console.log("del proj", project_id);
  };

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
              className="admin-btn btn-secondary"
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
              <button
                className="admin-btn btn-text"
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="projects-stats">
          <span className="stats-text">
            Showing {filteredProjects.length} of {projects.length} projects
          </span>

          <button
            className="admin-btn btn-primary"
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
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ReactLoading
                type="spinningBubbles"
                color="#133e87"
                height={60}
                width={60}
              />
            </div>
          ) : (
            <>
              {filteredProjects.map((project) => {
                const date = new Date(project.deadline).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  },
                );
                return (
                  <div
                    key={project.project_id}
                    className="project-card"
                    onClick={() => handleProjectClick(project.project_id)}
                  >
                    <div className="project-card-header">
                      <h3 className="project-title">{project.title}</h3>
                      <span
                        className={`task-status ${project.project_steps_tbl.step_name
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {project.project_steps_tbl.step_name}
                      </span>
                      {accessLvl === 1 || accessLvl === 2 ? (
                        <></>
                      ) : (
                        <button
                          type="button"
                          className="project-delete-btn"
                          aria-label="Delete project"
                          title="Delete project"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmOpen(true);
                            setProjToDelete(project.project_id);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                            <path d="M10 11v6"></path>
                            <path d="M14 11v6"></path>
                            <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      )}
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
                          <span>{date}</span>
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
                          <span>{project.sections_tbl.section_name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

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
            </>
          )}
        </div>
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
      />

      {isCreateProjModalOpen && (
        <CreateProjectModal onClose={() => setIsCreateProjModalOpen(false)} />
      )}

      <ConfirmationModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
        }}
        onConfirm={() => {
          handleDeleteProject(projToDelete);
        }}
        title="Delete Project"
        message="Are you sure you want to Delete this project?."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </Layout>
  );
};

export default TaskList;
