import React, { useEffect, useState } from "react";
import "./Footer.css";
import sampleLogo from "../../assets/images/Logo.png";
import { useProjectContext } from "../../context/Context";
import { Link } from "react-router-dom";
// import PwaInstall from "./pwa.jsx";
// import AlertsNConfirmsModal from "../alertsNConfirmations/AlertsNConfirmsModal.jsx";

export default function ReaderFooter() {
  const { isMobile, isTablet, isLimitedWebView, isFullWebView } =
    useProjectContext();

  //   const [notLoggedInAlert, setNotLoggedInAlert] = useState(false);

  //   const { userRole } = useAdminContext();
  //   const [user] = useAuthState(auth);

  //   useEffect(() => {
  //     setBranchDetailsLTD(true);

  //     return () => {
  //       setBranchDetailsLTD(false);
  //     };
  //   }, []);

  //   const requireAuth = (e, targetPath) => {
  //     if (!user) {
  //       e.preventDefault();
  //       setNotLoggedInAlert(true);
  //       if (go) navigate("/Login", { state: { redirectTo: targetPath } });
  //     }
  //   };

  //   console.log("branch branchDetails", branchDetails);
  //   const showInterested = !user || userRole === 1;

  return (
    <>
      <div className="ReaderFooter-Parent">
        <div className="ReaderFooter-Top">
          <div className="ReaderFooter-Top-Name">
            <div className="Logo-Name">
              <img src={sampleLogo} alt="logo" />
              <h3>The Nuntium</h3>
            </div>
            <div className="About">
              <p>
                The Nuntium is the Official student publication of National
                University Dasmarinas.{" "}
              </p>
            </div>
          </div>
          <div className="ReaderFooter-Top-Location">
            <h5>Location</h5>
            <p>
              Sampaloc 1 Bridge, SM Dasmarinas, Governor's Dr, Dasmariñas,
              Dasmariñas, Philippines, 4114
            </p>
          </div>

          {(isLimitedWebView || isFullWebView) && (
            <div className="ReaderFooter-Top-Contacts">
              <h5>Contact Us</h5>
              <p>09777042093</p>
              <p>national-u.edu.ph</p>
              <p>theNuntium@gmail.com</p>
            </div>
          )}

          {(isMobile || isTablet) && (
            <div className="ReaderFooter-Top-Contacts">
              <h5>Contact Us</h5>
              <p>09777042093</p>
              <p>national-u.edu.ph</p>
              <p>theNuntium@gmail.com</p>
            </div>
          )}

          {/* {showInterested && (
            <div className="ReaderFooter-Top-Contacts1">
              <h5>Interested? </h5>
              <div className="JoinLinksCont">
                <div className="JoinLinksCont1">
                  <Link
                    to="/RegisterBranch"
                    className="JoinLinks"
                    onClick={(e) => requireAuth(e, "/RegisterBranch")}
                  >
                    Register your own branch!
                  </Link>
                </div>
                <div className="JoinLinksCont1">
                  <Link
                    to="/ContributorsHunt"
                    className="JoinLinks"
                    onClick={(e) => requireAuth(e, "/ContributorsHunt")}
                  >
                    Join us to be a Contributor
                  </Link>
                </div>
              </div>
            </div>
          )} */}
        </div>
        <div className="ReaderFooter-Bottom">
          <hr className="hr2" />
          <p className="p1">© 2025 Editorially All Rights Reserved</p>
          <p className="p2">Designed and developed by EDITORIALLY 2025–2026</p>
        </div>
      </div>

      {/* <AlertsNConfirmsModal
        show={notLoggedInAlert}
        onHide={() => {
          setNotLoggedInAlert(false);
        }}
        type="error"
        title="You're Not Logged in!"
        message="Please log in to continue"
      /> */}
    </>
  );
}
