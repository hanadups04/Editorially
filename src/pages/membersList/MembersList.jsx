import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FilterModal } from "../../components/members/FilterModal";
import { AddMemberModal } from "../../components/members/AddMembersModal";
import "./MembersList.css";
import Layout from "../../components/templates/AdminTemplate";
import * as ReadFunctions from "../../context/functions/ReadFunctions"
import { supabase } from "../../supabaseClient";

// Mock data - replace with actual API call
const mockMembers = [];

const MembersList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ section: "", role: "" });
  const [loading, setIsLoading] = useState(true);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchMembers() {
      try {
        const data = await ReadFunctions.fetchAllUsers();
        if(isMounted) {
          console.log("users is: ", data);
          setMembers(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if(isMounted) setIsLoading(false);
      }
    }

    fetchMembers();

    const subscription = supabase
          .channel("members-updates") // you can name it anything
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "users_tbl" },
            async (payload) => {
              console.log("Change received!", payload);
              // payload.new → new row
              // payload.old → old row (for update/delete)
              await fetchMembers();
            },
          )
          .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(subscription);
    }
  }, [])

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSection =
      !filters.section || member.section === filters.section;
    const matchesRole = !filters.role || member.role === filters.role;
    return matchesSearch && matchesSection && matchesRole;
  });

  return (
    <Layout>
      <div className="members-page">
        <div className="members-container">
          {/* Header */}
          <div className="members-header">
            <div className="header-title-group">
              <svg
                className="icon-users"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <h1>Members</h1>
            </div>
            <p className="header-subtitle">
              Manage all users within the publication
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="search-filter-bar">
            <div className="search-input-wrapper">
              <svg
                className="search-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search by username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <button
              className="filter-button"
              onClick={() => setIsFilterOpen(true)}
            >
              <svg
                className="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filter
            </button>
            <button
              className="filter-button"
              onClick={() => setIsAddMemberOpen(true)}
            >
              Add Member
            </button>
          </div>

          {/* Active Filters */}
          {(filters.section || filters.role) && (
            <div className="active-filters">
              {filters.section && (
                <span className="filter-badge">Section: {filters.section}</span>
              )}
              {filters.role && (
                <span className="filter-badge">Role: {filters.role}</span>
              )}
              <button
                className="clear-filters-button"
                onClick={() => setFilters({ section: "", role: "" })}
              >
                Clear filters
              </button>
            </div>
          )}

          <div >
            {loading ? (
            <div 
            className="content-detail" 
            style={{
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center"}}>Loading...</div>
          ) : (
            <div>
              {/* Members Grid */}
          <div className="members-grid">

            {filteredMembers.map((member) => (
              <Link
                key={member.uid}
                to={`/members/${member.uid}`}
                className="member-card-link"
              >
                <div className="member-card">
                  <div className="member-card-header">
                    <div className="member-info-row">
                      <div className="member-avatar">
                        {member.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="member-text-info">
                        <h3 className="member-username">{member.username}</h3>
                        <p className="member-email">{member.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="member-card-content">
                    <div className="member-detail-row">
                      <span className="detail-label">Section:</span>
                      <span className="detail-value">{member.sections_tbl.section_name}</span>
                    </div>
                    
                    <div className="member-detail-row">
                      <span className="detail-label">Role:</span>
                      <span
                        className={`role-badge admin`}
                      >
                        {member.roles_tbl.role_name}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          

          {filteredMembers.length === 0 && (
            <div className="no-members">
              <svg
                className="no-members-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <h3>No members found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          )}
            </div>
          )}

          </div>

           

          

          
        </div>

        <FilterModal
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          filters={filters}
          onApplyFilters={setFilters}
        />
        <AddMemberModal
          open={isAddMemberOpen}
          onOpenChange={setIsAddMemberOpen}
        />
      </div>
    </Layout>
  );
};

export default MembersList;
