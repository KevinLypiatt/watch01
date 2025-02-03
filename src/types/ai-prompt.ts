export interface AIPrompt {
  id: number;
  ai_model: string;
  name: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  purpose: string;
}