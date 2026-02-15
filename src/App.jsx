import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Outlet,
  useNavigate,
  Await,
} from "react-router-dom";
import "./App.css";
import { supabase } from "./supabaseClient.js";
import ProjectPage from "./pages/admin/ProjectPage.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import LandingPage from "./pages/landingPage/LandingPage.jsx";
import Members from "./pages/membersList/MembersList.jsx";
import ContentManagement from "./pages/cms/ContentManagement.jsx";
import TaskList from "./pages/admin/TaskList.jsx";
import Calendar from "./pages/admin/Calendar.jsx";
import Login from "./pages/login_register/login.jsx";
import Register from "./pages/login_register/register.jsx";
import Redirector from "./AppRedirector.jsx";
import DocumentPage from "./pages/admin/DocumentPage.jsx";
import ContentDetail from "./pages/admin/ContentDetail.jsx";
import MemberDetail from "./pages/membersList/MemberDetail.jsx";

const ProtectedRoute = ({ requiredAccessLvl, children }) => {
  const [userAccessLvl, setUserAccessLvl] = useState(null);
  const navigate = useNavigate();
  const [isAccessLvlFetched, setIsAccessLvlFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading || !isAccessLvlFetched) {
    return (
      <div>
        {" "}
        {isLoading ? (
          <div className="loadProgress">
            <img
              src={LogoWhitebg}
              alt="Loading..."
              height={100}
              width={100}
              style={{ objectFit: "contain" }}
              className="loading-logo"
            />
            <p className="loadingText">Loading, please wait...</p>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }

  return children ? children : <Outlet />;
};

function App() {
  const withAccess = (Component, levels) => (
    <ProtectedRoute requiredAccessLvl={levels}>
      <Component />
    </ProtectedRoute>
  );

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Redirector />} />
          {/* user searches editorially.app, calls redirector, checks for account, if none, throws user to landing page, if present, throws user to appropriate page */}
          <Route path="/aboutus" element={<LandingPage />} />
          {/* <Route path="/Readers" element={<LandingPage />} /> */}
          {/* <Route path="/Readers/:id" element={<LandingPage />} /> */}
          {/* <Route path="/Search" element={<LandingPage />} /> */}
          <Route path="/tasks" element={<ProjectPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/members/:id" element={<MemberDetail />} />
          <Route path="/document" element={<DocumentPage />} />
          <Route path="/projects" element={<TaskList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/content" element={<ContentManagement />} />
          <Route path="/content/:id" element={<ContentDetail />} />
          <Route path="/profile/:id" element={<MemberDetail />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
