import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "lucide-react";

interface WatchDescriptionSectionProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  checkReferenceAndGenerate: () => void;
  isGenerating: boolean;
}

export const WatchDescriptionSection = ({
  formData,
  handleInputChange,
  checkReferenceAndGenerate,
  isGenerating,
}: WatchDescriptionSectionProps) => {
  return (
    <>
      <div className="flex gap-4 mb-4">
        <Button
          type="button"
          onClick={checkReferenceAndGenerate}
          disabled={isGenerating}
          variant="outline"
          className="bg-[#f3f3f3] hover:bg-[#e5e5e5]"
        >
          {isGenerating ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Working...
            </>
          ) : (
            "Generate Description"
          )}
        </Button>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          className="min-h-[200px]"
        />
      </div>
    </>
  );
};