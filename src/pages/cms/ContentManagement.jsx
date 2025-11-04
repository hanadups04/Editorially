import { useState } from "react";
import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";
import "./ContentManagement.css";

const ContentManagement = () => {
  const [contents, setContents] = useState([
    {
      id: "1",
      title: "Getting Started with React",
      excerpt: "Learn the basics of React and build your first component.",
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
      publishedDate: "2024-01-15",
      section: "Tutorial",
      status: "published",
    },
    {
      id: "2",
      title: "Advanced TypeScript Patterns",
      excerpt: "Explore advanced patterns and techniques in TypeScript.",
      thumbnail:
        "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400",
      publishedDate: "2024-01-20",
      section: "News",
      status: "published",
    },
    {
      id: "3",
      title: "Building Scalable Applications",
      excerpt: "Best practices for building applications that scale.",
      thumbnail:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
      publishedDate: "2024-01-25",
      section: "Guide",
      status: "published",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterSection, setFilterSection] = useState("all");
  const [filterDateSort, setFilterDateSort] = useState("newest");
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editingTitleValue, setEditingTitleValue] = useState("");

  const handleDelete = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setContents(contents.filter((content) => content.id !== id));
    alert("Content deleted successfully");
  };

  const handleRequestChanges = (title, e) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Request for changes to "${title}" has been submitted.`);
  };

  const handleEditClick = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/content/${id}/edit`;
  };

  const handleTitleDoubleClick = (id, title, e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingTitleId(id);
    setEditingTitleValue(title);
  };

  const handleTitleChange = (e) => {
    setEditingTitleValue(e.target.value);
  };

  const handleTitleBlur = (id) => {
    setContents(
      contents.map((content) =>
        content.id === id ? { ...content, title: editingTitleValue } : content
      )
    );
    setEditingTitleId(null);
  };

  const handleTitleKeyPress = (e, id) => {
    if (e.key === "Enter") {
      handleTitleBlur(id);
    }
  };

  const applyFilters = () => {
    setFilterModalOpen(false);
  };

  const resetFilters = () => {
    setFilterSection("all");
    setFilterDateSort("newest");
  };

  const filteredContents = contents
    .filter((content) => {
      const matchesSearch =
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSection =
        filterSection === "all" || content.section === filterSection;
      return matchesSearch && matchesSection;
    })
    .sort((a, b) => {
      if (filterDateSort === "newest") {
        return new Date(b.publishedDate) - new Date(a.publishedDate);
      } else {
        return new Date(a.publishedDate) - new Date(b.publishedDate);
      }
    });

  const sections = ["all", ...new Set(contents.map((c) => c.section))];

  return (
    <div className="content-management">
      <header className="content-header">
        <div className="container">
          <h1 className="header-title">Published Content</h1>
          <p className="header-subtitle">
            Manage all your published articles and posts
          </p>
        </div>
      </header>

      <main className="content-main">
        <div className="search-filter-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="filter-btn"
            onClick={() => setFilterModalOpen(true)}
          >
            <span className="btn-icon">⚙️</span>
            Filter
          </button>
        </div>

        <div className="content-grid">
          {filteredContents.length === 0 ? (
            <div className="no-results">
              <SearchX
                className="no-results-icon"
                size={64}
                strokeWidth={1.5}
              />
              <p className="no-results-text">No posts found</p>
              <p className="no-results-subtitle">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            filteredContents.map((content) => (
              <Link
                key={content.id}
                to={`/content/${content.id}`}
                className="content-card"
              >
                <div className="card-thumbnail">
                  <img src={content.thumbnail} alt={content.title} />
                </div>
                <div className="card-body">
                  {editingTitleId === content.id ? (
                    <input
                      type="text"
                      className="card-title-input"
                      value={editingTitleValue}
                      onChange={handleTitleChange}
                      onBlur={() => handleTitleBlur(content.id)}
                      onKeyPress={(e) => handleTitleKeyPress(e, content.id)}
                      onClick={(e) => e.preventDefault()}
                      autoFocus
                    />
                  ) : (
                    <h2
                      className="card-title"
                      onDoubleClick={(e) =>
                        handleTitleDoubleClick(content.id, content.title, e)
                      }
                    >
                      {content.title}
                    </h2>
                  )}
                  <p className="card-section">Section: {content.section}</p>
                  <p className="card-excerpt">{content.excerpt}</p>
                  <p className="card-date">
                    Published:{" "}
                    {new Date(content.publishedDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="card-actions">
                  <button
                    className="btn btn-edit"
                    onClick={(e) => handleEditClick(content.id, e)}
                  >
                    <span className="btn-icon">✏️</span>
                    Edit
                  </button>
                  <button
                    className="btn btn-request"
                    onClick={(e) => handleRequestChanges(content.title, e)}
                  >
                    <span className="btn-icon">💬</span>
                    Request
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={(e) => handleDelete(content.id, e)}
                  >
                    <span className="btn-icon">🗑️</span>
                  </button>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>

      {filterModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setFilterModalOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Filter Options</h2>
              <button
                className="modal-close"
                onClick={() => setFilterModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="filter-group">
                <label className="filter-label">Section</label>
                <select
                  className="filter-select"
                  value={filterSection}
                  onChange={(e) => setFilterSection(e.target.value)}
                >
                  {sections.map((section) => (
                    <option key={section} value={section}>
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Sort by Date</label>
                <select
                  className="filter-select"
                  value={filterDateSort}
                  onChange={(e) => setFilterDateSort(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-reset" onClick={resetFilters}>
                Reset
              </button>
              <button className="btn btn-apply" onClick={applyFilters}>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
