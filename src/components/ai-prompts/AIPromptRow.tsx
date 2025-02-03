import React from 'react';
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Trash } from "lucide-react";

interface AIPrompt {
  id: number;
  ai_model: string | null;
  name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface AIPromptRowProps {
  prompt: AIPrompt;
  editingId: number | null;
  editedContent: string;
  onEditClick: (prompt: AIPrompt) => void;
  onDeleteClick: (id: number) => void;
  onSave: (id: number) => void;
  onEditCancel: () => void;
  onContentChange: (content: string) => void;
}

export const AIPromptRow = ({
  prompt,
  editingId,
  editedContent,
  onEditClick,
  onDeleteClick,
  onSave,
  onEditCancel,
  onContentChange,
}: AIPromptRowProps) => {
  return (
    <TableRow key={prompt.id}>
      <TableCell className="align-top">{prompt.ai_model}</TableCell>
      <TableCell className="align-top">{prompt.name}</TableCell>
      <TableCell>
        {editingId === prompt.id ? (
          <div className="flex flex-col gap-2">
            <Textarea
              value={editedContent}
              onChange={(e) => onContentChange(e.target.value)}
              className="min-h-[200px]"
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
          <div className="whitespace-pre-wrap max-h-[160px] overflow-y-auto">
            {prompt.content}
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEditClick(prompt)}
            disabled={editingId !== null}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDeleteClick(prompt.id)}
            disabled={editingId !== null}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};