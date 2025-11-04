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
          navigate(`/${currentSlug}`);
          return;
        }

        // If permissions is stored as plain column, use: select("access_level")
        const accessLevel = data?.accessLevel;

        setUserAccessLvl(accessLevel);
      } catch (err) {
        console.error("Error during fetch:", err.message);
      } finally {
        setIsAccessLvlFetched(true);
        setIsLoading(false);
      }
    };

    getUserAndAccess();
  }, [navigate, currentSlug]);

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
          <Route path="/" element={<LandingPage />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="*" element={<Dashboard />} />
          <Route path="/Members" element={<Members />} />
          <Route path="/ContentManagement" element={<ContentManagement />} />
          {/* <Route path="/Login" element={<LoginPage />} /> */}
          {/* <Route path="/Register" element={<RegisterPage />} /> */}
          {/* <Route
            path="/RegisterBranch"
            element={withAccess(RegisterBranch, [1, 2, 3, 4, 5, 6])}
          /> */}
          {/* <Route path="/:branchSlug" element={<ThemeLayoutRouter />}>
            <Route index element={<ThemeViewRouter view="home" />} />
            <Route
              path=":sectionName"
              // element={withReaderAccess(SectionPage)}
              element={<ThemeViewRouter view="section" />}
            />
            <Route
              path="/:branchSlug/Profile"
              element={withReaderAccess(ReaderProfile)}
            />

            <Route
              path="/:branchSlug/SavedPosts"
              element={withReaderAccess(SavedPostPage)}
            />
            <Route
              path="ViewArticle"
              // element={withReaderAccess(ViewArticle)}
              element={<ThemeViewRouter view="article" />}
            />

            <Route
              path="/:branchSlug/AboutUs"
              element={withReaderAccess(AboutUs)}
            />

            <Route
              path="/:branchSlug/AboutUsProfile"
              element={withReaderAccess(AboutUsProfile)}
            />
            <Route
              path="/:branchSlug/Search"
              element={withReaderAccess(SearchPage)}
            />
          </Route> */}

          {/* <Route
            path="/Admin"
            element={withAccess(AdminPageTemplate, [6, 5, 4, 3, 2])}
          >
            <Route path="Profile" element={<ReaderProfile />} />

            <Route
              path="AdminDashboard"
              element={withAccess(AdminDashboard, [6, 5, 4])}
            />
            <Route
              path="EicHomepage"
              element={withAccess(EicHomepage, [6, 5, 4])}
            />
            <Route
              path="UserManagement"
              element={withAccess(UserManagement, [6, 5, 4, 3])}
            />
            <Route
              path="ManageRoles"
              element={withAccess(ManageRoles, [6, 5, 4])}
            />
            <Route
              path="BranchProcess"
              element={withAccess(BranchProcess, [6, 5, 4])}
            />
            <Route
              path="EbHomepage"
              element={withAccess(EbHomepage, [5, 4, 3])}
            />
            <Route
              path="TopicNSubtasksView"
              element={withAccess(TopicNSubtasksView, [6, 5, 4, 3, 2])}
            />
            <Route
              path="CreateTaskPage"
              element={withAccess(CreateTaskPage, [6, 5, 4, 3, 2])}
            />
            <Route
              path="ContribHomepage"
              element={withAccess(ContribHomepage, [2])}
            />
            <Route
              path="SwHomepage"
              element={withAccess(SwHomepage, [5, 4, 3, 2])}
            />
            <Route
              path="applicantInfoPage"
              element={withAccess(ApplicantInfoPage, [6, 5, 4, 3, 2])}
            />
            <Route
              path="ContribHuntParent"
              element={withAccess(ContribHuntParent, [6, 5, 4, 3])}
            />
            <Route
              path="CmsPage"
              element={withAccess(CmsPage, [5, 6, 4, 3, 2])}
            />
            <Route
              path="ViewCmsArticle"
              element={withAccess(ViewCmsArticle, [5, 6, 4, 3, 2])}
            />
            <Route
              path="AdminCalendar"
              element={withAccess(AdminCalendar, [5, 6, 4, 3, 2])}
            />
            <Route
              path="HistoryPage"
              element={withAccess(HistoryPage, [5, 6, 4, 3, 2])}
            />
          </Route> */}

          {/* <Route
            path="/TextEditor"
            element={
              <ProtectedRoute requiredAccessLvl={[6, 5, 4, 3, 2]}>
                <TextEditor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/PubEditor"
            element={
              <ProtectedRoute requiredAccessLvl={[6, 5, 4, 3, 2]}>
                <PubEditor />
              </ProtectedRoute>
            }
          /> */}

          {/* <Route
            path="/SAdmin" // everything accesslevel inside to be set to 5
            element={withAccess(SuperAdminTemplate, [4, 5])}
          >
            <Route
              path="SADashboard"
              element={withAccess(SADashboard, [4, 5])}
            />
            <Route
              path="SAMembers"
              element={withAccess(SAMemberList, [4, 5])}
            />
            <Route
              path="SABranches"
              element={withAccess(SABranchLists, [4, 5])}
            />
            <Route
              path="SAApplicants"
              element={withAccess(SABranchApplicants, [4, 5])}
            />
            <Route
              path="SADeactivatedPublications"
              element={withAccess(SADeactivatedBranchList, [4, 5])}
            />

            <Route path="SAUserLogs" element={withAccess(SAUserLogs, [4, 5])} />
            <Route path="SAProjLogs" element={withAccess(SAProjLogs, [4, 5])} />
            <Route
              path="branch/:branchId"
              element={withAccess(SingleBranchView, [4, 5])}
            />
          </Route> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
