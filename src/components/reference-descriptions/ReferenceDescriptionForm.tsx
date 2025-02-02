import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ReferenceDescriptionFormProps {
  brand: string;
  referenceName: string;
  description: string;
  isGenerating: boolean;
  handleBrandChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleReferenceNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleGenerateDescription: () => void;
}

export const ReferenceDescriptionForm = ({
  brand,
  referenceName,
  description,
  isGenerating,
  handleBrandChange,
  handleReferenceNameChange,
  handleDescriptionChange,
  handleSubmit,
  handleGenerateDescription,
}: ReferenceDescriptionFormProps) => {
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div>
        <label htmlFor="brand" className="block text-sm font-medium mb-1">
          Brand
        </label>
        <Input
          id="brand"
          value={brand}
          onChange={handleBrandChange}
          required
        />
      </div>
      <div>
        <label htmlFor="referenceName" className="block text-sm font-medium mb-1">
          Reference Name
        </label>
        <Input
          id="referenceName"
          value={referenceName}
          onChange={handleReferenceNameChange}
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={handleDescriptionChange}
          className="min-h-[200px]"
        />
      </div>
      <div className="flex gap-4">
        <Button type="submit" variant="outline" className="bg-[#f3f3f3] hover:bg-[#e5e5e5]">
          Save Changes
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleGenerateDescription}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate Reference Description"}
        </Button>
      </div>
    </form>
  );
};