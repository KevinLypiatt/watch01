export interface WatchFormProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleGenerateDescription: () => void;
  isGenerating: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}