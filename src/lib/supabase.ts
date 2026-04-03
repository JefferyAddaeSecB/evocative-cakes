import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import {
  buildAdminNewOrderNotification,
  buildCustomerOrderAcknowledgementNotification,
  buildCustomerOrderStatusNotification,
  buildDashboardOrderLink,
  type NotificationOrderContext,
} from '@/lib/admin-notifications'
import {
  canAdvanceOrderStatus,
  getNextOrderStatus,
  isGalleryContentCategory,
  type GalleryContentCategory,
  type MediaPlacement,
  type OrderStatus,
} from '@/lib/admin-workflow'
import type { Database } from '@/types/database.types'

type TypedSupabaseClient = SupabaseClient
type OrderRow = Database['public']['Tables']['orders']['Row']
type OrderInsert = Database['public']['Tables']['orders']['Insert']
type OrderImageRow = Database['public']['Tables']['order_images']['Row']
type GalleryImageRow = Database['public']['Tables']['gallery_images']['Row']

export type OrderWithImages = OrderRow & {
  order_images: OrderImageRow[]
}

export type WebsiteMediaItem = GalleryImageRow & {
  public_url: string
}

export interface NotificationDispatchResult {
  success: boolean
  emailSent: boolean
  smsSent: boolean
  error?: string
}

export interface CreateOrderResult {
  order: OrderRow
  uploadedImageCount: number
  failedImageCount: number
  hasImageUploadIssues: boolean
  hasStoragePolicyIssue: boolean
  adminNotificationSent: boolean
  customerAcknowledgementSent: boolean
}

export interface WebsiteMediaInput {
  placement: MediaPlacement
  category?: GalleryContentCategory | null
  title?: string | null
  description?: string | null
  alt_text?: string | null
  sort_order?: number
  is_published?: boolean
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
const ORDER_IMAGE_BUCKET = 'order-images'
const WEBSITE_MEDIA_BUCKET = 'website-media'
const ADMIN_NOTIFICATION_FUNCTION = 'admin-notifications'
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

let supabaseClient: TypedSupabaseClient | null = null

export function getSupabaseClient() {
  if (!isSupabaseConfigured) {
    throw new Error(missingSupabaseConfigMessage)
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl!, supabaseAnonKey!)
  }

  return supabaseClient
}

export const supabase = new Proxy({} as TypedSupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient()
    const value = Reflect.get(client as object, prop, client)

    return typeof value === 'function' ? value.bind(client) : value
  },
}) as TypedSupabaseClient

function normalizeOptionalText(value?: string | null) {
  const normalizedValue = value?.trim()
  return normalizedValue ? normalizedValue : null
}

function extractStorageObjectPath(imageReference: string, bucket: string) {
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
      `/storage/v1/object/public/${bucket}/`,
      `/storage/v1/object/sign/${bucket}/`,
      `/storage/v1/object/authenticated/${bucket}/`,
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

function buildStoragePath(file: File, folder: string) {
  const fileExt = file.name.split('.').pop()
  const randomSlug = Math.random().toString(36).slice(2, 8)
  const safeFolder = folder.replace(/^\/+|\/+$/g, '')
  return `${safeFolder}/${Date.now()}_${randomSlug}.${fileExt}`
}

function buildNotificationOrderContext(order: OrderRow | OrderWithImages): NotificationOrderContext {
  return {
    id: order.id,
    customer_name: order.customer_name,
    customer_email: order.customer_email,
    customer_phone: order.customer_phone,
    event_type: order.event_type,
    event_date: order.event_date,
    cake_description: order.cake_description,
    design_preferences: order.design_preferences,
    dietary_restrictions: order.dietary_restrictions,
    serving_size: order.serving_size,
  }
}

function enrichWebsiteMediaRecord(record: GalleryImageRow): WebsiteMediaItem {
  const client = getSupabaseClient()
  const { data } = client.storage.from(WEBSITE_MEDIA_BUCKET).getPublicUrl(record.storage_path)

  return {
    ...record,
    public_url: data.publicUrl,
  }
}

function normalizeWebsiteMediaInput(input: WebsiteMediaInput): Database['public']['Tables']['gallery_images']['Insert'] {
  const placement = input.placement
  const category =
    placement === 'gallery' && input.category && isGalleryContentCategory(input.category)
      ? input.category
      : null

  return {
    placement,
    category,
    title: normalizeOptionalText(input.title),
    description: normalizeOptionalText(input.description),
    alt_text: normalizeOptionalText(input.alt_text),
    sort_order: Number.isFinite(input.sort_order) ? Number(input.sort_order) : 0,
    is_published: input.is_published ?? true,
    storage_path: '',
    is_archived: false,
  }
}

async function uploadFileToBucket(bucket: string, file: File, folder: string) {
  const client = getSupabaseClient()
  const filePath = buildStoragePath(file, folder)

  const { data, error } = await client.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      contentType: file.type || undefined,
      upsert: false,
    })

  if (error) {
    throw error
  }

  return data.path
}

