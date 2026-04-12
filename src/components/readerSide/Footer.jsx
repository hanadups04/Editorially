/* ===========================
   Footer JSX + CSS3 Version (Plain JS)
   =========================== */
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import "./Footer.css";

export function FooterCSS3() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__grid">
          <div>
            <Link to="/" className="footer__brand-link">
              <div className="footer__brand-icon">
                <span className="footer__brand-icon-text">NU</span>
              </div>
              <span className="footer__brand-name">The Nuntium</span>
            </Link>
            <p className="footer__description">
              Official Publication of National University – Dasmarinas
            </p>
          </div>

          <div>
            <h4 className="footer__heading">Contact</h4>
            <div className="footer__contact-list">
              <div className="footer__contact-item">
                <Mail size={14} className="footer__contact-icon" />
                <span>thequill@nu-dasmarinas.edu.ph</span>
              </div>
              <div className="footer__contact-item">
                <Phone size={14} className="footer__contact-icon" />
                <span>(046) 416-1311</span>
              </div>
              <div className="footer__contact-item">
                <MapPin size={14} className="footer__contact-icon" />
                <span>Dasmarinas, Cavite, Philippines</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="footer__heading">Sections</h4>
            <div className="footer__sections-grid">
              {[
                "News",
                "Sports",
                "Literary",
                "Opinion",
                "General",
                "Sci-Tech",
                "Feature",
              ].map((s) => (
                <Link
                  key={s}
                  to={`/section/${s.toLowerCase()}`}
                  className="footer__section-link"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="footer__credits">
          <p className="footer__credits-text">
            Designed and Developed by Editorially 2025 – 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
