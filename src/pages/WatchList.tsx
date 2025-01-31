import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { WatchListHeader } from "@/components/watch-list/WatchListHeader";
import { WatchListFilters } from "@/components/watch-list/WatchListFilters";
import { WatchListTable } from "@/components/watch-list/WatchListTable";

const WatchList = () => {
  const [searchInput, setSearchInput] = useState("");
  const [brandInput, setBrandInput] = useState("");
  const [modelInput, setModelInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [sortColumn, setSortColumn] = useState<string>("brand");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const { data: watches, isLoading } = useQuery({
    queryKey: ["watches", searchTerm, brandFilter, modelFilter, sortColumn, sortDirection],
    queryFn: async () => {
      let query = supabase.from("watches").select("*");

      if (brandFilter) {
        query = query.ilike("brand", `%${brandFilter}%`);
      }
      if (modelFilter) {
        query = query.ilike("model_reference", `%${modelFilter}%`);
      }
      if (searchTerm) {
        query = query.or(
          `brand.ilike.%${searchTerm}%,model_name.ilike.%${searchTerm}%,model_reference.ilike.%${searchTerm}%`
        );
      }

      query = query.order('brand', { ascending: true }).order('model_reference', { ascending: true });
      
      if (sortColumn) {
        query = query.order(sortColumn, { ascending: sortDirection === 'asc' });
      }

      const { data, error } = await query;
      if (error) throw error;
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
    setModelFilter(modelInput);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading watches...</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader />
      <div className="container mx-auto py-20">
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
          watches={watches || []}
          handleSort={handleSort}
        />
      </div>
    </div>
  );
};

export default WatchList;