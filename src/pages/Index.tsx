import { Link } from "react-router-dom";
import { List, Database, Plus, FilePlus, BookOpen, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { exportTableToCSV } from "@/utils/csvExport";

const Index = () => {
  const { toast } = useToast();
  const [isEditingIntro, setIsEditingIntro] = useState(false);
  const [introContent, setIntroContent] = useState("");

  const { data: introGuide } = useQuery({
    queryKey: ["introGuide"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("style_guides")
        .select("content")
        .eq("id", 6)
        .maybeSingle();
      
      if (error) throw error;
      if (data) setIntroContent(data.content);
      return data;
    },
  });

  const updateIntroMutation = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase
        .from("style_guides")
        .update({ content })
        .eq("id", 6);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Introduction guide updated successfully",
      });
      setIsEditingIntro(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update introduction guide",
        variant: "destructive",
      });
      console.error("Error updating introduction guide:", error);
    },
  });

  const handleIntroSave = () => {
    updateIntroMutation.mutate(introContent);
  };

  return (
    <div className="min-h-screen bg-soft-white flex items-center justify-center">
      <div className="grid grid-cols-2 gap-6 max-w-2xl p-6">
        <Link to="/watch-list">
          <Button variant="outline" className="w-full h-32 flex flex-col items-center justify-center gap-2">
            <List className="w-8 h-8" />
            <span>View Watch List</span>
          </Button>
        </Link>
        <Link to="/reference-descriptions">
          <Button variant="outline" className="w-full h-32 flex flex-col items-center justify-center gap-2">
            <Database className="w-8 h-8" />
            <span>View Reference List</span>
          </Button>
        </Link>
        <Link to="/watches/new">
          <Button variant="outline" className="w-full h-32 flex flex-col items-center justify-center gap-2">
            <Plus className="w-8 h-8" />
            <span>Add New Watch</span>
          </Button>
        </Link>
        <Link to="/reference-descriptions/new">
          <Button variant="outline" className="w-full h-32 flex flex-col items-center justify-center gap-2">
            <FilePlus className="w-8 h-8" />
            <span>Add New Reference</span>
          </Button>
        </Link>
        <Dialog open={isEditingIntro} onOpenChange={setIsEditingIntro}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full h-32 flex flex-col items-center justify-center gap-2">
              <BookOpen className="w-8 h-8" />
              <span>Introduction and Guide</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Introduction and Guide</DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto">
              <Textarea
                value={introContent}
                onChange={(e) => setIntroContent(e.target.value)}
                className="min-h-[400px]"
              />
            </div>
            <Button onClick={handleIntroSave}>Save Changes</Button>
          </DialogContent>
        </Dialog>
        <Button
          variant="outline"
          className="w-full h-32 flex flex-col items-center justify-center gap-2"
          onClick={() => exportTableToCSV("style_guides")}
        >
          <Download className="w-8 h-8" />
          <span>Export Style Guides</span>
        </Button>
        <Button
          variant="outline"
          className="w-full h-32 flex flex-col items-center justify-center gap-2"
          onClick={() => exportTableToCSV("watches")}
        >
          <Download className="w-8 h-8" />
          <span>Export Watches</span>
        </Button>
        <Button
          variant="outline"
          className="w-full h-32 flex flex-col items-center justify-center gap-2 col-span-2"
          onClick={() => exportTableToCSV("reference_descriptions")}
        >
          <Download className="w-8 h-8" />
          <span>Export References</span>
        </Button>
      </div>
    </div>
  );
};

export default Index;