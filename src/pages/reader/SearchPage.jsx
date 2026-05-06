/* ===========================
   SearchPage JSX + CSS3 Version (Plain JS)
   =========================== */
import { useState, useCallback, useEffect, useRef } from "react";
import { NavbarCSS3 } from "../../components/readerSide/Navbar";
import { FooterCSS3 } from "../../components/readerSide/Footer";
import { ArticleCardCSS3 } from "../../components/readerSide/ArticleCard";
import { searchArticles } from "../../context/functions/db_queries";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import "./SearchPage.css";

export default function SearchPageCSS3JSX() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const debounceRef = useRef();
  const inputRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const doSearch = useCallback(async (q, p = 0) => {
    if (!q.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    setIsLoading(true);
    const res = await searchArticles(q, p, 15);
    if (p === 0) setResults(res.data);
    else setResults((prev) => [...prev, ...res.data]);
    setHasMore(res.hasMore);
    setHasSearched(true);
    setIsLoading(false);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setPage(0);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val, 0), 300);
  };

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading && query.trim()) {
          const nextPage = page + 1;
          setPage(nextPage);
          doSearch(query, nextPage);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoading, query, page, doSearch]);

  return (
    <div className="search-page">
      <NavbarCSS3 />
      <div style={{ height: "104px" }} />

      <div className="search-page__container">
        <div className="search-page__header">
          <h1 className="search-page__title">Search</h1>
          <div className="search-page__input-wrapper">
            <SearchIcon size={20} className="search-page__input-icon" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleChange}
              placeholder="Search articles, authors, topics..."
              className="search-page__input"
            />
          </div>
        </div>

        {!hasSearched && !isLoading && (
          <div className="search-page__empty">
            <div className="search-page__empty-icon">
              <SearchIcon
                size={24}
                style={{ color: "hsla(var(--muted-foreground), 0.4)" }}
              />
            </div>
            <p className="search-page__empty-text">
              Start typing to discover articles
            </p>
          </div>
        )}

        {hasSearched && results.length === 0 && !isLoading && (
          <div className="search-page__empty search-page__no-results">
            <h2>No articles found</h2>
            <p>Try a different search term</p>
          </div>
        )}

        {results.length > 0 && (
          <div>
            <p className="search-page__results-count">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
            {results.map((article) => (
              <ArticleCardCSS3
                key={article.id}
                article={article}
                variant="horizontal"
              />
            ))}
          </div>
        )}

        <div ref={observerRef} className="search-page__scroll-trigger">
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
        </div>
      </div>

      <FooterCSS3 />
    </div>
  );
}
