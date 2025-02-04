
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
  promptFormat: 'single' | 'split';
  headers: (apiKey: string) => Record<string, string>;
}

const AI_MODEL_CONFIGS: Record<string, AIModelConfig> = {
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
    console.log('Starting watch description generation...');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { watchData, activeModel } = await req.json();
    
    console.log('Watch data received:', JSON.stringify(watchData, null, 2));
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

    const systemPrompt = prompts?.find(p => p.name === 'System Prompt')?.content;
    const styleGuide = prompts?.find(p => p.name === 'Style Guide')?.content;
    const userPrompt = modelConfig.requiresUserPrompt ? 
      prompts?.find(p => p.name === 'User Prompt')?.content : 
      undefined;

    if (!systemPrompt || !styleGuide || (modelConfig.requiresUserPrompt && !userPrompt)) {
      throw new Error('Required prompts not found in ai_prompts table');
    }

    const prompt = modelConfig.promptFormat === 'single'
      ? `${systemPrompt}\n\nStyle Guide:\n${styleGuide}\n\nWatch Details:\n${JSON.stringify(watchData, null, 2)}`
      : [
          { 
            role: 'system', 
            content: `${systemPrompt}\n\nStyle Guide:\n${styleGuide}` 
          },
          {
            role: 'user',
            content: `${userPrompt}\n\nWatch Details:\n${JSON.stringify(watchData, null, 2)}`
          }
        ];

    console.log('Sending request to AI service:', {
      endpoint: modelConfig.apiEndpoint,
      model: activeModel,
      promptFormat: modelConfig.promptFormat,
    });

    const response = await fetch(modelConfig.apiEndpoint, {
      method: 'POST',
      headers: modelConfig.headers(apiKey),
      body: JSON.stringify(
        modelConfig.promptFormat === 'single'
          ? {
              model: activeModel,
              max_tokens: modelConfig.maxTokens,
              messages: [{ role: 'user', content: prompt as string }],
            }
          : {
              model: activeModel,
              max_tokens: modelConfig.maxTokens,
              messages: prompt,
            }
      ),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('AI API error:', errorData);
      throw new Error(`AI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('AI response received:', data);
    
    const generatedText = modelConfig.name === 'claude-3-opus-20240229'
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
