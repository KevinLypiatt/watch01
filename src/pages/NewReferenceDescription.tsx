import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/PageHeader";

const NewReferenceDescription = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [brand, setBrand] = useState("");
  const [referenceName, setReferenceName] = useState("");
  const [description, setDescription] = useState("");

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Add New Reference Description"
        description="Create a new reference description"
      />
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label htmlFor="brand" className="block text-sm font-medium mb-1">
            Brand
          </label>
          <Input
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="referenceName" className="block text-sm font-medium mb-1">
            Reference Name
          </label>
          <Input
            id="referenceName"
            value={referenceName}
            onChange={(e) => setReferenceName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[200px]"
            required
          />
        </div>
        <div className="flex gap-4">
          <Button type="submit">Create Reference Description</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/reference-descriptions")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewReferenceDescription;