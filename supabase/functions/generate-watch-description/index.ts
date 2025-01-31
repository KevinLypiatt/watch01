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

    const { watchData } = await req.json();
    const { brand, model_reference } = watchData;
    
    console.log('Watch data received:', JSON.stringify(watchData, null, 2));

    // Get the system prompt and guide
    const { data: styleGuides } = await supabaseClient
      .from('style_guides')
      .select('*')
      .in('name', ['watch_description_system_prompt', 'watch_description_guide']);

    const systemPrompt = styleGuides?.find(g => g.name === 'watch_description_system_prompt')?.content || '';
    const guide = styleGuides?.find(g => g.name === 'watch_description_guide')?.content || '';
    
    console.log('Style guides loaded:');
    console.log('System prompt:', systemPrompt);
    console.log('Style guide:', guide);

    // Get the reference description
    const { data: referenceDesc } = await supabaseClient
      .from('reference_descriptions')
      .select('reference_description')
      .eq('brand', brand)
      .eq('reference_name', model_reference)
      .maybeSingle();
    
    console.log('Reference description found:', referenceDesc?.reference_description || 'No reference found');

    const prompt = `${systemPrompt}\n\nStyle Guide:\n${guide}\n\nReference Description:\n${referenceDesc?.reference_description || ''}\n\nWatch Details:\n${JSON.stringify(watchData, null, 2)}`;
    
    console.log('Final prompt being sent to Claude:', prompt);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();
    console.log('Claude response received:', data);

    return new Response(
      JSON.stringify({ description: data.content[0].text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-watch-description function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});