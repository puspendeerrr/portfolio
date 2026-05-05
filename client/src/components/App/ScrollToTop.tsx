import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // If using Lenis, we might need to tell lenis to scroll to top as well,
    // but window.scrollTo is usually caught by lenis or works alongside it.
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
