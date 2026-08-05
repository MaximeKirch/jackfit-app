// Supabase Edge Function: delete-account
// Deletes the authenticated user from auth.users. Because all app-side
// tables have ON DELETE CASCADE toward auth.users, this purges every
// row associated with the user (RGPD art. 17).
//
// Deploy: supabase functions deploy delete-account
// Invoke from client: supabase.functions.invoke('delete-account')

import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return json({ error: 'missing_authorization' }, 401)
    }

    const supabaseUrl        = Deno.env.get('SUPABASE_URL')!
    const serviceRoleKey     = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const anonKey            = Deno.env.get('SUPABASE_ANON_KEY')!

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: userData, error: userErr } = await userClient.auth.getUser()
    if (userErr || !userData.user) {
      return json({ error: 'invalid_token' }, 401)
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey)
    const { error: deleteErr } = await adminClient.auth.admin.deleteUser(userData.user.id)
    if (deleteErr) {
      console.error('admin.deleteUser failed', deleteErr)
      return json({ error: 'delete_failed', detail: deleteErr.message }, 500)
    }

    return json({ ok: true }, 200)
  } catch (err) {
    console.error('delete-account fatal', err)
    return json({ error: 'internal_error' }, 500)
  }
})

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
