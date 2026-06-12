import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "../../components/templates/AdminTemplate";
import { supabase } from "../../supabaseClient.js";
import "./DocumentPage.css";
import { readWork } from "../../context/functions/ReadFunctions.js";
import ReactLoading from "react-loading";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const DocumentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("taskId");
  const taskRole = searchParams.get("role") || "Writer";
  const project_id = searchParams.get("project_id");
  const role_id = searchParams.get("role_id");
  const user_id = searchParams.get("user_id");
  const assignee_id = searchParams.get("assignee_id");
  const [loading, isLoading] = useState(true);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  // const taskAssignee = searchParams.get("assignee") || "Unknown";

  const [headline, setHeadline] = useState("");
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [show, setShow] = useState(false);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [headlineID, setHeadlineID] = useState("");
  const [contentID, setContentID] = useState("");

  console.log("akahkas", role_id);

  useEffect(() => {
    let isMounted = true;

    async function fetchWork() {
      try {
        const data = await readWork(taskId);
        if (isMounted && data) {
          const headline = data.find((row) => row.category === 1);
          const content = data.find((row) => row.category === 2);

          console.log("content is: ", content);
          console.log("headline is: ", headline);
          setShouldUpdate(true);
          setHeadlineID(headline.content_id);
          setContentID(content.content_id);

          setContent(content.content);
          setHeadline(headline.content);
        } else {
          setContent("");
          setHeadline("");
        }
      } catch (error) {
        console.error(error);
        setIsError(true);
        setError(error);
      } finally {
        if (isMounted) isLoading(false);
      }
    }

    fetchWork();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleSubmit = async () => {
    const rows = [
      { category: 1, content: headline, project_id: project_id },
      { category: 2, content: content, project_id: project_id },
    ];

    for (const row of rows) {
      const { error } = await supabase.from("contents_tbl").insert({
        subtask_id: taskId,
        ...row,
      });

      setShow(true);

      if (error) {
        console.error("Insert failed:", error);
        return;
      }
    }

    // navigate(-1);
  };

  const handleUpdate = async () => {
    const updates = [
      {
        id: headlineID,
        payload: {
          subtask_id: taskId,
          category: 1,
          content: headline,
          project_id,
        },
      },
      {
        id: contentID,
        payload: {
          subtask_id: taskId,
          category: 2,
          content: content,
          project_id,
        },
      },
    ];

    for (const item of updates) {
      const { error } = await supabase
        .from("contents_tbl")
        .update(item.payload)
        .eq("content_id", item.id);

      if (error) {
        console.error("Update failed:", error);
        return;
      }
    }

    setShow(true);
  };

  return (
    <Layout>
      <div className="document-page">
        <div className="document-header">
          <div className="document-header-left">
            <button
              className="admin-btn btn-ghost"
              onClick={() => navigate(-1)}
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
              <h1 className="document-title"> Work Submission</h1>
              {/* <span className="document-meta">Assigned to: {taskAssignee}</span> */}
            </div>
          </div>
{role_id === 1 || user_id !== assignee_id ? (
            <></>
          ) : (
          <div className="document-header-right">
            <button
              className="admin-btn btn-primary"
              type="submit"
              onClick={async () => {
                if (shouldUpdate) {
                  await handleUpdate();
                  console.log("update running:");
                } else {
                  await handleSubmit();
                  console.log("insert running:");
                }
              }}
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
                Save my work
              </button>
            </div>
          )}
        </div>

        <>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ReactLoading
                type="spinningBubbles"
                color="#133e87"
                height={60}
                width={60}
              />
            </div>
          ) : (
            <>
              <div className="document-editor-container1">
                {role_id === 1 || user_id !== assignee_id ? (
                  <input
                    type="text"
                    name="headline"
                    className="document-editor"
                    placeholder="Add your headline here..."
                    maxLength={50}
                    value={headline}
                    // onChange={(e) => setHeadline(e.target.value)}
                    readOnly
                    disabled
                  />
                ) : (
                  <input
                    type="text"
                    name="headline"
                    className="document-editor"
                    placeholder="Add your headline here..."
                    maxLength={50}
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                  />
                )}

                {role_id === 1 || user_id !== assignee_id ? (
                  <></>
                ) : (
                  <div className="editor-footer">
                    <span className="word-count">
                      {
                        headline.split(/\s+/).filter((word) => word.length > 0)
                          .length
                      }{" "}
                      words
                    </span>
                    <span className="char-count">
                      {headline.length} characters
                    </span>
                  </div>
                )}
              </div>

              <div className="document-editor-container2">
                {role_id === 1 || user_id !== assignee_id ? (
                  <textarea
                    name="content"
                    className="document-editor"
                    placeholder="Start writing your content here...

Tips:
• Begin with a compelling introduction
• Include relevant quotes and data
• Structure your content with clear sections
• Proofread before submitting"
                    value={content}
                    readOnly
                    disabled
                  />
                ) : (
                  <textarea
                    name="content"
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
                )}
                {role_id === 1 || user_id !== assignee_id ? (
                  <></>
                ) : (
                  <div className="editor-footer">
                    <span className="word-count">
                      {
                        content.split(/\s+/).filter((word) => word.length > 0)
                          .length
                      }{" "}
                      words
                    </span>
                    <span className="char-count">
                      {content.length} characters
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      </div>

      <ToastContainer position="top-end" className="p-3">
        <Toast show={show} onClose={() => setShow(false)} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Work Saved!</strong>
          </Toast.Header>
          <Toast.Body>
            Your Work has been saved and is waiting for review!
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Layout>
  );
};

export default DocumentPage;
