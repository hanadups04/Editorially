/* ===========================
   Index Page JSX + CSS3 Version (Plain JS)
   =========================== */
import { useEffect, useState, useCallback } from "react";
import { NavbarCSS3 } from "@/components/css3/Navbar.css3";
import { MarqueeCSS3 } from "@/components/css3/Marquee.css3";
import { FeaturedSectionCSS3 } from "@/components/css3/FeaturedSection.css3";
import { RecentArticlesCSS3 } from "@/components/css3/RecentArticles.css3";
import { SectionDividerCSS3 } from "@/components/css3/SectionDivider.css3";
import { FooterCSS3 } from "@/components/css3/Footer.css3";
import { fetchArticles, fetchFeaturedArticles } from "@/lib/db_queries";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Loader2 } from "lucide-react";
import "./Index.css";

export default function IndexCSS3JSX() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetchFeaturedArticles().then(setFeatured);
  }, []);

  const fetchFn = useCallback((page) => fetchArticles(page, 15), []);
  const { items, isLoading, hasMore, observerRef } = useInfiniteScroll({
    fetchFn,
  });

  const featuredIds = new Set(featured.map((f) => f.id));
  const nonFeatured = items.filter((a) => !featuredIds.has(a.id));

  return (
    <div className="index-page">
      <NavbarCSS3 />
      <div className="index-page__spacer" />
      <MarqueeCSS3 articles={featured} />
      <FeaturedSectionCSS3 articles={featured} />
      <SectionDividerCSS3 />
      <RecentArticlesCSS3 articles={nonFeatured} />
      <div ref={observerRef} className="index-page__scroll-trigger">
        {isLoading && <Loader2 className="index-page__spinner" />}
        {!hasMore && !isLoading && items.length > 0 && (
          <p className="index-page__end-text">You've reached the end</p>
        )}
      </div>
      <FooterCSS3 />
    </div>
  );
}
