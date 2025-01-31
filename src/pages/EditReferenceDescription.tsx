import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save } from "lucide-react";

const EditReferenceDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    brand: "",
    reference_name: "",
    reference_description: "",
  });

  const { isLoading } = useQuery({
    queryKey: ["reference", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reference_descriptions")
        .select("*")
        .eq("reference_id", id)
        .single();

      if (error) {
        console.error("Error fetching reference:", error);
        throw error;
      }

      if (data) {
        setFormData({
          brand: data.brand || "",
          reference_name: data.reference_name || "",
          reference_description: data.reference_description || "",
        });
      }

      return data;
    },
  });

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("reference_descriptions")
        .update(formData)
        .eq("reference_id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reference description updated successfully",
      });

      navigate("/reference-descriptions");
    } catch (error) {
      console.error("Error updating reference:", error);
      toast({
        title: "Error",
        description: "Failed to update reference description",
        variant: "destructive",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/reference-descriptions")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Edit Reference Description</h1>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Brand</label>
            <Input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Enter brand name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Reference Name</label>
            <Input
              name="reference_name"
              value={formData.reference_name}
              onChange={handleChange}
              placeholder="Enter reference name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              name="reference_description"
              value={formData.reference_description}
              onChange={handleChange}
              placeholder="Enter reference description"
              className="min-h-[150px]"
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditReferenceDescription;