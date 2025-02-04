
import { useState, useEffect } from "react";
import { PageHeaderWithModel } from "@/components/shared/PageHeaderWithModel";
import { ReferenceDescriptionHeader } from "@/components/reference-descriptions/ReferenceDescriptionHeader";
import { ReferenceDescriptionTable } from "@/components/reference-descriptions/ReferenceDescriptionTable";
import { ReferenceDescriptionFilters } from "@/components/reference-descriptions/ReferenceDescriptionFilters";
import { useGenerateDescriptions } from "@/hooks/useGenerateDescriptions";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const ReferenceDescriptions = () => {
  const [sortColumn, setSortColumn] = useState<string>('brand');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [brandInput, setBrandInput] = useState('');
  const [referenceInput, setReferenceInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    brand: '',
    reference: '',
    search: ''
  });
  const [activeGenerationModel, setActiveGenerationModel] = useState<string>(() => {
    const saved = localStorage.getItem("activeGenerationModel");
    return saved || "claude-3-opus-20240229";
  });

  useEffect(() => {
    localStorage.setItem("activeGenerationModel", activeGenerationModel);
  }, [activeGenerationModel]);

  const { data: references = [], refetch } = useQuery({
    queryKey: ['references', sortColumn, sortDirection, activeFilters.brand, activeFilters.reference, activeFilters.search],
    queryFn: async () => {
      let query = supabase
        .from('reference_descriptions')
        .select('*')
        .order(sortColumn, { ascending: sortDirection === 'asc' });
      
      if (activeFilters.brand) {
        query = query.ilike('brand', `%${activeFilters.brand}%`);
      }
      if (activeFilters.reference) {
        query = query.ilike('reference_name', `%${activeFilters.reference}%`);
      }
      if (activeFilters.search) {
        query = query.or(`brand.ilike.%${activeFilters.search}%,reference_name.ilike.%${activeFilters.search}%,reference_description.ilike.%${activeFilters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from('reference_descriptions')
      .delete()
      .eq('reference_id', id);

    if (error) {
      console.error('Error deleting reference:', error);
      return;
    }

    refetch();
  };

  const handleSearch = () => {
    setActiveFilters({
      brand: brandInput,
      reference: referenceInput,
      search: searchInput
    });
  };

  const generateMutation = useGenerateDescriptions();

  return (
    <div className="container mx-auto py-8">
      <PageHeaderWithModel 
        activeModel={activeGenerationModel}
        title="Reference Descriptions" 
      />
      <div className="pt-16">
        <ReferenceDescriptionHeader
          isGenerating={generateMutation.isPending}
          handleGenerateAll={() => generateMutation.mutate()}
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
          references={references}
          handleSort={handleSort}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default ReferenceDescriptions;
