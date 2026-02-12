import React, { useState } from "react";
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
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [searchParams] = useSearchParams();
  const projectID =
    searchParams.get("project_id") ?? searchParams.get("projectID");

  React.useEffect(() => {
    if (projectID) console.log(`Project ID from URL: ${projectID}`);
  }, [projectID]);

  // Sample project data
  const [project, setProject] = useState({
    title: "Spring 2025 Feature: Campus Sustainability Initiative",
    description:
      "A comprehensive feature article covering the university's new sustainability programs and student-led environmental initiatives.",
    publicationDate: "March 15, 2025",
    issue: "Vol. 45, Issue 3",
    category: "Feature Article",
    status: "In Progress",
  });

  // Workflow steps
  const workflowSteps = [
    { id: "submitted", label: "Submitted" },
    { id: "approved", label: "Approved" },
    { id: "assigned", label: "Assigned" },
    { id: "in-progress", label: "In Progress" },
    { id: "review", label: "Review" },
    { id: "completed", label: "Completed" },
  ];

  // Initialize tasks on first render
  React.useEffect(() => {
    setTasks(initialTasks);
  }, []);

  // Sample tasks with different assignees
  const initialTasks = [
    {
      id: 1,
      role: "Writer",
      assignee: {
        name: "Sarah Johnson",
        email: "sarah.j@university.edu",
      },
      description:
        "Research and write the main feature article about campus sustainability initiatives. Include interviews with at least 5 key stakeholders.",
      status: "In Progress",
      deadline: "March 10, 2025",
      priority: "High",
    },
    {
      id: 2,
      role: "Layout",
      assignee: {
        name: "Michael Chen",
        email: "michael.c@university.edu",
      },
      description:
        "Design the layout for the 2-page spread. Incorporate infographics showing sustainability statistics and student survey results.",
      status: "Pending",
      deadline: "March 12, 2025",
      priority: "High",
    },
    {
      id: 3,
      role: "Photographer",
      assignee: {
        name: "Emma Rodriguez",
        email: "emma.r@university.edu",
      },
      description:
        "Capture photos of the new solar panels, recycling stations, and student volunteers. Need at least 15 high-quality images.",
      status: "In Progress",
      deadline: "March 8, 2025",
      priority: "High",
    },
    {
      id: 4,
      role: "Editor",
      assignee: {
        name: "David Kim",
        email: "david.k@university.edu",
      },
      description:
        "Review and edit the article for grammar, style, and AP format compliance. Provide feedback to the writer.",
      status: "Pending",
      deadline: "March 11, 2025",
      priority: "Medium",
    },
    {
      id: 5,
      role: "Writer",
      assignee: {
        name: "Jessica Martinez",
        email: "jessica.m@university.edu",
      },
      description:
        "Write sidebar piece on student perspectives and personal sustainability stories. Target 500 words.",
      status: "In Progress",
      deadline: "March 9, 2025",
      priority: "Medium",
    },
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
  };

  const handleEditTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
  };

  const handleEditTaskClick = (task) => {
    setSelectedTask(task);
    setIsEditTaskModalOpen(true);
  };

  return (
    <Layout>
      <ProjectInfo
        project={project}
        onEditClick={() => setIsEditProjectModalOpen(true)}
      />
      <div>
        <button
          className="btn btn-primary"
          onClick={() => UpdateFunctions.approveProject(projectID)}
        >
          APPROVE
        </button>
        <h2>Project ID: {projectID}</h2>
        <button
          className="btn btn-primary"
          onClick={() => UpdateFunctions.rejectProject(projectID)}
        >
          REJECT
        </button>
      </div>
      <ProgressTracker currentStep="in-progress" steps={workflowSteps} />

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
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onUploadClick={() => setIsUploadModalOpen(true)}
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
        task={selectedTask}
        onSubmit={handleEditTask}
      />

      <UploadImagesModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </Layout>
  );
};

export default ProjectPage;
