import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SystemPrompts = () => {
  const { toast } = useToast();
  const [isEditingWatch, setIsEditingWatch] = useState(false);
  const [isEditingReference, setIsEditingReference] = useState(false);
  const [watchPrompt, setWatchPrompt] = useState("");
  const [referencePrompt, setReferencePrompt] = useState("");

  const { data: prompts } = useQuery({
    queryKey: ["systemPrompts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("style_guides")
        .select("*")
        .in("id", [2, 5]);
      
      if (error) throw error;
      
      if (data) {
        const watchPromptData = data.find(prompt => prompt.id === 2);
        const referencePromptData = data.find(prompt => prompt.id === 5);
        setWatchPrompt(watchPromptData?.content || "");
        setReferencePrompt(referencePromptData?.content || "");
      }
      return data;
    },
  });

  const updatePromptMutation = useMutation({
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
        description: "System prompt updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update system prompt",
        variant: "destructive",
      });
      console.error("Error updating system prompt:", error);
    },
  });

  const handleWatchPromptSave = () => {
    updatePromptMutation.mutate({ id: 2, content: watchPrompt });
    setIsEditingWatch(false);
  };

  const handleReferencePromptSave = () => {
    updatePromptMutation.mutate({ id: 5, content: referencePrompt });
    setIsEditingReference(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">System Prompts</h1>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Watch Description System Prompt</h2>
            <Button
              variant="outline"
              onClick={() => isEditingWatch ? handleWatchPromptSave() : setIsEditingWatch(true)}
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
            value={watchPrompt}
            onChange={(e) => setWatchPrompt(e.target.value)}
            className="min-h-[200px]"
            disabled={!isEditingWatch}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Reference Description System Prompt</h2>
            <Button
              variant="outline"
              onClick={() => isEditingReference ? handleReferencePromptSave() : setIsEditingReference(true)}
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
            value={referencePrompt}
            onChange={(e) => setReferencePrompt(e.target.value)}
            className="min-h-[200px]"
            disabled={!isEditingReference}
          />
        </div>
      </div>
    </div>
  );
};

export default SystemPrompts;