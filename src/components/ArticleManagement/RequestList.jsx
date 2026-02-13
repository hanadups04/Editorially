import React, {useState, useEffect} from 'react';
import './RequestList.css';
import * as ReadFunctions from "../../context/functions/ReadFunctions";

const EditRequestsModal = ({ isOpen, onClose, requests = [], onToggleResolved }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal edit-requests-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit Requests</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {requests.length === 0 ? (
            <div className="requests-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              <p>No edit requests yet</p>
            </div>
          ) : (
            <div className="requests-list">
              {requests.map((request, index) => (
                <div key={index} className="request-card">
                  <div className="request-card-header">
                    <div className="request-author">
                      <div className="request-author-avatar">
                        {request.users_tbl.username.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="request-author-info">
                        <span className="request-author-name">{request.requestedBy}</span>
                        <span className="request-date">
                          {new Date(request.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    <span className={`request-urgency-badge ${request.isUrgent ? 'urgent' : 'normal'}`}>
                      {request.is_urgent ? '⚠ Urgent' : '✓ Normal'}
                    </span>
                  </div>
                  <div className="request-description">
                    {request.content}
                  </div>
                  <div className="request-description" style={{marginTop: "10px"}}>
                    <div className="form-group urgency-group">
                    <label className="urgency-label">
                        <input
                        type="checkbox"
                        name="is_resolved"
                        checked={!!request.resolved}
                        onChange={(event) => onToggleResolved?.(index, event.target.checked)}
                        className="urgency-checkbox"
                        />
                        <span className="urgency-indicator"></span>
                        <span className="urgency-text">
                        Close this Request
                        <span className="urgency-hint">
                        This will mark the request as resolved
                        </span>
                        </span>
                    </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default EditRequestsModal;
