import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SuccessModal from "../../components/ArticleManagement/SuccessModa";
import "./ForgotPass.css";
import { supabase } from "../../supabaseClient";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      if (!newPassword || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
      }

      if (newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log("SESSION:", session);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("USER:", user);

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      // alert("Password updated successfully.");
      setSuccess(true);

      // Optional
      //   navigate("/login");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update password.");
    }
  };

  return (
    <div className="fp-page">
      <div className="fp-card">
        <h1 className="fp-title">Reset Password</h1>
        <p className="fp-subtitle">
          Enter your new password below to update your account.
        </p>

        <form className="fp-form" onSubmit={handleSubmit}>
          <div className="fp-field">
            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="fp-field">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="fp-error">{error}</div>}

          <button type="submit" className="fp-submit-btn">
            Update Password
          </button>
        </form>
      </div>

      <SuccessModal
        isOpen={success}
        title="Password Updated"
        message="Your password has been successfully updated."
        onClose={() => {
          setSuccess(false);
          navigate("/");
        }}
      />
    </div>
  );
};

export default ForgotPassword;
