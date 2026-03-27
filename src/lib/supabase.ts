import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to upload image to Supabase Storage
export async function uploadOrderImage(file: File, orderId: string): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${orderId}/${fileName}`

  const { data, error } = await supabase.storage
    .from('order-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    throw error
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('order-images')
    .getPublicUrl(data.path)

  return publicUrl
}

// Helper function to create order with images
export async function createOrder(orderData: {
  source: 'contact_form' | 'chatbot'
  customer_name: string
  customer_email: string
  customer_phone: string
  event_type?: string
  event_date?: string
  cake_description: string
  dietary_restrictions?: string
  serving_size?: string
  design_preferences?: string
}, images?: File[]) {
  // Insert order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([orderData] as any)
    .select()
    .single()

  if (orderError) {
    throw orderError
  }

  // Upload images if provided
  if (images && images.length > 0 && order) {
    const imageUploadPromises = images.map(async (file) => {
      const imageUrl = await uploadOrderImage(file, (order as any).id)

      return supabase.from('order_images').insert([{
        order_id: (order as any).id,
        image_url: imageUrl,
        file_name: file.name,
        file_size: file.size
      }] as any)
    })

    await Promise.all(imageUploadPromises)
  }

  return order
}

// Helper function to get order with images
export async function getOrderWithImages(orderId: string) {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*, order_images(*)')
    .eq('id', orderId)
    .single()

  if (orderError) {
    throw orderError
  }

  return order
}

// Helper function to get all orders (for admin dashboard)
export async function getAllOrders() {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*, order_images(*)')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return orders
}

// Helper function to update order status
export async function updateOrderStatus(orderId: string, status: 'new' | 'in_progress' | 'completed', adminNotes?: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status, admin_notes: adminNotes } as any)
    .eq('id', orderId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Real-time subscription for admin dashboard
export function subscribeToOrders(callback: (payload: any) => void) {
  return supabase
    .channel('orders-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      callback
    )
    .subscribe()
}
