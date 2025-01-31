import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const WatchList = () => {
  const { data: watches, isLoading } = useQuery({
    queryKey: ["watches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("watches")
        .select("brand, model_reference, model_name");

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading watches...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Watch List</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>Model Reference</TableHead>
              <TableHead>Model Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {watches?.map((watch, index) => (
              <TableRow key={index}>
                <TableCell>{watch.brand || "-"}</TableCell>
                <TableCell>{watch.model_reference || "-"}</TableCell>
                <TableCell>{watch.model_name || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default WatchList;