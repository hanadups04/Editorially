/* ===========================
   SectionPage JSX + CSS3 Version (Plain JS)
   =========================== */
import { useParams, Link } from "react-router-dom";
import { useCallback } from "react";
import { fetchArticlesBySection } from "@/lib/db_queries";
import { sectionLabels } from "@/lib/mock-data";
import { NavbarCSS3 } from "@/components/css3/Navbar.css3";
import { FooterCSS3 } from "@/components/css3/Footer.css3";
import { ArticleCardCSS3 } from "@/components/css3/ArticleCard.css3";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Loader2 } from "lucide-react";
import "./SectionPage.css";

export default function SectionPageCSS3JSX() {
  const { section } = useParams();
  const label = sectionLabels[section || ""] || section || "";

  const fetchFn = useCallback(
    (page) => fetchArticlesBySection(section || "", page, 15),
    [section],
  );

  const { items, isLoading, hasMore, observerRef } = useInfiniteScroll({
    fetchFn,
  });

  const hero = items[0];
  const rest = items.slice(1);
  const heroDate = hero
    ? new Date(hero.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="section-page">
      <NavbarCSS3 />
      <div style={{ height: "104px" }} />

      <div className="section-page__container">
        <div className="section-page__header">
          <h1 className="section-page__title">{label}</h1>
          <div className="section-page__line" />
        </div>

        {hero && (
          <Link to={`/article/${hero.slug}`} className="section-page__hero">
            <div className="section-page__hero-image">
              {hero.thumbnail ? (
                <img src={hero.thumbnail} alt={hero.title} />
              ) : (
                <div className="section-page__hero-placeholder">
                  <span className="section-page__hero-placeholder-letter">
                    {label[0]}
                  </span>
                </div>
              )}
            </div>
            <div>
              <span className="section-page__hero-label">Latest</span>
              <h2 className="section-page__hero-title">{hero.title}</h2>
              <p className="section-page__hero-excerpt">{hero.excerpt}</p>
              <div className="section-page__hero-meta">
                <span className="section-page__hero-meta-author">
                  {hero.authors.join(", ")}
                </span>
                <span style={{ margin: "0 0.5rem" }}>·</span>
                <span>{heroDate}</span>
              </div>
            </div>
          </Link>
        )}

        <div className="section-page__grid">
          {rest.map((article) => (
            <ArticleCardCSS3 key={article.id} article={article} />
          ))}
        </div>
      </div>

      <div ref={observerRef} className="section-page__scroll-trigger">
        {isLoading && (
          <Loader2
            style={{
              width: "1.25rem",
              height: "1.25rem",
              animation: "spin 1s linear infinite",
              color: "hsl(var(--muted-foreground))",
            }}
          />
        )}
        {!hasMore && !isLoading && items.length > 0 && (
          <p className="section-page__end-text">No more articles</p>
        )}
      </div>

      <FooterCSS3 />
    </div>
  );
}
