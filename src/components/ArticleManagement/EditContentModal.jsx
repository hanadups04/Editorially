import React, { useState, useEffect } from "react";
import "./EditContentModal.css";
import * as UpdateFunctions from "../../context/functions/UpdateFunctions";
import * as AddFunctions from "../../context/functions/AddFunctions";

const EditContentModal = ({ isOpen, onClose, content, onSubmit }) => {
  const [formData, setFormData] = useState({
    headline: "",
    content: "",
    images: "",
  });

  useEffect(() => {
    if (content) {
      setFormData({
        headline: content.headline || "",
        content: content.content || "",
        images: content.images || "",
      });
    }
  }, [content]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateArticle = await UpdateFunctions.updateArticle(
      content.article_id,
      formData,
    );
    console.log("article data updated: ", updateArticle);
    onSubmit(formData);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, upload to server and get URL
      const fileUpload = await AddFunctions.uploadThumbnail(file);
      console.log("file uplaoded: ", fileUpload);
      // const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, images: fileUpload }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal edit-content-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">Edit Article</h2>
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

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="headline"
                className="form-input"
                value={formData.headline}
                onChange={handleChange}
                placeholder="Enter article title"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea
                name="content"
                className="form-textarea"
                value={formData.content}
                onChange={handleChange}
                placeholder="Enter article content"
                rows={8}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Thumbnail</label>
              <div className="thumbnail-upload">
                {formData.images && (
                  <div className="thumbnail-preview">
                    <img src={formData.images} alt="Thumbnail preview" />
                  </div>
                )}
                <div className="upload-controls">
                  <label className="upload-btn">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      hidden
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Upload
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContentModal;
