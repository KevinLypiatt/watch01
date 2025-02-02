import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, Download, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StyleGuideSectionProps {
  title: string;
  content: string;
  isEditing: boolean;
  setContent: (content: string) => void;
  handleSave: () => void;
  setIsEditing: (isEditing: boolean) => void;
}

export const StyleGuideSection = ({
  title,
  content,
  isEditing,
  setContent,
  handleSave,
  setIsEditing,
}: StyleGuideSectionProps) => {
  const { toast } = useToast();

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Success",
        description: "Content copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDownload}
            className="bg-[#f3f3f3] hover:bg-[#e5e5e5]"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            onClick={handleCopy}
            className="bg-[#f3f3f3] hover:bg-[#e5e5e5]"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button
            variant="outline"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="bg-[#f3f3f3] hover:bg-[#e5e5e5]"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        </div>
      </div>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[200px]"
        disabled={!isEditing}
      />
    </div>
  );
};