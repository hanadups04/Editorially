import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EnterEmail.css";
import * as auth from "../../context/auth";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    await auth.sendResetEmail(email);

    onClose?.();
    // navigate("/forgot-password");
  };

  return (
    <div className="fpm-overlay" onClick={onClose}>
      <div className="fpm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="fpm-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <h2 className="fpm-title">Forgot Password</h2>
        <p className="fpm-subtitle">
          Enter the email associated with your account and we'll send you a link
          to reset your password.
        </p>

        <form className="fpm-form" onSubmit={handleSubmit}>
          <div className="fpm-field">
            <label htmlFor="fpm-email">Email Address</label>
            <input
              id="fpm-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              required
            />
          </div>

          {error && <div className="fpm-error">{error}</div>}

          <div className="fpm-actions">
            <button
              type="button"
              className="fpm-btn fpm-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="fpm-btn fpm-btn-primary">
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
