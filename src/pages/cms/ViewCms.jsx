import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./ViewCms.css";

const ViewCms = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState(
    "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800"
  );

  // Mock data - in real app, fetch based on id
  const contentData = {
    id: id || "1",
    title: "Getting Started with React",
    content: `React is a powerful JavaScript library for building user interfaces. It allows developers to create reusable UI components and manage complex state efficiently.

In this comprehensive guide, we'll explore the fundamentals of React and how to build your first component. We'll cover JSX syntax, component props, state management, and lifecycle methods.

React's component-based architecture makes it easy to break down complex UIs into smaller, manageable pieces. Each component can maintain its own state and props, making your code more organized and easier to debug.

Whether you're building a simple website or a complex web application, React provides the tools and flexibility you need to create amazing user experiences.`,
    publishedDate: "2024-01-15",
    author: "John Doe",
    status: "published",
  };

  const handleDelete = () => {
    alert("Content deleted successfully");
    navigate("/content");
  };

  const handleRequestChanges = () => {
    alert(`Request for changes to "${contentData.title}" has been submitted.`);
  };

  const handleThumbnailClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setThumbnail(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="content-detail">
      <header className="detail-header">
        <div className="container">
          <button className="back-button" onClick={() => navigate("/content")}>
            ← Back to Content
          </button>
          <div className="header-content">
            <div className="header-info">
              <h1 className="detail-title">{contentData.title}</h1>
              <div className="detail-meta">
                <span>By {contentData.author}</span>
                <span>•</span>
                <span>
                  {new Date(contentData.publishedDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="detail-main">
        <div className="detail-container">
          <div
            className="detail-thumbnail-container"
            onClick={handleThumbnailClick}
          >
            <img
              src={thumbnail}
              alt={contentData.title}
              className="detail-thumbnail"
            />
            <div className="thumbnail-overlay">
              <span className="thumbnail-overlay-text">
                Click to select a new picture
              </span>
            </div>
          </div>

          <article className="detail-article">
            {contentData.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="article-paragraph">
                {paragraph}
              </p>
            ))}
          </article>

          <div className="detail-actions">
            <button
              className="action-btn btn-primary"
              onClick={() => navigate(`/content/${id}/edit`)}
            >
              <span className="btn-icon">✏️</span>
              Edit Content
            </button>
            <button
              className="action-btn btn-secondary"
              onClick={handleRequestChanges}
            >
              <span className="btn-icon">💬</span>
              Request Changes
            </button>
            <button className="action-btn btn-danger" onClick={handleDelete}>
              <span className="btn-icon">🗑️</span>
              Delete
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewCms;
