import { TableCell, TableRow } from "@/components/ui/table";
import { Check } from "lucide-react";
import { WatchTableActions } from "./WatchTableActions";

interface Watch {
  id: number;
  brand: string;
  model_name: string;
  model_reference: string;
  case_material: string;
  year: number;
  description: string;
}

interface WatchTableRowProps {
  watch: Watch;
  onDeleteClick: (id: number) => void;
}

export const WatchTableRow = ({ watch, onDeleteClick }: WatchTableRowProps) => {
  return (
    <TableRow>
      <TableCell>{watch.brand || "-"}</TableCell>
      <TableCell>{watch.model_name || "-"}</TableCell>
      <TableCell>{watch.model_reference || "-"}</TableCell>
      <TableCell>{watch.case_material || "-"}</TableCell>
      <TableCell>{watch.year || "-"}</TableCell>
      <TableCell>
        {watch.description ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : null}
      </TableCell>
      <TableCell>
        <WatchTableActions 
          watchId={watch.id} 
          onDeleteClick={onDeleteClick}
        />
      </TableCell>
    </TableRow>
  );
};