import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
const ORDER_IMAGE_BUCKET = 'order-images'
const MONTH_LOOKUP: Record<string, number> = {
  january: 0,
  jan: 0,
  february: 1,
  feb: 1,
  march: 2,
  mar: 2,
  april: 3,
  apr: 3,
  may: 4,
  june: 5,
  jun: 5,
  july: 6,
  jul: 6,
  august: 7,
  aug: 7,
  september: 8,
  sept: 8,
  sep: 8,
  october: 9,
  oct: 9,
  november: 10,
  nov: 10,
  december: 11,
  dec: 11,
}

const missingSupabaseConfigMessage =
  'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment settings.'

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

let supabaseClient: SupabaseClient | null = null

export function getSupabaseClient() {
  if (!isSupabaseConfigured) {
    throw new Error(missingSupabaseConfigMessage)
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl!, supabaseAnonKey!)
  }

  return supabaseClient
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient()
    const value = Reflect.get(client as object, prop, client)

    return typeof value === 'function' ? value.bind(client) : value
  },
}) as SupabaseClient

export interface CreateOrderResult {
  order: any
  uploadedImageCount: number
  failedImageCount: number
  hasImageUploadIssues: boolean
  hasStoragePolicyIssue: boolean
}

function extractOrderImagePath(imageReference: string) {
  const trimmedReference = imageReference.trim()

  if (!trimmedReference) {
    return null
  }

  if (!/^https?:\/\//i.test(trimmedReference)) {
    return trimmedReference.replace(/^\/+/, '')
  }

  try {
    const { pathname } = new URL(trimmedReference)
    const storagePathPrefixes = [
      `/storage/v1/object/public/${ORDER_IMAGE_BUCKET}/`,
      `/storage/v1/object/sign/${ORDER_IMAGE_BUCKET}/`,
      `/storage/v1/object/authenticated/${ORDER_IMAGE_BUCKET}/`,
    ]

    for (const prefix of storagePathPrefixes) {
      if (pathname.includes(prefix)) {
        return decodeURIComponent(pathname.split(prefix)[1] || '')
      }
    }
  } catch (error) {
    console.warn('Failed to parse stored image URL:', error)
  }

  return null
}

function formatDateParts(year: number, monthIndex: number, day: number) {
  const month = String(monthIndex + 1).padStart(2, '0')
  const normalizedDay = String(day).padStart(2, '0')

  return `${year}-${month}-${normalizedDay}`
}

