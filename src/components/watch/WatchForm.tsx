import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const checkReferenceAndGenerate = async () => {
    if (!formData.brand || !formData.model_reference) {
      toast({
        title: "Warning",
        description: "Please enter both Brand and Model Reference",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: reference } = await supabase
        .from('reference_descriptions')
        .select('reference_description')
        .eq('brand', formData.brand)
        .eq('reference_name', formData.model_reference)
        .maybeSingle();

      if (!reference) {
        toast({
          title: "Warning",
          description: "No reference record for this watch",
          variant: "destructive",
        });
        return;
      }

      if (!reference.reference_description) {
        toast({
          title: "Warning",
          description: "No reference description yet created",
          variant: "destructive",
        });
        return;
      }

      handleGenerateDescription();
    } catch (error) {
      console.error('Error checking reference:', error);
      toast({
        title: "Error",
        description: "Failed to check reference description",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Brand</label>
          <Input 
            name="brand" 
            value={formData.brand || ''} 
            onChange={handleInputChange} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Model Reference</label>
          <Input 
            name="model_reference" 
            value={formData.model_reference || ''} 
            onChange={handleInputChange} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Model Name</label>
          <Input 
            name="model_name" 
            value={formData.model_name || ''} 
            onChange={handleInputChange} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Case Material</label>
          <Input 
            name="case_material" 
            value={formData.case_material || ''} 
            onChange={handleInputChange} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Year</label>
          <Input 
            name="year" 
            type="number" 
            value={formData.year || ''} 
            onChange={handleInputChange} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Movement Type</label>
          <Input 
            name="movement_type" 
            value={formData.movement_type || ''} 
            onChange={handleInputChange} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Listing Reference</label>
          <Input 
            name="listing_reference" 
            value={formData.listing_reference || ''} 
            onChange={handleInputChange} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Condition</label>
          <Input 
            name="condition" 
            value={formData.condition || ''} 
            onChange={handleInputChange} 
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Additional Information</label>
        <Textarea
          name="additional_information"
          value={formData.additional_information || ''}
          onChange={handleInputChange}
          className="min-h-[100px]"
        />
      </div>
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
      <Button type="submit" variant="outline" className="bg-[#f3f3f3] hover:bg-[#e5e5e5]">
        Save Watch
      </Button>
    </form>
  );
};