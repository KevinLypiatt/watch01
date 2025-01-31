import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const NewWatch = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<any>({});

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
      const newContent = prompt("Edit style guide:", guide.content);
      if (newContent) {
        updateStyleGuideMutation.mutate({ name, content: newContent });
      }
    }
  };

  const handleGenerateDescription = () => {
    generateDescriptionMutation.mutate(formData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createWatchMutation.mutate(formData);
  };

  return (
    <div className="container mx-auto py-10">
      <Button
        variant="ghost"
        onClick={() => navigate("/watch-list")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2" />
        Back to Watch List
      </Button>
      <h1 className="text-2xl font-bold mb-6">New Watch</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Brand</label>
            <Input
              name="brand"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Model Name</label>
            <Input
              name="model_name"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Model Reference</label>
            <Input
              name="model_reference"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Case Material</label>
            <Input
              name="case_material"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Year</label>
            <Input
              name="year"
              type="number"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Movement Type</label>
            <Input
              name="movement_type"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Listing Reference</label>
            <Input
              name="listing_reference"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Condition</label>
            <Input
              name="condition"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Additional Information</label>
          <Textarea
            name="additional_information"
            onChange={handleInputChange}
            className="min-h-[100px]"
          />
        </div>
        <div className="flex gap-4 mb-4">
          <Button
            type="button"
            onClick={() => handleStyleGuideEdit('watch_description_system_prompt')}
          >
            Edit System Prompt
          </Button>
          <Button
            type="button"
            onClick={() => handleStyleGuideEdit('watch_description_guide')}
          >
            Edit Style Guide
          </Button>
          <Button
            type="button"
            onClick={handleGenerateDescription}
          >
            Generate Description
          </Button>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            name="description"
            value={formData.description || ""}
            onChange={handleInputChange}
            className="min-h-[200px]"
          />
        </div>
        <Button type="submit">Save New Watch</Button>
      </form>
    </div>
  );
};

export default NewWatch;