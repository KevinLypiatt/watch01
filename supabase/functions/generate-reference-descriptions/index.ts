
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders, GenerateDescriptionRequest, ReferenceData } from './types.ts';
import { getAIPrompts, generateWithAI } from './ai-service.ts';
import { getReferencesWithoutDescriptions, getReferenceById, updateReferenceDescription } from './db-service.ts';

const AI_MODEL_CONFIGS: Record<string, any> = {
  'claude-3-opus-20240229': {
    name: 'claude-3-opus-20240229',
    apiEndpoint: 'https://api.anthropic.com/v1/messages',
    maxTokens: 1024,
    requiresUserPrompt: false,
    promptFormat: 'single',
    headers: (apiKey: string) => ({
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    }),
  },
  'gpt-4o': {
    name: 'gpt-4o',
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    maxTokens: 1024,
    requiresUserPrompt: true,
    promptFormat: 'split',
    headers: (apiKey: string) => ({
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }),
  },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting reference description generation...');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const request: GenerateDescriptionRequest = await req.json();
    const { referenceId, generateAll, brand, reference_name, activeModel } = request;
    
    console.log('Active model:', activeModel);

    if (!activeModel || !(activeModel in AI_MODEL_CONFIGS)) {
      throw new Error(`Unsupported AI model: ${activeModel}`);
    }

    const modelConfig = AI_MODEL_CONFIGS[activeModel];
    const apiKey = activeModel === 'claude-3-opus-20240229' 
      ? Deno.env.get('ANTHROPIC_API_KEY')
      : Deno.env.get('OPENAI_API_KEY');

    if (!apiKey) {
      throw new Error(`API key not found for model: ${activeModel}`);
    }

    const prompts = await getAIPrompts(supabaseClient, activeModel);
    
    const systemPrompt = prompts?.find(p => p.name === 'System Prompt')?.content;
    const styleGuide = prompts?.find(p => p.name === 'Style Guide')?.content;
    const userPrompt = modelConfig.requiresUserPrompt ? 
      prompts?.find(p => p.name === 'User Prompt')?.content : 
      undefined;

    if (!systemPrompt || !styleGuide || (modelConfig.requiresUserPrompt && !userPrompt)) {
      throw new Error('Required prompts not found in the database');
    }

    async function generateDescription(reference: ReferenceData) {
      console.log('Generating description for reference:', reference);
      
      const description = await generateWithAI(
        modelConfig,
        apiKey,
        systemPrompt,
        styleGuide,
        userPrompt,
        reference
      );

      if (reference.reference_id) {
        await updateReferenceDescription(supabaseClient, reference.reference_id, description);
      }
      
      return description;
    }

    if (generateAll) {
      const references = await getReferencesWithoutDescriptions(supabaseClient);
      console.log(`Found ${references?.length} references without descriptions`);

      for (const reference of references || []) {
        await generateDescription(reference);
      }

      return new Response(
        JSON.stringify({ message: `Generated descriptions for ${references?.length} references` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (referenceId) {
      const reference = await getReferenceById(supabaseClient, referenceId);
      if (!reference) throw new Error('Reference not found');

      const description = await generateDescription(reference);

      return new Response(
        JSON.stringify({ description }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (brand && reference_name) {
      const description = await generateDescription({ brand, reference_name });
      
      return new Response(
        JSON.stringify({ description }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      throw new Error('Invalid request: either referenceId or brand and reference_name must be provided');
    }
  } catch (error) {
    console.error('Error in generate-reference-descriptions function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
