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
      .select('*')

    if (fetchError) {
      console.error('Error fetching watches:', fetchError)
      throw fetchError
    }

    console.log('Found watches:', watches?.length || 0)

    if (!watches || watches.length === 0) {
      return new Response(
        JSON.stringify({
          message: 'No watches found',
          count: 0
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    // Create a reference description for each watch
    const { error: insertError } = await supabaseClient
      .from('reference_descriptions')
      .insert(
        watches.map(watch => ({
          brand: watch.brand,
          reference_name: watch.model_reference,
          reference_description: null
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