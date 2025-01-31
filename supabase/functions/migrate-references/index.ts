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

    // Get all watches
    const { data: watches, error: fetchError } = await supabaseClient
      .from('watches')
      .select('brand, model_reference')
      .not('brand', 'is', null)
      .not('model_reference', 'is', null)

    if (fetchError) {
      console.error('Error fetching watches:', fetchError)
      throw fetchError
    }

    console.log('Total watches found:', watches?.length || 0)

    if (!watches || watches.length === 0) {
      return new Response(
        JSON.stringify({
          message: 'No watches found to migrate',
          count: 0
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Insert each watch reference into reference_descriptions
    const { data: insertedData, error: insertError } = await supabaseClient
      .from('reference_descriptions')
      .upsert(
        watches.map(watch => ({
          brand: watch.brand,
          reference_name: watch.model_reference,
          reference_description: null // This can be filled in later
        }))
      )

    if (insertError) {
      console.error('Insert error:', insertError)
      throw insertError
    }

    console.log('Successfully processed watches:', watches.length)

    return new Response(
      JSON.stringify({
        message: 'Migration completed successfully',
        count: watches.length
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