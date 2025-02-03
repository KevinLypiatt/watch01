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
  activeGenerationModel,
}: AIPromptTableProps) => {
  return (
    <div className="overflow-hidden rounded-md border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {prompts.map((prompt) => (
            <tr key={prompt.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activeGenerationModel}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prompt.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {editingId === prompt.id ? (
                  <Textarea
                    value={editedContent}
                    onChange={(e) => onContentChange(e.target.value)}
                    rows={3}
                  />
                ) : (
                  prompt.content
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {editingId === prompt.id ? (
                  <>
                    <Button onClick={() => onSave(prompt.id)}>Save</Button>
                    <Button onClick={onEditCancel} variant="outline">Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => onEditClick(prompt)}>Edit</Button>
                    <Button onClick={() => onDeleteClick(prompt.id)} variant="outline" className="text-red-600">Delete</Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
