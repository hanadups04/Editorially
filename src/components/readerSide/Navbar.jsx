/* ===========================
   Navbar JSX + CSS3 Version (Plain JS)
   =========================== */
import { Link, useLocation } from "react-router-dom";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useState } from "react";
import { Search, Sun, Moon, Menu, X } from "lucide-react";
import "./Navbar.css";

const navLinks = [
  { label: "News", to: "/section/news" },
  { label: "Sports", to: "/section/sports" },
  { label: "Literary", to: "/section/literary" },
  { label: "Opinion", to: "/section/opinion" },
  { label: "General", to: "/section/general" },
  { label: "Sci-Tech", to: "/section/sci-tech" },
  { label: "Feature", to: "/section/feature" },
  { label: "About Us", to: "/about" },
  { label: "Our Process", to: "/our-process" },
];

export function NavbarCSS3JSX() {
  const { isDark, toggle } = useDarkMode();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__top">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="navbar__mobile-toggle"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="navbar__logo">
            <div className="navbar__logo-icon">
              <span className="navbar__logo-text">NU</span>
            </div>
            <span className="navbar__title">The Nuntium</span>
          </Link>

          <div className="navbar__actions">
            <Link to="/search" className="navbar__action-btn">
              <Search size={18} />
            </Link>
            <button
              onClick={toggle}
              className="navbar__action-btn"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        <div className="navbar__links">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar__link ${location.pathname === link.to ? "navbar__link--active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {mobileOpen && (
        <div className="navbar__mobile">
          <div className="navbar__mobile-links">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="navbar__mobile-link"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
