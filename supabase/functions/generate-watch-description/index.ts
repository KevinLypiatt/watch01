import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    
    console.log('System prompt found:', systemPrompt);
    console.log('Style guide found:', styleGuide);

    if (!systemPrompt || !styleGuide) {
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
    
    console.log('Reference description found:', referenceDesc?.reference_description || 'No reference found');

    const prompt = `${systemPrompt}\n\nStyle Guide:\n${styleGuide}\n\nReference Description:\n${referenceDesc?.reference_description || ''}\n\nWatch Details:\n${JSON.stringify(watchData, null, 2)}`;
    
    console.log('Final prompt being sent to AI model:', prompt);

    let response;
    if (activeModel === 'claude-3-opus-20240229') {
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '',
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: activeModel,
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });
    } else {
      // Using gpt-4o model
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that generates watch descriptions.' },
            { role: 'user', content: prompt }
          ],
        }),
      });
    }

    const data = await response.json();
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