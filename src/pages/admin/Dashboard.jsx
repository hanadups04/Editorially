import React from "react";
import "./Dashboard.css";
// import { ChartContainer } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Layout from "../../components/templates/AdminTemplate";

const Dashboard = () => {
  // Sample data for stats
  const stats = [
    { label: "Ongoing Projects", value: 12, change: "+3", trend: "up" },
    { label: "For Proposal", value: 8, change: "+2", trend: "up" },
    { label: "Completed", value: 45, change: "+5", trend: "up" },
    { label: "Overdue Tasks", value: 3, change: "-2", trend: "down" },
  ];

  // Placeholder data for charts
  const projectsByMonth = [
    { month: "Jan", projects: 12 },
    { month: "Feb", projects: 15 },
    { month: "Mar", projects: 10 },
    { month: "Apr", projects: 18 },
    { month: "May", projects: 14 },
    { month: "Jun", projects: 16 },
  ];

  const statusDistribution = [
    { name: "Ongoing", value: 12 },
    { name: "For Proposal", value: 8 },
    { name: "Review", value: 5 },
    { name: "Completed", value: 45 },
  ];

  const COLORS = ["#6366f1", "#f59e0b", "#8b5cf6", "#10b981"];

  const recentActivities = [
    {
      project: "Modern Kitchen Renovation",
      activity: "Task completed",
      time: "2 hours ago",
    },
    {
      project: "Office Space Redesign",
      activity: "Status updated",
      time: "5 hours ago",
    },
    {
      project: "Luxury Bathroom Update",
      activity: "New task added",
      time: "1 day ago",
    },
    {
      project: "Living Room Makeover",
      activity: "Images uploaded",
      time: "2 days ago",
    },
  ];

  return (
    <Layout>
      <div className="overview-page">
        <div className="overview-header">
          <h1>Project Overview</h1>
          <p className="overview-subtitle">
            Track your project performance and activities
          </p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card card">
              <div className="stat-label">{stat.label}</div>
              <div className="stat-value">{stat.value}</div>
              <div className={`stat-change ${stat.trend}`}>
                <span>{stat.change}</span>
                <span className="stat-period">this month</span>
              </div>
            </div>
          ))}
        </div>

        <div className="charts-grid">
          <div className="chart-card card">
            <div className="card-header">
              <h2 className="card-title">Projects by Month</h2>
              <p className="card-subtitle">Monthly project creation trend</p>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={projectsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="projects"
                    fill="#6366f1"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-card card">
            <div className="card-header">
              <h2 className="card-title">Project Status Distribution</h2>
              <p className="card-subtitle">Current project breakdown</p>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="activity-section card">
          <div className="card-header">
            <h2 className="card-title">Recent Activity</h2>
            <p className="card-subtitle">Latest updates across all projects</p>
          </div>
          <div className="activity-list">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div className="activity-content">
                  <div className="activity-project">{activity.project}</div>
                  <div className="activity-description">
                    {activity.activity}
                  </div>
                </div>
                <div className="activity-time">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
