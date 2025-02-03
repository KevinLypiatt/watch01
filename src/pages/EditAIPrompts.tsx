import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DeletePromptDialog } from "@/components/ai-prompts/DeletePromptDialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportTableToCSV } from "@/utils/csvExport";
import { AIPromptFilter } from "@/components/ai-prompts/AIPromptFilter";
import { AIPromptTable } from "@/components/ai-prompts/AIPromptTable";

interface AIPrompt {
  id: number;
  ai_model: string;
  name: string;
  content: string;
  created_at: string;
  updated_at: string;
  purpose: string;
}

export const EditAIPrompts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPromptId, setSelectedPromptId] = useState<number | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>("");

  const { data: aiPrompts, isLoading } = useQuery({
    queryKey: ["aiPrompts", selectedModel],
    queryFn: async () => {
      let query = supabase
        .from("ai_prompts")
        .select("*")
        .order("id");
      
      if (selectedModel) {
        query = query.eq("ai_model", selectedModel);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as AIPrompt[];
    },
  });

  const { data: uniqueModels } = useQuery({
    queryKey: ["uniqueAiModels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_prompts")
        .select("ai_model");
      
      if (error) throw error;
      
      const uniqueModelsSet = new Set(data.map(item => item.ai_model));
      return Array.from(uniqueModelsSet);
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
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit AI Prompts</h1>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => exportTableToCSV("ai_prompts")}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <AIPromptFilter
        selectedModel={selectedModel}
        uniqueModels={uniqueModels}
        onModelChange={setSelectedModel}
      />

      <AIPromptTable
        prompts={aiPrompts}
        editingId={editingId}
        editedContent={editedContent}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        onSave={handleSave}
        onEditCancel={() => setEditingId(null)}
        onContentChange={setEditedContent}
      />

      <DeletePromptDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};