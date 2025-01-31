import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting migration process...')
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get distinct brand and model_reference combinations from watches
    const { data: uniqueReferences, error: fetchError } = await supabaseClient
      .from('watches')
      .select('brand, model_reference')
      .not('model_reference', 'is', null)
      .not('brand', 'is', null)

    if (fetchError) {
      console.error('Error fetching watches:', fetchError)
      throw new Error('Failed to fetch watches: ' + fetchError.message)
    }

    if (!uniqueReferences || uniqueReferences.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No watches found with brand and model references to migrate'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Create a Set to store unique combinations
    const uniqueCombinations = new Set(
      uniqueReferences.map(ref => JSON.stringify({ brand: ref.brand, reference_name: ref.model_reference }))
    )

    console.log(`Found ${uniqueCombinations.size} unique brand/reference combinations`)
    let processedCount = 0

    // Process each unique combination
    for (const combination of uniqueCombinations) {
      const { brand, reference_name } = JSON.parse(combination)
      console.log('Processing combination:', { brand, reference_name })

      const { error: insertError } = await supabaseClient
        .from('reference_descriptions')
        .insert({
          brand: brand,
          reference_name: reference_name
        })

      if (insertError) {
        console.error('Insert error for combination:', { brand, reference_name }, insertError)
        // Continue with other records even if one fails
        continue
      }
      processedCount++
    }

    console.log(`Successfully processed ${processedCount} references`)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Migration completed successfully',
        count: processedCount
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Migration error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'An unexpected error occurred during migration'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})