import React, { useState, useRef } from "react";
import "./UploadImagesModal.css";

const UploadImagesModal = ({ isOpen, onClose }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
  };

  const addFiles = (files) => {
    const newFiles = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const removeFile = (id) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpload = () => {
    setUploading(true);
    const progress = selectedFiles.map((file) => ({
      id: file.id,
      progress: 0,
    }));
    setUploadProgress(progress);

    // Simulate upload progress
    selectedFiles.forEach((file, index) => {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const updated = [...prev];
          if (updated[index].progress < 100) {
            updated[index].progress += 10;
          } else {
            clearInterval(interval);
          }
          return updated;
        });
      }, 200);
    });

    // Auto close after upload completes
    setTimeout(() => {
      setUploading(false);
      setUploadProgress([]);
      setSelectedFiles([]);
      onClose();
    }, selectedFiles.length * 2000 + 1000);
  };

  if (!isOpen && !uploading) return null;

  return (
    <>
      {isOpen && !uploading && (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Upload Images</h2>
              <button className="modal-close" onClick={onClose}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div
                className={`file-upload-zone ${isDragging ? "drag-over" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ margin: "0 auto" }}
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <p
                  style={{
                    marginTop: "var(--spacing-md)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Click to select files or drag and drop
                </p>
                <p
                  style={{
                    marginTop: "var(--spacing-xs)",
                    fontSize: "var(--text-sm)",
                    color: "var(--text-tertiary)",
                  }}
                >
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />

              {selectedFiles.length > 0 && (
                <div className="file-preview-grid">
                  {selectedFiles.map((file) => (
                    <div key={file.id} className="file-preview-item">
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="file-preview-image"
                      />
                      <button
                        className="file-preview-remove"
                        onClick={() => removeFile(file.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={selectedFiles.length === 0}
              >
                Upload{" "}
                {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}
              </button>
            </div>
          </div>
        </div>
      )}

      {uploading && uploadProgress.length > 0 && (
        <div className="upload-container">
          <div className="upload-header">
            <span className="upload-title">
              Uploading {uploadProgress.length} file(s)
            </span>
            <button className="modal-close" onClick={() => setUploading(false)}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          {selectedFiles.map((file, index) => (
            <div key={file.id} className="upload-item">
              <div className="upload-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
              <div className="upload-info">
                <div className="upload-filename">{file.name}</div>
                <div className="upload-progress-bar">
                  <div
                    className="upload-progress-fill"
                    style={{
                      width: `${uploadProgress[index]?.progress || 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default UploadImagesModal;
