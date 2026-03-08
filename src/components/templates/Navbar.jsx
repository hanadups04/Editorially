import React, { useEffect, useState, useMemo } from "react";
import "./Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/Logo.png";
import Menu from "../../assets/images/Menu.png";
import * as ReadFunctions from "../../context/functions/ReadFunctions";
// import Login from "../assets/images/Login.png";
// import { useBranch } from "../context/BranchContext.jsx";
// import { use } from "../context/ReaderContext.jsx";
// import { useReaderContext } from "../context/ReaderContext.jsx";
// import OverlayTrigger from "react-bootstrap/OverlayTrigger";
// import Popover from "react-bootstrap/Popover";
// import Horiz from "../assets/images/horiz.png";
// import AlertsNConfirmsModal from "../alertsNConfirmations/AlertsNConfirmsModal.jsx";
// import NotifIcon from "../assets/images/notifications.png";
// import NotifItemTemp from "../readers/Homepage/NotifItemTemp.jsx";

export default function Navbar() {
  //   const {
  //     userRole,
  //     branchSections,
  //     setBranchSectionsLTD,
  //     userBranch,
  //     setUserNotifsLTD,
  //     userNotifs,
  //   } = useAdminContext();
  //   const [user] = useAuthState(auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  //   const { exitReaderMode, handleLogout } = UpdateFunctions();
  const [askLogout, setAskLogout] = useState(false);
  const [sections, setSections] = useState([]);
  const [loading, setIsLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchSections() {
      try {
        const data = await ReadFunctions.fetchAllSections();
        if (isMounted) {
          console.log("data is: ", data);
          setSections(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchSections();
    return () => {
      isMounted = false;
    };
  }, []);

  //   const handleExitReaderMode = async () => {
  //     try {
  //       console.log("userRole in handleExitReaderMode:", userRole);
  //       setBranchId(userBranch);
  //       const path = await exitReaderMode(branchId);
  //       if (path) {
  //         navigate(path);
  //       }
  //     } catch (error) {
  //       console.error("Error exiting reader mode:", error);
  //     }
  //   };

  useEffect(() => {
    const path = location.pathname;

    // First check hardcoded routes
    switch (path) {
      case "/":
        setActiveLink("home");
        break;
      //   case "/TermlyContent":
      //     setActiveLink("termly content");
      //     break;
      //   case "/SavedPosts":
      //     setActiveLink("saved posts");
      //     break;
      // case "/aboutus":
      //   setActiveLink("about");
      //   break;
      //   case "/Search":
      //     setActiveLink("search");
      //     break;
      default:
        "/aboutus";
        setActiveLink("about");
        break;
    }
  }, [location.pathname, sections]);

  const currentDate = useMemo(() => {
    const date = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  }, []);

  return (
    <>
      <div className="Navbar-Parent">
        <div className="Navbar-Top">
          <img className="NavLogo" src={Logo} alt="navlogo" />
          <p className="NavName">The Nuntium</p>
        </div>
        <div className="Navbar-Bottom">
          <div className="BurgerIcon" onClick={toggleMenu}>
            <img className="NavMenu" src={Menu} alt="menu" />
          </div>
          <div className={`Navbar-Bottom-Left ${isMenuOpen ? "open" : ""}`}>
            {/* <div className="Navbar-Bottom-News">
              <Link
                to={`/${currentSlug}`}
                className={`Navbar-Bottom-Link ${
                  activeLink === "home" ? "active" : ""
                }`}
              >
                Home
              </Link>
            </div> */}

            {/* {branchSections &&
              branchSections.sections &&
              Object.entries(branchSections.sections)
                .filter(([key, value]) => value.submissionType !== 3)
                .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                .map(([key, value]) => (
                  <div
                    key={key}
                    className={`Navbar-Bottom-${key}`}
                    onClick={() => openedSection(key)}
                  >
                    <Link
                      to={`/${currentSlug}/${key}`}
                      className={`Navbar-Bottom-Link ${
                        activeLink === key.toLowerCase() ? "active" : ""
                      }`}
                    >
                      {key}
                    </Link>
                  </div>
                ))} */}

            {/* <div className="Navbar-Bottom-TermlyContent">
              <Link
                to={"/TermlyContent"}
                className={`Navbar-Bottom-Link ${
                  activeLink === "termly content" ? "active" : ""
                }`}
              >
                Publications
              </Link>
            </div>
            <div className="Navbar-Bottom-Sports">
              <Link
                to={"/Search"}
                className={`Navbar-Bottom-Link ${
                  activeLink === "search" ? "active" : ""
                }`}
              >
                Search Articles
              </Link>
            </div> */}

            <div className="Navbar-Bottom-About">
              <Link
                to={"/aboutus"}
                className={`Navbar-Bottom-Link ${
                  activeLink === "about" ? "active" : ""
                }`}
              >
                About Us
              </Link>
            </div>

            {/* {userRole &&
              (userRole === 2 ||
                userRole === 3 ||
                userRole === 4 ||
                userRole === 5 ||
                userRole === 6) && (
                <div className="Navbar-Bottom-ExitReaderMode">
                  <Link
                    className={`Navbar-Bottom-Link ${
                      activeLink === "exit" ? "active" : ""
                    }`}
                    onClick={handleExitReaderMode}
                  >
                    Exit Reader Mode
                  </Link>
                </div>
              )} */}
          </div>
          <div className="Navbar-Bottom-Right">
            <p className="NavDate">{currentDate}</p>

            {/* {user ? (
              <div
                className="ParentTaskCard-Delete"
                onClick={(e) => e.stopPropagation()}
              >
                {["left"].map((placement) => (
                  <OverlayTrigger
                    trigger="click"
                    key={placement}
                    placement={placement}
                    rootClose={true}
                    overlay={
                      <Popover id={`popover-positioned-${placement}`}>
                        <Popover.Body className="PopoverBody">
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            {userRole === 1 && (
                              <>
                                <strong
                                  className="DeletePopup"
                                  onClick={() =>
                                    navigate(
                                      `/${currentSlug}/Profile?user=${auth.currentUser.uid}`,
                                    )
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  Profile
                                </strong>
                                <hr />
                              </>
                            )}

                            <strong
                              className="DeletePopup"
                              onClick={() => setAskLogout(true)}
                              style={{ cursor: "pointer" }}
                            >
                              Logout
                            </strong>
                          </div>
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <img
                      className="HorizIcon"
                      src={Horiz}
                      alt="timerIcon"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </OverlayTrigger>
                ))}
              </div>
            ) : (
              <img
                className="NotifIcon"
                src={Login}
                alt="notifications"
                onClick={() => navigate("/Login")}
                style={{
                  cursor: "pointer",
                }}
              />
            )} */}

            {/* {user && (
              <div onClick={(e) => e.stopPropagation()}>
                {["bottom"].map((placement) => (
                  <OverlayTrigger
                    trigger="click"
                    key={placement}
                    placement={placement}
                    overlay={
                      <Popover id="popover-basic">
                        <Popover.Body className="PopoverBody">
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              maxHeight: "600px",
                              overflowY: "auto",
                            }}
                          >
                            <strong className="DeletePopup">
                              Notifications
                            </strong>
                            <hr />
                            {userNotifs.map((item, key) => {
                              return (
                                <>
                                  <NotifItemTemp
                                    key={key}
                                    articleName={item.message}
                                    section={item.section}
                                    title={item.title}
                                    timeUploaded={item.created_at}
                                  />
                                  <hr />
                                </>
                              );
                            })}
                          </div>
                        </Popover.Body>
                      </Popover>
                    }
                  >
                    <img
                      src={NotifIcon}
                      alt="Notification Icon"
                      className="NotifIcon"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </OverlayTrigger>
                ))}
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* {askLogout && (
        <AlertsNConfirmsModal
          type="confirmation"
          message={"Are you sure you want to Log out of your account?"}
          title={"Log out of account"}
          onHide={() => setAskLogout(false)}
          onConfirm={() => handleLogout(navigate)} //tawagin approve all duto nigga
          onCancel={() => setAskLogout(false)} //close yng modal here manigga fakyo
          show={askLogout}
        />
      )} */}
    </>
  );
}
