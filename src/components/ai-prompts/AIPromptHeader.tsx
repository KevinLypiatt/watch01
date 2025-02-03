import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportTableToCSV } from "@/utils/csvExport";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AIPromptHeaderProps {
  activeGenerationModel: string;
  setActiveGenerationModel: (model: string) => void;
}

export const AIPromptHeader = ({
  activeGenerationModel,
  setActiveGenerationModel,
}: AIPromptHeaderProps) => {
  const availableGenerationModels = [
    "claude-3-opus-20240229",
    "gpt-4o"
  ];

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <Link to="/" className="hover:text-primary">
          <Home className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold">Edit AI Prompts</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <label htmlFor="generationModel" className="text-sm font-medium mb-1">
            Active Generation Model
          </label>
          <Select
            value={activeGenerationModel}
            onValueChange={setActiveGenerationModel}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {availableGenerationModels.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => exportTableToCSV("ai_prompts")}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </div>
  );
};