/* ===========================
   Marquee JSX + CSS3 Version (Plain JS)
   =========================== */
import { Link } from "react-router-dom";
import { useState } from "react";
import "./Marquee.css";

export function MarqueeCSS3({ articles }) {
  const [featuredArticles, setIsFeaturedArticles] = useState(articles);
  const [paused, setPaused] = useState(false);
  console.log("artivlessss", featuredArticles);

  // const items = [...articles, ...articles];

  return (
    <div
      className={`marquee ${paused ? "marquee--paused" : ""}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="marquee__track">
        {featuredArticles.map((article) => (
          <Link
            // key={`${article.article_id}-${i}`}
            // to={`/article/${article.slug}`}
            className="marquee__item"
          >
            <span className="marquee__dot" />
            <span className="marquee__title">{article.headline}</span>
            <span className="marquee__section">
              {article.sections_tbl.section_name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
