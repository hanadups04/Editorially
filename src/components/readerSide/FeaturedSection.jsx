/* ===========================
   FeaturedSection JSX + CSS3 Version (Plain JS)
   =========================== */
import { useState } from "react";
import { Link } from "react-router-dom";
import "./FeaturedSection.css";

function Placeholder({ letter }) {
  return (
    <div className="article-card__placeholder">
      <span
        className="article-card__placeholder-letter"
        style={{ fontSize: "3rem" }}
      >
        {letter}
      </span>
    </div>
  );
}

export function FeaturedSectionCSS3({ articles }) {
  if (articles.length === 0) return null;

  const [featuredArticles, setFeaturedArticles] = useState(articles);

  const hero = featuredArticles[0];
  if (!hero) return null;
  const secondary = featuredArticles.slice(1, 5);
  // const secondary = articles.slice(1, 5);

  const heroDate = new Date(hero.date_posted).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section
      className="featured"
      style={{ animation: "fadeUp 0.6s ease-out forwards" }}
    >
      <div className="featured__label">
        <span className="featured__label-text">Featured</span>
        <div className="featured__label-line" />
      </div>

      <div className="featured__grid">
        <Link className="featured__hero">
          {hero.images ? (
            <img
              src={hero.images}
              alt={hero.headline}
              className="featured__hero-image"
            />
          ) : (
            <Placeholder
              letter={hero.sections_tbl.section_name[0].toUpperCase()}
            />
          )}
          <div className="featured__hero-overlay" />
          <div className="featured__hero-content">
            <div className="featured__hero-meta">
              <span className="featured__hero-badge">
                {hero.sections_tbl.section_name}
              </span>
              <span className="featured__hero-meta-text2">•</span>
              <span className="featured__hero-meta-text2">{heroDate}</span>
              <span className="featured__hero-meta-text2">•</span>
              <span className="featured__hero-meta-text2">
                By {hero.author1.username} & {hero.author2.username}
              </span>
            </div>
            <h2 className="featured__hero-title">{hero.headline}</h2>
            <p className="featured__hero-excerpt">{hero.content}</p>
          </div>
        </Link>

        <div className="featured__secondary">
          {secondary.map((article) => {
            const date = new Date(article.date_posted).toLocaleDateString(
              "en-US",
              {
                month: "long",
                day: "numeric",
                // year: "numeric",
              },
            );
            return (
              <Link
                key={article.article_id}
                // to={`/article/${article.slug}`}
                className="featured__secondary-item"
              >
                <div className="featured__secondary-thumb">
                  {article.images ? (
                    <img src={article.images} alt={article.headline} />
                  ) : (
                    <Placeholder
                      letter={article.sections_tbl.section_name[0].toUpperCase()}
                    />
                  )}
                </div>
                <div className="featured__secondary-body">
                  <div className="featured__secondary-meta">
                    <span className="featured__secondary-section">
                      {article.sections_tbl.section_name}
                    </span>
                    <span className="featured__hero-meta-text">•</span>
                    <span className="featured__hero-meta-text">{date}</span>
                    <span className="featured__hero-meta-text">•</span>
                    <span className="featured__hero-meta-text">
                      By {hero.author1.username} & {hero.author2.username}
                    </span>
                  </div>
                  <h3 className="featured__secondary-title">
                    {article.headline}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