function normalizeOrderDate(eventDate?: string) {
  if (!eventDate) {
    return undefined
  }

  const normalizedDate = eventDate.trim()

  if (!normalizedDate) {
    return undefined
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
    return normalizedDate
  }

  const sanitizedDate = normalizedDate
    .toLowerCase()
    .replace(/(\d+)(st|nd|rd|th)\b/g, '$1')
    .replace(/,/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const monthFirstMatch = sanitizedDate.match(/^([a-z]+)\s+(\d{1,2})(?:\s+(\d{4}))?$/i)
  const dayFirstMatch = sanitizedDate.match(/^(\d{1,2})\s+([a-z]+)(?:\s+(\d{4}))?$/i)
  const numericMatch = sanitizedDate.match(/^(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?$/)

  const today = new Date()

  if (monthFirstMatch || dayFirstMatch) {
    const [, first, second, explicitYear] = monthFirstMatch || dayFirstMatch || []
    const monthName = monthFirstMatch ? first : second
    const dayValue = Number(monthFirstMatch ? second : first)
    const monthIndex = MONTH_LOOKUP[monthName]

    if (Number.isInteger(dayValue) && monthIndex !== undefined) {
      let year = explicitYear ? Number(explicitYear) : today.getFullYear()
      let candidateDate = new Date(year, monthIndex, dayValue)

      if (!explicitYear && candidateDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        year += 1
        candidateDate = new Date(year, monthIndex, dayValue)
      }

      return formatDateParts(candidateDate.getFullYear(), candidateDate.getMonth(), candidateDate.getDate())
    }
  }

  if (numericMatch) {
    const firstValue = Number(numericMatch[1])
    const secondValue = Number(numericMatch[2])
    const explicitYear = numericMatch[3]
    const monthValue = firstValue > 12 ? secondValue : firstValue
    const dayValue = firstValue > 12 ? firstValue : secondValue
    const yearValue = explicitYear
      ? Number(explicitYear.length === 2 ? `20${explicitYear}` : explicitYear)
      : today.getFullYear()

    if (monthValue >= 1 && monthValue <= 12 && dayValue >= 1 && dayValue <= 31) {
      return formatDateParts(yearValue, monthValue - 1, dayValue)
    }
  }

  return undefined
}

// Helper function to upload image to Supabase Storage
export async function uploadOrderImage(file: File, orderId: string): Promise<string> {
  const client = getSupabaseClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${orderId}/${fileName}`

  const { data, error } = await client.storage
    .from(ORDER_IMAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      contentType: file.type || undefined,
      upsert: false
    })

  if (error) {
    throw error
  }

  return data.path
}

export async function resolveOrderImageUrl(imageReference: string) {
  const storagePath = extractOrderImagePath(imageReference)

  if (!storagePath) {
    return imageReference
  }

  const client = getSupabaseClient()
  const { data, error } = await client.storage
    .from(ORDER_IMAGE_BUCKET)
    .createSignedUrl(storagePath, 60 * 60)

  if (!error && data?.signedUrl) {
    return data.signedUrl
  }

  const { data: publicUrlData } = client.storage
    .from(ORDER_IMAGE_BUCKET)
    .getPublicUrl(storagePath)

  return publicUrlData.publicUrl || imageReference
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
}, images?: File[]): Promise<CreateOrderResult> {
  const client = getSupabaseClient()
  const normalizedOrderData = {
    ...orderData,
    event_date: normalizeOrderDate(orderData.event_date),
  }

  // Insert order
  const { data: order, error: orderError } = await client
    .from('orders')
    .insert([normalizedOrderData] as any)
    .select()
    .single()

  if (orderError) {
    throw orderError
  }

  let uploadedImageCount = 0
  let failedImageCount = 0
  let hasStoragePolicyIssue = false

  // Upload images if provided
  if (images && images.length > 0 && order) {
    const imageUploadResults = await Promise.allSettled(
      images.map(async (file) => {
        const imagePath = await uploadOrderImage(file, (order as any).id)
        const { error } = await client.from('order_images').insert([{
          order_id: (order as any).id,
          image_url: imagePath,
          file_name: file.name,
          file_size: file.size
        }] as any)

        if (error) {
          throw error
        }

        return imagePath
      })
    )

    uploadedImageCount = imageUploadResults.filter((result) => result.status === 'fulfilled').length
    failedImageCount = imageUploadResults.length - uploadedImageCount

    hasStoragePolicyIssue = imageUploadResults.some(
      (result) =>
        result.status === 'rejected' &&
        /row-level security policy/i.test(
          result.reason instanceof Error ? result.reason.message : String(result.reason)
        )
    )

    if (failedImageCount > 0) {
      console.error('One or more order image uploads failed:', imageUploadResults)
    }
  }

  return {
    order,
    uploadedImageCount,
    failedImageCount,
    hasImageUploadIssues: failedImageCount > 0,
    hasStoragePolicyIssue,
  }
}

// Helper function to get order with images
export async function getOrderWithImages(orderId: string) {
  const client = getSupabaseClient()
  const { data: order, error: orderError } = await client
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
  const client = getSupabaseClient()
  const { data: orders, error } = await client
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
  const client = getSupabaseClient()
  const { data, error } = await client
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
  return getSupabaseClient()
    .channel('orders-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      callback
    )
    .subscribe()
}
