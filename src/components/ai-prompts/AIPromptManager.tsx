
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AIPromptTable } from "./AIPromptTable";
import { DeletePromptDialog } from "./DeletePromptDialog";
import { AIPrompt } from "@/types/ai-prompt";

interface AIPromptManagerProps {
  activeGenerationModel: string;
}

export const AIPromptManager = ({ activeGenerationModel }: AIPromptManagerProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPromptId, setSelectedPromptId] = useState<number | null>(null);

  const { data: aiPrompts, isLoading } = useQuery({
    queryKey: ["aiPrompts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_prompts")
        .select("*")
        .order("id");
      
      if (error) throw error;
      return data as AIPrompt[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) => {
      const { data, error } = await supabase
        .from("ai_prompts")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiPrompts"] });
      toast({
        title: "Success",
        description: "AI prompt updated successfully",
      });
      setEditingId(null);
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: "Failed to update AI prompt",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("ai_prompts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiPrompts"] });
      toast({
        title: "Success",
        description: "AI prompt deleted successfully",
      });
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete AI prompt",
        variant: "destructive",
      });
    },
  });

  const handleEditClick = (prompt: AIPrompt) => {
    setEditingId(prompt.id);
    setEditedContent(prompt.content);
  };

  const handleSave = async (id: number) => {
    await updateMutation.mutate({ id, content: editedContent });
  };

  const handleDeleteClick = (id: number) => {
    setSelectedPromptId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedPromptId) {
      await deleteMutation.mutate(selectedPromptId);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <AIPromptTable
        prompts={aiPrompts || []}
        editingId={editingId}
        editedContent={editedContent}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        onSave={handleSave}
        onEditCancel={() => setEditingId(null)}
        onContentChange={setEditedContent}
        activeGenerationModel={activeGenerationModel}
      />

      <DeletePromptDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

