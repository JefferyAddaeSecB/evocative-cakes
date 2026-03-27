// Debug Supabase permissions
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Set SUPABASE_URL and SUPABASE_ANON_KEY before running this script.')
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔍 Testing Supabase permissions...\n')

// Test 1: Try to insert a simple order
console.log('Test 1: Inserting test order...')
const { data: orderData, error: orderError } = await supabase
  .from('orders')
  .insert([{
    source: 'contact_form',
    customer_name: 'Test User',
    customer_email: 'test@example.com',
    customer_phone: '555-1234',
    cake_description: 'Test cake'
  }])
  .select()

if (orderError) {
  console.log('❌ Order insert failed:', orderError.message)
  console.log('Full error:', orderError)
} else {
  console.log('✅ Order inserted successfully!')
  console.log('Order ID:', orderData[0].id)
}

// Test 2: Check if we can read orders
console.log('\nTest 2: Reading orders...')
const { data: readData, error: readError } = await supabase
  .from('orders')
  .select('*')
  .limit(1)

if (readError) {
  console.log('❌ Read failed:', readError.message)
} else {
  console.log('✅ Read successful! Found', readData.length, 'orders')
}

process.exit(0)
