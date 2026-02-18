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
import "./ProjectPage.css";

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

  useEffect(() => {
    if (projectID) console.log(`Project ID from URL: ${projectID}`);
  }, [projectID]);

  const [project, setProject] = useState({});
  const [subtasks, setSubtasks] = useState([]);
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchSpecificProject() {
      try {
        const data = await ReadFunctions.fetchSingleProject(projectID);
        if (isMounted) {
          console.log("ass is: ", data);
          setProject(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    async function fetchTasks() {
      try {
        const data = await ReadFunctions.fetchAllTasks(projectID);
        if (isMounted) {
          console.log("subtask is", data);
          setSubtasks(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchTasks();
    fetchSpecificProject();
    return () => {
      isMounted = false;
    };
  }, []);

  // Workflow steps
  const workflowSteps = [
    { step_id: "1", label: "Proposed" },
    { step_id: "2", label: "Pending Approval" },
    { step_id: "3", label: "Approved - Pending Assignment" },
    { step_id: "4", label: "In Progress" },
    { step_id: "5", label: "Submitted for Review" },
    { step_id: "6", label: "Revisions Required" },
    { step_id: "7", label: "Approved for Posting" },
    { step_id: "8", label: "Published" },
  ];

  // Initialize tasks on first render
  React.useEffect(() => {
    // setTasks(initialTasks);
  }, []);

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
    setTasks((prev) => [...prev, task]);
  };

  const handleToggleComplete = (taskId, isCompleted) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
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

  if (loading) {
    return (
      <Layout>
        <div className="content-detail">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ProjectInfo
        // project={projectID}
        title={project.title}
        description={project.details}
        deadline={project.deadline}
        section={
          Array.isArray(project?.sections_tbl)
            ? project.sections_tbl?.[0]?.section_name
            : (project?.sections_tbl?.section_name ?? "")
        }
        status={project.status}
        onEditClick={() => setIsEditProjectModalOpen(true)}
      />
      {project.step_id === 2 && (
        <div className="Project-ApproveRejectBtnsCont">
          <h4 className="BtnsTitle">Approve this Proposed Article? </h4>
          <div className="Project-ApproveRejectBtns">
            <button
              className="btn btn-primary"
              onClick={() => UpdateFunctions.approveProject(projectID)}
            >
              APPROVE
            </button>
            <button
              className="btn btn-delete"
              onClick={() => UpdateFunctions.rejectProject(projectID)}
            >
              REJECT
            </button>
          </div>
        </div>
      )}

      <ProgressTracker currentStep={project.step_id} steps={workflowSteps} />

      <div className="tasks-section">
        <div className="section-header">
          <h2 className="section-title">Team Tasks</h2>
          <button
            className="btn btn-primary"
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
        </div>

        <div className="tasks-grid">
          {Array.isArray(subtasks) &&
            subtasks.map((subtask) => (
              <TaskCard
                key={subtask.subtask_id}
                subtask={subtask}
                type={subtask.subtask_type}
                onToggleComplete={handleToggleComplete}
                onUploadClick={() => {
                  setTaskId(subtask.subtask_id);
                  setIsUploadModalOpen(true);
                }}
                onEditClick={handleEditTaskClick}
              />
            ))}
        </div>
      </div>

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSubmit={handleAddTask}
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
      />
    </Layout>
  );
};

export default ProjectPage;
