import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, Download, Copy, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const StyleGuides = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditingWatch, setIsEditingWatch] = useState(false);
  const [isEditingReference, setIsEditingReference] = useState(false);
  const [watchGuide, setWatchGuide] = useState("");
  const [referenceGuide, setReferenceGuide] = useState("");

  const { data: guides } = useQuery({
    queryKey: ["styleGuides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("style_guides")
        .select("*")
        .in("id", [1, 4]);
      
      if (error) throw error;
      
      if (data) {
        const watchGuideData = data.find(guide => guide.id === 1);
        const referenceGuideData = data.find(guide => guide.id === 4);
        setWatchGuide(watchGuideData?.content || "");
        setReferenceGuide(referenceGuideData?.content || "");
      }
      return data;
    },
  });

  const updateGuideMutation = useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) => {
      const { error } = await supabase
        .from("style_guides")
        .update({ content, updated_at: new Date().toISOString() })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["styleGuides"] });
      toast({
        title: "Success",
        description: "Style guide updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update style guide",
        variant: "destructive",
      });
      console.error("Error updating style guide:", error);
    },
  });

  const handleWatchGuideSave = () => {
    updateGuideMutation.mutate({ id: 1, content: watchGuide });
    setIsEditingWatch(false);
  };

  const handleReferenceGuideSave = () => {
    updateGuideMutation.mutate({ id: 4, content: referenceGuide });
    setIsEditingReference(false);
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async (content: string) => {
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
    <div className="container mx-auto p-6 space-y-8">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link to="/" className="inline-flex items-center text-gray-700 hover:text-gray-900">
            <Home className="w-6 h-6" />
          </Link>
        </div>
      </div>
      
      <div className="pt-16">
        <h1 className="text-2xl font-bold mb-6">Style Guides</h1>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Watch Description Style Guide</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDownload(watchGuide, 'watch-style-guide.txt')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCopy(watchGuide)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  onClick={() => isEditingWatch ? handleWatchGuideSave() : setIsEditingWatch(true)}
                >
                  {isEditingWatch ? (
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
              value={watchGuide}
              onChange={(e) => setWatchGuide(e.target.value)}
              className="min-h-[200px]"
              disabled={!isEditingWatch}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Reference Description Style Guide</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDownload(referenceGuide, 'reference-style-guide.txt')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCopy(referenceGuide)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  onClick={() => isEditingReference ? handleReferenceGuideSave() : setIsEditingReference(true)}
                >
                  {isEditingReference ? (
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
              value={referenceGuide}
              onChange={(e) => setReferenceGuide(e.target.value)}
              className="min-h-[200px]"
              disabled={!isEditingReference}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleGuides;