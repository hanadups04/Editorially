/* ===========================
   ArticleCard JSX + CSS3 Version (Plain JS)
   =========================== */
import { Link } from "react-router-dom";
import { useProjectContext } from "../../context/Context";
import "./ArticleCard.css";

export function ArticleCardCSS3({ article, variant = "default" }) {
  const { useScrollAnimation } = useProjectContext();
  const { ref, isVisible } = useScrollAnimation();
  const formattedDate = new Date(article.date_posted).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  if (variant === "horizontal") {
    return (
      <Link to={`/article/${article.article_id}`} className="article-card">
        <div
          ref={ref}
          className="article-card__horizontal"
          style={{ opacity: isVisible ? 1 : 0 }}
        >
          <div className="article-card__horizontal-thumb">
            {article.images ? (
              <img
                src={article.images}
                alt={article.headline}
                className="article-card__image"
              />
            ) : (
              <div className="article-card__placeholder">
                <span
                  className="article-card__placeholder-letter"
                  style={{ fontSize: "1.5rem" }}
                >
                  {article.section_name[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="article-card__horizontal-body">
            <span className="article-card__section-label">
              {article.section_name}
            </span>
            <h3 className="article-card__title" style={{ fontSize: "1rem" }}>
              {article.headline}
            </h3>
            <div className="article-card__meta">
              <span>
                {article.author1} & {article.author2}{" "}
              </span>
              <span>·</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link to={`/article/${article.article_id}`} className="article-card">
        <div
          ref={ref}
          className="article-card__compact"
          style={{ opacity: isVisible ? 1 : 0 }}
        >
          <span className="article-card__section-label">
            {article.section_name}
          </span>
          <h3 className="article-card__compact-title">{article.headline}</h3>
          <span
            className="article-card__meta"
            style={{ marginTop: "0.25rem", display: "block" }}
          >
            {formattedDate}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/article/${article.article_id}`} className="article-card">
      <div
        ref={ref}
        className="article-card__default"
        style={{ opacity: isVisible ? 1 : 0 }}
      >
        <div className="article-card__image-wrapper">
          {article.images ? (
            <img
              src={article.images}
              alt={article.headline}
              className="article-card__image"
            />
          ) : (
            <div className="article-card__placeholder">
              <span className="article-card__placeholder-letter">
                {article.section_name[0].toUpperCase()}
              </span>
            </div>
          )}
          <span className="article-card__badge">{article.section_name}</span>
        </div>
        <div className="article-card__body">
          <h3 className="article-card__title">{article.headline}</h3>
          <p className="article-card__excerpt">{article.content}</p>
          <div className="article-card__meta">
            <span className="article-card__meta-author">
              {article.author1} & {article.author2}
            </span>
            <span>·</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
