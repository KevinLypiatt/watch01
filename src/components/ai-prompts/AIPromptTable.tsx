import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AIPromptRow } from "./AIPromptRow";

interface AIPrompt {
  id: number;
  ai_model: string;
  name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface AIPromptTableProps {
  prompts: AIPrompt[] | undefined;
  editingId: number | null;
  editedContent: string;
  onEditClick: (prompt: AIPrompt) => void;
  onDeleteClick: (id: number) => void;
  onSave: (id: number) => void;
  onEditCancel: () => void;
  onContentChange: (content: string) => void;
}

export const AIPromptTable = ({
  prompts,
  editingId,
  editedContent,
  onEditClick,
  onDeleteClick,
  onSave,
  onEditCancel,
  onContentChange,
}: AIPromptTableProps) => {
  return (
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
          {prompts?.map((prompt) => (
            <AIPromptRow
              key={prompt.id}
              prompt={prompt}
              editingId={editingId}
              editedContent={editedContent}
              onEditClick={onEditClick}
              onDeleteClick={onDeleteClick}
              onSave={onSave}
              onEditCancel={onEditCancel}
              onContentChange={onContentChange}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};