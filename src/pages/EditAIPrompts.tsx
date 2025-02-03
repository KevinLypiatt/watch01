import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { AIPromptRow } from "@/components/ai-prompts/AIPromptRow";
import { DeletePromptDialog } from "@/components/ai-prompts/DeletePromptDialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportTableToCSV } from "@/utils/csvExport";

interface AIPrompt {
  id: number;
  ai_model: string | null;
  name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const EditAIPrompts = () => {
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">AI Model</TableHead>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Content</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {aiPrompts?.map((prompt) => (
              <AIPromptRow
                key={prompt.id}
                prompt={prompt}
                editingId={editingId}
                editedContent={editedContent}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
                onSave={handleSave}
                onEditCancel={() => setEditingId(null)}
                onContentChange={setEditedContent}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <DeletePromptDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};