async function dispatchNotification(payload: Record<string, unknown>): Promise<NotificationDispatchResult> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      emailSent: false,
      smsSent: false,
      error: missingSupabaseConfigMessage,
    }
  }

  try {
    const client = getSupabaseClient()
    const { data, error } = await client.functions.invoke(ADMIN_NOTIFICATION_FUNCTION, {
      body: payload,
    })

    if (error) {
      throw error
    }

    return {
      success: Boolean(data?.success),
      emailSent: Boolean(data?.emailSent),
      smsSent: Boolean(data?.smsSent),
      error: Array.isArray(data?.errors) && data.errors.length > 0 ? data.errors.join(' | ') : undefined,
    }
  } catch (error) {
    return {
      success: false,
      emailSent: false,
      smsSent: false,
      error: error instanceof Error ? error.message : 'Notification request failed',
    }
  }
}

async function sendAdminNewOrderNotification(order: OrderRow) {
  const draft = buildAdminNewOrderNotification(
    buildNotificationOrderContext(order),
    buildDashboardOrderLink(order.id)
  )

  return dispatchNotification({
    audience: 'admin',
    email: {
      subject: draft.subject,
      html: draft.html,
      text: draft.text,
    },
    sms: {
      message: draft.sms,
    },
  })
}

async function sendCustomerOrderAcknowledgementNotification(order: OrderRow) {
  const draft = buildCustomerOrderAcknowledgementNotification(buildNotificationOrderContext(order))

  return dispatchNotification({
    audience: 'customer',
    email: {
      to: order.customer_email,
      subject: draft.subject,
      html: draft.html,
      text: draft.text,
    },
  })
}

export async function sendCustomerOrderStatusNotification(
  order: OrderRow | OrderWithImages,
  nextStatus: OrderStatus,
  previousStatus?: OrderStatus
) {
  const draft = buildCustomerOrderStatusNotification(
    buildNotificationOrderContext(order),
    nextStatus,
    previousStatus
  )

  return dispatchNotification({
    audience: 'customer',
    email: {
      to: order.customer_email,
      subject: draft.subject,
      html: draft.html,
      text: draft.text,
    },
  })
}

export async function uploadOrderImage(file: File, orderId: string): Promise<string> {
  return uploadFileToBucket(ORDER_IMAGE_BUCKET, file, orderId)
}

