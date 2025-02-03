import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AIPromptFilterProps {
  selectedModel: string;
  uniqueModels: string[] | undefined;
  onModelChange: (value: string) => void;
}

export const AIPromptFilter = ({
  selectedModel,
  uniqueModels,
  onModelChange,
}: AIPromptFilterProps) => {
  return (
    <div className="mb-6">
      <Select
        value={selectedModel}
        onValueChange={onModelChange}
      >
        <SelectTrigger className="w-[200px] bg-white">
          <SelectValue placeholder="Select AI Model" />
        </SelectTrigger>
        <SelectContent className="bg-white shadow-lg z-50">
          <SelectItem value="all">All Models</SelectItem>
          {uniqueModels?.map((model) => (
            <SelectItem key={model} value={model}>
              {model}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};