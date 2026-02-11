import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../../components/templates/AdminTemplate";
import "./DocumentPage.css";

const DocumentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("taskId");
  const taskRole = searchParams.get("role") || "Writer";
  const taskAssignee = searchParams.get("assignee") || "Unknown";

  const [content, setContent] = useState("");
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Sample comments data
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "David Kim",
      avatar: "DK",
      text: "Great start! Make sure to include quotes from the sustainability coordinator.",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      author: "Sarah Johnson",
      avatar: "SJ",
      text: "I've added the interview notes in the shared folder. Feel free to use them.",
      timestamp: "1 day ago",
    },
  ]);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date().toLocaleTimeString());
    }, 1000);
  };

  const handleSubmitForReview = () => {
    alert("Work submitted for review!");
    navigate("/project");
  };

  const handleAddComment = (newComment) => {
    const comment = {
      id: comments.length + 1,
      author: "You",
      avatar: "YO",
      text: newComment,
      timestamp: "Just now",
    };
    setComments((prev) => [...prev, comment]);
  };

  return (
    <Layout>
      <div className="document-page">
        <div className="document-header">
          <div className="document-header-left">
            <button
              className="btn btn-ghost"
              onClick={() => navigate("/tasks")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Project
            </button>
            <div className="document-info">
              <h1 className="document-title">{taskRole} - Work Submission</h1>
              <span className="document-meta">Assigned to: {taskAssignee}</span>
            </div>
          </div>
          <div className="document-header-right">
            {lastSaved && (
              <span className="save-status">Last saved: {lastSaved}</span>
            )}
            <button
              className="btn btn-secondary"
              onClick={handleSave}
              disabled={isSaving}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
              {isSaving ? "Saving..." : "Save Draft"}
            </button>
            <button className="btn btn-primary" onClick={handleSubmitForReview}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              Submit for Review
            </button>
          </div>
        </div>

        <div className="document-editor-container">
          <div className="editor-toolbar">
            <div className="toolbar-group">
              <button className="toolbar-btn" title="Bold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                  <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                </svg>
              </button>
              <button className="toolbar-btn" title="Italic">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="19" y1="4" x2="10" y2="4"></line>
                  <line x1="14" y1="20" x2="5" y2="20"></line>
                  <line x1="15" y1="4" x2="9" y2="20"></line>
                </svg>
              </button>
              <button className="toolbar-btn" title="Underline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
                  <line x1="4" y1="21" x2="20" y2="21"></line>
                </svg>
              </button>
            </div>
            <div className="toolbar-divider"></div>
            <div className="toolbar-group">
              <button className="toolbar-btn" title="Heading 1">
                H1
              </button>
              <button className="toolbar-btn" title="Heading 2">
                H2
              </button>
              <button className="toolbar-btn" title="Heading 3">
                H3
              </button>
            </div>
            <div className="toolbar-divider"></div>
            <div className="toolbar-group">
              <button className="toolbar-btn" title="Bullet List">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
              <button className="toolbar-btn" title="Numbered List">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="10" y1="6" x2="21" y2="6"></line>
                  <line x1="10" y1="12" x2="21" y2="12"></line>
                  <line x1="10" y1="18" x2="21" y2="18"></line>
                  <path d="M4 6h1v4"></path>
                  <path d="M4 10h2"></path>
                  <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
                </svg>
              </button>
              <button className="toolbar-btn" title="Quote">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"></path>
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z"></path>
                </svg>
              </button>
            </div>
          </div>

          <textarea
            className="document-editor"
            placeholder="Start writing your content here...

Tips:
• Begin with a compelling introduction
• Include relevant quotes and data
• Structure your content with clear sections
• Proofread before submitting"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="editor-footer">
            <span className="word-count">
              {content.split(/\s+/).filter((word) => word.length > 0).length}{" "}
              words
            </span>
            <span className="char-count">{content.length} characters</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DocumentPage;
