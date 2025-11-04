import React, { useState, useEffect, useMemo } from "react";
import "./MenuList.css";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
// import UpdateFunctions from "../context/functions/UpdateFunctions.js";
import CalendarW from "../../assets/images/CalendarW.png";
import CalendarB from "../../assets/images/CalendarB.png";
import DashboardB from "../../assets/images/DashboardB.png";
import DashboardW from "../../assets/images/DashboardW.png";
import List from "../../assets/images/listicon.png";
import ListW from "../../assets/images/ListW.png";
import ProfileW from "../../assets/images/ProfileW.png";
import ProfileB from "../../assets/images/ProfileB.png";
import MembersW from "../../assets/images/MembersW.png";
import MembersB from "../../assets/images/MembersB.png";
import LogoutW from "../../assets/images/LogoutW.png";
import LogoutB from "../../assets/images/LogoutB.png";
import BookW from "../../assets/images/BookW.png";
import BookB from "../../assets/images/BookB.png";
import ApplicantW from "../../assets/images/ApplicantW.png";
import ApplicantB from "../../assets/images/ApplicantB.png";
import ProjectsW from "../../assets/images/ProjectsW.png";
import ProjectsB from "../../assets/images/ProjectsB.png";
import AlertsNConfirmsModal from "../../AlertModals/AlertsNConfirmsModal";
// import Modal from "../orgComponents/ModalHistory.jsx";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "../firebaseConfig.js";
// import { useAdminContext } from "../context/AdminContext.jsx";
import Accordion from "react-bootstrap/Accordion";
import Members2 from "../../assets/images/Members2.png";
import Members2B from "../../assets/images/Members2B.png";
import ProjCms from "../../assets/images/ProjCms.png";
// import { useBranch } from "../context/BranchContext.jsx";

