import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WatchTableActionsProps {
  watchId: number;
  onDeleteClick: (id: number) => void;
}

export const WatchTableActions = ({ watchId, onDeleteClick }: WatchTableActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(`/edit-watch/${watchId}`)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDeleteClick(watchId)}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};