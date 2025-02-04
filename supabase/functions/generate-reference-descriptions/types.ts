
export interface GenerateDescriptionRequest {
  referenceId?: number;
  generateAll?: boolean;
  brand?: string;
  reference_name?: string;
  activeModel: string;
}

export interface ReferenceData {
  reference_id?: number;
  brand: string;
  reference_name: string;
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
