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
    console.log('Starting reference description generation...');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { referenceId, generateAll, brand, reference_name } = await req.json();
    
    // Get both the system prompt and style guide from ai_prompts table
    const { data: prompts, error: promptsError } = await supabaseClient
      .from('ai_prompts')
      .select('*')
      .eq('purpose', 'reference')
      .eq('ai_model', 'claude-3-opus-20240229');

    if (promptsError) {
      throw new Error(`Error fetching prompts: ${promptsError.message}`);
    }

    if (!prompts || prompts.length < 2) {
      throw new Error('Required prompts not found in the database');
    }

    const systemPrompt = prompts.find(p => p.name === 'System Prompt')?.content;
    const styleGuide = prompts.find(p => p.name === 'Style Guide')?.content;

    if (!systemPrompt || !styleGuide) {
      throw new Error('Missing required prompts in the database');
    }

    console.log('System prompt loaded:', systemPrompt);
    console.log('Style guide loaded:', styleGuide);

    // Function to generate description for a single reference
    async function generateDescription(reference: any) {
      console.log('Generating description for reference:', reference);

      // Construct the complete prompt by concatenating system prompt, style guide, and reference details
      const prompt = `${systemPrompt}

Style Guide:
${styleGuide}

Brand: ${reference.brand}
Reference Name: ${reference.reference_name}`;
      
      console.log('Sending prompt to Claude:', prompt);

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
      
      if (!response.ok) {
        console.error('Claude API error:', data);
        throw new Error(`Claude API error: ${data.error?.message || 'Unknown error'}`);
      }

      const generatedDescription = data.content[0].text;
      console.log('Generated description:', generatedDescription);

      // Only update the database if we have a reference ID
      if (reference.reference_id) {
        const { error: updateError } = await supabaseClient
          .from('reference_descriptions')
          .update({ reference_description: generatedDescription })
          .eq('reference_id', reference.reference_id);

        if (updateError) throw updateError;
      }
      
      return generatedDescription;
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