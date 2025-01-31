import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, ArrowUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Watch {
  id: number;
  brand: string;
  model_reference: string;
  model_name: string;
  case_material: string;
  year: number;
  movement_type: string;
  condition: string;
}

interface WatchListTableProps {
  watches: Watch[];
  handleSort: (column: string) => void;
}

export const WatchListTable = ({
  watches,
  handleSort,
}: WatchListTableProps) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead onClick={() => handleSort('brand')} className="cursor-pointer hover:bg-muted/50">
              Brand
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead onClick={() => handleSort('model_reference')} className="cursor-pointer hover:bg-muted/50">
              Model Reference
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead onClick={() => handleSort('model_name')} className="cursor-pointer hover:bg-muted/50">
              Model Name
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead onClick={() => handleSort('case_material')} className="cursor-pointer hover:bg-muted/50">
              Case Material
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead onClick={() => handleSort('year')} className="cursor-pointer hover:bg-muted/50">
              Year
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead onClick={() => handleSort('movement_type')} className="cursor-pointer hover:bg-muted/50">
              Movement Type
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead onClick={() => handleSort('condition')} className="cursor-pointer hover:bg-muted/50">
              Condition
              <ArrowUpDown className="ml-2 h-4 w-4 inline" />
            </TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {watches && watches.length > 0 ? (
            watches.map((watch) => (
              <TableRow key={watch.id}>
                <TableCell>{watch.brand || "-"}</TableCell>
                <TableCell>{watch.model_reference || "-"}</TableCell>
                <TableCell>{watch.model_name || "-"}</TableCell>
                <TableCell>{watch.case_material || "-"}</TableCell>
                <TableCell>{watch.year || "-"}</TableCell>
                <TableCell>{watch.movement_type || "-"}</TableCell>
                <TableCell>{watch.condition || "-"}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/watches/${watch.id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                No watches found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};