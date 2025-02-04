
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { ReferenceData } from './types.ts';

export async function getReferencesWithoutDescriptions(supabaseClient: any) {
  const { data: references, error } = await supabaseClient
    .from('reference_descriptions')
    .select('*')
    .is('reference_description', null);

  if (error) throw error;
  return references;
}

export async function getReferenceById(supabaseClient: any, referenceId: number) {
  const { data: reference, error } = await supabaseClient
    .from('reference_descriptions')
    .select('*')
    .eq('reference_id', referenceId)
    .single();

  if (error) throw error;
  return reference;
}

export async function updateReferenceDescription(
  supabaseClient: any,
  referenceId: number,
  description: string
) {
  const { error: updateError } = await supabaseClient
    .from('reference_descriptions')
    .update({ reference_description: description })
    .eq('reference_id', referenceId);

  if (updateError) throw updateError;
}
