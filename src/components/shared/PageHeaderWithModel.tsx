
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PageHeaderWithModelProps {
  activeModel?: string;
  onModelChange?: (value: string) => void;
  title?: string;
}

export const PageHeaderWithModel = ({ activeModel, onModelChange, title }: PageHeaderWithModelProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="inline-flex items-center text-gray-700 hover:text-gray-900">
            <Home className="w-6 h-6" />
          </Link>
          {title && <h1 className="text-xl font-semibold">{title}</h1>}
        </div>
        {activeModel && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Active Model:</span>
            {onModelChange ? (
              <Select value={activeModel} onValueChange={onModelChange}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claude-3-opus-20240229">Claude 3 Opus</SelectItem>
                  <SelectItem value="gpt-4o">GPT-4 Opus</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <span className="font-semibold">{activeModel}</span>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
