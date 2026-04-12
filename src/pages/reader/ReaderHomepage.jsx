/* ===========================
   Index Page JSX + CSS3 Version (Plain JS)
   =========================== */
import { useEffect, useState, useCallback } from "react";
import { NavbarCSS3 } from "../../components/readerSide/Navbar";
import { MarqueeCSS3 } from "../../components/readerSide/Marquee";
import { FeaturedSectionCSS3 } from "../../components/readerSide/FeaturedSection";
import { RecentArticlesCSS3 } from "../../components/readerSide/RecentArticles";
import { SectionDividerCSS3 } from "../../components/readerSide/SectionDivider";
import { FooterCSS3 } from "../../components/readerSide/Footer";
import {
  fetchArticles,
  fetchFeaturedArticles,
} from "../../context/functions/db_queries";

import { useProjectContext } from "../../context/Context";
import { Loader2 } from "lucide-react";
import "./ReaderHomepage";

export default function IndexCSS3JSX() {
  const { useInfiniteScroll } = useProjectContext();
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
