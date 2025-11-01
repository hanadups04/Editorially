import React, { useState, useEffect } from "react";
import "./AlertsNConfirmsModal.css";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import Check from "../assets/images/Check.png";
import Error from "../assets/images/Error.png";
import Confirm from "../assets/images/Confirm.png";

export default function AlertsNConfirmsModal({
  title,
  message,
  show = true,
  onHide,
  type = "success",
  onConfirm,
  onCancel,
}) {
  // const [position, setPosition] = useState("top-start");
  const [visible, setVisible] = useState(show);
  // const [confirmed, setConfirmed] = useState(false);

  // if (!visible) return null;

  let imgSrc, imgBg, textColor;
  switch (type) {
    case "error":
      imgSrc = Error;
      imgBg = "#f5cdcdff";
      textColor = "#C10707";
      break;
    case "confirmation":
      imgSrc = Confirm;
      imgBg = "#acb5e4ff";
      textColor = "#020b40";
      break;
    case "success":
    default:
      imgSrc = Check;
      imgBg = "#e4f7e2f1";
      textColor = "#238110";
      break;
  }

  useEffect(() => {
    if (visible && type !== "confirmation") {
      const timeout = setTimeout(() => {
        setVisible(false);
        if (onHide) onHide();
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [visible, type, onHide]);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  if (!visible) return null;

  return (
    <>
      <div
        className="AlertsNConfirmsModal-Parent"
        style={{
          position: "fixed",
          zIndex: 1000,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0, 0, 0, 0.14)",
        }}
        onClick={() => {
          setVisible(false);
          if (type === "confirmation") {
            if (onCancel) onCancel();
          }
          if (onHide) onHide();
        }}
      >
        <div aria-live="polite" aria-atomic="true">
          <ToastContainer
            className="p-3"
            style={{
              zIndex: 1000,
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              maxWidth: "600px",
              // height: "100vh",
              display: "flex",
              justifyContent: "center",
              borderRadius: "20px",
            }}
            position="middle-center"
          >
            <Toast
              show={visible}
              onClose={() => {
                setVisible(false);
                if (onHide) onHide();
              }}
              style={{
                width: "auto",
                background: "white",
              }}
            >
              <Toast.Body
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  padding: "2rem",
                }}
              >
                <img
                  src={imgSrc}
                  style={{
                    width: "35px",
                    height: "35px",
                    backgroundColor: imgBg,
                  }}
                  className="rounded me-2"
                  alt=""
                />
                <h4 style={{ color: textColor, fontWeight: "600" }}>{title}</h4>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: "450",
                    wordWrap: "break-word",
                    textAlign: "center",
                  }}
                >
                  {message}
                </p>
                {type === "confirmation" && (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      className="ConfirmButton btn-primary"
                      onClick={() => {
                        if (onConfirm) onConfirm();
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      className="CancelButton btn-secondary"
                      onClick={() => {
                        setVisible(false);
                        if (onCancel) onCancel();
                        if (onHide) onHide();
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </Toast.Body>
            </Toast>
          </ToastContainer>
        </div>
      </div>
    </>
  );
}
