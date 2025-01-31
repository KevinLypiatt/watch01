import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { ReferenceDescriptionHeader } from "@/components/reference-descriptions/ReferenceDescriptionHeader";
import { ReferenceDescriptionFilters } from "@/components/reference-descriptions/ReferenceDescriptionFilters";
import { ReferenceDescriptionTable } from "@/components/reference-descriptions/ReferenceDescriptionTable";
import { useGenerateDescriptions } from "@/hooks/useGenerateDescriptions";

const ReferenceDescriptions = () => {
  const [searchInput, setSearchInput] = useState("");
  const [brandInput, setBrandInput] = useState("");
  const [referenceInput, setReferenceInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [referenceFilter, setReferenceFilter] = useState("");
  const [sortColumn, setSortColumn] = useState<string>("brand");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [isEditingGuide, setIsEditingGuide] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [styleGuide, setStyleGuide] = useState("");

  const generateMutation = useGenerateDescriptions();

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
      
      query = query.order(sortColumn, { ascending: sortDirection === 'asc' });

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
        .select("*")
        .in("id", [4, 5]);
      if (error) throw error;
      
      const systemPromptGuide = data?.find(guide => guide.id === 5);
      const styleGuideContent = data?.find(guide => guide.id === 4);
      
      if (systemPromptGuide) setSystemPrompt(systemPromptGuide.content);
      if (styleGuideContent) setStyleGuide(styleGuideContent.content);
      
      return data || [];
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

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setBrandFilter(brandInput);
    setReferenceFilter(referenceInput);
  };

  const handleGenerateAll = () => {
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
          isGenerating={generateMutation.isPending}
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