import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Layout from "../components/templates/AdminTemplate";
import ConfirmationModal from "../components/ArticleManagement/ConfirmationModal";
import SuccessModal from "../components/ArticleManagement/SuccessModa";
import "./ConstructArticle.css";
import * as ReadFunctions from "../context/functions/ReadFunctions";
import { createArticle } from "../context/functions/AddFunctions";

const ConstructArticle = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // const projectId = searchParams.get('projectId') || '1';

  const [author1, setAuthor1] = useState("");
  const [author2, setAuthor2] = useState("");

  const [headline, setHeadline] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [content, setContent] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const { id: projectId } = useParams();
  const sectionId = searchParams.get("section_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function getData() {
      try {
        const data = await ReadFunctions.avengersAssemble(projectId);
        const headline = data.find((item) => item.category === 1);
        const content = data.find((item) => item.category === 2);
        const image = data.find((item) => item.category === 3);

        setHeadline(headline.content);
        setContent(content.content);
        setThumbnail(image.content);
        setAuthor1(headline.project_subtask_tbl.users_tbl.uid);
        setAuthor2(image.project_subtask_tbl.users_tbl.uid);

        console.log(
          "hehe: ",
          headline.project_subtask_tbl.users_tbl.username,
          image.project_subtask_tbl.users_tbl.username,
        );
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    getData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePostArticle = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmPost = async () => {
    try {
      const data = {
        headline,
        content,
        images: thumbnail,
        author_id2: author1,
        author_id1: author2,
        section_id: Number(sectionId),
      };

      console.log("article data: ", data);

      await createArticle(data, projectId);
    } catch (error) {
      console.error("error mo'y: ", error);
    }
    // Mock: insert into articles_tbl

    setIsConfirmOpen(false);
    setSuccessModal({
      isOpen: true,
      title: "Article Posted!",
      message: "The article has been successfully published.",
    });
  };

  const handleSuccessClose = () => {
    setSuccessModal((prev) => ({ ...prev, isOpen: false }));
    // navigate('/content');
  };

  return (
    <Layout>
      <div className="construct-article">
        <div className="construct-header">
          <button className="back-link" onClick={() => navigate(-1)}>
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
          <h1>Construct Article</h1>
        </div>

        <div className="content-sources-info">
          <h3>Content Sources</h3>
          <div className="source-items">
            {/* {contentSources.map((source, index) => ( */}
            <div className="source-item">
              <span className="status-icon">✓</span>
              <span className="source-type">Headline</span>
              <span>Submitted by {author1}</span>
            </div>
            <div className="source-item">
              <span className="status-icon">✓</span>
              <span className="source-type">Image</span>
              <span>Submitted by {author2}</span>
            </div>
            {/* ))} */}
          </div>
        </div>

        <div className="construct-form">
          <div className="form-group">
            <label>
              Headline
              <span className="source-tag">from content row</span>
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Enter article headline..."
            />
          </div>

          <div className="form-group thumbnail-section">
            <label>
              Thumbnail
              <span className="source-tag">from content row</span>
            </label>
            {thumbnail && (
              <div className="thumbnail-preview">
                <img src={thumbnail} alt="Article thumbnail" />
              </div>
            )}
            <div className="thumbnail-input-group">
              <input
                type="text"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="Image URL..."
              />
              <label className="upload-btn">
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
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setThumbnail(url);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>
              Content
              <span className="source-tag">from content row</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter article content..."
            />
          </div>

          <div className="construct-actions">
            {/* <button className="btn-cancel" onClick={() => navigate(-1)}>
              Cancel
            </button> */}
            <button
              className="admin-btn btn-primary"
              onClick={handlePostArticle}
              disabled={!headline.trim() || !content.trim()}
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
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              Post Article
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmPost}
        title="Post Article"
        message="Are you sure you want to publish this article? It will be visible to all readers."
        confirmText="Post Article"
        variant="default"
      />

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={handleSuccessClose}
        title={successModal.title}
        message={successModal.message}
      />
    </Layout>
  );
};

export default ConstructArticle;
