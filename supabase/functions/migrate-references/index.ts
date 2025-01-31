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

    // Get all watches that have a model_reference
    const { data: watches, error: fetchError } = await supabaseClient
      .from('watches')
      .select('brand, model_reference')
      .not('model_reference', 'is', null)

    if (fetchError) {
      console.error('Error fetching watches:', fetchError)
      throw new Error('Failed to fetch watches: ' + fetchError.message)
    }

    if (!watches || watches.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No watches found with model references to migrate'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    console.log(`Found ${watches.length} watches to process`)
    let processedCount = 0

    // Process each watch
    for (const watch of watches || []) {
      console.log('Processing watch:', watch)
      
      if (!watch.brand || !watch.model_reference) {
        console.warn('Skipping watch with missing brand or model_reference:', watch)
        continue
      }

      const { error: insertError } = await supabaseClient
        .from('reference_descriptions')
        .insert({
          brand: watch.brand,
          reference_name: watch.model_reference
        })

      if (insertError) {
        console.error('Insert error for watch:', watch, insertError)
        throw new Error(`Failed to insert reference for ${watch.model_reference}: ${insertError.message}`)
      }
      processedCount++
    }

    if (processedCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No references were successfully migrated'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
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