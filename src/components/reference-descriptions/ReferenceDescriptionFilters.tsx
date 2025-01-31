import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ReferenceDescriptionFiltersProps {
  brandInput: string;
  referenceInput: string;
  searchInput: string;
  setBrandInput: (value: string) => void;
  setReferenceInput: (value: string) => void;
  setSearchInput: (value: string) => void;
  handleSearch: () => void;
}

export const ReferenceDescriptionFilters = ({
  brandInput,
  referenceInput,
  searchInput,
  setBrandInput,
  setReferenceInput,
  setSearchInput,
  handleSearch,
}: ReferenceDescriptionFiltersProps) => {
  return (
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
  );
};