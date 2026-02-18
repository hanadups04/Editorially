import React, { useState, useEffect } from "react";
import "./login.css";
// import Logo from "../../assets/images/LogoBlueBg.png";
import ShowPass from "../../assets/images/showpass.png";
import ShowPassOff from "../../assets/images/showpassoff.png";
// import ForgotPassModal from "./ForgotPassModal.jsx";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
// import { useBranch } from "../../context/BranchContext.jsx";
import AlertsNConfirmsModal from "../../AlertModals/AlertsNConfirmsModal.jsx";
import { isAuthenticated, signIn } from "../../context/auth.js";
import * as ReadFunctions from "../../context/functions/ReadFunctions.js";
import { supabase } from "../../supabaseClient.js";
import * as auth from "../../context/auth.js";

export default function Login() {
  const [recovAcc, setRecoverAccount] = useState(false);
  const [formData, setFormData] = useState({
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
    console.log("handle login called");
    e.preventDefault();

    try {
      const currentUser = await signIn(formData.email, formData.password);
      if (currentUser.code === 1) {
        const userdata = await isAuthenticated();
        const { data: existing } = await supabase
          .from("users_tbl")
          .select("uid") // if stored as JSON
          .eq("uid", userdata.id)
          .maybeSingle();

        if (!existing) {
          console.log("not existing, creating a new one");
          await supabase.from("users_tbl").insert({
            uid: currentUser.data.user.id,
            username: currentUser.data.user.user_metadata.display_name,
            email: currentUser.data.user.email,
            status: "active",
            is_notif: true,
            photoUrl:
              "https://firebasestorage.googleapis.com/v0/b/nu-publication-system.firebasestorage.app/o/logo.jpg?alt=media&token=fed28218-248d-4ad9-a639-14f072f7e9b9",
          });
        }
        console.log(
          "acccount existing, proceeding to fetch user acccesslevel ",
        );
        console.log(
          "fetch user accesslevel called: ",
          currentUser.data.user.id,
        );
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
      .select("uid, role_id, status, roles_tbl ( access_level )")
      .eq("uid", userId)
      .single();

    if (data) {
      if (data.status === "inactive") {
        // ask user if they want to recover their account
        alert("your account has been disabled. ask your admin for assistance");
        const login = await auth.signOut();
        console.log("state is: ", login);
        return;
      }

      navigate("/dashboard");
    } else {
      console.error("User row not found");
      navigate(`/login`);
    }
  };
  const [openForgotPassModal, setOpenForgotPassModal] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false); // added

  //   if (authLoading) {
  //     return (
  //       <div
  //         style={{
  //           display: "flex",
  //           flexDirection: "column",
  //           justifyContent: "center",
  //           alignItems: "center",
  //           padding: 24,
  //         }}
  //       >
  //         <ReactLoading
  //           type="spinningBubbles"
  //           color="#133e87"
  //           height={60}
  //           width={60}
  //         />
  //       </div>
  //     );
  //   }

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
                    opacity: loading ? 0.5 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
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
                {loading ? (
                  <ReactLoading
                    type="spinningBubbles"
                    color="#133e87"
                    height={60}
                    width={60}
                  />
                ) : (
                  <button type="submit" className="btnLogin" disabled={loading}>
                    Log In
                  </button>
                )}
              </div>

              <hr />
            </div>
            <div className="CreateAccount">
              <div className="CreateAccountBtn">
                <label>Create an Account? </label>
                <a
                  href="/Register"
                  className="Sign-In"
                  style={{
                    opacity: loading ? 0.5 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
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
                    opacity: loading ? 0.5 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
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
