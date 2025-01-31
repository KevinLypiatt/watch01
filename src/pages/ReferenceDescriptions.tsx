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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const ReferenceDescriptions = () => {
  const navigate = useNavigate();
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
      
      // Default sorting by brand and then reference_name
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
            <Dialog open={isEditingPrompt} onOpenChange={setIsEditingPrompt}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-[#f3f3f3] hover:bg-[#e5e5e5]"
                >
                  Edit System Prompt
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit System Prompt</DialogTitle>
                </DialogHeader>
                <Textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="min-h-[200px]"
                />
                <Button onClick={handleSystemPromptSave}>Save Changes</Button>
              </DialogContent>
            </Dialog>

            <Dialog open={isEditingGuide} onOpenChange={setIsEditingGuide}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-[#f3f3f3] hover:bg-[#e5e5e5]"
                >
                  Edit Reference Style Guide
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Reference Style Guide</DialogTitle>
                </DialogHeader>
                <Textarea
                  value={styleGuide}
                  onChange={(e) => setStyleGuide(e.target.value)}
                  className="min-h-[200px]"
                />
                <Button onClick={handleStyleGuideSave}>Save Changes</Button>
              </DialogContent>
            </Dialog>

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
