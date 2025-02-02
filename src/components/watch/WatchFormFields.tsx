import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface WatchFormFieldsProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const WatchFormFields = ({ formData, handleInputChange }: WatchFormFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Brand</label>
          <Input 
            name="brand" 
            value={formData.brand || ''} 
            onChange={handleInputChange} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Model Reference</label>
          <Input 
            name="model_reference" 
            value={formData.model_reference || ''} 
            onChange={handleInputChange} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Model Name</label>
          <Input 
            name="model_name" 
            value={formData.model_name || ''} 
            onChange={handleInputChange} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Case Material</label>
          <Input 
            name="case_material" 
            value={formData.case_material || ''} 
            onChange={handleInputChange} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Year</label>
          <Input 
            name="year" 
            type="number" 
            value={formData.year || ''} 
            onChange={handleInputChange} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Movement Type</label>
          <Input 
            name="movement_type" 
            value={formData.movement_type || ''} 
            onChange={handleInputChange} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Listing Reference</label>
          <Input 
            name="listing_reference" 
            value={formData.listing_reference || ''} 
            onChange={handleInputChange} 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Condition</label>
          <Input 
            name="condition" 
            value={formData.condition || ''} 
            onChange={handleInputChange} 
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Additional Information</label>
        <Textarea
          name="additional_information"
          value={formData.additional_information || ''}
          onChange={handleInputChange}
          className="min-h-[100px]"
        />
      </div>
    </>
  );
};