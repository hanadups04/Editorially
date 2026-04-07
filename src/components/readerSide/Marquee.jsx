/* ===========================
   Marquee JSX + CSS3 Version (Plain JS)
   =========================== */
import { Link } from "react-router-dom";
import { useState } from "react";
import "./Marquee.css";

export function MarqueeCSS3JSX({ articles }) {
  const [paused, setPaused] = useState(false);

  if (articles.length === 0) return null;

  const items = [...articles, ...articles];

  return (
    <div
      className={`marquee ${paused ? "marquee--paused" : ""}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="marquee__track">
        {items.map((article, i) => (
          <Link
            key={`${article.id}-${i}`}
            to={`/article/${article.slug}`}
            className="marquee__item"
          >
            <span className="marquee__dot" />
            <span className="marquee__title">{article.title}</span>
            <span className="marquee__section">{article.section}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
