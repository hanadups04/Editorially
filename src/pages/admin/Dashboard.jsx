import React from "react";
import Layout from "../../components/templates/AdminTemplate";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <Layout>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Dashboard</h1>
          <p className="card-subtitle">
            Overview of all your publication projects
          </p>
        </div>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "var(--text-lg)",
            }}
          >
            Select a project from the sidebar to get started
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
