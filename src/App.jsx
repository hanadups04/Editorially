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
  // const { branchId, currentSlug } = useBranch();

  useEffect(() => {
    const getUserAndAccess = async () => {
      setIsLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate(`/${currentSlug}`);
        return;
      }

      setUser(user);

      try {
        // Fetch access level from your users table
        const { data, error } = await supabase
          .from("users_tbl")
          .select("uid, role_id, roles_tbl ( access_level )") // if stored as JSON
          .eq("uid", user.id)
          .single();

        if (error || !data) {
          console.error("User not found or error fetching:", error);
          navigate("/AboutUs");
          return;
        }

        // If permissions is stored as plain column, use: select("access_level")
        const accessLevel = data?.accessLevel;

        setUserAccessLvl(accessLevel);
      } catch (err) {
        console.error("Error during fetch:", err.message);
        navigate("/aboutus");
      } finally {
        setIsAccessLvlFetched(true);
        setIsLoading(false);
      }
    };

    getUserAndAccess();
  }, [navigate]);

  useEffect(() => {
    if (isAccessLvlFetched && !requiredAccessLvl.includes(userAccessLvl)) {
      console.log(currentSlug, "currnetSlug");
      navigate(`/${currentSlug}`);
    }
  }, [isAccessLvlFetched, userAccessLvl, requiredAccessLvl, navigate]);

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
          <Route path="/tasks" element={<ProjectPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/members/:id" element={<MemberDetail/>}/>
          <Route path="/document" element={<DocumentPage />} />
          <Route path="/projects" element={<TaskList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/content" element={<ContentManagement />} />
          <Route path="/content/:id" element={<ContentDetail />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
