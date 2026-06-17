import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../../supabaseClient.js";
import * as AddFunctions from "../../context/functions/AddFunctions.js";
import "./UploadImagesModal.css";
import { compressImage } from "../../context/functions/AddFunctions.js";
import ReactLoading from "react-loading";
import { readImages } from "../../context/functions/ReadFunctions.js";

const UploadImagesModal = ({ isOpen, onClose, taskId, project_id, onAdd }) => {
  console.log("asa", taskId);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [thumbnail, setThumbnail] = useState("");
  const [processing, setProcessing] = useState(false);
  const [image, setImage] = useState("");
  const [loading, setIsLoading] = useState(true);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [imageID3, setImageID3] = useState("");
  const [imageID4, setImageID4] = useState("");

  const hasSelectedFile = !!selectedFiles?.file;
  const hasUploadedImage = !!image;

  useEffect(() => {
    let isMounted = true;

    async function getData() {
      try {
        const data = await readImages(taskId);
        console.log(data, "data of image");
        const hires3 = data.find((item) => item.category === 3);
        const hires4 = data.find((item) => item.category === 4);

        setImageID3(hires3.content_id);
        setImageID4(hires4.content_id);

        setImage(hires3.content);
        setShouldUpdate(true);
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    getData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];

    if (!file) return;
    addFile(file);
  };

  const addFile = async (file) => {
    const newFile = {
      id: crypto.randomUUID(),
      file: file,
      preview: URL.createObjectURL(file),
      name: file.name,
    };
    try {
      setProcessing(true);
      const compressed = await compressImage(file);
      setSelectedFiles(newFile);
      setThumbnail(compressed);
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(false);
    }
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

  const handleSubmit = async (uploadedUrls, thumbsnail) => {
    const payload = await supabase.from("contents_tbl").insert({
      subtask_id: taskId,
      category: 3,
      content: uploadedUrls,
      project_id: project_id,
    });

    const payload2 = await supabase.from("contents_tbl").insert({
      subtask_id: taskId,
      category: 4,
      content: thumbsnail,
      project_id: project_id,
    });

    const payload3 = await supabase
      .from("project_subtask_tbl")
      .update({
        is_done: true,
      })
      .eq("subtask_id", taskId);

    console.log("data booger: ", payload);
  };

  const handleUpdate = async (uploadedUrls, thumbsnail) => {
    const [payload, payload2] = await Promise.all([
      supabase
        .from("contents_tbl")
        .update({
          subtask_id: taskId,
          category: 3,
          content: uploadedUrls,
          project_id: project_id,
        })
        .eq("content_id", imageID3),

      supabase
        .from("contents_tbl")
        .update({
          subtask_id: taskId,
          category: 4,
          content: thumbsnail,
          project_id: project_id,
        })
        .eq("content_id", imageID4),
    ]);

    console.log("update result:", { payload, payload2 });
  };

  const handleImageUpload = async (e) => {
    // const file = e.target.files?.[0];
    if (!selectedFiles?.file) return;
    if (selectedFiles) {
      setUploading(true);
      try {
        const newFiles = await AddFunctions.uploadThumbnail(selectedFiles.file);
        const newThumbnail = await AddFunctions.uploadThumbnail(thumbnail);
        console.log("file uplaoded: ", newFiles);
        setSelectedFiles(newFiles);

        if (shouldUpdate) {
          console.log("newThumbnail:", newThumbnail);
          console.log("newFiles:", newFiles);
          await handleUpdate(newFiles, newThumbnail);
        } else {
          await handleSubmit(newFiles, newThumbnail);
        }

        // optional cleanup
        setSelectedFiles("");
        if (onAdd) onAdd();
        onClose();
      } catch (err) {
        console.error("Upload/submit failed:", err);
      } finally {
        setUploading(false);
        e.target.value = ""; // lets you re-pick the same file
      }
    }
  };

  if (!isOpen && !uploading) return null;

  return (
    <>
      {isOpen && !uploading && (
        <div className="admin-overlay" onClick={onClose}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-header">
              <h2 className="admin-title">Upload Images</h2>
              <button className="admin-close" onClick={onClose}>
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

            <div className="admin-body">
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
                  Click to select file or drag and drop
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

              {!processing && (hasSelectedFile || hasUploadedImage) && (
                <>
                  <div className="file-preview-grid">
                    <div className="file-preview-item">
                      <img
                        src={hasSelectedFile ? selectedFiles.preview : image}
                        alt={
                          hasSelectedFile
                            ? selectedFiles.name
                            : "article thumbnail"
                        }
                        className="file-preview-image"
                      />
                    </div>
                  </div>
                </>
              )}

              {processing ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
                    flexDirection: "column",
                  }}
                >
                  <ReactLoading
                    type="spinningBubbles"
                    color="#133e87"
                    height={60}
                    width={60}
                  />
                  Please wait while we process your image
                </div>
              ) : (
                <></>
              )}
            </div>

            <div className="admin-footer">
              <button
                type="button"
                className="admin-btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn btn-primary"
                onClick={handleImageUpload}
                disabled={Object.keys(selectedFiles).length === 0}
              >
                Upload
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
            <button className="admin-close" onClick={() => setUploading(false)}>
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
          {/* {selectedFiles.map((file, index) => (
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
          ))} */}
        </div>
      )}
    </>
  );
};

export default UploadImagesModal;
