import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";
import "./ContentManagement.css";
import Layout from "../../components/templates/AdminTemplate";
import * as ReadFunctions from "../../context/functions/ReadFunctions";
import { isAuthenticated } from "../../context/auth";
import EditContentModal from "../../components/ArticleManagement/EditContentModal";
import * as DeleteFunctions from "../../context/functions/DeleteFunctions";
import * as auth from "../../context/auth";
import * as AddFunctions from "../../context/functions/AddFunctions";
import ConfirmationModal from "../../components/ArticleManagement/ConfirmationModal";
import RequestChangesModal from "../../components/ArticleManagement/RequestChangesModa";
import { supabase } from "../../supabaseClient";

export default function ContentManagement() {
  const [loading, setIsLoading] = useState(true);
  const [contents, setContents] = useState([]);
  const [userRole, setRole] = useState([]);
  const [userId, setId] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchArticles() {
      try {
        const data = await ReadFunctions.getPostedArticles();
        if (isMounted) {
          console.log("data is: ", data);
          setContents(data);
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

    const subscription = supabase
      .channel("articles-updates") // you can name it anything
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "articles_tbl" },
        async (payload) => {
          console.log("Change received!", payload);
          // payload.new → new row
          // payload.old → old row (for update/delete)
          await fetchArticles();
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(subscription);
    };
  }, []);

  //for searching and filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterSection, setFilterSection] = useState("all");
  const [filterDateSort, setFilterDateSort] = useState("newest");

  //Editing Modal for Editorial Management
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editingTitleValue, setEditingTitleValue] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  //Request Changes Modal for adviser
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Confirmation modal states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [showConfirmOpen, setShowConfirmOpen] = useState(false);

  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [pendingDeleteStatus, setPendingDeleteStatus] = useState(null);

  const handleEditSubmit = (updatedData) => {
    if (editingIndex === null) return;

    setContents((prev) =>
      prev.map((item, idx) =>
        idx === editingIndex ? { ...item, ...updatedData } : item,
      ),
    );

    setIsEditModalOpen(false);
    setEditingIndex(null);
  };

  const handleDelete = async () => {
    // setContent((prev) => ({ ...prev, visible: !content.visible }));
    setContents((prev) =>
      prev.map((item) =>
        item.article_id === pendingDeleteId
          ? { ...item, status: pendingDeleteStatus }
          : item,
      ),
    );

    const callDelete = await DeleteFunctions.archiveArticle(
      pendingDeleteId,
      pendingDeleteStatus,
    );
    setDeleteConfirmOpen(false);
    setPendingDeleteId(null);
    setPendingDeleteStatus(null);
    console.log("archive result is: ", callDelete);
  };

  const handleRequestSubmit = async (requestData) => {
    setIsRequestModalOpen(false);
    const callReqeusetEdit = await AddFunctions.insertEditRequest(requestData);

    console.log("data of request edit is: ", requestData);
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
        content.id === id ? { ...content, title: editingTitleValue } : content,
      ),
    );
    setEditingTitleId(null);
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
      const matchesSearch = content.headline
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      // content.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSection =
        filterSection === "all" ||
        content.sections_tbl.section_name === filterSection;
      return matchesSearch && matchesSection;
    })
    .sort((a, b) => {
      if (filterDateSort === "newest") {
        return new Date(b.date_posted) - new Date(a.date_posted);
      } else {
        return new Date(a.date_posted) - new Date(b.date_posted);
      }
    });

  const sections = [
    "all",
    ...new Set(contents.map((c) => c.sections_tbl.section_name)),
  ];

  return (
    <Layout>
      <div className="content-managementt">
        <header className="content-headerr">
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              Filter
            </button>
          </div>

          {loading ? (
            <div className="content-detail">Loading...</div>
          ) : (
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
                filteredContents.map((content) => {
                  const originalIndex = contents.findIndex(
                    (item) => item.article_id === content.article_id,
                  );

                  return (
                    <Link
                      key={content.article_id}
                      to={`/content/${content.article_id}`}
                      className="content-card"
                    >
                      <div className="card-thumbnail">
                        <img src={content.images} alt={content.headline} />
                      </div>
                      <div className="card-body">
                        <span className="card-section">
                          {content.sections_tbl.section_name}
                        </span>

                        {editingTitleId === content.article_id ? (
                          <input
                            type="text"
                            className="card-title-input"
                            value={editingTitleValue}
                            onChange={handleTitleChange}
                            onBlur={() => handleTitleBlur(content.article_id)}
                            onClick={(e) => e.preventDefault()}
                            autoFocus
                          />
                        ) : (
                          <h2
                            className="card-title"
                            onDoubleClick={(e) =>
                              handleTitleDoubleClick(
                                content.article_id,
                                content.headline,
                                e,
                              )
                            }
                          >
                            {content.headline}
                          </h2>
                        )}
                        {/* <p className="card-section">
                          Section: {content.sections_tbl.section_name}
                        </p> */}
                        {/* <p className="card-excerpt">{content.excerpt}</p> */}
                        <p className="card-date">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          {new Date(content.date_posted).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="card-actions">
                        {userRole < 3 ? (
                          <button
                            className="btn0 btn-edit"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (originalIndex !== -1) {
                                setEditingIndex(originalIndex);
                                setIsRequestModalOpen(true);
                              }
                            }}
                          >
                            <span className="btn-icon">🙋</span>
                            Request Changes
                          </button>
                        ) : (
                          <button
                            className="btn0 btn-edit"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (originalIndex !== -1) {
                                setEditingIndex(originalIndex);
                                setIsEditModalOpen(true);
                              }
                            }}
                          >
                            <span className="btn-icon">✎</span>
                            <span>Edit</span>
                          </button>
                        )}

                        {userRole === 5 && (
                          <>
                            {content.visible ? (
                              <button
                                className="btn0 btn-icon-only"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setDeleteConfirmOpen(true);
                                  setPendingDeleteId(content.article_id);
                                  setPendingDeleteStatus(!content.visible);
                                }}
                              >
                                {/* change to eye icon for show OR hide */}
                                <span className="btn-icon">👁</span>
                              </button>
                            ) : (
                              <button
                                className="btn0 btn-icon-only"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setShowConfirmOpen(true);
                                  setPendingDeleteId(content.article_id);
                                  setPendingDeleteStatus(!content.visible);
                                }}
                              >
                                {/* change to eye icon for show OR hide */}
                                <span className="btn-icon">
                                  <svg
                                    className="btn-icon-svg"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="10"
                                    height="10"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                    <path d="M1 1l22 22" />
                                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                  </svg>
                                </span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          )}
        </main>

        {filterModalOpen && (
          <div
            className="admin-overlay"
            onClick={() => setFilterModalOpen(false)}
          >
            <div className="admin-modal">
              <div
                className="admin-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="admin-header">
                  <h2 className="admin-title">Filter Options</h2>
                  <button
                    className="admin-close"
                    onClick={() => setFilterModalOpen(false)}
                  >
                    ✕
                  </button>
                </div>
                <div className="admin-body">
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
                <div className="admin-footer">
                  <button
                    className="admin-btn btn-reset"
                    onClick={resetFilters}
                  >
                    Reset
                  </button>
                  <button
                    className="admin-btn btn-apply"
                    onClick={applyFilters}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* edit content modal */}
      <EditContentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingIndex(null);
        }}
        content={editingIndex !== null ? contents[editingIndex] : null}
        onSubmit={handleEditSubmit}
      />

      {/* request changes modal */}
      <RequestChangesModal
        isOpen={isRequestModalOpen}
        onClose={() => {
          setIsRequestModalOpen(false);
          setEditingIndex(null);
        }}
        content={editingIndex !== null ? contents[editingIndex] : null}
        onSubmit={handleRequestSubmit}
        owner_id={userId}
      />

      {/* delete confirmation */}
      <ConfirmationModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setPendingDeleteId(null);
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
          setPendingDeleteId(null);
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
}
