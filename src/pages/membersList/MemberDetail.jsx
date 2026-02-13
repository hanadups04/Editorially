import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { EditMemberModal } from "../../components/members/EditDetailModal";
import "./MemberDetail.css";
import * as ReadFunctions from "../../context/functions/ReadFunctions";
import { supabase } from "../../supabaseClient";
import Layout from "../../components/templates/AdminTemplate";
import * as UpdateFunctions from "../../context/functions/UpdateFunctions";

const MemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState({});
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(member.avatar);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const isProfilePage = location.pathname.startsWith("/profile");
  const isMembersPage = location.pathname.startsWith("/members");

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      try {
        const data = await ReadFunctions.getUserProfile(id);
        if (isMounted) {
          console.log("profile is: ", data);
          setMember(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProfile();

    const subscription = supabase
      .channel("profile-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users_tbl",
          filter: `uid=eq.${id}`, // only this article
        },
        (payload) => {
          console.log("profile change received!", payload);
          setMember((prev) => ({ ...prev, ...payload.new }));
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleNotificationToggle = async () => {
    const newValue = !member.is_notif;
    setMember({ ...member, is_notif: newValue });

    const data = await UpdateFunctions.toggleNotification(id, newValue);
    console.log("notif update: ", data);
  };

  const handleDelete = () => {
    alert("Account disabled successfully");
    navigate("/members");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setMember({ ...member, avatar: reader.result });
        alert("Profile picture updated");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Layout>
      <div className="member-detail-page">
        <div className="member-detail-container">
          {/* Back Button */}
          <button className="back-button" onClick={() => navigate("/members")}>
            <svg
              className="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Members
          </button>

          {/* Profile Card */}
          <div className="profile-card">
            {loading ? (
              <div className="content-detail">Loading...</div>
            ) : (
              <>
                <div className="profile-header">
                  <div className="profile-info">
                    <div
                      className="profile-avatar-large profile-avatar-clickable"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {avatarPreview ? (
                        <img src={avatarPreview} alt={member.username} />
                      ) : (
                        <span>{member.username.slice(0, 2).toUpperCase()}</span>
                      )}
                      <div className="profile-avatar-hover-overlay">
                        <span>Click to select a new picture</span>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="profile-avatar-input-hidden"
                    />
                    <div className="profile-text">
                      <h1 className="profile-username username-truncate">
                        {member.username}
                      </h1>
                      <span className={`role-badge-large admin`}>
                        {member.role}
                      </span>
                      <p className="profile-email">{member.email}</p>
                    </div>
                  </div>
                </div>

                <div className="profile-content">
                  <div className="details-grid">
                    <div className="detail-section">
                      <div className="detail-item">
                        <label className="detail-label">Email</label>
                        <p className="detail-value">{member.email}</p>
                      </div>

                      <div className="detail-item">
                        <label className="detail-label">Section</label>
                        <p className="detail-value">
                          {member.sections_tbl.section_name}
                        </p>
                      </div>
                    </div>
                    <div className="detail-section">
                      <div className="detail-item">
                        <label className="detail-label">Role</label>
                        <p className="detail-value">
                          {member.roles_tbl.role_name}
                        </p>
                      </div>
                      <div className="notification-toggle">
                        <div className="toggle-label">
                          <svg
                            className={`icon ${member.is_notif ? "active" : ""}`}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                          </svg>
                          <label>Notifications</label>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={member.is_notif}
                            onChange={handleNotificationToggle}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="action-buttons">
                    <button
                      className="edit-button"
                      onClick={() => setIsEditOpen(true)}
                    >
                      <svg
                        className="icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit Info
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => setIsDeleteOpen(true)}
                    >
                      <svg
                        className="icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                      Disable Account
                    </button>
                  </div>
                </div>

                {/* Edit Modal */}
                <EditMemberModal
                  open={isEditOpen}
                  onOpenChange={setIsEditOpen}
                  member={member}
                  onUpdate={(updatedData) => {
                    setMember({ ...member, ...updatedData });
                    alert("Member information updated");
                  }}
                  isProfile={isProfilePage ? true : false}
                />

                {/* Delete Confirmation Modal */}
                {isDeleteOpen && (
                  <div
                    className="modal-overlay"
                    onClick={() => setIsDeleteOpen(false)}
                  >
                    <div
                      className="modal-content alert"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h2>Disable Account?</h2>
                      <p className="modal-description">
                        This will disable the account for {member.username}. The
                        user will no longer be able to access the publication.
                        This action can be reversed.
                      </p>
                      <div className="modal-actions">
                        <button
                          className="cancel-button"
                          onClick={() => setIsDeleteOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="confirm-button"
                          onClick={handleDelete}
                        >
                          Disable Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MemberDetail;
