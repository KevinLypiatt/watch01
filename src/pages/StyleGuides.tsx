import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const StyleGuides = () => {
  const { toast } = useToast();
  const [isEditingWatch, setIsEditingWatch] = useState(false);
  const [isEditingReference, setIsEditingReference] = useState(false);
  const [watchGuide, setWatchGuide] = useState("");
  const [referenceGuide, setReferenceGuide] = useState("");

  const { data: guides } = useQuery({
    queryKey: ["styleGuides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("style_guides")
        .select("*")
        .in("id", [1, 4]);
      
      if (error) throw error;
      
      if (data) {
        const watchGuideData = data.find(guide => guide.id === 1);
        const referenceGuideData = data.find(guide => guide.id === 4);
        setWatchGuide(watchGuideData?.content || "");
        setReferenceGuide(referenceGuideData?.content || "");
      }
      return data;
    },
  });

  const updateGuideMutation = useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) => {
      const { error } = await supabase
        .from("style_guides")
        .update({ content })
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
    setIsEditingWatch(false);
  };

  const handleReferenceGuideSave = () => {
    updateGuideMutation.mutate({ id: 4, content: referenceGuide });
    setIsEditingReference(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Style Guides</h1>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Watch Description Style Guide</h2>
            <Button
              variant="outline"
              onClick={() => isEditingWatch ? handleWatchGuideSave() : setIsEditingWatch(true)}
            >
              {isEditingWatch ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
          </div>
          <Textarea
            value={watchGuide}
            onChange={(e) => setWatchGuide(e.target.value)}
            className="min-h-[200px]"
            disabled={!isEditingWatch}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Reference Description Style Guide</h2>
            <Button
              variant="outline"
              onClick={() => isEditingReference ? handleReferenceGuideSave() : setIsEditingReference(true)}
            >
              {isEditingReference ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
          </div>
          <Textarea
            value={referenceGuide}
            onChange={(e) => setReferenceGuide(e.target.value)}
            className="min-h-[200px]"
            disabled={!isEditingReference}
          />
        </div>
      </div>
    </div>
  );
};

export default StyleGuides;