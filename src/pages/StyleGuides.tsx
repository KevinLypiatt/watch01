import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StyleGuideHeader } from "@/components/style-guides/StyleGuideHeader";
import { StyleGuideSection } from "@/components/style-guides/StyleGuideSection";

const StyleGuides = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [watchGuide, setWatchGuide] = useState("");
  const [referenceGuide, setReferenceGuide] = useState("");

  const { data: guides } = useQuery({
    queryKey: ["styleGuides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("style_guides")
        .select("*")
        .in("id", [1, 8]);  // Changed from [1, 4] to [1, 8]
      
      if (error) throw error;
      
      if (data) {
        const watchGuideData = data.find(guide => guide.id === 1);
        const referenceGuideData = data.find(guide => guide.id === 8);  // Changed from 4 to 8
        if (!watchGuide) setWatchGuide(watchGuideData?.content || "");
        if (!referenceGuide) setReferenceGuide(referenceGuideData?.content || "");
      }
      return data;
    },
  });

  const updateGuideMutation = useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) => {
      const { error } = await supabase
        .from("style_guides")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Style guide updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update style guide",
        variant: "destructive",
      });
      console.error("Error updating style guide:", error);
    },
  });

  const handleWatchGuideSave = () => {
    updateGuideMutation.mutate({ id: 1, content: watchGuide });
  };

  const handleReferenceGuideSave = () => {
    updateGuideMutation.mutate({ id: 8, content: referenceGuide });  // Changed from 4 to 8
  };

  return (
    <div>
      <StyleGuideHeader />
      <div className="container mx-auto p-6 space-y-8 pt-16">
        <h1 className="text-2xl font-bold mb-6">Style Guides</h1>
        
        <div className="space-y-6">
          <StyleGuideSection
            title="Watch Description Style Guide"
            content={watchGuide}
            setContent={setWatchGuide}
            handleSave={handleWatchGuideSave}
          />

          <StyleGuideSection
            title="Reference Description Style Guide"
            content={referenceGuide}
            setContent={setReferenceGuide}
            handleSave={handleReferenceGuideSave}
          />
        </div>
      </div>
    </div>
  );
};

export default StyleGuides;