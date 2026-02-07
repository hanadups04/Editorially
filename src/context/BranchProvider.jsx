import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import * as ReadFunctions from "../context/functions/ReadFunctions";
import * as auth from "./auth";

const BranchContext = createContext();
const ADMIN_PREFIXES = [
  "admin",
  "adviser",
  "advisor",
  "dashboard",
  "sadmin",
  "aboutus",
  "login",
  "register",
];

const getFirstPathSegment = () => {
  if (typeof window === "undefined") return null;
  const seg = window.location.pathname.split("/").filter(Boolean)[0] || null;
  return seg ? seg.toLowerCase() : null;
};
const isAdminRoute = (seg) => (seg ? ADMIN_PREFIXES.includes(seg) : false);

export function BranchProvider({ children }) {
  const [branchId, setBranchId] = useState(null);
  const [currentSlug, setCurrentSlug] = useState(null);
  const defaultPubTheme = { article: 1, homepage: 1, section: 1 };
  const [pubTheme, setPubTheme] = useState(defaultPubTheme);
  const routeSlugRef = useRef(null);
  const [pubColors, setPubColors] = useState({
    cfc: "#020b40",
    hnfbgc: "#020b40",
    hnffc: "#F5F5F0",
    nbfc: "#020b40",
    // hnfic: "icon",
  });

  const isMountedRef = useRef(false);
  const debounceRef = useRef(null);

  // go to branch defined in slug
  const branchRouting = async () => {
    const first = getFirstPathSegment(); // e.g., "admin" or "<branchSlug>"
    const onAdmin = isAdminRoute(first);
    const slugFromUrl = !onAdmin && first ? first : null;
    const routeSlug = !onAdmin ? routeSlugRef.current || slugFromUrl : null;

    if (onAdmin) return; // stop running if admin route????

    const tenantData = await ReadFunctions.getBranchBySlug(first); // get slug from url path

    const pubColor = {
      fontcolor1: tenantData.data.font_color1 || "",
      fontcolor2: tenantData.data.font_color2 || "",
      fontcolor3: tenantData.data.font_color3 || "",
      maincolor: tenantData.data.main_color || "",
    };

    const pubTheme = {
      iconUrl: tenantData.data.icon_url || 1,
      homepage: tenantData.data.homepage_type || 1,
      article: tenantData.data.article_type || 1,
      section: tenantData.data.section_type || 1,
    };

    if (tenantData.code === 1) {
      setBranchId(tenantData.data.tenant_id);
      setPubTheme(pubTheme);
      setPubColors(pubColor);
      setCurrentSlug(first);
    }
  };

  // Setup a history listener without needing useLocation()
  useEffect(() => {
    // Helper: dispatch a custom event when location changes
    const wrapHistoryMethod = (methodName) => {
      const original = window.history[methodName];
      return function () {
        const result = original.apply(this, arguments);
        const event = new Event("locationchange");
        window.dispatchEvent(event);
        return result;
      };
    };

    // Only patch once
    if (!window.__historyPatched) {
      window.history.pushState = wrapHistoryMethod("pushState");
      window.history.replaceState = wrapHistoryMethod("replaceState");
      window.__historyPatched = true;
    }

    // Handler: run branchRouting when location changes, but debounce rapid changes.
    const onLocationChange = () => {
      // Debounce short bursts of navigation
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        // Only run when first path segment actually changed
        const first = getFirstPathSegment();
        if (!isAdminRoute(first) && first !== currentSlug) {
          branchRouting();
        } else if (!first && currentSlug) {
          // optional: handle navigation back to root (clear state)
          // setCurrentSlug(null);
          // setBranchId(null);
        }
      }, 60); // 60ms debounce — tune if needed
    };

    // Attach listeners
    window.addEventListener("popstate", onLocationChange);
    window.addEventListener("locationchange", onLocationChange);

    // Run once on mount (but avoid running before provider mounted)
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      branchRouting();
    }

    return () => {
      window.removeEventListener("popstate", onLocationChange);
      window.removeEventListener("locationchange", onLocationChange);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // Intentionally not depending on currentSlug here to avoid re-attaching listeners on every change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BranchContext.Provider
      value={{
        branchId,
        setBranchId,
        currentSlug,
        pubTheme,
        pubColors,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error("useBranch must be used within a BranchProvider");
  }
  return context;
}
