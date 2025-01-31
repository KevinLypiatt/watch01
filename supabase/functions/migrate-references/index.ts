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
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get unique combinations from watches table
    const { data: watches, error: fetchError } = await supabaseClient
      .from('watches')
      .select('brand, model_reference')

    if (fetchError) throw fetchError

    console.log('Total watches found:', watches?.length || 0)
    console.log('Raw watches data:', watches)

    // Filter out null values and create a Set to store unique combinations
    const uniqueCombinations = new Set()
    const uniqueWatches = watches?.filter(watch => {
      if (!watch.brand || !watch.model_reference) {
        console.log('Skipping watch due to null values:', watch)
        return false
      }
      const key = `${watch.brand}-${watch.model_reference}`
      if (!uniqueCombinations.has(key)) {
        uniqueCombinations.add(key)
        return true
      }
      return false
    }) || []

    console.log(`Found ${uniqueWatches.length} unique watch references`)
    console.log('Unique watches to insert:', uniqueWatches)

    if (uniqueWatches.length === 0) {
      return new Response(
        JSON.stringify({
          message: 'No valid watch references found to migrate',
          count: 0
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Insert unique combinations into reference_descriptions
    const { data: insertedData, error: insertError } = await supabaseClient
      .from('reference_descriptions')
      .upsert(
        uniqueWatches.map(watch => ({
          brand: watch.brand,
          reference_name: watch.model_reference,
          reference_description: null // This can be filled in later
        })),
        { 
          onConflict: 'brand,reference_name',
          ignoreDuplicates: true 
        }
      )

    if (insertError) {
      console.error('Insert error:', insertError)
      throw insertError
    }

    console.log('Successfully inserted data:', insertedData)

    return new Response(
      JSON.stringify({
        message: 'Migration completed successfully',
        count: uniqueWatches.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Migration error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})