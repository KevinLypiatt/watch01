
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AIPrompt } from "@/types/ai-prompt";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface AIPromptTableProps {
  prompts: AIPrompt[];
  editingId: number | null;
  editedContent: string;
  onEditClick: (prompt: AIPrompt) => void;
  onDeleteClick: (id: number) => void;
  onSave: (id: number) => Promise<void>;
  onEditCancel: () => void;
  onContentChange: (value: string) => void;
  activeGenerationModel: string;
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
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Model</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Content</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prompts.map((prompt) => (
            <TableRow key={prompt.id} className="h-24">
              <TableCell className="align-top">{prompt.ai_model}</TableCell>
              <TableCell className="align-top">{prompt.purpose}</TableCell>
              <TableCell className="align-top">{prompt.name}</TableCell>
              <TableCell className="align-top">
                {editingId === prompt.id ? (
                  <div className="flex flex-col gap-2">
                    <Textarea
                      value={editedContent}
                      onChange={(e) => onContentChange(e.target.value)}
                      className="min-h-[120px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => onSave(prompt.id)}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={onEditCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{prompt.content}</div>
                )}
              </TableCell>
              <TableCell className="align-top">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditClick(prompt)}
                    disabled={editingId !== null}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteClick(prompt.id)}
                    disabled={editingId !== null}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
