/* ===========================
   SectionPage JSX + CSS3 Version (Plain JS)
   =========================== */
import { useParams, Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { fetchArticlesBySection } from "../../context/functions/db_queries";
import { sectionLabels } from "../../context/functions/mock-data";
import { NavbarCSS3 } from "../../components/readerSide/Navbar";
import { FooterCSS3 } from "../../components/readerSide/Footer";
import { ArticleCardCSS3 } from "../../components/readerSide/ArticleCard";
import { useProjectContext } from "../../context/Context";
import { Loader2 } from "lucide-react";
import * as ReadFunctions from "../../context/functions/ReadFunctions";
import "./SectionPage.css";

export default function SectionPageCSS3() {
  const { useInfiniteScroll } = useProjectContext();
  const [loading, setIsLoading] = useState(true);
  const [sectionArticles, setSectionArticles] = useState([]);

  const { name } = useParams();
  useEffect(() => {
    let isMounted = true;

    async function fetchSectionArticles() {
      try {
        const articles = await ReadFunctions.getSectionArticles(name);

        if (isMounted) {
          setSectionArticles(articles);
          console.log("sec articles", articles);
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchSectionArticles();
    return () => {
      isMounted = false;
    };
  }, [name]);

  const label = sectionLabels[name || ""] || name || "";

  const fetchFn = useCallback(
    (page) => fetchArticlesBySection(name || "", page, 15),
    [name],
  );

  const { items, isLoading, hasMore, observerRef } = useInfiniteScroll({
    fetchFn,
  });

  const hero = sectionArticles[0];
  const rest = sectionArticles.slice(1);
  const heroDate = hero
    ? new Date(hero.date_posted).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="section-page">
      <NavbarCSS3 />

      <div className="section-page__container">
        <div className="section-page__header">
          <h1 className="section-page__title">{label}</h1>
          <div className="section-page__line" />
        </div>

        {hero && (
          <Link
            to={`/article/${hero.article_id}`}
            className="section-page__hero"
          >
            <div className="section-page__hero-image">
              {hero.images ? (
                <img src={hero.images} alt={hero.headline} />
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
              <h2 className="section-page__hero-title">{hero.headline}</h2>
              <p className="section-page__hero-excerpt">{hero.content}</p>
              <div className="section-page__hero-meta">
                <span className="section-page__hero-meta-author">
                  {hero.author1} & {hero.author2}
                </span>
                <span style={{ margin: "0 0.5rem" }}>·</span>
                <span>{heroDate}</span>
              </div>
            </div>
          </Link>
        )}

        <div className="section-page__grid">
          {rest.map((article) => (
            <ArticleCardCSS3 key={article.article_id} article={article} />
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
