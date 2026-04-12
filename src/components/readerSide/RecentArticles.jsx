/* ===========================
   RecentArticles JSX + CSS3 Version (Plain JS)
   =========================== */
import { Link } from "react-router-dom";
import { sectionLabels } from "../../context/functions/mock-data";
import { useProjectContext } from "../../context/Context";
import { ArticleCardCSS3 } from "./ArticleCard.jsx";
import "./RecentArticles.css";

export function RecentArticlesCSS3({ articles, section }) {
  if (!section) {
    const grouped = articles.reduce((acc, a) => {
      if (!acc[a.section]) acc[a.section] = [];
      acc[a.section].push(a);
      return acc;
    }, {});

    return (
      <div className="recent-articles">
        <div className="recent-articles__sections">
          {Object.entries(grouped).map(([sec, items]) => (
            <SectionBlockCSS3JSX
              key={sec}
              section={sec}
              articles={items.slice(0, 6)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="recent-articles">
      <SectionBlockCSS3JSX section={section} articles={articles} showAll />
    </div>
  );
}

function SectionBlockCSS3JSX({ section, articles, showAll = false }) {
  const { useScrollAnimation } = useProjectContext();
  const { ref, isVisible } = useScrollAnimation(0.05);
  const label = sectionLabels[section] || section;
  const layoutIndex =
    [
      "news",
      "sports",
      "literary",
      "opinion",
      "general",
      "sci-tech",
      "feature",
    ].indexOf(section) % 3;

  return (
    <section
      ref={ref}
      className={`section-block ${isVisible ? "section-block--visible" : ""}`}
    >
      <div className="section-block__header">
        <div className="section-block__title-row">
          <h2 className="section-block__title">{label}</h2>
          <div className="section-block__line" />
        </div>
        {!showAll && (
          <Link to={`/section/${section}`} className="section-block__view-all">
            View All →
          </Link>
        )}
      </div>

      {layoutIndex === 0 && (
        <div className="section-block__grid">
          {articles.slice(0, 1).map((a) => (
            <div key={a.id} className="section-block__grid-featured">
              <ArticleCardCSS3 article={a} />
            </div>
          ))}
          {articles.slice(1).map((a) => (
            <ArticleCardCSS3 key={a.id} article={a} />
          ))}
        </div>
      )}

      {layoutIndex === 1 && (
        <div>
          {articles.slice(0, 1).map((a) => (
            <ArticleCardCSS3 key={a.id} article={a} />
          ))}
          <div
            className="section-block__list-grid"
            style={{ marginTop: "1rem" }}
          >
            {articles.slice(1).map((a) => (
              <ArticleCardCSS3 key={a.id} article={a} variant="horizontal" />
            ))}
          </div>
        </div>
      )}

      {layoutIndex === 2 && (
        <div className="section-block__mixed">
          <div className="section-block__mixed-cards">
            {articles.slice(0, 4).map((a) => (
              <ArticleCardCSS3 key={a.id} article={a} />
            ))}
          </div>
          <div className="section-block__sidebar">
            <span className="section-block__sidebar-label">
              More in {label}
            </span>
            {articles.slice(4).map((a) => (
              <ArticleCardCSS3 key={a.id} article={a} variant="compact" />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
