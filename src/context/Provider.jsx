import React, { useEffect, useState, useMemo } from "react";
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

  return (
    <Context.Provider value={{ ...screenSizes }}>{children}</Context.Provider>
  );
};

export { Provider };
