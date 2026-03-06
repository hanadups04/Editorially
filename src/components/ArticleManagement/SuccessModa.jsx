import React, { useEffect } from 'react';
import './RequestList.css';

const SuccessModal = ({ isOpen, onClose, title = 'Success!', message = 'Action completed successfully.' }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay success-overlay" onClick={onClose}>
      <div className="modal success-modal" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h2 className="success-title">{title}</h2>
        <p className="success-message">{message}</p>
        <div className="success-actions">
          <button className="btn btn-primary" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
