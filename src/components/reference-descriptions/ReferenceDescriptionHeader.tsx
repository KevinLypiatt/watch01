import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface ReferenceDescriptionHeaderProps {
  isGenerating: boolean;
  isEditingPrompt: boolean;
  isEditingGuide: boolean;
  systemPrompt: string;
  styleGuide: string;
  setIsEditingPrompt: (value: boolean) => void;
  setIsEditingGuide: (value: boolean) => void;
  setSystemPrompt: (value: string) => void;
  setStyleGuide: (value: string) => void;
  handleSystemPromptSave: () => void;
  handleStyleGuideSave: () => void;
  handleGenerateAll: () => void;
}

export const ReferenceDescriptionHeader = ({
  isGenerating,
  isEditingPrompt,
  isEditingGuide,
  systemPrompt,
  styleGuide,
  setIsEditingPrompt,
  setIsEditingGuide,
  setSystemPrompt,
  setStyleGuide,
  handleSystemPromptSave,
  handleStyleGuideSave,
  handleGenerateAll,
}: ReferenceDescriptionHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reference Descriptions</h1>
      </div>
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          className="bg-[#f3f3f3] hover:bg-[#e5e5e5]"
          onClick={handleGenerateAll}
          disabled={isGenerating}
        >
          {isGenerating ? "Working..." : "Generate Reference Descriptions"}
        </Button>
        <Button onClick={() => navigate("/reference-descriptions/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Description
        </Button>
      </div>
      <div className="flex justify-end gap-4">
        <Dialog open={isEditingPrompt} onOpenChange={setIsEditingPrompt}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-[#f3f3f3] hover:bg-[#e5e5e5]"
            >
              Edit System Prompt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit System Prompt</DialogTitle>
            </DialogHeader>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="min-h-[200px]"
            />
            <Button onClick={handleSystemPromptSave}>Save Changes</Button>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditingGuide} onOpenChange={setIsEditingGuide}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-[#f3f3f3] hover:bg-[#e5e5e5]"
            >
              Edit Style Guide
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Style Guide</DialogTitle>
            </DialogHeader>
            <Textarea
              value={styleGuide}
              onChange={(e) => setStyleGuide(e.target.value)}
              className="min-h-[200px]"
            />
            <Button onClick={handleStyleGuideSave}>Save Changes</Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};