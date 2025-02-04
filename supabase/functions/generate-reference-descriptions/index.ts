
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AIModelConfig {
  name: string;
  apiEndpoint: string;
  maxTokens: number;
  requiresUserPrompt: boolean;
}

const AI_MODEL_CONFIGS: Record<string, AIModelConfig> = {
  'claude-3-opus-20240229': {
    name: 'claude-3-opus-20240229',
    apiEndpoint: 'https://api.anthropic.com/v1/messages',
    maxTokens: 1024,
    requiresUserPrompt: false,
  },
  'gpt-4o': {
    name: 'gpt-4o',
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    maxTokens: 1024,
    requiresUserPrompt: true,
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

    const { referenceId, generateAll, brand, reference_name, activeModel } = await req.json();
    console.log('Active model:', activeModel);

    if (!activeModel || !(activeModel in AI_MODEL_CONFIGS)) {
      throw new Error(`Unsupported AI model: ${activeModel}`);
    }

    const modelConfig = AI_MODEL_CONFIGS[activeModel];
    
    // Get prompts based on active model
    const { data: prompts, error: promptsError } = await supabaseClient
      .from('ai_prompts')
      .select('*')
      .eq('purpose', 'reference')
      .eq('ai_model', activeModel);

    if (promptsError) {
      throw new Error(`Error fetching prompts: ${promptsError.message}`);
    }

    if (!prompts || prompts.length === 0) {
      throw new Error('Required prompts not found in the database');
    }

    const systemPrompt = prompts.find(p => p.name === 'System Prompt')?.content;
    const styleGuide = prompts.find(p => p.name === 'Style Guide')?.content;
    const userPrompt = modelConfig.requiresUserPrompt ? 
      prompts.find(p => p.name === 'User Prompt')?.content : 
      null;

    if (!systemPrompt || !styleGuide || (modelConfig.requiresUserPrompt && !userPrompt)) {
      throw new Error('Missing required prompts in the database');
    }

    // Function to generate description using Claude
    async function generateWithClaude(reference: any) {
      console.log('Generating description with Claude for reference:', reference);

      const prompt = `${systemPrompt}

Style Guide:
${styleGuide}

Brand: ${reference.brand}
Reference Name: ${reference.reference_name}`;
      
      console.log('Sending prompt to Claude:', prompt);

      const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
      if (!apiKey) throw new Error('ANTHROPIC_API_KEY not found');

      const response = await fetch(modelConfig.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: activeModel,
          max_tokens: modelConfig.maxTokens,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Claude API error:', errorData);
        throw new Error(`Claude API error: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return data.content[0].text;
    }

    // Function to generate description using GPT
    async function generateWithGPT(reference: any) {
      console.log('Generating description with GPT for reference:', reference);

      const systemMessage = `${systemPrompt}\n\nStyle Guide:\n${styleGuide}`;
      const userMessage = `${userPrompt}\n\nBrand: ${reference.brand}\nReference Name: ${reference.reference_name}`;

      console.log('System message:', systemMessage);
      console.log('User message:', userMessage);

      const apiKey = Deno.env.get('OPENAI_API_KEY');
      if (!apiKey) throw new Error('OPENAI_API_KEY not found');

      const response = await fetch(modelConfig.apiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: activeModel,
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: userMessage }
          ],
          max_tokens: modelConfig.maxTokens,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('GPT API error:', errorData);
        throw new Error(`GPT API error: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    }

    // Function to generate description based on active model
    async function generateDescription(reference: any) {
      console.log('Generating description for reference:', reference);
      
      const description = activeModel === 'claude-3-opus-20240229' ?
        await generateWithClaude(reference) :
        await generateWithGPT(reference);

      // Only update the database if we have a reference ID
      if (reference.reference_id) {
        const { error: updateError } = await supabaseClient
          .from('reference_descriptions')
          .update({ reference_description: description })
          .eq('reference_id', reference.reference_id);

        if (updateError) throw updateError;
      }
      
      return description;
    }

    if (generateAll) {
      // Get all references without descriptions
      const { data: references, error } = await supabaseClient
        .from('reference_descriptions')
        .select('*')
        .is('reference_description', null);

      if (error) throw error;
      console.log(`Found ${references?.length} references without descriptions`);

      // Generate descriptions for all references
      for (const reference of references || []) {
        await generateDescription(reference);
      }

      return new Response(
        JSON.stringify({ message: `Generated descriptions for ${references?.length} references` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (referenceId) {
      // Generate description for an existing reference
      const { data: reference } = await supabaseClient
        .from('reference_descriptions')
        .select('*')
        .eq('reference_id', referenceId)
        .single();

      if (!reference) throw new Error('Reference not found');

      const description = await generateDescription(reference);

      return new Response(
        JSON.stringify({ description }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (brand && reference_name) {
      // Generate description for a new reference
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
