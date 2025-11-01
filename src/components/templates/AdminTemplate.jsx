import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./AdminTemplate.css";

const Layout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <div className="app-layout">
      <div style={{ width: "auto" }}>
        <Sidebar isCollapsed={isSidebarCollapsed} isOpen={isSidebarOpen} />
      </div>
      <div className="main-content">
        <Header onToggleSidebar={handleToggleSidebar} />
        <main className="content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
