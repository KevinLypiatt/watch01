import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface ReferenceDescriptionHeaderProps {
  isGenerating: boolean;
  handleGenerateAll: () => void;
}

export const ReferenceDescriptionHeader = ({
  isGenerating,
  handleGenerateAll,
}: ReferenceDescriptionHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">Reference Descriptions</h1>
        <p className="text-muted-foreground">
          Manage and generate references
        </p>
      </div>
      <div className="flex gap-4">
        <Link to="/reference-descriptions/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add New Reference
          </Button>
        </Link>
        <Button
          variant="outline"
          onClick={handleGenerateAll}
          disabled={isGenerating}
          className="bg-[#f3f3f3] hover:bg-[#e5e5e5]"
        >
          {isGenerating ? "Generating..." : "Generate All Descriptions"}
        </Button>
      </div>
    </div>
  );
};