import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { ReferenceDescriptionHeader } from "@/components/reference-descriptions/ReferenceDescriptionHeader";
import { ReferenceDescriptionFilters } from "@/components/reference-descriptions/ReferenceDescriptionFilters";
import { ReferenceDescriptionTable } from "@/components/reference-descriptions/ReferenceDescriptionTable";

const ReferenceDescriptions = () => {
  const { toast } = useToast();
  const [searchInput, setSearchInput] = useState("");
  const [brandInput, setBrandInput] = useState("");
  const [referenceInput, setReferenceInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [referenceFilter, setReferenceFilter] = useState("");
  const [sortColumn, setSortColumn] = useState<string>("brand");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isGenerating, setIsGenerating] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [styleGuide, setStyleGuide] = useState("");
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [isEditingGuide, setIsEditingGuide] = useState(false);

  const { data: references, isLoading } = useQuery({
    queryKey: ["references", brandFilter, referenceFilter, searchTerm, sortColumn, sortDirection],
    queryFn: async () => {
      let query = supabase.from("reference_descriptions").select("*");

      if (brandFilter) {
        query = query.ilike("brand", `%${brandFilter}%`);
      }
      if (referenceFilter) {
        query = query.ilike("reference_name", `%${referenceFilter}%`);
      }
      if (searchTerm) {
        query = query.or(
          `brand.ilike.%${searchTerm}%,reference_name.ilike.%${searchTerm}%,reference_description.ilike.%${searchTerm}%`
        );
      }
      
      query = query.order('brand', { ascending: true }).order('reference_name', { ascending: true });
      
      if (sortColumn) {
        query = query.order(sortColumn, { ascending: sortDirection === 'asc' });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const { data: styleGuides } = useQuery({
    queryKey: ["styleGuides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("style_guides")
        .select("*");
      if (error) throw error;
      return data || [];
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
      setIsEditingPrompt(false);
      setIsEditingGuide(false);
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

  const generateMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('generate-reference-descriptions', {
        body: { generateAll: true },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Reference descriptions generated successfully",
      });
      setIsGenerating(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate reference descriptions",
        variant: "destructive",
      });
      console.error("Error generating descriptions:", error);
      setIsGenerating(false);
    },
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleSystemPromptSave = () => {
    updateStyleGuideMutation.mutate({
      name: "reference_description_system_prompt",
      content: systemPrompt,
    });
  };

  const handleStyleGuideSave = () => {
    updateStyleGuideMutation.mutate({
      name: "reference_description_guide",
      content: styleGuide,
    });
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setBrandFilter(brandInput);
    setReferenceFilter(referenceInput);
  };

  const handleGenerateAll = () => {
    setIsGenerating(true);
    generateMutation.mutate();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div>
      <PageHeader />
      <div className="container mx-auto py-20">
        <ReferenceDescriptionHeader
          isGenerating={isGenerating}
          isEditingPrompt={isEditingPrompt}
          isEditingGuide={isEditingGuide}
          systemPrompt={systemPrompt}
          styleGuide={styleGuide}
          setIsEditingPrompt={setIsEditingPrompt}
          setIsEditingGuide={setIsEditingGuide}
          setSystemPrompt={setSystemPrompt}
          setStyleGuide={setStyleGuide}
          handleSystemPromptSave={handleSystemPromptSave}
          handleStyleGuideSave={handleStyleGuideSave}
          handleGenerateAll={handleGenerateAll}
        />

        <ReferenceDescriptionFilters
          brandInput={brandInput}
          referenceInput={referenceInput}
          searchInput={searchInput}
          setBrandInput={setBrandInput}
          setReferenceInput={setReferenceInput}
          setSearchInput={setSearchInput}
          handleSearch={handleSearch}
        />

        <ReferenceDescriptionTable
          references={references || []}
          handleSort={handleSort}
        />
      </div>
    </div>
  );
};

export default ReferenceDescriptions;