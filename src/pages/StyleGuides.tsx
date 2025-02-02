import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { StyleGuideHeader } from "@/components/style-guides/StyleGuideHeader";
import { StyleGuideSection } from "@/components/style-guides/StyleGuideSection";

const StyleGuides = () => {
  const { toast } = useToast();
  const [watchGuide, setWatchGuide] = useState("");
  const [referenceGuide, setReferenceGuide] = useState("");

  const { data: guides } = useQuery({
    queryKey: ["styleGuides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("style_guides")
        .select("*")
        .in("id", [1, 8]);
      
      if (error) {
        console.error("Error fetching style guides:", error);
        throw error;
      }
      
      if (data) {
        const watchGuideData = data.find(guide => guide.id === 1);
        const referenceGuideData = data.find(guide => guide.id === 8);
        if (!watchGuide) setWatchGuide(watchGuideData?.content || "");
        if (!referenceGuide) setReferenceGuide(referenceGuideData?.content || "");
      }
      return data;
    },
  });

  const updateGuideMutation = useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) => {
      const { data, error } = await supabase
        .from("style_guides")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select();
      
      if (error) {
        console.error("Error updating style guide:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Style guide updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error in mutation:", error);
      toast({
        title: "Error",
        description: "Failed to update style guide",
        variant: "destructive",
      });
    },
  });

  const handleWatchGuideSave = () => {
    updateGuideMutation.mutate({ id: 1, content: watchGuide });
  };

  const handleReferenceGuideSave = () => {
    updateGuideMutation.mutate({ id: 8, content: referenceGuide });
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