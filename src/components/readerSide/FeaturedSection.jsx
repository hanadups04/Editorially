/* ===========================
   FeaturedSection JSX + CSS3 Version (Plain JS)
   =========================== */
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

export function FeaturedSectionCSS3JSX({ articles }) {
  if (articles.length === 0) return null;

  const hero = articles[0];
  const secondary = articles.slice(1, 5);

  const heroDate = new Date(hero.date).toLocaleDateString("en-US", {
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
        <Link to={`/article/${hero.slug}`} className="featured__hero">
          {hero.thumbnail ? (
            <img
              src={hero.thumbnail}
              alt={hero.title}
              className="featured__hero-image"
            />
          ) : (
            <Placeholder letter={hero.section[0].toUpperCase()} />
          )}
          <div className="featured__hero-overlay" />
          <div className="featured__hero-content">
            <div className="featured__hero-meta">
              <span className="featured__hero-badge">{hero.section}</span>
              <span className="featured__hero-meta-text">•</span>
              <span className="featured__hero-meta-text">{heroDate}</span>
              <span className="featured__hero-meta-text">•</span>
              <span className="featured__hero-meta-text">
                By {hero.authors[0]}
              </span>
            </div>
            <h2 className="featured__hero-title">{hero.title}</h2>
            <p className="featured__hero-excerpt">{hero.excerpt}</p>
          </div>
        </Link>

        <div className="featured__secondary">
          {secondary.map((article) => {
            const date = new Date(article.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            return (
              <Link
                key={article.id}
                to={`/article/${article.slug}`}
                className="featured__secondary-item"
              >
                <div className="featured__secondary-thumb">
                  {article.thumbnail ? (
                    <img src={article.thumbnail} alt={article.title} />
                  ) : (
                    <Placeholder letter={article.section[0].toUpperCase()} />
                  )}
                </div>
                <div className="featured__secondary-body">
                  <div className="featured__secondary-meta">
                    <span className="featured__secondary-section">
                      {article.section}
                    </span>
                    <span className="featured__hero-meta-text">•</span>
                    <span className="featured__hero-meta-text">{date}</span>
                    <span className="featured__hero-meta-text">•</span>
                    <span className="featured__hero-meta-text">
                      By {article.authors[0]}
                    </span>
                  </div>
                  <h3 className="featured__secondary-title">{article.title}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
