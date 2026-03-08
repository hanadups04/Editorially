import React from "react";
import "./ProgressTracker.css";

const ProgressTracker = ({ currentStep, steps }) => {
  const currentStepIndex = steps.findIndex(
    (step) => step.step_id === currentStep,
  );
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="card progress-tracker">
      <div className="card-header">
        <h2 className="card-title">Project Progress</h2>
        <p className="card-subtitle">Track the workflow stages</p>
      </div>
      <div className="progress-steps">
        <div className="progress-line">
          <div
            className="progress-line-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;

          return (
            <div
              key={step.step_id}
              className={`progress-step ${isCompleted ? "completed" : ""} ${
                isActive ? "active" : ""
              }`}
            >
              <div className="progress-circle">
                {isCompleted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className="progress-label">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;
