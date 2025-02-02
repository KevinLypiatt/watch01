import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Home } from "lucide-react";
import { ReferenceDescriptionForm } from "@/components/reference-descriptions/ReferenceDescriptionForm";

const NewReferenceDescription = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [brand, setBrand] = useState("");
  const [referenceName, setReferenceName] = useState("");
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const createMutation = useMutation({
    mutationFn: async () => {
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
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create reference description",
        variant: "destructive",
      });
      console.error("Error creating reference description:", error);
    },
  });

  const generateDescriptionMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('generate-reference-descriptions', {
        body: { 
          referenceId: null,
          brand,
          reference_name: referenceName
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
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="hover:text-primary">
          <Home className="w-6 h-6" />
        </Link>
        <Link to="/reference-descriptions" className="text-primary hover:underline">
          To Reference List
        </Link>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Reference Description</h1>
        <p className="text-muted-foreground">Create a new reference description</p>
      </div>
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
  );
};

export default NewReferenceDescription;
