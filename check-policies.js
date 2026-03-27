import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Set SUPABASE_URL and SUPABASE_ANON_KEY before running this script.')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Check policies using pg_policies view
const { data, error } = await supabase.rpc('exec_sql', {
  query: "SELECT * FROM pg_policies WHERE tablename = 'orders';"
})

console.log('Policies:', data, error)
