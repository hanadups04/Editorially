/* ===========================
   NotFound JSX + CSS3 Version (Plain JS)
   =========================== */
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./NotFound.css";

export default function NotFoundCSS3JSX() {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="not-found">
      <div className="not-found__content">
        <h1 className="not-found__title">404</h1>
        <p className="not-found__text">Oops! Page not found</p>
        <a href="/" className="not-found__link">
          Return to Home
        </a>
      </div>
    </div>
  );
}
