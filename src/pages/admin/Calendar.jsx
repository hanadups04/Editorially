import React, { useState, useMemo } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/templates/AdminTemplate";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Calendar.css";

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const navigate = useNavigate();

  // Sample projects data (same as Dashboard)
  const allProjects = [
    {
      id: 1,
      name: "Website Redesign",
      deadline: "2025-11-04",
      status: "In Progress",
      section: "Design",
    },
    {
      id: 2,
      name: "Mobile App Development",
      deadline: "2025-11-10",
      status: "Pending",
      section: "Development",
    },
    {
      id: 3,
      name: "Marketing Campaign",
      deadline: "2025-11-15",
      status: "In Progress",
      section: "Marketing",
    },
    {
      id: 4,
      name: "Database Migration",
      deadline: "2025-11-20",
      status: "Review",
      section: "Backend",
    },
    {
      id: 5,
      name: "User Research",
      deadline: "2025-11-25",
      status: "Pending",
      section: "Research",
    },
    {
      id: 6,
      name: "API Integration",
      deadline: "2025-12-05",
      status: "In Progress",
      section: "Development",
    },
  ];

  // Filter out completed projects
  const activeProjects = allProjects.filter(
    (project) => project.status !== "Completed"
  );

  // Get color based on days until deadline
  const getDeadlineColor = (deadline) => {
    const now = moment();
    const deadlineDate = moment(deadline);
    const daysUntil = deadlineDate.diff(now, "days");

    if (daysUntil <= 2) return "#ef4444"; // red
    if (daysUntil <= 5) return "#f97316"; // orange
    return "#22c55e"; // green
  };

  // Convert projects to calendar events
  const events = useMemo(() => {
    return activeProjects.map((project) => ({
      id: project.id,
      title: project.name,
      start: new Date(project.deadline),
      end: new Date(project.deadline),
      resource: project,
      color: getDeadlineColor(project.deadline),
    }));
  }, []);

  // Handle event click
  const handleSelectEvent = (event) => {
    navigate("/project", { state: { project: event.resource } });
  };

  // Custom event style
  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: "5px",
        opacity: 0.9,
        color: "white",
        border: "none",
        display: "block",
        fontWeight: "500",
        padding: "4px 8px",
      },
    };
  };

  return (
    <Layout>
      <div className="calendar-page">
        <div className="calendar-header">
          <h1>Project Deadlines</h1>
          <div className="calendar-legend">
            <div className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: "#ef4444" }}
              ></span>
              <span>≤ 2 days</span>
            </div>
            <div className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: "#f97316" }}
              ></span>
              <span>≤ 5 days</span>
            </div>
            <div className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: "#22c55e" }}
              ></span>
              <span>≥ 1 week</span>
            </div>
          </div>
        </div>
        <div className="calendar-container">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 700 }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            views={["month", "week", "day"]}
            defaultView="month"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Calendar;
