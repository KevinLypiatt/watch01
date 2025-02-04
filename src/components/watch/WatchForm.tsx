
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WatchFormFields } from "./WatchFormFields";
import { WatchDescriptionSection } from "./WatchDescriptionSection";
import { Copy } from "lucide-react";

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

  const handleCopyDescription = () => {
    if (formData.description) {
      navigator.clipboard.writeText(formData.description);
      toast({
        title: "Success",
        description: "Description copied to clipboard",
      });
    } else {
      toast({
        title: "Warning",
        description: "No description to copy",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <WatchFormFields 
        formData={formData}
        handleInputChange={handleInputChange}
      />
      
      <WatchDescriptionSection
        formData={formData}
        handleInputChange={handleInputChange}
        checkReferenceAndGenerate={checkReferenceAndGenerate}
        isGenerating={isGenerating}
      />

      <div className="flex gap-4">
        <Button type="submit" variant="outline" className="bg-[#f3f3f3] hover:bg-[#e5e5e5]">
          Save Watch
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          className="bg-[#f3f3f3] hover:bg-[#e5e5e5]"
          onClick={handleCopyDescription}
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy Description
        </Button>
      </div>
    </form>
  );
};
