import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SystemPromptHeader } from "@/components/system-prompts/SystemPromptHeader";
import { SystemPromptSection } from "@/components/system-prompts/SystemPromptSection";

const SystemPrompts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
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
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["systemPrompts"] });
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
    <div>
      <SystemPromptHeader />
      <div className="container mx-auto p-6 space-y-8 pt-16">
        <h1 className="text-2xl font-bold mb-6">System Prompts</h1>
        
        <div className="space-y-6">
          <SystemPromptSection
            title="Watch Description System Prompt"
            content={watchPrompt}
            isEditing={isEditingWatch}
            setContent={setWatchPrompt}
            handleSave={handleWatchPromptSave}
            setIsEditing={setIsEditingWatch}
          />

          <SystemPromptSection
            title="Reference Description System Prompt"
            content={referencePrompt}
            isEditing={isEditingReference}
            setContent={setReferencePrompt}
            handleSave={handleReferencePromptSave}
            setIsEditing={setIsEditingReference}
          />
        </div>
      </div>
    </div>
  );
};

export default SystemPrompts;