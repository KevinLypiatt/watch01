import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ReferenceDescriptionHeaderProps {
  isGenerating: boolean;
  handleGenerateAll: () => void;
}

export const ReferenceDescriptionHeader = ({
  isGenerating,
  handleGenerateAll,
}: ReferenceDescriptionHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reference Descriptions</h1>
      </div>
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          className="bg-[#f3f3f3] hover:bg-[#e5e5e5]"
          onClick={handleGenerateAll}
          disabled={isGenerating}
        >
          {isGenerating ? "Working..." : "Generate Reference Descriptions"}
        </Button>
        <Button onClick={() => navigate("/reference-descriptions/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Description
        </Button>
      </div>
    </div>
  );
};