export async function resolveOrderImageUrl(imageReference: string) {
  const storagePath = extractStorageObjectPath(imageReference, ORDER_IMAGE_BUCKET)

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
  const normalizedOrderData: OrderInsert = {
    ...orderData,
    event_date: normalizeOrderDate(orderData.event_date),
  }

  const { data: order, error: orderError } = await client
    .from('orders')
    .insert([normalizedOrderData])
    .select()
    .single()

  if (orderError) {
    throw orderError
  }

  let uploadedImageCount = 0
  let failedImageCount = 0
  let hasStoragePolicyIssue = false

  if (images && images.length > 0) {
    const imageUploadResults = await Promise.allSettled(
      images.map(async (file) => {
        const imagePath = await uploadOrderImage(file, order.id)
        const { error } = await client.from('order_images').insert([{
          order_id: order.id,
          image_url: imagePath,
          file_name: file.name,
          file_size: file.size,
        }])

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

  const [adminNotificationResult, customerAcknowledgementResult] = await Promise.all([
    sendAdminNewOrderNotification(order),
    sendCustomerOrderAcknowledgementNotification(order),
  ])

  return {
    order,
    uploadedImageCount,
    failedImageCount,
    hasImageUploadIssues: failedImageCount > 0,
    hasStoragePolicyIssue,
    adminNotificationSent: adminNotificationResult.success,
    customerAcknowledgementSent: customerAcknowledgementResult.success,
  }
}

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

  return order as OrderWithImages
}

export async function getAllOrders() {
  const client = getSupabaseClient()
  const { data: orders, error } = await client
    .from('orders')
    .select('*, order_images(*)')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (orders || []) as OrderWithImages[]
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, adminNotes?: string | null) {
  const client = getSupabaseClient()
  const { data: existingOrder, error: existingOrderError } = await client
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (existingOrderError) {
    throw existingOrderError
  }

  if (existingOrder.status === status) {
    return existingOrder
  }

  if (!canAdvanceOrderStatus(existingOrder.status, status)) {
    const nextAllowedStatus = getNextOrderStatus(existingOrder.status)
    const nextAllowedLabel = nextAllowedStatus ? ` The next allowed status is "${nextAllowedStatus}".` : ' This order is already completed.'

    throw new Error(
      `Invalid order status transition from "${existingOrder.status}" to "${status}".${nextAllowedLabel}`
    )
  }

  const updates: Database['public']['Tables']['orders']['Update'] = {
    status,
    admin_notes: adminNotes ?? undefined,
    completed_at: status === 'completed' ? new Date().toISOString() : existingOrder.completed_at,
  }

  const { data, error } = await client
    .from('orders')
    .update(updates)
    .eq('id', orderId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function getPublishedWebsiteMedia(placement: MediaPlacement) {
  if (!isSupabaseConfigured) {
    return [] as WebsiteMediaItem[]
  }

  const client = getSupabaseClient()
  const { data, error } = await client
    .from('gallery_images')
    .select('*')
    .eq('placement', placement)
    .eq('is_published', true)
    .eq('is_archived', false)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data || []).map(enrichWebsiteMediaRecord)
}

export async function getAdminWebsiteMedia() {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('gallery_images')
    .select('*')
    .order('is_archived', { ascending: true })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data || []).map(enrichWebsiteMediaRecord)
}

export async function createWebsiteMedia(input: WebsiteMediaInput, file: File) {
  const client = getSupabaseClient()
  const normalizedInput = normalizeWebsiteMediaInput(input)
  const storagePath = await uploadFileToBucket(WEBSITE_MEDIA_BUCKET, file, input.placement)

  const { data, error } = await client
    .from('gallery_images')
    .insert([{
      ...normalizedInput,
      storage_path: storagePath,
    }])
    .select()
    .single()

  if (error) {
    throw error
  }

  return enrichWebsiteMediaRecord(data)
}

export async function updateWebsiteMedia(
  mediaId: string,
  input: Partial<WebsiteMediaInput>,
  replacementFile?: File
) {
  const client = getSupabaseClient()
  const { data: existingMedia, error: existingMediaError } = await client
    .from('gallery_images')
    .select('*')
    .eq('id', mediaId)
    .single()

  if (existingMediaError) {
    throw existingMediaError
  }

  const nextPlacement = input.placement || existingMedia.placement
  let nextStoragePath = existingMedia.storage_path

  if (replacementFile) {
    nextStoragePath = await uploadFileToBucket(WEBSITE_MEDIA_BUCKET, replacementFile, nextPlacement)
  }

  const mergedInput = normalizeWebsiteMediaInput({
    placement: nextPlacement,
    category: input.category === undefined ? existingMedia.category : input.category,
    title: input.title === undefined ? existingMedia.title : input.title,
    description: input.description === undefined ? existingMedia.description : input.description,
    alt_text: input.alt_text === undefined ? existingMedia.alt_text : input.alt_text,
    sort_order: input.sort_order === undefined ? existingMedia.sort_order : input.sort_order,
    is_published: input.is_published === undefined ? existingMedia.is_published : input.is_published,
  })

  const { data, error } = await client
    .from('gallery_images')
    .update({
      ...mergedInput,
      storage_path: nextStoragePath,
      is_archived: existingMedia.is_archived,
    })
    .eq('id', mediaId)
    .select()
    .single()

  if (error) {
    throw error
  }

  if (replacementFile && existingMedia.storage_path !== nextStoragePath) {
    const { error: removeError } = await client.storage
      .from(WEBSITE_MEDIA_BUCKET)
      .remove([existingMedia.storage_path])

    if (removeError) {
      console.warn('Failed to remove replaced website media asset:', removeError)
    }
  }

  return enrichWebsiteMediaRecord(data)
}

export async function setWebsiteMediaPublishedState(mediaId: string, isPublished: boolean) {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('gallery_images')
    .update({
      is_published: isPublished,
    })
    .eq('id', mediaId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return enrichWebsiteMediaRecord(data)
}

export async function archiveWebsiteMedia(mediaId: string) {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('gallery_images')
    .update({
      is_archived: true,
    })
    .eq('id', mediaId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return enrichWebsiteMediaRecord(data)
}

export async function restoreWebsiteMedia(mediaId: string) {
  const client = getSupabaseClient()
  const { data, error } = await client
    .from('gallery_images')
    .update({
      is_archived: false,
    })
    .eq('id', mediaId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return enrichWebsiteMediaRecord(data)
}

export async function moveWebsiteMedia(mediaId: string, direction: 'up' | 'down') {
  const client = getSupabaseClient()
  const { data: currentMedia, error: currentMediaError } = await client
    .from('gallery_images')
    .select('*')
    .eq('id', mediaId)
    .single()

  if (currentMediaError) {
    throw currentMediaError
  }

  const { data: siblingMedia, error: siblingMediaError } = await client
    .from('gallery_images')
    .select('*')
    .eq('placement', currentMedia.placement)
    .eq('is_archived', currentMedia.is_archived)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (siblingMediaError) {
    throw siblingMediaError
  }

  const orderedMedia = [...(siblingMedia || [])]
  const currentIndex = orderedMedia.findIndex((item) => item.id === mediaId)

  if (currentIndex === -1) {
    throw new Error('Unable to locate the selected media item in its current order.')
  }

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

  if (targetIndex < 0 || targetIndex >= orderedMedia.length) {
    return enrichWebsiteMediaRecord(currentMedia)
  }

  const [movedItem] = orderedMedia.splice(currentIndex, 1)
  orderedMedia.splice(targetIndex, 0, movedItem)

  await Promise.all(
    orderedMedia.map(async (item, index) => {
      const { error } = await client
        .from('gallery_images')
        .update({ sort_order: index })
        .eq('id', item.id)

      if (error) {
        throw error
      }
    })
  )

  const { data: updatedMedia, error: updatedMediaError } = await client
    .from('gallery_images')
    .select('*')
    .eq('id', mediaId)
    .single()

  if (updatedMediaError) {
    throw updatedMediaError
  }

  return enrichWebsiteMediaRecord(updatedMedia)
}

export async function deleteWebsiteMedia(mediaId: string) {
  const client = getSupabaseClient()
  const { data: existingMedia, error: existingMediaError } = await client
    .from('gallery_images')
    .select('*')
    .eq('id', mediaId)
    .single()

  if (existingMediaError) {
    throw existingMediaError
  }

  const { error } = await client
    .from('gallery_images')
    .delete()
    .eq('id', mediaId)

  if (error) {
    throw error
  }

  const { error: removeError } = await client.storage
    .from(WEBSITE_MEDIA_BUCKET)
    .remove([existingMedia.storage_path])

  if (removeError) {
    console.warn('Failed to remove deleted website media asset:', removeError)
  }

  return existingMedia
}

export function subscribeToOrders(callback: (payload: {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
  new: Partial<OrderRow>
  old: Partial<OrderRow>
}) => void) {
  return getSupabaseClient()
    .channel('orders-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      callback
    )
    .subscribe()
}
