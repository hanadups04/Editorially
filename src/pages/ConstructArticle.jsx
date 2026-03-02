import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/templates/AdminTemplate';
import ConfirmationModal from '../components/ArticleManagement/ConfirmationModal';
// import SuccessModal from '../components/content/SuccessModal';
import './ConstructArticle.css';

const ConstructArticle = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || '1';

  // Mock: simulate querying 3 separate content rows by type
  const contentSources = [
    { type: 'headline', value: 'Campus Sustainability Initiative Transforms University Life', submittedBy: 'Sarah Johnson', status: 'approved' },
    { type: 'thumbnail', value: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800', submittedBy: 'Emma Rodriguez', status: 'approved' },
    { type: 'content', value: `The university's new sustainability initiative is making waves across campus, with students and faculty alike embracing eco-friendly practices that are transforming daily life.\n\nFrom newly installed solar panels atop the science building to comprehensive recycling stations positioned throughout campus, the changes are both visible and impactful. Student volunteers have been at the forefront of these efforts, organizing weekly clean-up drives and educational workshops.\n\n"We've seen a 40% reduction in campus waste since the program launched," says Dr. Emily Chen, the program's director. "But more importantly, we've seen a cultural shift in how our community thinks about sustainability."\n\nThe initiative includes partnerships with local businesses, a new composting program for dining halls, and plans for an urban garden that will supply fresh produce to the campus cafeteria. Students involved in the project say it has given them practical experience in environmental management while making a real difference in their community.`, submittedBy: 'Sarah Johnson', status: 'approved' }
  ];

  const [headline, setHeadline] = useState(contentSources.find(s => s.type === 'headline')?.value || '');
  const [thumbnail, setThumbnail] = useState(contentSources.find(s => s.type === 'thumbnail')?.value || '');
  const [content, setContent] = useState(contentSources.find(s => s.type === 'content')?.value || '');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });

  const handlePostArticle = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmPost = () => {
    // Mock: insert into articles_tbl
    console.log('Posting article to articles_tbl:', { headline, thumbnail, content, projectId });
    setIsConfirmOpen(false);
    setSuccessModal({
      isOpen: true,
      title: 'Article Posted!',
      message: 'The article has been successfully published.'
    });
  };

  const handleSuccessClose = () => {
    setSuccessModal(prev => ({ ...prev, isOpen: false }));
    navigate('/content');
  };

  return (
    <Layout>
      <div className="construct-article">
        <div className="construct-header">
          <button className="back-link" onClick={() => navigate(-1)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            {contentSources.map((source, index) => (
              <div key={index} className="source-item">
                <span className="status-icon">✓</span>
                <span className="source-type">{source.type.charAt(0).toUpperCase() + source.type.slice(1)}</span>
                <span>Submitted by {source.submittedBy}</span>
              </div>
            ))}
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
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Upload
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
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
            <button className="btn-cancel" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={handlePostArticle}
              disabled={!headline.trim() || !content.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

      {/* <SuccessModal
        isOpen={successModal.isOpen}
        onClose={handleSuccessClose}
        title={successModal.title}
        message={successModal.message}
      /> */}
    </Layout>
  );
};

export default ConstructArticle;
