import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Sidebar.css";
import { signOut } from "../../context/auth";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../ArticleManagement/ConfirmationModal";

const Sidebar = ({ isCollapsed, isOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);

  const navItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="nav-item-icon"
        >
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
    },
    {
      path: "/projects",
      label: "Projects",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="nav-item-icon"
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
    },
    {
      path: "/content",
      label: "Posts",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="nav-item-icon"
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
    },
    {
      path: "/members",
      label: "Team",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="nav-item-icon"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
    },
  ];

  const isActive = (path) => {
    if (path === "/projects") {
      return (
        location.pathname.startsWith("/projects") ||
        location.pathname.startsWith("/tasks")
      );
    }

    if (path === "/content") {
      return (
        location.pathname.startsWith("/content") ||
        location.pathname.startsWith("/content/:id")
      );
    }

    if(path === "/members") {
      return(
        location.pathname.startsWith("/members") ||
        location.pathname.startsWith("/members/:id")
      )
    }

    return location.pathname === path;
  };

    const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <aside
      className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isOpen ? "open" : ""}`}
    >
      <div className="sidebar-header">
        {!isCollapsed && <h2>Navigation</h2>}
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? "active" : ""}`}
          >
            {item.icon}
            {!isCollapsed && (
              <span className="nav-item-text">{item.label}</span>
            )}
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button 
          onClick={() => setConfirm(true)}
          className="nav-item logout-btn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="nav-item-icon"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          {!isCollapsed && (
            <span className="nav-item-text">Logout</span>
          )}
        </button>
      </div>

      <ConfirmationModal
        isOpen={confirm}
        onClose={() => {
          setConfirm(false);
        }}
        onConfirm={() => {
          handleLogout();
        }}
        title="Confirm Logout"
        message="Are you sure you want to log out?."
        confirmText="Yes"
        cancelText="No"
        variant="danger"
      />
    </aside>
  );
};

export default Sidebar;
