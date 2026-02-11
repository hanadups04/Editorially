import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import Layout from "../components/layout/Layout";
import Layout from "../../components/templates/AdminTemplate";
// import EditContentModal from "../components/content/EditContentModal";
import EditContentModal from "../../components/ArticleManagement/EditContentModal";
import "./ContentDetail.css";
import * as ReadFunctions from "../../context/functions/ReadFunctions";
import * as auth from "../../context/auth";
import RequestChangesModal from "../../components/ArticleManagement/RequestChangesModa";
import * as AddFunctions from "../../context/functions/AddFunctions";

const ContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [content, setContent] = useState({});
  const [userRole, setRole] = useState([]);
  const [userId, setId] = useState([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchArticles() {
      try {
        const data = await ReadFunctions.getSingleArticle(id);
        if (isMounted) {
          console.log("data is: ", data);
          setContent(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    async function fetchRole() {
      try {
        const user = await auth.isAuthenticated();
        console.log("user is", user.data.id);
        const data = await ReadFunctions.getUserProfile(user.data.id);
        if (isMounted) {
          console.log("userdata is: ", data);
          setId(user.data.id);
          setRole(data.roles_tbl.access_level);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchArticles();
    fetchRole();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleFeatured = () => {
    setContent((prev) => ({ ...prev, featured: !prev.featured }));
  };

  const handleEditSubmit = (updatedData) => {
    setContent((prev) => ({ ...prev, ...updatedData }));
    setIsEditModalOpen(false);
  };

  const handleRequestSubmit = async (requestData) => {
    setIsRequestModalOpen(false);
    const callReqeusetEdit = await AddFunctions.insertEditRequest(requestData);

    console.log("data of request edit is: ", requestData);
  };

  if (loading) {
    return (
      <Layout>
        <div className="content-detail">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="content-detail">
        <div className="detail-header">
          <button className="back-btn" onClick={() => navigate("/content")}>
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
            Back to Content
          </button>

          <div
            style={{
              display: "flex",
              columnGap: "10px",
            }}
          >
            {userRole < 3 ? (
              <button
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsRequestModalOpen(true);
                }}
              >
                <span className="btn-icon">🙋</span>
                Request Changes
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => setIsEditModalOpen(true)}
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
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit Article
              </button>
            )}

            <button
              className="btn btn-secondary"
              onClick={() => setIsEditModalOpen(true)}
              style={{ backgroundColor: "#10b981", color: "white" }}
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
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit Requests
            </button>
            <button
              className="btn btn-delete"
              // onClick={(e) => handleDelete(content.article_id, e)}
            >
              Delete Article
            </button>
          </div>
        </div>

        <article className="detail-article">
          <div className="article-thumbnail">
            <img src={content.images} alt={content.headline} />
          </div>

          <div className="article-content">
            <div className="article-meta">
              <span className="meta-section">{content.section_id}</span>
              <span className="meta-date">
                {new Date(content.date_posted).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            <h1 className="article-headline">{content.headline}</h1>

            <div className="article-author">
              <div className="author-avatar">
                {content.author_id
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="author-info">
                <span className="author-name">{content.author_id}</span>
                <span className="author-role">Staff Writer</span>
              </div>
            </div>

            <div className="featured-toggle">
              <span className="toggle-label">Featured Article</span>
              <button
                className={`toggle-btn ${content.featured ? "active" : ""}`}
                onClick={handleToggleFeatured}
              >
                <span className="toggle-slider"></span>
              </button>
            </div>

            <div className="article-body">
              {content.content.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>
      </div>

      <EditContentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        content={content}
        onSubmit={handleEditSubmit}
      />

      <RequestChangesModal
        isOpen={isRequestModalOpen}
        onClose={() => {
          setIsRequestModalOpen(false);
        }}
        content={{
          article_id: content.article_id,
        }}
        onSubmit={handleRequestSubmit}
        owner_id={userId}
      />
    </Layout>
  );
};

export default ContentDetail;
