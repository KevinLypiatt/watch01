import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WatchListFiltersProps {
  brandInput: string;
  modelInput: string;
  searchInput: string;
  setBrandInput: (value: string) => void;
  setModelInput: (value: string) => void;
  setSearchInput: (value: string) => void;
  handleSearch: () => void;
}

export const WatchListFilters = ({
  brandInput,
  modelInput,
  searchInput,
  setBrandInput,
  setModelInput,
  setSearchInput,
  handleSearch,
}: WatchListFiltersProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex gap-4">
        <Input
          placeholder="Filter by brand..."
          value={brandInput}
          onChange={(e) => setBrandInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Input
          placeholder="Filter by model reference..."
          value={modelInput}
          onChange={(e) => setModelInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Input
          placeholder="Search all fields..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
  );
};