import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Register.css";
import NUbranch from "./NUbranch.jsx";
import GoogleLogo from "../../assets/images/GoogleLogo.png";
import Logo from "../../assets/images/LogoBlueBg.png";
import {
  auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  fetchSignInMethodsForEmail,
} from "../../firebaseConfig";
import { updateProfile } from "firebase/auth";
import { setDoc, doc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import UpdateFunctions from "../../context/functions/UpdateFunctions.js";
import { usePermissionContext } from "../../context/PermissionContext.jsx";
import ReactLoading from "react-loading";
import TermsModal from "../../TermsModal/TermsModal";
import { useBranch } from "../../context/BranchContext.jsx";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    branchId: "",
    confirmPassword: "",
  });
  const [normLoading, setNormLoading] = useState(false);
  const { saveFcmToken } = UpdateFunctions();
  const { handleUserLogin } = usePermissionContext();
  const { setBranchId, currentSlug } = useBranch();
  const [user, authLoading] = useAuthState(auth);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [termsChecked, setTermsChecked] = useState(false);
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [verifyMessage, setVerifyMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  const [invData, setInviteData] = useState({});
  const [tokenData, setTokenData] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const provider = new GoogleAuthProvider();

  useEffect(() => {
    if (authLoading) return; // wait for auth to resolve
    if (user && !isLoggingIn) {
      navigate(`/${currentSlug}`, { replace: true }); // block login when already authenticated
    }
  }, [user, authLoading, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitted(false);
  };

  const handleRegister = async (e) => {
    setIsLoggingIn(true);
    e.preventDefault();
    setSubmitted(true);
    setError("");
    setNormLoading(true);

    const { email, password, confirmPassword, username, photoUrl, branchId } =
      formData;

    if (!email || !password || !username || !branchId) {
      setNormLoading(false);
      setError("Please Fill out all the required inputs.");
      return;
    }

    if (password !== confirmPassword) {
      setNormLoading(false);
      setError("Passwords do not match.");
      return;
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return;
    }

    if (!emailRegex.test(email) || !passwordRegex.test(password)) {
      setNormLoading(false);
      return;
    }

    if (username.length < 3) {
      setNormLoading(false);
      setError("Username must be at least 3 characters.");
      return;
    }

    if (!termsChecked) {
      setNormLoading(false);

      setError("Please agree to the terms and conditions.");
      return;
    }

    const defaultRnP = {
      role: "Reader",
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
    };

    try {
      // Step 1: Check if email is already registered
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        setNormLoading(false);

        setError("This email is already in use.");
        console.log(signInMethods.length);
        return;
      }

      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(result.user, {
        displayName: username,
      });

      await setDoc(doc(db, "users", result.user.uid), {
        created_at: serverTimestamp(),
        email: email,
        uid: result.user.uid,
        username: username,
        branchId: branchId,
        role: invData.role || defaultRnP.role,
        permissions: invData.permissions || defaultRnP.permissions,
        recieveNotifications: true,
        accountType: "standard",
        status: "active",
        assignedCount: 0,
        photoURL:
          photoUrl ??
          "https://firebasestorage.googleapis.com/v0/b/nu-publication-system.firebasestorage.app/o/logo.jpg?alt=media&token=fed28218-248d-4ad9-a639-14f072f7e9b9",
      });
      setVerifyMessage("Registration successful!");

      await sendEmailVerification(result.user);

      setTimeout(() => {
        setVerifyMessage(
          "A verification email has been sent. Please check your inbox."
        );
        setNormLoading(false);
      }, 3000);

      console.log("User Registered:", result.user);

      // await fetchUserAccessLvl(result.user);

      pollForVerification(result.user);
    } catch (error) {
      console.error("Registration Error:", error.message);
      setNormLoading(false);
      if (error.code === "auth/email-already-in-use") {
        setNormLoading(false);

        setError("This email is already in use.");
      } else {
        setNormLoading(false);

        setError("Invalid email or password!");
      }
    }
  };

  const pollForVerification = (user) => {
    const checkEmailVerification = async () => {
      await user.reload();
      if (user.emailVerified) {
        console.log("Email verified!");
        clearInterval(pollingInterval); // Stop polling
        setNormLoading(false);
        fetchUserAccessLvl(user);
        setVerifyMessage("Email has been verified. Redirecting you shortly");
      } else {
        console.log("Email not verified yet...");
      }
    };

    const pollingInterval = setInterval(checkEmailVerification, 3000);
    window.addEventListener("beforeunload", () =>
      clearInterval(pollingInterval)
    );
  };

  const fetchUserAccessLvl = async (user) => {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      setBranchId(userDoc.data().branchId);
      switch (userDoc.data().permissions.accessLevel) {
        case 6:
          navigate("/Adviser/AdviserApprove");
          console.log("navigating to adviser");
          break;
        case 5:
          navigate("/Admin/EicHomepage");
          console.log("navigating to eic");
          break;
        case 4:
          navigate("/Admin/EicHomepage");
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
          navigate(`/${currentSlug}`);
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
      navigate("/Login");
    }
  };

  useEffect(() => {
    const run = async () => {
      const inviteToken = queryParams.get("token");

      if (inviteToken) {
        setTokenData(true);
        try {
          const inviteRes = await fetch(
            "https://us-central1-nu-publication-system.cloudfunctions.net/checkInviteToken",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token: inviteToken }),
            }
          );

          const inviteData = await inviteRes.json();
          setInviteData(inviteData);
          console.log("inviteData:", inviteData);

          if (!inviteData.valid) {
            setError("Invalid or expired invite link.");
            return;
          }

          // Move the if block here
          if (inviteData.branchId) {
            console.log("inv data is :", inviteData);
            setFormData((prev) => ({
              ...prev,
              email: inviteData.target,
              branchId: inviteData.branchId,
            }));
            setTokenData(false);
          }
        } catch (err) {
          console.error("Error checking invite:", err);
          setTokenData(false);
          setError("Unable to verify invite.");
        }
      } else {
        console.log("no invite token, no prefill to do");
        setTokenData(false);
      }
    };

    run();
  }, []);

  const [showTermsModal, setShowTermsModal] = useState(false);

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
      <div className="Register-Parent">
        <div className="Register-Form">
          {/* <div className="Register-LogoCont">
            <img src={Logo} alt="Logo" className="logoLogin" />
          </div> */}
          <div className="Register-FormHeader">
            <p className="BrandName">Editorially</p>
            <p className="Register">Register your account</p>
          </div>
          {tokenData ? (
            <ReactLoading
              type="spinningBubbles"
              color="#133e87"
              height={60}
              width={60}
            />
          ) : (
            <div className="Register-FormContent">
              <p className="FormLabel">Your Branch</p>
              <NUbranch
                selectedBranch={formData.branchId}
                onChange={(branchId) =>
                  setFormData((prev) => ({ ...prev, branchId }))
                }
              />
              {submitted && !formData.branchId && (
                <p style={{ color: "red", fontSize: "14px" }}>
                  Select a branch.
                </p>
              )}
              <p className="FormLabel">Username</p>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="Register-Input"
                onChange={handleInputChange}
                required
              />
              {submitted && !formData.username && (
                <p style={{ color: "red", fontSize: "14px" }}>
                  Username is required
                </p>
              )}
              <p className="FormLabel">Email</p>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="Register-Input"
                onChange={handleInputChange}
                required
                value={formData.email}
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
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="Register-Input"
                onChange={handleInputChange}
                required
              />
              {submitted && !formData.password && (
                <p style={{ color: "red", fontSize: "14px" }}>
                  Password is required
                </p>
              )}
              <p className="FormLabel">Confirm Password</p>
              <input
                type="password"
                name="confirmPassword" // Changed from "password" to "confirmPassword"
                placeholder="Confirm Password" // Updated placeholder for clarity
                className="Register-Input"
                onChange={handleInputChange}
                required
              />
              {submitted && formData.password && !formData.confirmPassword && (
                <p style={{ color: "red", fontSize: "14px" }}>
                  Please confirm your password
                </p>
              )}
              {/* {submitted &&
                formData.password &&
                formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p style={{ color: "red", fontSize: "14px" }}>
                    Passwords do not match
                  </p>
                )} */}
              {submitted &&
                formData.password &&
                !passwordRegex.test(formData.password) && (
                  <p style={{ color: "red", fontSize: "14px" }}>
                    Password must be at least 8 characters
                  </p>
                )}

              <div className="Register-TermsConditions">
                <div className="Register-TermsCondsInput">
                  <input
                    type="checkbox"
                    checked={termsChecked}
                    required
                    onChange={(e) => setTermsChecked(e.target.checked)}
                    disabled={normLoading}
                    style={{
                      cursor: "pointer",
                    }}
                  />
                  I agree to the
                </div>
                <p
                  className="TermsNCondLink"
                  onClick={() => setShowTermsModal(true)}
                >
                  terms and conditions
                </p>
              </div>
              {submitted && !termsChecked && (
                <p style={{ color: "red", fontSize: "14px" }}>
                  Please Check The terms and conditions.
                </p>
              )}

              {/* {error && (
                <p style={{ color: "red", fontSize: "14px" }}>{error}</p>
              )} */}
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
                    className="btnsignup"
                    onClick={handleRegister}
                    disabled={normLoading}
                    // onClick={() => console.log("branch id is: ", formData.branchId)}
                  >
                    Sign Up
                  </button>
                )}
              </div>
              <hr />
            </div>
          )}

          <div className="HaveAccount">
            <div className="HaveAccountBtn">
              <label>Already have an Account? </label>
              <a
                href="/Login"
                className="Login"
                style={{
                  opacity: normLoading ? 0.5 : 1,
                  cursor: normLoading ? "not-allowed" : "pointer",
                }}
              >
                Log in
              </a>
            </div>
          </div>

          {verifyMessage && (
            <div className="VerifyMessageCont">
              <p
                className="success-message"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  borderBottomLeftRadius: "15px",
                  borderBottomRightRadius: "15px",
                  backgroundColor: "#008218",
                  fontSize: "14px",
                  fontWeight: "600",
                  margin: "50px",
                }}
              >
                {verifyMessage}
              </p>
            </div>
          )}
        </div>
      </div>

      <TermsModal
        show={showTermsModal}
        onHide={() => setShowTermsModal(false)}
        title="Terms and Conditions"
      >
        <p>
          <strong>
            By registering for an account, you agree to abide by the following
            terms and conditions:
          </strong>
        </p>
        <p>
          Account registration requires you to provide accurate, complete, and
          current information as requested in the registration form. You are
          responsible for ensuring that the information you provide remains
          correct and up to date at all times. Any false or misleading
          information may result in the deactivation of your account.
        </p>
        <p>
          You are responsible for maintaining the confidentiality of your login
          credentials. Any actions taken under your account will be considered
          your responsibility. If you believe your account has been compromised,
          you must immediately notify your administrators.
        </p>
        <p>
          Your data within the system will be collected and processed in
          accordance with our Privacy Policy. This includes information
          necessary for authentication, account management, and communication
          related to your use of the system. Your data will not be shared with
          unauthorized third parties without your consent, except as required by
          law.
        </p>
        <p>
          <strong>
            By completing your registration, you acknowledge that you have read,
            understood, and agreed to these Terms and Conditions, and that your
            continued use of the system constitutes ongoing acceptance of any
            future revisions to these terms.
          </strong>
        </p>
      </TermsModal>
    </>
  );
}
