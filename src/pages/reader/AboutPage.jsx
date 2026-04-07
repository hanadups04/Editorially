/* ===========================
   AboutPage JSX + CSS3 Version (Plain JS)
   =========================== */
import { NavbarCSS3 } from "@/components/css3/Navbar.css3";
import { FooterCSS3 } from "@/components/css3/Footer.css3";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { BookOpen, Eye } from "lucide-react";
import "./AboutPage.css";

const teamMembers = [
  { name: "Sofia Reyes", position: "Editor-in-Chief", initials: "SR" },
  { name: "Marco Villanueva", position: "Managing Editor", initials: "MV" },
  { name: "Isabella Cruz", position: "News Editor", initials: "IC" },
  { name: "Gabriel Santos", position: "Sports Editor", initials: "GS" },
  { name: "Camille Tan", position: "Literary Editor", initials: "CT" },
  { name: "Rafael Aquino", position: "Opinion Editor", initials: "RA" },
  { name: "Luna Bautista", position: "Layout Artist", initials: "LB" },
  { name: "Diego Fernandez", position: "Photojournalist", initials: "DF" },
  { name: "Aria Mendoza", position: "Staff Writer", initials: "AM" },
  { name: "Mateo Rivera", position: "Staff Writer", initials: "MR" },
];

function AnimatedSection({ children, className = "" }) {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        animation: isVisible ? "fadeUp 0.6s ease-out forwards" : "none",
      }}
    >
      {children}
    </div>
  );
}

export default function AboutPageCSS3JSX() {
  return (
    <div className="about-page">
      <NavbarCSS3 />
      <div style={{ height: "104px" }} />

      <section className="about-page__hero">
        <div className="about-page__hero-bg" />
        <div className="about-page__hero-content">
          <span className="about-page__hero-label">About Us</span>
          <h1 className="about-page__hero-title">About The Nuntium</h1>
          <p className="about-page__hero-subtitle">
            The voice of National University – Dasmarinas. We tell the stories
            that shape our community, challenge perspectives, and inspire
            action.
          </p>
        </div>
      </section>

      <AnimatedSection>
        <section className="about-page__section">
          <div className="about-page__story-grid">
            <div>
              <span className="about-page__story-label">Our Story</span>
              <h2 className="about-page__story-title">
                More Than a Publication
              </h2>
              <div className="about-page__story-text">
                <p>
                  The Nuntium stands as the official student publication of
                  National University – Dasmarinas, serving as the heartbeat of
                  campus journalism.
                </p>
                <p>
                  Through rigorous reporting, creative expression, and
                  thoughtful commentary, we document the stories that define our
                  academic community.
                </p>
              </div>
            </div>
            <div className="about-page__story-visual">
              <div className="about-page__story-placeholder">
                <div className="about-page__story-placeholder-inner">
                  <div className="about-page__story-placeholder-circle">
                    <span className="about-page__story-placeholder-letter">
                      N
                    </span>
                  </div>
                  <span className="about-page__story-placeholder-name">
                    The Nuntium
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="about-page__section">
          <div className="about-page__mv-grid">
            <div className="about-page__mv-card">
              <div className="about-page__mv-icon">
                <BookOpen size={24} />
              </div>
              <h3 className="about-page__mv-title">Our Mission</h3>
              <p className="about-page__mv-text">
                To uphold journalistic integrity and serve as a credible,
                independent voice within the university.
              </p>
            </div>
            <div className="about-page__mv-card">
              <div className="about-page__mv-icon">
                <Eye size={24} />
              </div>
              <h3 className="about-page__mv-title">Our Vision</h3>
              <p className="about-page__mv-text">
                To be a leading campus publication that fosters critical
                thinking and champions press freedom.
              </p>
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="about-page__section">
          <div className="about-page__team-header">
            <span className="about-page__hero-label">The Team</span>
            <h2 className="about-page__story-title">
              Meet Our Editorial Board
            </h2>
            <p
              style={{
                color: "hsl(var(--muted-foreground))",
                fontFamily: "var(--font-body)",
                maxWidth: "32rem",
                margin: "0 auto",
              }}
            >
              The passionate individuals behind every story, headline, and page.
            </p>
          </div>
          <div className="about-page__team-grid">
            {teamMembers.map((member, i) => {
              const isLarge = i < 2;
              return (
                <div
                  key={member.name}
                  className={`about-page__team-card ${isLarge ? "about-page__team-card--large" : ""}`}
                >
                  <div
                    className={`about-page__team-card-inner ${isLarge ? "about-page__team-card-inner--large" : ""}`}
                  >
                    <div
                      className={`about-page__team-avatar ${isLarge ? "about-page__team-avatar--large" : ""}`}
                    >
                      <span
                        className={`about-page__team-initials ${isLarge ? "about-page__team-initials--large" : ""}`}
                      >
                        {member.initials}
                      </span>
                    </div>
                    <h3
                      className={`about-page__team-name ${isLarge ? "about-page__team-name--large" : ""}`}
                    >
                      {member.name}
                    </h3>
                    <span className="about-page__team-position">
                      {member.position}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </AnimatedSection>

      <FooterCSS3 />
    </div>
  );
}
