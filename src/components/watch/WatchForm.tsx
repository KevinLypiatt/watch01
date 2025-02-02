import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface WatchFormProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleGenerateDescription: () => void;
  isGenerating: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

export const WatchForm = ({
  formData,
  handleInputChange,
  handleGenerateDescription,
  isGenerating,
  handleSubmit
}: WatchFormProps) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Brand</label>
          <Input name="brand" onChange={handleInputChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Model Name</label>
          <Input name="model_name" onChange={handleInputChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Model Reference</label>
          <Input name="model_reference" onChange={handleInputChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Case Material</label>
          <Input name="case_material" onChange={handleInputChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Year</label>
          <Input name="year" type="number" onChange={handleInputChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Movement Type</label>
          <Input name="movement_type" onChange={handleInputChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Listing Reference</label>
          <Input name="listing_reference" onChange={handleInputChange} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Condition</label>
          <Input name="condition" onChange={handleInputChange} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Additional Information</label>
        <Textarea
          name="additional_information"
          onChange={handleInputChange}
          className="min-h-[100px]"
        />
      </div>
      <div className="flex gap-4 mb-4">
        <Button
          type="button"
          onClick={handleGenerateDescription}
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
      <Button type="submit" variant="outline" className="bg-[#f3f3f3] hover:bg-[#e5e5e5]">
        Save Watch
      </Button>
    </form>
  );
};