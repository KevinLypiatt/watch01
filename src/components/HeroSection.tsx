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
        <div
          ref={textRef}
          className="transition-all duration-700 opacity-0 transform translate-y-4"
        />
      </div>
    </section>
  );
};