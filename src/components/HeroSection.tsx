import { useEffect, useRef } from "react";

export const HeroSection = () => {
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const text = textRef.current;
    if (text) {
      text.style.opacity = "1";
      text.style.transform = "translateY(0)";
    }
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center px-6 bg-soft-gray">
      <div className="max-w-4xl mx-auto text-center">
        <span className="inline-block px-3 py-1 mb-6 text-sm bg-accent-light rounded-full text-accent animate-fade-in">
          Introducing Innovation
        </span>
        <h1
          ref={textRef}
          className="text-4xl md:text-6xl font-medium text-accent-dark mb-6 transition-all duration-700 opacity-0 transform translate-y-4"
        >
          Create something beautiful
        </h1>
        <p className="text-accent max-w-2xl mx-auto mb-8 animate-fade-up">
          Experience design perfection with our carefully crafted products,
          designed to elevate your everyday life.
        </p>
        <button className="px-8 py-3 bg-accent-dark text-white rounded-full hover:bg-black transition-colors duration-200 animate-fade-up">
          Discover More
        </button>
      </div>
    </section>
  );
};