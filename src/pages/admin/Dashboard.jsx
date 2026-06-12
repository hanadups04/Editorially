import React, { useEffect, useState } from "react";
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
import * as ReadFunctions from "../../context/functions/ReadFunctions";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [ongoing, setOngoing] = useState(0);
  const [proposal, setProposal] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [overdue, setOverdue] = useState(0);
  const [stats, setStats] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [months, setMonths] = useState([]);
  const [steps, setSteps] = useState([]);
  const year = new Date().getFullYear();

  useEffect(() => {
    let isMounted = true;

    async function fetchDatas() {
      try {
        const projects = await ReadFunctions.getProjectsLength();
        const proposals = await ReadFunctions.getForProposal();
        const posted = await ReadFunctions.getPosted();
        const over = await ReadFunctions.getOverdue();
        const monthly = await ReadFunctions.projectsByMonth();
        const step = await ReadFunctions.getProjectByStep();

        if (isMounted) {
          setSuccess("yehey sakses");
          setOngoing(projects);
          setProposal(proposals);
          setCompleted(posted);
          setOverdue(over);
          setMonths(monthly);
          setSteps(step);

          console.log("eto data mo tol: ", step);
        }
      } catch (error) {
        setError("Something went wrong. Please try again later");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDatas();

    return () => {
      isMounted = false;
      setError("");
      setSuccess("");
    };
  }, []);

  const COLORS = ["#6366f1", "#f59e0b", "#8b5cf6", "#10b981"];

  if (loading) {
    return (
      <Layout>
        <div className="content-detail">Loading...</div>
      </Layout>
    );
  }

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
          {/* {stats.map((stat, index) => ( */}
          <div key="ongoing" className="stat-card card">
            <div className="stat-label">Ongoing Projects</div>
            <div className="stat-value">{ongoing}</div>
            {/* <div className={`stat-change ${stat.trend}`}> */}
            {/* <span>{stat.change}</span> */}
            {/* <span className="stat-period">this month</span> */}
            {/* </div> */}
          </div>
          <div key="proposal" className="stat-card card">
            <div className="stat-label">For Proposal</div>
            <div className="stat-value">{proposal}</div>
            {/* <div className={`stat-change ${stat.trend}`}> */}
            {/* <span>{stat.change}</span> */}
            {/* <span className="stat-period">this month</span> */}
            {/* </div> */}
          </div>
          <div key="complete" className="stat-card card">
            <div className="stat-label">Completed</div>
            <div className="stat-value">{completed}</div>
            {/* <div className={`stat-change ${stat.trend}`}> */}
            {/* <span>{stat.change}</span> */}
            {/* <span className="stat-period">this month</span> */}
            {/* </div> */}
          </div>
          <div key="overdue" className="stat-card card">
            <div className="stat-label">Overdue</div>
            <div className="stat-value">{overdue}</div>
            {/* <div className={`stat-change ${stat.trend}`}> */}
            {/* <span>{stat.change}</span> */}
            {/* <span className="stat-period">this month</span> */}
            {/* </div> */}
          </div>
          {/* ))} */}
        </div>

        <div className="charts-grid">
          <div className="chart-card card">
            <div className="card-header">
              <h2 className="card-title">Active Projects by Month</h2>
              <p className="card-subtitle">Monthly project creation trend</p>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={months}>
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
              <h2 className="card-title">
                Project Distribution For Year: {`${year}`}
              </h2>
              <p className="card-subtitle">Current project breakdown</p>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={steps}
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
                    {steps.map((entry, index) => (
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

        {/* <div className="activity-section card">
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
        </div> */}
      </div>
    </Layout>
  );
};

export default Dashboard;
