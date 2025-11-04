import React, { useState, useEffect } from "react";
import "./Login2.css";
import Logo from "../../assets/images/LogoBlueBg.png";
// import ShowPass from "../../assets/images/showpass.png";
// import ShowPassOff from "../../assets/images/showpassoff.png";
// import ForgotPassModal from "./ForgotPassModal.jsx";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
// import { useBranch } from "../../context/BranchContext.jsx";
import AlertsNConfirmsModal from "../../AlertModals/AlertsNConfirmsModal.jsx";
import { isAuthenticated, signIn } from "../../context/auth.js";

export default function Login() {
  //   const { setBranchId, currentSlug } = useBranch();
  const [recovAcc, setRecoverAccount] = useState(false);
  // const { setUserBranch } = useAdminContext();
  const [formData, setFormData] = useState({
    // branchId: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  const [loading, setLoading] = useState(false);
  const [normLoading, setNormLoading] = useState(false);

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorLogin, setErrorLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const currentUser = await signIn(email, password);
      if (currentUser.code === 1) {
        await fetchUserAccessLvl(currentUser.data.user.id);
      } else {
        setErrorLogin(true);
        setErrorMessage(currentUser.error);
      }
    } catch (error) {
      setErrorLogin(true);
    }
  };

  const fetchUserAccessLvl = async (userId) => {
    // const userDoc = await getDoc(doc(db, "users", userId));
    const { data, error } = await supabase
      .from("users_tbl")
      .select("uid, role_id, tenant_id, roles_tbl ( access_level )") // if stored as JSON
      .eq("uid", userId)
      .single();

    if (data) {
      setBranchId(data.branchId);

      if (userDoc.data().status === "deleted") {
        // ask user if they want to recover their account
        setRecoverAccount(true);
        return;
      }

      if (userDoc.data().status === "disabled") {
        // ask user if they want to recover their account
        alert("your account has been disabled. ask your admin for assistance");
        return;
      }

      const slug = await getSlugByBranchId(userDoc.data().branchId);
      switch (userDoc.data().permissions.accessLevel) {
        case 6:
          navigate("/Adviser/AdminDashboard");
          console.log("navigating to adviser");
          break;
        case 5:
          navigate("/Admin/AdminDashboard");
          console.log("navigating to eic");
          break;
        case 4:
          navigate("/Admin/AdminDashboard");
          console.log("navigating to assoc or managing");
          break;
        case 3:
          navigate("/Admin/EbHomepage");
          console.log("navigating to section editor");
          break;
        case 2:
          navigate("/Admin/SwHomepage");
          console.log("navigating to section writer");
          break;
        case 1:
          navigate(`/${slug}`);
          console.log("navigating to reader");
          break;
      }
      await saveFcmToken();
      localStorage.setItem(
        "userPerms",
        JSON.stringify(userDoc.data().permissions)
      );
      await handleUserLogin(user, "from login page");

      // setUserBranch(userDoc.data().branchId);
    } else {
      console.error("User document not found");
      navigate(`/Login`);
    }
  };
  const [openForgotPassModal, setOpenForgotPassModal] = useState(false);
  const [openSelectBranchModal, setOpenSelectBranchModal] = useState(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState(null);
  const [isContinuing, setIsContinuing] = useState(false); // added

  const handleContinueReading = async (e) => {
    e.preventDefault();
    if (normLoading || loading || isContinuing) return;
    try {
      setIsContinuing(true);
      if (!auth.currentUser) {
        const cred = await signInAnonymously(auth);
        await ensureUserDocument(cred.user);
      }
      navigate("/nuntium");
    } catch (err) {
      console.error("Anonymous continue failed:", err);
      navigate("/nuntium"); // still allow reading
    } finally {
      setIsContinuing(false);
    }
  };

  if (authLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <ReactLoading
          type="spinningBubbles"
          color="#133e87"
          height={60}
          width={60}
        />
      </div>
    );
  }

  return (
    <>
      <div className="Login-Parent">
        <form onSubmit={handleSubmit}>
          <div className="Login-Form">
            {/* <div className="Login-LogoCont">
              <img src={Logo} alt="Logo" className="logoLogin" />
            </div> */}
            <div className="Login-FormHeader">
              <p className="BrandName">Editorially</p>
              <p className="Signin">Log in with your credentials to continue</p>
            </div>
            <div className="Login-FormContent">
              {/* <p className="FormLabel">Select Branch</p> */}
              {/* <select
                id="myDropdown"
                className="PubmatSecDropDown"
                name="secForChecking"
                value={formData.branchName}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Branch</option>
                {sections.section &&
                  Object.keys(sections.section).map((sec, key) => (
                    <option key={key} value={sec}>
                      {sec}
                    </option>
                  ))}
              </select> */}
              {/* <NUbranch
                selectedBranch={formData.branchId}
                onChange={(branchId) =>
                  setFormData((prev) => ({ ...prev, branchId }))
                }
              /> */}
              <p className="FormLabel">Email</p>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className={`Login-Input ${
                  submitted &&
                  (!formData.email || !emailRegex.test(formData.email)) &&
                  "error"
                }`}
                value={formData.email}
                onChange={handleInputChange}
              />
              {submitted && !formData.email && (
                <p style={{ color: "red", fontSize: "14px" }}>
                  Email is required
                </p>
              )}
              {submitted &&
                formData.email &&
                !emailRegex.test(formData.email) && (
                  <p style={{ color: "red", fontSize: "14px" }}>
                    Email format is incorrect
                  </p>
                )}
              <p className="FormLabel">Password</p>
              <div className="PasswordCont">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className={`Password-Input ${
                    submitted &&
                    (!formData.password ||
                      !passwordRegex.test(formData.password)) &&
                    "error"
                  }`}
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {showPassword ? (
                  <img
                    className="ShowPass"
                    type="button"
                    src={ShowPass}
                    alt="Show Password"
                    onClick={() => setShowPassword((prev) => !prev)}
                  />
                ) : (
                  <img
                    className="ShowPass"
                    type="button"
                    src={ShowPassOff}
                    alt="Show Password"
                    onClick={() => setShowPassword((prev) => !prev)}
                  />
                )}
              </div>

              {submitted && !formData.password && (
                <p style={{ color: "red", fontSize: "14px" }}>
                  Password is required
                </p>
              )}
              {submitted &&
                formData.password &&
                !passwordRegex.test(formData.password) && (
                  <p style={{ color: "red", fontSize: "14px" }}>
                    Password must be at least 8 characters
                  </p>
                )}
              {error && (
                <p style={{ color: "red", fontSize: "14px" }}>{error}</p>
              )}

              <div className="Login-ForgotPass">
                <p
                  className="Forgot-Password"
                  onClick={() => setOpenForgotPassModal(true)}
                  style={{
                    opacity: normLoading || loading ? 0.5 : 1,
                    cursor: normLoading || loading ? "not-allowed" : "pointer",
                  }}
                >
                  Forgot password?
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                {normLoading ? (
                  <ReactLoading
                    type="spinningBubbles"
                    color="#133e87"
                    height={60}
                    width={60}
                  />
                ) : (
                  <button
                    type="submit"
                    className="btnLogin primaryButton"
                    disabled={loading}
                  >
                    Log In
                  </button>
                )}
              </div>

              <hr />
            </div>
            <div className="Login-GoogleCont">
              {loading ? (
                <ReactLoading
                  type="spinningBubbles"
                  color="#133e87"
                  height={60}
                  width={60}
                />
              ) : (
                <div
                  onClick={normLoading ? null : loginGoogle}
                  style={{
                    opacity: normLoading ? 0.5 : 1,
                    cursor: normLoading ? "not-allowed" : "pointer",
                  }}
                  className="Login-GoogleCont"
                >
                  <img
                    src={GoogleLogo}
                    alt="Google"
                    className="Google-Logo"
                    disabled={isSigningIn}
                  />
                  <p>Continue with Google</p>
                </div>
              )}

              {/* {isSigningIn ? "Signing in..." : "Sign in with Google"} */}
            </div>
            <div className="CreateAccount">
              <div className="CreateAccountBtn">
                <label>Create an Account? </label>
                <a
                  href="/Register"
                  className="Sign-In"
                  style={{
                    opacity: normLoading || loading ? 0.5 : 1,
                    cursor: normLoading || loading ? "not-allowed" : "pointer",
                  }}
                >
                  Sign In
                </a>
              </div>
              <div className="CreateAccountBtn">
                <label>‎ or </label>
                <a
                  href="/nuntium"
                  className="Sign-In"
                  onClick={() => {
                    navigate("/nuntium");
                  }}
                  style={{
                    opacity: normLoading || loading ? 0.5 : 1,
                    cursor: normLoading || loading ? "not-allowed" : "pointer",
                  }}
                >
                  Continue Reading
                </a>
              </div>
            </div>
          </div>
        </form>
      </div>
      {openForgotPassModal && (
        <ForgotPassModal
          onClose={() => setOpenForgotPassModal(false)}
          // setIsForgotPassword={true}
        />
      )}

      {openSelectBranchModal && (
        <SelectBranchModal
          onClose={() => setOpenSelectBranchModal(false)}
          onSelectBranch={async (branch) => {
            console.log("Selected branch:", branch);
            setSelectedBranch(branch);
            setOpenSelectBranchModal(false);

            if (pendingGoogleUser) {
              await setDoc(doc(db, "users", pendingGoogleUser.uid), {
                created_at: new Date(),
                email: pendingGoogleUser.email,
                uid: pendingGoogleUser.uid,
                username: pendingGoogleUser.displayName,
                branchId: branch,
                recieveNotifications: true,
                status: "active",
                accountType: "google",
                role: "Reader",
                assignedCount: 0,
                photoURL: pendingGoogleUser.photoURL,

                permissions: {
                  accessLevel: 1,
                  permissions: {
                    articles: {
                      canDelete: false,
                      canEdit: false,
                      canView: true,
                    },
                    topics: {
                      canAssign: false,
                      canDelete: false,
                      canEditTopic: false,
                      canReturn: false,
                    },
                    users: {
                      canManage: false,
                    },
                  },
                },
              });

              const userDoc = await getDoc(
                doc(db, "users", pendingGoogleUser.uid)
              );
              if (userDoc.exists()) {
                await fetchUserAccessLvl(userDoc.data());
              } else {
                console.error("User document not found");
                navigate(`/Login`);
              }

              // Optionally, fetch user access level or continue login flow here
              setPendingGoogleUser(null); // Clear temp user
            }
          }}
        />
      )}
      {recovAcc && (
        <AlertsNConfirmsModal
          type="confirmation"
          message={"This account has been deleted, Do you want to recover it?"}
          title={"Recover Account?"}
          onHide={() => setRecoverAccount(false)}
          onConfirm={() => handleRecover()} //tawagin approve all duto nigga
          onCancel={() => {
            handleCancelRecovery();
            navigate("/Login");
            setRecoverAccount(false);
          }} //close yng modal here manigga fakyo
          show={recovAcc}
        />
      )}
    </>
  );
}
