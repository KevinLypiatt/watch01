import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export const NavigationMenu = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled
          ? "bg-soft-white/80 backdrop-blur-lg border-b border-gray-100"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold">
          Home
        </Link>
        <div className="flex gap-6">
          <Link to="/watch-list" className="text-lg">
            Watch List
          </Link>
          <Link to="/reference-descriptions" className="text-lg">
            References
          </Link>
        </div>
      </div>
    </nav>
  );
};