import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { Context } from "./Context";
import { supabase } from "../supabaseClient";

const Provider = ({ children }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const screenSizes = useMemo(() => {
    return {
      isMicro: screenWidth <= 425,
      isMobile: screenWidth < 768,
      isTablet: screenWidth >= 768 && screenWidth < 900,
      isLimitedWebView: screenWidth >= 900 && screenWidth < 1100,
      isFullWebView: screenWidth >= 1100,
    };
  }, [screenWidth]);

  const useScrollAnimation = (threshold = 0.15) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(el);
          }
        },
        { threshold },
      );

      observer.observe(el);
      return () => observer.disconnect();
    }, [threshold]);

    return { ref, isVisible };
  };

  const useInfiniteScroll = ({ fetchFn, debounceMs = 300 }) => {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);
    const observerRef = useRef(null);
    const debounceTimer = useRef();

    const loadMore = useCallback(async () => {
      if (isLoading || !hasMore) return;
      setIsLoading(true);
      try {
        const result = await fetchFn(page);
        setItems((prev) => [...prev, ...result.data]);
        setHasMore(result.hasMore);
        setPage((prev) => prev + 1);
      } finally {
        setIsLoading(false);
        setInitialLoad(false);
      }
    }, [fetchFn, page, isLoading, hasMore]);

    useEffect(() => {
      if (initialLoad) loadMore();
    }, []);

    useEffect(() => {
      const el = observerRef.current;
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && hasMore && !isLoading) {
            clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(loadMore, debounceMs);
          }
        },
        { threshold: 0.1 },
      );

      observer.observe(el);
      return () => {
        observer.disconnect();
        clearTimeout(debounceTimer.current);
      };
    }, [loadMore, hasMore, isLoading, debounceMs]);

    const reset = useCallback(() => {
      setItems([]);
      setPage(0);
      setHasMore(true);
      setInitialLoad(true);
    }, []);

    return { items, isLoading, hasMore, observerRef, reset };
  };

  // const useDarkMode = () => {
  //   const [isDark, setIsDark] = useState(() => {
  //     if (typeof window === "undefined") return false;
  //     return localStorage.getItem("theme") === "dark";
  //   });

  //   useEffect(() => {
  //     const root = document.documentElement;
  //     if (isDark) {
  //       root.classList.add("dark");
  //       localStorage.setItem("theme", "dark");
  //     } else {
  //       root.classList.remove("dark");
  //       localStorage.setItem("theme", "light");
  //     }
  //   }, [isDark]);

  //   return { isDark, toggle: () => setIsDark((p) => !p) };
  // };

  return (
    <Context.Provider
      value={{
        ...screenSizes,
        useScrollAnimation,
        useInfiniteScroll,
        // useDarkMode,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Provider };
