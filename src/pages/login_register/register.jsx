import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Register.css";
import ReactLoading from "react-loading";
import * as auth from "../../context/auth";
import { supabase } from "../../supabaseClient";
// import TermsModal from "../../TermsModal/TermsModal";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    branchId: "",
    confirmPassword: "",
  });
  const [normLoading, setNormLoading] = useState(false);
  const [registerMessage, setRegisterMessage] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [termsChecked, setTermsChecked] = useState(false);
  const [error, setError] = useState("");
  const [verifyMessage, setVerifyMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  const [invData, setInviteData] = useState({});
  const [tokenData, setTokenData] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitted(false);
  };

  const handleRegister = async (e) => {
    console.log("napindot ang regikster buttons");
    setIsLoggingIn(true);
    e.preventDefault();
    setSubmitted(true);
    setError("");
    setNormLoading(true);

    const { email, password, confirmPassword, username, photoUrl, branchId } =
      formData;

    // if (!email || !password || !username || !branchId) {
    //   setNormLoading(false);
    //   setError("Please Fill out all the required inputs.");
    //   return;
    // }

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
    try {
      const signInUser = await auth.signUp(email, password, username);
      console.log("signinuser: ", signInUser.code);
      console.log("signinuser: ", signInUser.data);

      if (signInUser.code === 1) {
        console.log("registering ka na manigga");
        setNormLoading(false);
        setRegisterMessage(
          "Email Confirmation Sent. Please Click the provided link there to proceed with the account verification"
        );
      } else {
        setNormLoading(false);
        setRegisterMessage("Registration Failed due to unkown reason");
        console.log("register failed due to: ", signInUser.error);
      }
    } catch (error) {
      console.error("Registration Error:", error);
      setRegisterMessage("Registration Failed due to unkown reason");
      setNormLoading(false);
    }
  };

  const [showTermsModal, setShowTermsModal] = useState(false);

  // if (authLoading) {
  //   return (
  //     <div
  //       style={{
  //         display: "flex",
  //         flexDirection: "column",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         padding: 24,
  //       }}
  //     >
  //       <ReactLoading
  //         type="spinningBubbles"
  //         color="#133e87"
  //         height={60}
  //         width={60}
  //       />
  //     </div>
  //   );
  // }

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
              {/* <NUbranch
                selectedBranch={formData.branchId}
                onChange={(branchId) =>
                  setFormData((prev) => ({ ...prev, branchId }))
                }
              /> */}
              {/* {submitted && !formData.branchId && (
                <p style={{ color: "red", fontSize: "14px" }}>
                  Select a branch.
                </p>
              )} */}
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
                    onClick={(e) => handleRegister(e)}
                    disabled={normLoading}
                    // onClick={() => console.log("pindiot ako eh ")}
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

      {/* <TermsModal
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
      </TermsModal> */}
    </>
  );
}
