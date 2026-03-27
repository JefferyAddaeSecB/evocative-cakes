// Quick test to verify Supabase connection
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Set SUPABASE_URL and SUPABASE_ANON_KEY before running this script.')
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔗 Testing Supabase connection...\n')

// Test connection
const { data, error } = await supabase.from('orders').select('count').limit(1)

if (error) {
  console.log('❌ Error:', error.message)
  console.log('\nThis is expected if tables don\'t exist yet!')
  console.log('➡️  Run the SQL migration in Supabase dashboard\n')
} else {
  console.log('✅ Connection successful!')
  console.log('✅ Tables exist and are accessible!\n')
  console.log('Data:', data)
}

process.exit(0)
