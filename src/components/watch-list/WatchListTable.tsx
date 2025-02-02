import { Table, TableBody } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { WatchTableHeader } from "./WatchTableHeader";
import { WatchTableRow } from "./WatchTableRow";

interface Watch {
  id: number;
  brand: string;
  model_name: string;
  model_reference: string;
  case_material: string;
  year: number;
  movement_type: string;
  listing_reference: string;
  condition: string;
  description: string;
  additional_information: string;
}

interface WatchListTableProps {
  watches: Watch[];
  handleSort: (column: string) => void;
  handleDelete: (id: number) => void;
}

export const WatchListTable = ({
  watches,
  handleSort,
  handleDelete,
}: WatchListTableProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWatchId, setSelectedWatchId] = useState<number | null>(null);

  const onDeleteClick = (id: number) => {
    setSelectedWatchId(id);
    setDeleteDialogOpen(true);
  };

  const onDeleteConfirm = () => {
    if (selectedWatchId) {
      handleDelete(selectedWatchId);
      setDeleteDialogOpen(false);
      setSelectedWatchId(null);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <WatchTableHeader handleSort={handleSort} />
          <TableBody>
            {watches && watches.length > 0 ? (
              watches.map((watch) => (
                <WatchTableRow
                  key={watch.id}
                  watch={watch}
                  onDeleteClick={onDeleteClick}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  No watches found
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the watch from your database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};