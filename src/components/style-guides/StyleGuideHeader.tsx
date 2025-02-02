import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export const StyleGuideHeader = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Link to="/" className="inline-flex items-center text-gray-700 hover:text-gray-900">
          <Home className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
};