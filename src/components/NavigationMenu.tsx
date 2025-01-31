import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

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
        <a href="/" className="text-xl font-medium text-accent-dark">
          Brand
        </a>
        <div className="hidden md:flex items-center space-x-8">
          {["Features", "Products", "About", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-accent hover:text-accent-dark transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};