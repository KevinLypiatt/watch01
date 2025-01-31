import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { WatchForm } from "@/components/watch/WatchForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const NewWatch = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<any>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPromptDialogOpen, setIsPromptDialogOpen] = useState(false);
  const [isGuideDialogOpen, setIsGuideDialogOpen] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [guideText, setGuideText] = useState("");

  const { data: styleGuides, isLoading: loadingGuides } = useQuery({
    queryKey: ["styleGuides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("style_guides")
        .select("*")
        .in("name", ["watch_description_system_prompt", "watch_description_guide"]);

      if (error) throw error;
      return data;
    },
  });

  const updateStyleGuideMutation = useMutation({
    mutationFn: async ({ name, content }: { name: string; content: string }) => {
      const { error } = await supabase
        .from("style_guides")
        .update({ content })
        .eq("name", name);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Style guide updated successfully",
      });
      setIsPromptDialogOpen(false);
      setIsGuideDialogOpen(false);
    },
  });

  const generateDescriptionMutation = useMutation({
    mutationFn: async (watchData: any) => {
      const response = await supabase.functions.invoke('generate-watch-description', {
        body: { watchData },
      });
      
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data) => {
      setFormData(prev => ({
        ...prev,
        description: data.description,
      }));
      toast({
        title: "Success",
        description: "Description generated successfully",
      });
      setIsGenerating(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate description",
        variant: "destructive",
      });
      setIsGenerating(false);
    },
  });

  const createWatchMutation = useMutation({
    mutationFn: async (newWatch: any) => {
      const { error } = await supabase
        .from("watches")
        .insert([newWatch]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Watch created successfully",
      });
      navigate("/watch-list");
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleStyleGuideEdit = (name: string) => {
    const guide = styleGuides?.find(g => g.name === name);
    if (guide) {
      if (name === 'watch_description_system_prompt') {
        setPromptText(guide.content);
        setIsPromptDialogOpen(true);
      } else {
        setGuideText(guide.content);
        setIsGuideDialogOpen(true);
      }
    }
  };

  const handleGenerateDescription = () => {
    setIsGenerating(true);
    generateDescriptionMutation.mutate(formData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createWatchMutation.mutate(formData);
  };

  return (
    <div>
      <PageHeader />
      <div className="container mx-auto py-20">
        <Button
          variant="ghost"
          onClick={() => navigate("/watch-list")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2" />
          Back to Watch List
        </Button>
        <h1 className="text-2xl font-bold mb-6">New Watch</h1>
        
        <WatchForm 
          formData={formData}
          handleInputChange={handleInputChange}
          handleGenerateDescription={handleGenerateDescription}
          handleStyleGuideEdit={handleStyleGuideEdit}
          isGenerating={isGenerating}
          handleSubmit={handleSubmit}
        />

        <Dialog open={isPromptDialogOpen} onOpenChange={setIsPromptDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit System Prompt</DialogTitle>
            </DialogHeader>
            <Textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="min-h-[300px]"
            />
            <DialogFooter>
              <Button onClick={() => setIsPromptDialogOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={() => updateStyleGuideMutation.mutate({
                  name: 'watch_description_system_prompt',
                  content: promptText
                })}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isGuideDialogOpen} onOpenChange={setIsGuideDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Style Guide</DialogTitle>
            </DialogHeader>
            <Textarea
              value={guideText}
              onChange={(e) => setGuideText(e.target.value)}
              className="min-h-[300px]"
            />
            <DialogFooter>
              <Button onClick={() => setIsGuideDialogOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button
                onClick={() => updateStyleGuideMutation.mutate({
                  name: 'watch_description_guide',
                  content: guideText
                })}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default NewWatch;