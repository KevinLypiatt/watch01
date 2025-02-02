import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";

interface WatchTableHeaderProps {
  handleSort: (column: string) => void;
}

export const WatchTableHeader = ({ handleSort }: WatchTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead onClick={() => handleSort('brand')} className="cursor-pointer hover:bg-muted/50">
          Brand
          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
        </TableHead>
        <TableHead onClick={() => handleSort('model_name')} className="cursor-pointer hover:bg-muted/50">
          Model Name
          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
        </TableHead>
        <TableHead onClick={() => handleSort('model_reference')} className="cursor-pointer hover:bg-muted/50">
          Reference
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
        <TableHead onClick={() => handleSort('description')} className="cursor-pointer hover:bg-muted/50">
          Description
          <ArrowUpDown className="ml-2 h-4 w-4 inline" />
        </TableHead>
        <TableHead className="w-[100px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};