export default function MenuList({
  collapsed,
  activeAccordionKey,
  setActiveAccordionKey,
}) {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [askLogout, setAskLogout] = useState(false);
  //   const [user] = useAuthState(auth);
  //   const { currentSlug } = useBranch();

  const navigate = useNavigate();
  const location = useLocation();
  //   const { handleLogout } = UpdateFunctions();
  //   const { userRole, branchSections, setBranchSectionsLTD } = useAdminContext();
  const userRole = 5;

  // useEffect(() => {
  //   setBranchSectionsLTD(true);

  //   return () => {
  //     setBranchSectionsLTD(false);
  //   };
  // }, []);

  // Map current pathname to the menu key. Keep this mapping consistent with your routes.
  const pathToKey = (pathname) => {
    if (pathname.includes("/Admin/AdminDashboard")) return "dashboard";
    if (
      pathname.includes("/Admin/EicHomepage") ||
      pathname.includes("/Admin/EbHomepage") ||
      pathname.includes("/Admin/SwHomepage")
    )
      return "eichomepage";
    if (pathname.includes("/ContentManagement")) return "cms";
    if (pathname.includes("/Members")) return "members";
    if (pathname.includes("/Admin/ContribHuntParent")) return "applicants";
    if (pathname.startsWith("/Admin/Profile")) return "profile";
    // if (pathname === `/${branchSections.name}` || pathname === "/home")
    //   return "readerMode";
    // fallback: if nothing matches, return empty (no selection)
    return "";
  };

  // Keep selectedKeys in sync with the route so it persists across nav/refresh
  useEffect(() => {
    const k = pathToKey(location.pathname);
    setSelectedKeys(k ? [k] : []);
  }, [location.pathname, userRole]);

  useEffect(() => {
    const k = pathToKey(location.pathname);
    if (["members", "applicants"].includes(k)) {
      setActiveAccordionKey("MembersNApplicants");
    } else if (["eichomepage", "cms"].includes(k)) {
      setActiveAccordionKey("ProjectsNCms");
    }
  }, [location.pathname, setActiveAccordionKey]);

  // Central navigation handler so click & selection are always consistent
  const handleMenuClick = ({ key }) => {
    setSelectedKeys([key]); // immediate visual feedback

    if (["members", "applicants"].includes(key)) {
      setActiveAccordionKey("MembersNApplicants");
    } else if (["eichomepage", "cms"].includes(key)) {
      setActiveAccordionKey("ProjectsNCms");
    } else {
      setActiveAccordionKey(null);
    }

    switch (key) {
      case "dashboard":
        navigate("/Admin/AdminDashboard");
        break;
      case "eichomepage":
        if (userRole === 5 || userRole === 4) {
          navigate("/Admin/EicHomepage");
        } else if (userRole === 3) {
          navigate("/Admin/EbHomepage");
        } else if (userRole === 2) {
          navigate("/Admin/SwHomepage");
        }
      // else {
      //   navigate(`/${branchSections.name}`);
      // }
      // break;
      case "cms":
        navigate("/ContentManagement");
        break;
      case "members":
        navigate("/Members");
        break;
      case "applicants":
        navigate("/Admin/ContribHuntParent");
        break;
      //   case "profile":
      //     if (user?.uid) navigate(`/Admin/Profile?user=${user.uid}`);
      //     break;
      //   case "readerMode":
      //     navigate(`/${branchSections.name}`);
      //     break;
      case "logout":
        setAskLogout(true);
        break;
      default:
        break;
    }
  };

  // Build menu items and choose icon src based on currently selected key.
  const menuItems = useMemo(
    () => [
      {
        key: "dashboard",
        icon: (
          <img
            src={selectedKeys[0] === "dashboard" ? DashboardB : DashboardW}
            alt="dashboard"
            className="menu-icon"
          />
        ),
        label: "Dashboard",
        roles: [5, 4],
        style: { color: selectedKeys[0] === "dashboard" ? "black" : "white" },
      },
      {
        key: "eichomepage",
        icon: (
          <img
            src={selectedKeys[0] === "eichomepage" ? ProjectsB : ProjectsW}
            alt="projects"
            className="menu-icon"
          />
        ),
        label: "Projects",
        roles: [5, 4, 3, 2],
        style: { color: selectedKeys[0] === "eichomepage" ? "black" : "white" },
      },
      {
        key: "cms",
        icon: (
          <img
            src={selectedKeys[0] === "cms" ? List : ListW}
            alt="cms"
            className="menu-icon"
          />
        ),
        label: "CMS",
        roles: [5, 4, 3, 2],
        style: { color: selectedKeys[0] === "cms" ? "black" : "white" },
      },
      {
        key: "members",
        icon: (
          <img
            src={selectedKeys[0] === "members" ? Members2B : Members2}
            alt="members"
            className="menu-icon"
          />
        ),
        label: "Members",
        roles: [5, 4, 3],
        style: { color: selectedKeys[0] === "members" ? "black" : "white" },
      },
      {
        key: "profile",
        icon: (
          <img
            src={selectedKeys[0] === "profile" ? ProfileB : ProfileW}
            alt="profile"
            className="menu-icon"
          />
        ),
        label: "Profile",
        roles: [6, 5, 4, 3, 2],
        style: { color: selectedKeys[0] === "profile" ? "black" : "white" },
      },
      {
        key: "readerMode",
        icon: (
          <img
            src={selectedKeys[0] === "readerMode" ? BookB : BookW}
            alt="readerMode"
            className="menu-icon"
          />
        ),
        label: "Reader Mode",
        roles: [6, 5, 4, 3, 2],
        style: { color: selectedKeys[0] === "readerMode" ? "black" : "white" },
      },
      {
        key: "logout",
        icon: (
          <img
            src={selectedKeys[0] === "logout" ? LogoutB : LogoutW}
            alt="logout"
            className="menu-icon"
          />
        ),
        label: "Logout",
        roles: [2, 3, 4, 5],
        style: { color: selectedKeys[0] === "logout" ? "black" : "white" },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedKeys[0]] // only rebuild icons when selected key changes
  );

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  let groupedMenuItems = {};
  if (userRole === 5 || userRole === 4) {
    groupedMenuItems = {
      ProjectsNCms: {
        icon: <img src={ProjCms} alt="pdf-icon" className="menu-icon" />,
        label: "Projects & CMS",
        items: filteredMenuItems.filter((item) =>
          ["eichomepage", "cms"].includes(item.key)
        ),
      },
      MembersNApplicants: {
        icon: <img src={MembersW} alt="mem-icon" className="menu-icon" />,
        label: "Members & Applicants",
        items: filteredMenuItems.filter((item) =>
          ["members", "applicants"].includes(item.key)
        ),
      },
    };
  } else if (userRole === 3 && userRole === 2) {
    groupedMenuItems = {};
  }

  return (
    <>
      {(userRole === 5 || userRole === 4) && (
        <Menu
          mode="inline"
          className="menu-bar"
          selectedKeys={selectedKeys}
          onClick={handleMenuClick}
          items={filteredMenuItems.filter((item) => item.key === "dashboard")}
        />
      )}

      {(userRole === 5 || userRole === 4) && (
        <Accordion
          className="SidebarAccordion-Parent"
          activeKey={activeAccordionKey ?? undefined}
          onSelect={(key) => setActiveAccordionKey(key)}
          style={{ border: "1px solid #020b40", borderRadius: "0px" }}
        >
          {Object.entries(groupedMenuItems).map(([groupKey, group]) => (
            <Accordion.Item eventKey={groupKey} key={groupKey}>
              <Accordion.Header>
                {group.icon}{" "}
                {!collapsed && (
                  <span style={{ marginLeft: "8px" }}>{group.label}</span>
                )}
              </Accordion.Header>
              <Accordion.Body
                style={{
                  padding: "0px",
                }}
              >
                <Menu
                  mode="inline"
                  className="menu-bar"
                  selectedKeys={selectedKeys}
                  onClick={handleMenuClick}
                  items={group.items.map((item) => ({
                    key: item.key,
                    icon: item.icon,
                    label: item.label,
                  }))}
                />
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
      {(userRole === 3 || userRole === 2) && (
        <Menu
          mode="inline"
          className="menu-bar"
          selectedKeys={selectedKeys}
          onClick={handleMenuClick}
          items={filteredMenuItems}
        />
      )}

      {(userRole === 5 || userRole === 4) && (
        <Menu
          mode="inline"
          className="menu-bar"
          selectedKeys={selectedKeys}
          onClick={handleMenuClick}
          items={filteredMenuItems.filter((item) =>
            ["profile", "readerMode", "logout"].includes(item.key)
          )}
        />
      )}

      {isModalOpen && (
        <Modal
          title="Completed and Rejected Topics"
          visible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {askLogout && (
        <AlertsNConfirmsModal
          type="confirmation"
          message="Are you sure you want to log out of your account?"
          title="Log out of account"
          onHide={() => setAskLogout(false)}
          onConfirm={() => handleLogout(navigate)}
          onCancel={() => setAskLogout(false)}
          show={askLogout}
        />
      )}
    </>
  );
}
