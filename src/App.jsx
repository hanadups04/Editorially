import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Outlet,
  useNavigate,
  Navigate,
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
import * as auth from "./context/auth.js";
import ReactLoading from "react-loading";
import ConstructArticle from "./pages/ConstructArticle.jsx";
import ReaderHomepage from "./pages/reader/ReaderHomepage.jsx";
import SectionPage from "./pages/reader/SectionPage.jsx";
import ArticlePage from "./pages/reader/ArticlePage.jsx";
import SearchPage from "./pages/reader/SearchPage.jsx";
import AboutPage from "./pages/reader/AboutPage.jsx";
import OurProcessPage from "./pages/reader/OurProcessPage.jsx";
import { useRegisterSW } from "virtual:pwa-register/react";
import PwaInstall from "./components/readerSide/Pwa.jsx";
import NotFound from "./pages/reader/NotFound.jsx";
import ForgotPassword from "./pages/admin/ForgotPass.jsx";

const ProtectedRoute = ({ requiredAccessLvl, children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      if (!session) {
        navigate("/readers");
        // navigate("/login");
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isAuthenticated === null) {
    return (
      <div className="loadProgress">
        <ReactLoading
          type="spinningBubbles"
          color="#133e87"
          height={60}
          width={60}
        />
        <p className="loadingText">Loading, please wait...</p>
      </div>
    );
  }

  return children ? children : <Outlet />;
};

function App() {
  useRegisterSW();
  const isAdmin = window.location.hostname === "admin.editorially.app";

  // useEffect(() => {
  //   if (isAdmin) {
  //     navigate("/login");
  //   } else {
  //     navigate("/reader");
  //   }
  // }, []);

  // if (hostname === "admin.editorially.app") {
  //   return <Login />;
  // } else if (hostname === "editorially.app") {
  //   return <ReaderHomepage />;
  // }

  return (
    <>
      <PwaInstall />
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={isAdmin ? "/login" : "/readers"} replace />}
          />
          {/* <Route path="/" element={<Redirector />} /> */}
          {/* user searches editorially.app, calls redirector, checks for account, if none, throws user to landing page, if present, throws user to appropriate page */}
          <Route path="/aboutus" element={<LandingPage />} />
          <Route path="/readers" element={<ReaderHomepage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/section/:name" element={<SectionPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/our-process" element={<OurProcessPage />} />
          {/* <Route path="/Readers/:id" element={<LandingPage />} /> */}
          {/* <Route path="/Search" element={<LandingPage />} /> */}
          <Route
            path="/login"
            element={isAdmin ? <Login /> : <Navigate to="/readers" replace />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<NotFound />} />

          {/* only allow access on admin roles */}
          <Route element={<ProtectedRoute />}>
            <Route path="/tasks" element={<ProjectPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/members/:id" element={<MemberDetail />} />
            <Route path="/document" element={<DocumentPage />} />
            <Route path="/projects" element={<TaskList />} />
            <Route path="/content" element={<ContentManagement />} />
            <Route path="/content/:id" element={<ContentDetail />} />
            <Route path="/profile/:id" element={<MemberDetail />} />
            <Route path="/create-article/:id" element={<ConstructArticle />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
