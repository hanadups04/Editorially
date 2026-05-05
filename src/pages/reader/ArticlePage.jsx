/* ===========================
   ArticlePage JSX + CSS3 Version (Plain JS)
   =========================== */
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchArticleBySlug } from "../../context/functions/db_queries";
import { sectionLabels } from "../../context/functions/mock-data";
import { NavbarCSS3 } from "../../components/readerSide/Navbar";
import { FooterCSS3 } from "../../components/readerSide/Footer";
import { Loader2, ArrowLeft } from "lucide-react";
import * as ReadFunctions from "../../context/functions/ReadFunctions";
import "./ArticlePage.css";
import { Button } from "bootstrap";

export default function ArticlePageCSS3JSX() {
  const { id } = useParams();
  const [article, setArticle] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (!slug) return;
  //   setLoading(true);
  //   fetchArticleBySlug(slug).then((a) => {
  //     setArticle(a);
  //     setLoading(false);
  //   });
  // }, [slug]);

  useEffect(() => {
    let isMounted = true;

    async function fetchArticle() {
      try {
        const article = await ReadFunctions.fetchSingleArticle(id);
        if (isMounted) {
          setArticle(article);
          console.log("single article", article);
        }
      } catch (error) {
        console.log("error", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchArticle();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const formattedDate = article
    ? new Date(article.date_posted).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const navigate = useNavigate();

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
          <a href="/readers">← Back to home</a>
        </div>
      ) : (
        <article>
          <div className="article-page__back">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate(-1);
              }}
              className="article-page__back-link"
            >
              <ArrowLeft size={14} />
              Back
            </a>
          </div>

          <header className="article-page__header">
            <Link
              to={`/section/${article.sections_tbl?.section_name}`}
              className="article-page__section-link"
            >
              {sectionLabels[article.sections_tbl.section_name] ||
                article.sections_tbl.section_name}
            </Link>
            <h1 className="article-page__title">{article.headline}</h1>
            <div className="article-page__meta">
              <span className="article-page__meta-author">
                {article.author1.username} & {article.author2.username}
              </span>
              <span>·</span>
              <time>{formattedDate}</time>
            </div>
          </header>

          <div className="article-page__thumbnail">
            <div className="article-page__thumbnail-inner">
              {article.images ? (
                <img src={article.images} alt={article.headline} />
              ) : (
                <div className="article-page__placeholder">
                  <span className="article-page__placeholder-letter">
                    {article.sections_tbl.section_name[0].toUpperCase()}
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
