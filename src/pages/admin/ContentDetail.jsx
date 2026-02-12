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
import EditRequestsModal from "../../components/ArticleManagement/RequestList";
import * as UpdateFunctions from "../../context/functions/UpdateFunctions";
import * as DeleteFunctions from "../../context/functions/DeleteFunctions";
import ConfirmationModal from "../../components/ArticleManagement/ConfirmationModal";
import { supabase } from "../../supabaseClient";

const ContentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [content, setContent] = useState({});
  const [userRole, setRole] = useState([]);
  const [userId, setId] = useState([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [showConfirmOpen, setShowConfirmOpen] = useState(false);

  
  const [editRequests, setEditRequests] = useState([]);

  const handleToggleRequestResolved = async (requestIndex, nextValue) => {
  setEditRequests((prev) =>
    prev.map((request, index) =>
      index === requestIndex ? { ...request, resolved: nextValue } : request
    )
  );

  const resolved = await UpdateFunctions.markRequestAsResolved(
    editRequests[requestIndex].edit_id,
    nextValue
  );

  console.log("resolved data is: ", resolved);
};

const handleDelete = async () => {
    const callDelete = await DeleteFunctions.archiveArticle(id, !content.visible);
    // console.log("delete is: ", id, !content.visible);
    setDeleteConfirmOpen(false);
    console.log("archive result is: ", callDelete);
  };

  

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

    async function fetchRequests() {
      try {
        const requests = await ReadFunctions.getRequestsList(id);
        if(isMounted) {
          console.log("request is: ", requests);
          setEditRequests(requests);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchArticles();
    fetchRole();
    fetchRequests();


    const subscription = supabase
      .channel('articles-changes') // you can name it anything
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'articles_tbl' },
        (payload) => {
          console.log('Change received!', payload);
          // payload.new → new row
          // payload.old → old row (for update/delete)
          setContent((prev) => {
            switch (payload.eventType) {
              case 'INSERT':
                return [...prev, payload.new];
              case 'UPDATE':
                return prev.map((a) =>
                  a.article_id === payload.new.article_id ? payload.new : a
                );
              case 'DELETE':
                return prev.filter(
                  (a) => a.article_id !== payload.old.article_id
                );
              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleToggleFeatured = async () => {
    setContent((prev) => ({ ...prev, is_featured: !prev.is_featured }));
    const featured = await UpdateFunctions.featureArticle(
      content.article_id,
      !content.is_featured
    );
    console.log("featured data is: ", featured);  

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
            {/* {userRole < 3 ? (
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
            ) : ( */}
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
            {/* )} */}

            <button className="requests-btn" onClick={() => setIsRequestsModalOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              Edit Requests
              {editRequests.filter(req => req.resolved !== true).length > 0 && (
                <span className="requests-badge">
                  {editRequests.filter(req => req.resolved !== true).length}
                </span>
              )}

            </button>
            {content.visible ? (
              <button
              className="btn btn-delete"
              onClick={(e) => setDeleteConfirmOpen(true)}
            >
              Hide Article
            </button>
            ) : (
              <button
              className="btn btn-primary"
              onClick={(e) => setShowConfirmOpen(true)}
            >
              Show Article
            </button>
            )}
            
          </div>
        </div>

        <article className="detail-article">
          <div className="article-thumbnail">
            <img src={content.images} alt={content.headline} />
          </div>

          <div className="article-content">
            <div className="article-meta">
              <span className="meta-section">{content.sections_tbl.section_name}</span>
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
                {content.users_tbl.username
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="author-info">
                <span className="author-name">{content.users_tbl.username}</span>
                <span className="author-role">{content.users_tbl.roles_tbl.role_name}</span>
              </div>
            </div>

            <div className="featured-toggle" style={{backgroundColor: content.is_featured ? "#2563eb" : "#64748b", color: "white"}}>
              {content.is_featured ? "★ Article is Featured" : "☆ Mark as Featured"}
              <button
                className={`toggle-btn ${content.is_featured ? "active" : ""}`}
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

      <EditRequestsModal
        isOpen={isRequestsModalOpen}
        onClose={() => setIsRequestsModalOpen(false)}
        requests={editRequests}
        onToggleResolved={handleToggleRequestResolved}
      />

      <ConfirmationModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
        }}
        onConfirm={() => {
          handleDelete();
        }}
        title="Hide Article"
        message="Are you sure you want to Hide this article?."
        confirmText="Hide"
        cancelText="Cancel"
        variant="danger"
      />

      <ConfirmationModal
        isOpen={showConfirmOpen}
        onClose={() => {
          setShowConfirmOpen(false);
        }}
        onConfirm={() => {
          handleDelete();
        }}
        title="Show Article"
        message="Are you sure you want to Show this article?."
        confirmText="Show"
        cancelText="Cancel"
        variant="default"
      />
    </Layout>
  );
};

export default ContentDetail;
