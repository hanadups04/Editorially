/* ===========================
   ArticlePage JSX + CSS3 Version (Plain JS)
   =========================== */
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchArticleBySlug } from "@/lib/db_queries";
import { sectionLabels } from "@/lib/mock-data";
import { NavbarCSS3 } from "@/components/css3/Navbar.css3";
import { FooterCSS3 } from "@/components/css3/Footer.css3";
import { Loader2, ArrowLeft } from "lucide-react";
import "./ArticlePage.css";

export default function ArticlePageCSS3JSX() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchArticleBySlug(slug).then((a) => {
      setArticle(a);
      setLoading(false);
    });
  }, [slug]);

  const formattedDate = article
    ? new Date(article.date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="article-page">
      <NavbarCSS3 />
      <div style={{ height: "104px" }} />

      {loading ? (
        <div className="article-page__loading">
          <Loader2
            style={{
              width: "1.5rem",
              height: "1.5rem",
              animation: "spin 1s linear infinite",
              color: "hsl(var(--muted-foreground))",
            }}
          />
        </div>
      ) : !article ? (
        <div className="article-page__not-found">
          <h1>Article not found</h1>
          <a href="/">← Back to home</a>
        </div>
      ) : (
        <article>
          <div className="article-page__back">
            <Link to="/" className="article-page__back-link">
              <ArrowLeft size={14} />
              Back
            </Link>
          </div>

          <header className="article-page__header">
            <Link
              to={`/section/${article.section}`}
              className="article-page__section-link"
            >
              {sectionLabels[article.section] || article.section}
            </Link>
            <h1 className="article-page__title">{article.title}</h1>
            <div className="article-page__meta">
              <span className="article-page__meta-author">
                {article.authors.join(", ")}
              </span>
              <span>·</span>
              <time>{formattedDate}</time>
            </div>
          </header>

          <div className="article-page__thumbnail">
            <div className="article-page__thumbnail-inner">
              {article.thumbnail ? (
                <img src={article.thumbnail} alt={article.title} />
              ) : (
                <div className="article-page__placeholder">
                  <span className="article-page__placeholder-letter">
                    {article.section[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div
            className="article-page__content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      )}

      <FooterCSS3 />
    </div>
  );
}
