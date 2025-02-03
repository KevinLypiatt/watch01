import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SystemPromptHeader } from "@/components/system-prompts/SystemPromptHeader";
import { SystemPromptSection } from "@/components/system-prompts/SystemPromptSection";

interface AIPrompt {
  id: number;
  name: string;
  content: string;
  purpose: string;
  ai_model: string;
  created_at: string;
  updated_at: string;
}

const SystemPrompts = () => {
  const { toast } = useToast();
  const [watchPrompt, setWatchPrompt] = useState("");
  const [referencePrompt, setReferencePrompt] = useState("");

  const { data: prompts } = useQuery({
    queryKey: ["systemPrompts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_prompts")
        .select("*")
        .in("name", ["System Prompt", "Style Guide"]);
      
      if (error) {
        console.error("Error fetching system prompts:", error);
        throw error;
      }
      
      if (data) {
        const watchPromptData = data.find(prompt => prompt.name === "System Prompt");
        const referencePromptData = data.find(prompt => prompt.name === "Style Guide");
        if (!watchPrompt) setWatchPrompt(watchPromptData?.content || "");
        if (!referencePrompt) setReferencePrompt(referencePromptData?.content || "");
      }
      return data as AIPrompt[];
    },
  });

  const updatePromptMutation = useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) => {
      const { data, error } = await supabase
        .from("ai_prompts")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select();
      
      if (error) {
        console.error("Error updating system prompt:", error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "System prompt updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error in mutation:", error);
      toast({
        title: "Error",
        description: "Failed to update system prompt",
        variant: "destructive",
      });
    },
  });

  const handleWatchPromptSave = () => {
    const watchPromptData = prompts?.find(prompt => prompt.name === "System Prompt");
    if (watchPromptData) {
      updatePromptMutation.mutate({ id: watchPromptData.id, content: watchPrompt });
    }
  };

  const handleReferencePromptSave = () => {
    const referencePromptData = prompts?.find(prompt => prompt.name === "Style Guide");
    if (referencePromptData) {
      updatePromptMutation.mutate({ id: referencePromptData.id, content: referencePrompt });
    }
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
            setContent={setWatchPrompt}
            handleSave={handleWatchPromptSave}
          />

          <SystemPromptSection
            title="Reference Description System Prompt"
            content={referencePrompt}
            setContent={setReferencePrompt}
            handleSave={handleReferencePromptSave}
          />
        </div>
      </div>
    </div>
  );
};

export default SystemPrompts;