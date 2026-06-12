import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../../components/templates/AdminTemplate";
// import ProjectInfo from "../../components/project/ProjectInfo";
import ProjectInfo from "../../components/project/ProjectInfo";
import ProgressTracker from "../../components/project/ProgressTracker";
import TaskCard from "../../components/project/TaskCard";
import AddTaskModal from "../../components/project/AddTaskModal";
import EditProjectModal from "../../components/project/EditProjectModal";
import UploadImagesModal from "../../components/project/UploadImagesModa";
import EditTaskModal from "../../components/project/EditTaskModal";
import * as ReadFunctions from "../../context/functions/ReadFunctions.js";
import * as UpdateFunctions from "../../context/functions/UpdateFunctions.js";
import * as auth from "../../context/auth";
import "./ProjectPage.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient.js";

const ProjectPage = () => {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  const [searchParams] = useSearchParams();
  const projectID =
    searchParams.get("project_id") ?? searchParams.get("projectID");

  const [project, setProject] = useState({});
  const [subtasks, setSubtasks] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState([]);
  const [userSection, setUserSection] = useState([]);
  const [userId, setUserId] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const [projectData, tasksData] = await Promise.all([
          ReadFunctions.fetchSingleProject(projectID),
          ReadFunctions.fetchAllTasks(projectID),
        ]);

        if (isMounted) {
          console.log("project data is: ", projectData);
          console.log("subtasks are: ", tasksData);
          setProject(projectData);
          setSubtasks(tasksData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) {
          setIsLoading(false); // Now this waits for data to arrive
        }
      }
    }

    async function fetchRole() {
      try {
        const user = await auth.isAuthenticated();
        console.log("user", user.data.id);
        const data = await ReadFunctions.getUserProfile(user.data.id);
        if (isMounted) {
          console.log("user role is", data);
          setUserRole(data.roles_tbl.role_id);
          setUserSection(data.sections_tbl.section_id);
          setUserId(data.uid);
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchRole();

    fetchData();

    const subscription = supabase
      .channel("subtask-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "project_subtask_tbl" },
        async (payload) => {
          console.log("Changes Received: ", payload);
          await fetchData();
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects_tbl" },
        async (payload) => {
          console.log("project change:", payload);
          await fetchData();
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(subscription);
    };
  }, []);

  // Workflow steps
  const workflowSteps = [
    { step_id: "1", label: "Proposed" },
    { step_id: "2", label: "Approval" },
    { step_id: "3", label: "In Progress" },
    { step_id: "4", label: "Published" },
  ];

  const handleAddTask = (newTask) => {
    const task = {
      id: tasks.length + 1,
      role:
        newTask.taskType.charAt(0).toUpperCase() + newTask.taskType.slice(1),
      assignee: {
        name: newTask.assignee,
        email:
          newTask.assignee.toLowerCase().replace(" ", ".") + "@university.edu",
      },
      description: newTask.description,
      status: "Pending",
      deadline: new Date(newTask.deadline).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      priority: newTask.priority,
    };
    setSubtasks((prev) => [...prev, task]);
  };

  const handleToggleComplete = (taskId, isCompleted) => {
    setSubtasks((prev) =>
      prev.map((task) =>
        task.subtask_id === taskId
          ? { ...task, status: isCompleted ? "Completed" : "In Progress" }
          : task,
      ),
    );
  };

  const handleEditProject = (updatedProject) => {
    setProject(updatedProject);
    setProject((prev) => ({
      ...prev,
      ...updatedProject,
    }));
  };

  const handleEditTask = (subtask_id, updatedTask) => {
    // setSubtasks(subtask_id, updatedTask);
    setSubtasks((prev) =>
      Array.isArray(prev)
        ? prev.map((st) =>
            st.subtask_id === subtask_id ? { ...st, ...updatedTask } : st,
          )
        : prev,
    );
  };

  const handleEditTaskClick = (subtask) => {
    setSelectedTask(subtask);
    setIsEditTaskModalOpen(true);
  };

  const formattedDeadline = new Date(project.deadline).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  if (loading) {
    return (
      <Layout>
        <div className="content-detail">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      {(project.step_id == 1 || project.step_id == 2) &&
        (userRole === "role-0002" || userRole === "role-0006") && (
          <div className="Project-ApproveRejectBtnsCont">
            <div className="Project-BtnsContent">
              <p className="BtnsTitle">
                Do you want to Approve or Reject this Project?
              </p>
            </div>
            <div className="Project-Buttons">
              <button
                className="admin-btn btn-success"
                onClick={() => UpdateFunctions.approveProject(projectID)}
              >
                APPROVE
              </button>
              <button
                className="admin-btn btn-delete"
                onClick={() => UpdateFunctions.rejectProject(projectID)}
              >
                REJECT
              </button>
            </div>
          </div>
        )}

      <ProjectInfo
        // project={projectID}
        title={project.title}
        description={project.details}
        deadline={formattedDeadline}
        section={project.sections_tbl?.section_name}
        status={project.project_steps_tbl?.step_name}
        roleId={userRole}
        onEditClick={() => setIsEditProjectModalOpen(true)}
      />

      {/* {(project.step_id == "1" || project.step_id == "2") && (
        <div>
          <button
            className="admin-btn btn-primary"
            onClick={() => UpdateFunctions.approveProject(projectID)}
          >
            APPROVE
          </button>
          <button
            className="admin-btn btn-primary"
            onClick={() => UpdateFunctions.rejectProject(projectID)}
          >
            REJECT
          </button>
        </div>
      )} */}

      <ProgressTracker currentStep="in-progress" steps={workflowSteps} />

      {subtasks.length > 0 &&
        subtasks.every((t) => t.status === "Completed") && (
          <div className="construct-banner">
            <div className="construct-banner-text">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>
                All tasks are completed and approved. Ready to construct the
                article.
              </span>
            </div>
            <button
              className="admin-btn btn-primary"
              onClick={() =>
                navigate(
                  `/create-article/${projectID}?section_id=${project.section_id}`,
                )
              }
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
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              Construct Article
            </button>
          </div>
        )}

      <div className="tasks-section">
        <div className="section-header">
          <h2 className="section-title">Team Tasks</h2>
          {(project.step_id === "3" ||
            project.step_id === "4" ||
            project.step_id === "5") &&
            (userRole === "role-0002" || userRole === "role-0006") && (
              <button
                className="admin-btn btn-primary"
                onClick={() => setIsAddTaskModalOpen(true)}
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
                Add Task
              </button>
            )}
        </div>

        <div className="tasks-grid">
          {subtasks.map((subtask) => (
            <TaskCard
              key={subtask.subtask_id}
              subtask={subtask}
              onToggleComplete={handleToggleComplete}
              onUploadClick={(subtaskId) => {
                setIsUploadModalOpen(true);
                setTaskId(subtaskId);
              }}
              onEditClick={handleEditTaskClick}
              task={subtask.subtask_type}
              projectId={projectID}
              roleId={userRole}
              sectionId={userSection}
              userId={userId}
            />
          ))}
        </div>
      </div>

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSubmit={handleAddTask}
        section_id={project.section_id}
      />

      <EditProjectModal
        isOpen={isEditProjectModalOpen}
        onClose={() => setIsEditProjectModalOpen(false)}
        project={project}
        onSubmit={handleEditProject}
      />

      <EditTaskModal
        isOpen={isEditTaskModalOpen}
        onClose={() => {
          setIsEditTaskModalOpen(false);
          setSelectedTask(null);
        }}
        subtask={selectedTask}
        onSubmit={handleEditTask}
      />

      <UploadImagesModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        taskId={taskId}
        project_id={projectID}
      />
    </Layout>
  );
};

export default ProjectPage;
