
import { useState, useEffect } from "react";
import { PageHeaderWithModel } from "@/components/shared/PageHeaderWithModel";
import { WatchListHeader } from "@/components/watch-list/WatchListHeader";
import { WatchListTable } from "@/components/watch-list/WatchListTable";
import { WatchListFilters } from "@/components/watch-list/WatchListFilters";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const WatchList = () => {
  const [sortColumn, setSortColumn] = useState<string>('brand');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [brandInput, setBrandInput] = useState('');
  const [modelInput, setModelInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    brand: '',
    model: '',
    search: ''
  });
  const [activeGenerationModel, setActiveGenerationModel] = useState<string>(() => {
    const saved = localStorage.getItem("activeGenerationModel");
    return saved || "claude-3-opus-20240229";
  });

  useEffect(() => {
    localStorage.setItem("activeGenerationModel", activeGenerationModel);
  }, [activeGenerationModel]);

  const { data: watches = [], refetch } = useQuery({
    queryKey: ['watches', sortColumn, sortDirection, activeFilters.brand, activeFilters.model, activeFilters.search],
    queryFn: async () => {
      let query = supabase
        .from('watches')
        .select('*')
        .order(sortColumn, { ascending: sortDirection === 'asc' });

      if (activeFilters.brand) {
        query = query.ilike('brand', `%${activeFilters.brand}%`);
      }
      if (activeFilters.model) {
        query = query.ilike('model_reference', `%${activeFilters.model}%`);
      }
      if (activeFilters.search) {
        query = query.or(`brand.ilike.%${activeFilters.search}%,model_name.ilike.%${activeFilters.search}%,model_reference.ilike.%${activeFilters.search}%,description.ilike.%${activeFilters.search}%`);
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
      .from('watches')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting watch:', error);
      return;
    }

    refetch();
  };

  const handleSearch = () => {
    setActiveFilters({
      brand: brandInput,
      model: modelInput,
      search: searchInput
    });
  };

  return (
    <div className="container mx-auto py-8">
      <PageHeaderWithModel 
        activeModel={activeGenerationModel}
        title="Watch List" 
      />
      <div className="pt-16">
        <WatchListHeader />
        <WatchListFilters
          brandInput={brandInput}
          modelInput={modelInput}
          searchInput={searchInput}
          setBrandInput={setBrandInput}
          setModelInput={setModelInput}
          setSearchInput={setSearchInput}
          handleSearch={handleSearch}
        />
        <WatchListTable 
          watches={watches}
          handleSort={handleSort}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default WatchList;
