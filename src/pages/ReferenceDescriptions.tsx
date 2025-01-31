import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Edit, Plus, ArrowUpDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { useToast } from "@/hooks/use-toast";

const ReferenceDescriptions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchInput, setSearchInput] = useState("");
  const [brandInput, setBrandInput] = useState("");
  const [referenceInput, setReferenceInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [referenceFilter, setReferenceFilter] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isGenerating, setIsGenerating] = useState(false);

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
      if (sortColumn) {
        query = query.order(sortColumn, { ascending: sortDirection === 'asc' });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Reference Descriptions</h1>
          <div className="space-x-4">
            <Button
              variant="outline"
              className="bg-[#f3f3f3] hover:bg-[#e5e5e5]"
              onClick={handleGenerateAll}
              disabled={isGenerating}
            >
              {isGenerating ? "Working..." : "Generate Reference Descriptions"}
            </Button>
            <Button onClick={() => navigate("/reference-descriptions/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Description
            </Button>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex gap-4">
            <Input
              placeholder="Filter by brand..."
              value={brandInput}
              onChange={(e) => setBrandInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="max-w-xs"
            />
            <Input
              placeholder="Filter by reference..."
              value={referenceInput}
              onChange={(e) => setReferenceInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="max-w-xs"
            />
            <Input
              placeholder="Search all fields..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="max-w-md"
            />
            <Button 
              onClick={handleSearch}
              variant="outline"
              className="bg-[#f3f3f3] hover:bg-[#e5e5e5]"
            >
              Apply
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort('brand')} className="cursor-pointer hover:bg-muted/50">
                  Brand
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead onClick={() => handleSort('reference_name')} className="cursor-pointer hover:bg-muted/50">
                  Reference Name
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead onClick={() => handleSort('reference_description')} className="cursor-pointer hover:bg-muted/50">
                  Description
                  <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {references && references.length > 0 ? (
                references.map((reference) => (
                  <TableRow key={reference.reference_id}>
                    <TableCell>{reference.brand || "-"}</TableCell>
                    <TableCell>{reference.reference_name || "-"}</TableCell>
                    <TableCell>{reference.reference_description || "-"}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/reference-descriptions/${reference.reference_id}`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No references found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ReferenceDescriptions;