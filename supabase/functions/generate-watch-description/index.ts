
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
    console.log('Starting watch description generation...');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { watchData, activeModel } = await req.json();
    const { brand, model_reference } = watchData;
    
    console.log('Watch data received:', JSON.stringify(watchData, null, 2));
    console.log('Active model:', activeModel);

    if (!activeModel || !(activeModel in AI_MODEL_CONFIGS)) {
      throw new Error(`Unsupported AI model: ${activeModel}`);
    }

    const modelConfig = AI_MODEL_CONFIGS[activeModel];

    // Get the system prompt and guide for watch descriptions
    console.log('Fetching prompts from ai_prompts table...');
    const { data: prompts, error: promptsError } = await supabaseClient
      .from('ai_prompts')
      .select('*')
      .eq('purpose', 'watch')
      .eq('ai_model', activeModel);

    if (promptsError) {
      console.error('Error fetching prompts:', promptsError);
      throw promptsError;
    }

    console.log('Prompts fetched:', prompts);

    const systemPrompt = prompts?.find(p => p.name === 'System Prompt')?.content || '';
    const styleGuide = prompts?.find(p => p.name === 'Style Guide')?.content || '';
    const userPrompt = modelConfig.requiresUserPrompt ? 
      prompts?.find(p => p.name === 'User Prompt')?.content || '' : '';
    
    if (!systemPrompt || !styleGuide || (modelConfig.requiresUserPrompt && !userPrompt)) {
      throw new Error('Required prompts not found in ai_prompts table');
    }

    // Get the reference description
    console.log('Fetching reference description...');
    const { data: referenceDesc, error: referenceError } = await supabaseClient
      .from('reference_descriptions')
      .select('reference_description')
      .eq('brand', brand)
      .eq('reference_name', model_reference)
      .maybeSingle();
    
    if (referenceError) {
      console.error('Error fetching reference description:', referenceError);
      throw referenceError;
    }

    let response;
    let apiKey;

    if (activeModel === 'claude-3-opus-20240229') {
      apiKey = Deno.env.get('ANTHROPIC_API_KEY');
      if (!apiKey) throw new Error('ANTHROPIC_API_KEY not found');

      const prompt = `${systemPrompt}\n\nStyle Guide:\n${styleGuide}\n\nReference Description:\n${referenceDesc?.reference_description || ''}\n\nWatch Details:\n${JSON.stringify(watchData, null, 2)}`;
      
      console.log('Sending prompt to Claude:', prompt);

      response = await fetch(modelConfig.apiEndpoint, {
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
    } else {
      apiKey = Deno.env.get('OPENAI_API_KEY');
      if (!apiKey) throw new Error('OPENAI_API_KEY not found');

      const messages = [
        { 
          role: 'system', 
          content: `${systemPrompt}\n\nStyle Guide:\n${styleGuide}` 
        },
        {
          role: 'user',
          content: `${userPrompt}\n\nReference Description:\n${referenceDesc?.reference_description || ''}\n\nWatch Details:\n${JSON.stringify(watchData, null, 2)}`
        }
      ];

      console.log('Sending messages to GPT:', messages);

      response = await fetch(modelConfig.apiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: activeModel,
          messages,
          max_tokens: modelConfig.maxTokens,
        }),
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error:', errorData);
      throw new Error(`API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('AI response received:', data);
    
    const generatedText = activeModel === 'claude-3-opus-20240229'
      ? data.content[0].text
      : data.choices[0].message.content;

    return new Response(JSON.stringify({ description: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-watch-description function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
