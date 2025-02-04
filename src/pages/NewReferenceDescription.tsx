
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ReferenceDescriptionForm } from "@/components/reference-descriptions/ReferenceDescriptionForm";
import { PageHeaderWithModel } from "@/components/shared/PageHeaderWithModel";
import { ArrowLeft } from "lucide-react";

const NewReferenceDescription = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [brand, setBrand] = useState("");
  const [referenceName, setReferenceName] = useState("");
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeGenerationModel, setActiveGenerationModel] = useState<string>(() => {
    const saved = localStorage.getItem("activeGenerationModel");
    return saved || "claude-3-opus-20240229";
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      // First check if a record with the same brand and reference name exists
      const { data: existingReference } = await supabase
        .from("reference_descriptions")
        .select("reference_id")
        .eq("brand", brand)
        .eq("reference_name", referenceName)
        .single();

      if (existingReference) {
        throw new Error("A reference with this brand and reference name already exists");
      }

      const { error } = await supabase
        .from("reference_descriptions")
        .insert([
          {
            brand,
            reference_name: referenceName,
            reference_description: description,
          },
        ]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Reference description created successfully",
      });
      navigate("/reference-descriptions");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create reference description",
        variant: "destructive",
      });
      console.error("Error creating reference description:", error);
    },
  });

  const generateDescriptionMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('generate-reference-descriptions', {
        body: { 
          brand,
          reference_name: referenceName,
          activeModel: activeGenerationModel
        }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setDescription(data.description);
      toast({
        title: "Success",
        description: "Generation finished...",
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
      console.error("Error generating description:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  const handleGenerateDescription = () => {
    setIsGenerating(true);
    generateDescriptionMutation.mutate();
  };

  return (
    <div>
      <PageHeaderWithModel 
        activeModel={activeGenerationModel} 
        title="New Reference Description" 
      />
      <div className="container mx-auto py-20">
        <Button
          variant="ghost"
          onClick={() => navigate("/reference-descriptions")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2" />
          Back to References
        </Button>
        <ReferenceDescriptionForm
          brand={brand}
          referenceName={referenceName}
          description={description}
          isGenerating={isGenerating}
          handleBrandChange={(e) => setBrand(e.target.value)}
          handleReferenceNameChange={(e) => setReferenceName(e.target.value)}
          handleDescriptionChange={(e) => setDescription(e.target.value)}
          handleSubmit={handleSubmit}
          handleGenerateDescription={handleGenerateDescription}
        />
      </div>
    </div>
  );
};

export default NewReferenceDescription;
