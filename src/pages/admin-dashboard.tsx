import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowUp,
  AlertTriangle,
  Archive,
  BellRing,
  Calendar,
  CheckCircle2,
  Circle,
  ClipboardList,
  Clock3,
  Eye,
  EyeOff,
  Image as ImageIcon,
  ImagePlus,
  LogOut,
  Mail,
  MessageSquare,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  User,
} from 'lucide-react'
import {
  archiveWebsiteMedia,
  createWebsiteMedia,
  deleteWebsiteMedia,
  getAdminWebsiteMedia,
  getAllOrders,
  moveWebsiteMedia,
  resolveOrderImageUrl,
  restoreWebsiteMedia,
  sendCustomerOrderStatusNotification,
  setWebsiteMediaPublishedState,
  subscribeToOrders,
  supabase,
  updateOrderStatus,
  updateWebsiteMedia,
  type OrderWithImages,
  type WebsiteMediaItem,
} from '@/lib/supabase'
import {
  buildAdminNewOrderNotification,
  buildCustomerOrderAcknowledgementNotification,
  buildCustomerOrderStatusNotification,
  buildDashboardOrderLink,
} from '@/lib/admin-notifications'
import {
  canAdvanceOrderStatus,
  formatOrderStatus,
  galleryContentCategories,
  getNextOrderStatus,
  mediaPlacementLabels,
  orderStatusDescriptions,
  orderStatusLabels,
  orderStatuses,
  type GalleryContentCategory,
  type MediaPlacement,
  type OrderStatus,
} from '@/lib/admin-workflow'
import { toast } from 'sonner'

type AdminView = 'overview' | 'orders' | 'media' | 'notifications'
type SourceFilter = 'all' | 'chatbot' | 'contact_form'
type MediaStateFilter = 'all' | 'live' | 'draft' | 'archived'
type ResolvedOrder = Omit<OrderWithImages, 'order_images'> & {
  order_images: Array<OrderWithImages['order_images'][number] & { preview_url?: string }>
}

interface ConfirmationState {
  title: string
  message: string
  actionLabel: string
  tone: 'default' | 'danger'
  onConfirm: () => Promise<void>
}

interface MediaFormState {
  id: string | null
  placement: MediaPlacement
  category: GalleryContentCategory | ''
  title: string
  description: string
  alt_text: string
  sort_order: string
  is_published: boolean
}

const adminViews: Array<{
  id: AdminView
  label: string
  description: string
  icon: typeof ClipboardList
}> = [
  {
    id: 'overview',
    label: 'Overview',
    description: 'Operational summary',
    icon: ShieldCheck,
  },
  {
    id: 'orders',
    label: 'Orders',
    description: 'Pipeline and status management',
    icon: ClipboardList,
  },
  {
    id: 'media',
    label: 'Media',
    description: 'Live website image control',
    icon: ImagePlus,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Email and SMS drafts',
    icon: BellRing,
  },
]

const sourceLabels: Record<Exclude<SourceFilter, 'all'>, string> = {
  chatbot: 'Chatbot',
  contact_form: 'Contact Form',
}

const mediaPlacementOptions: MediaPlacement[] = ['gallery', 'hero']

const defaultMediaFormState: MediaFormState = {
  id: null,
  placement: 'gallery',
  category: 'Wedding Cakes',
  title: '',
  description: '',
  alt_text: '',
  sort_order: '0',
  is_published: true,
}

const previewOrder = {
  id: 'preview-order',
  customer_name: 'Jordan Lee',
  customer_email: 'customer@example.com',
  customer_phone: '+1 416-555-0189',
  event_type: 'Birthday',
  event_date: '2026-05-24',
  cake_description: 'Two-tier buttercream cake in blush, ivory, and gold with fresh florals.',
  design_preferences: 'Clean finish, floral front cascade, and matching cupcakes.',
  dietary_restrictions: 'No nuts',
  serving_size: '30-35 guests',
}

function isAdminView(value: string | null): value is AdminView {
  return value === 'overview' || value === 'orders' || value === 'media' || value === 'notifications'
}

function formatEventDate(value: string | null) {
  if (!value) {
    return 'Date not provided'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function getStatusClasses(status: OrderStatus) {
  switch (status) {
    case 'new':
      return 'border-orange-200 bg-orange-100 text-orange-700'
    case 'started':
      return 'border-sky-200 bg-sky-100 text-sky-700'
    case 'in_progress':
      return 'border-purple-200 bg-purple-100 text-purple-700'
    case 'completed':
      return 'border-emerald-200 bg-emerald-100 text-emerald-700'
  }
}

function buildMediaFormState(item: WebsiteMediaItem): MediaFormState {
  const normalizedCategory =
    item.category && galleryContentCategories.includes(item.category as GalleryContentCategory)
      ? (item.category as GalleryContentCategory)
      : ''

  return {
    id: item.id,
    placement: item.placement,
    category: normalizedCategory,
    title: item.title || '',
    description: item.description || '',
    alt_text: item.alt_text || '',
    sort_order: String(item.sort_order),
    is_published: item.is_published,
  }
}

function buildNotificationConfigItems() {
  return [
    'Deploy the `admin-notifications` Supabase Edge Function.',
    'Add `RESEND_API_KEY` and a verified-domain `RESEND_FROM_EMAIL` in Supabase secrets.',
    'Add `REPLY_TO_EMAIL` if Gmail should receive customer replies.',
    'Add `ADMIN_NOTIFICATION_EMAIL` and `ADMIN_NOTIFICATION_PHONE` for admin alerts.',
    'Set `VITE_SITE_URL` so dashboard links in notification emails open the correct live site.',
    'Add `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_FROM_NUMBER` if SMS alerts are required.',
    'Run `supabase-admin-upgrade.sql` so the richer statuses and media tables exist in production.',
  ]
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedView = searchParams.get('view')
  const initialView: AdminView = isAdminView(requestedView) ? requestedView : 'overview'
  const focusOrderId = searchParams.get('order')

  const mediaFormRef = useRef<HTMLElement>(null)

  const [activeView, setActiveView] = useState<AdminView>(initialView)
  const [orders, setOrders] = useState<ResolvedOrder[]>([])
  const [mediaItems, setMediaItems] = useState<WebsiteMediaItem[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const [isLoadingMedia, setIsLoadingMedia] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | OrderStatus>('all')
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null)
  const [mediaPlacementFilter, setMediaPlacementFilter] = useState<'all' | MediaPlacement>('all')
  const [mediaStateFilter, setMediaStateFilter] = useState<MediaStateFilter>('all')
  const [mediaSearchQuery, setMediaSearchQuery] = useState('')
  const [mediaSetupMessage, setMediaSetupMessage] = useState<string | null>(null)
  const [mediaForm, setMediaForm] = useState<MediaFormState>(defaultMediaFormState)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaFilePreview, setMediaFilePreview] = useState<string | null>(null)
  const [confirmationState, setConfirmationState] = useState<ConfirmationState | null>(null)
  const [isConfirmingAction, setIsConfirmingAction] = useState(false)
  const [isSavingMedia, setIsSavingMedia] = useState(false)

  useEffect(() => {
    const requestedView = searchParams.get('view')

    if (isAdminView(requestedView) && requestedView !== activeView) {
      setActiveView(requestedView)
    }
  }, [activeView, searchParams])

  useEffect(() => {
    if (focusOrderId) {
      setActiveView('orders')
      setFilterStatus('all')
      setSourceFilter('all')
    }
  }, [focusOrderId])

  const setView = (view: AdminView) => {
    setActiveView(view)
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams)
      nextParams.set('view', view)
      if (view !== 'orders') {
        nextParams.delete('order')
      }
      return nextParams
    })
  }

  const resetMediaForm = () => {
    setMediaForm(defaultMediaFormState)
    setMediaFile(null)
    setMediaFilePreview(null)
  }

  const loadOrders = useCallback(async (backgroundRefresh = false) => {
    if (backgroundRefresh) {
      setIsRefreshing(true)
    } else {
      setIsLoadingOrders(true)
    }

    try {
      const data = await getAllOrders()
      const ordersWithResolvedImages = await Promise.all(
        data.map(async (order) => ({
          ...order,
          order_images: await Promise.all(
            (order.order_images || []).map(async (image) => ({
              ...image,
              preview_url: await resolveOrderImageUrl(image.image_url),
            }))
          ),
        }))
      )

      setOrders(ordersWithResolvedImages)
      setLastUpdatedAt(new Date())
    } catch (error) {
      console.error('Error loading orders:', error)
      toast.error('Failed to load orders')
    } finally {
      if (backgroundRefresh) {
        setIsRefreshing(false)
      } else {
        setIsLoadingOrders(false)
      }
    }
  }, [])

  const loadMedia = useCallback(async () => {
    setIsLoadingMedia(true)
    setMediaSetupMessage(null)

    try {
      const data = await getAdminWebsiteMedia()
      setMediaItems(data)
    } catch (error) {
      console.error('Error loading media:', error)
      setMediaItems([])

      const message = error instanceof Error ? error.message : 'Failed to load website media'
      if (/gallery_images|website-media|relation .* does not exist|does not exist/i.test(message)) {
        setMediaSetupMessage(
          'Live media management is not active yet. Run `supabase-admin-upgrade.sql` in Supabase, then refresh this dashboard.'
        )
      } else {
        setMediaSetupMessage(message)
      }
    } finally {
      setIsLoadingMedia(false)
    }
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/admin/login')
      }
    }

    void checkAuth()
    void loadOrders()
    void loadMedia()

    const subscription = subscribeToOrders((payload) => {
      void loadOrders(true)

      if (payload.eventType === 'INSERT' && payload.new.customer_name) {
        toast.success('New order received', {
          description: `From ${payload.new.customer_name}`,
        })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [loadMedia, loadOrders, navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const queueConfirmation = (nextState: ConfirmationState) => {
    setConfirmationState(nextState)
  }

  const handleConfirmAction = async () => {
    if (!confirmationState) {
      return
    }

    setIsConfirmingAction(true)

    try {
      await confirmationState.onConfirm()
      setConfirmationState(null)
    } finally {
      setIsConfirmingAction(false)
    }
  }

  const requestStatusChange = (order: ResolvedOrder, nextStatus: OrderStatus) => {
    if (order.status === nextStatus) {
      return
    }

    if (!canAdvanceOrderStatus(order.status, nextStatus)) {
      const nextAllowedStatus = getNextOrderStatus(order.status)

      if (nextAllowedStatus) {
        toast.error(`Move this order to ${formatOrderStatus(nextAllowedStatus)} first.`)
      } else {
        toast.error('This order is already completed.')
      }

      return
    }

    queueConfirmation({
      title: `Update ${order.customer_name} to ${formatOrderStatus(nextStatus)}?`,
      message:
        'This moves the order forward in the live workflow immediately. The customer will receive a professional status update email.',
      actionLabel: `Mark as ${formatOrderStatus(nextStatus)}`,
      tone: 'default',
      onConfirm: async () => {
        try {
          const updatedOrder = await updateOrderStatus(order.id, nextStatus, order.admin_notes)
          const notificationResult = await sendCustomerOrderStatusNotification(updatedOrder, nextStatus, order.status)

          if (notificationResult.success) {
            toast.success(`Status updated to ${formatOrderStatus(nextStatus)}`, {
              description: 'Customer update email sent successfully.',
            })
          } else {
            toast.success(`Status updated to ${formatOrderStatus(nextStatus)}`, {
              description: notificationResult.error
                ? `Customer email was not sent: ${notificationResult.error}`
                : 'Customer email was not sent.',
            })
          }

          await loadOrders(true)
        } catch (error) {
          console.error('Error updating status:', error)
          toast.error(error instanceof Error ? error.message : 'Failed to update status')
        }
      },
    })
  }

  const handleMediaSubmit = () => {
    const isEditing = Boolean(mediaForm.id)

    if (!isEditing && !mediaFile) {
      toast.error('Select an image before saving')
      return
    }

    const sortOrder = Number.parseInt(mediaForm.sort_order || '0', 10)
    const safeSortOrder = Number.isNaN(sortOrder) ? 0 : sortOrder

    queueConfirmation({
      title: isEditing ? 'Save live media changes?' : 'Publish this new website image?',
      message:
        'This affects the live website immediately when the item is published. Continue only if the content is ready for visitors.',
      actionLabel: isEditing ? 'Save changes' : 'Upload image',
      tone: 'default',
      onConfirm: async () => {
        setIsSavingMedia(true)

        try {
          if (mediaForm.id) {
            await updateWebsiteMedia(
              mediaForm.id,
              {
                placement: mediaForm.placement,
                category: mediaForm.placement === 'gallery' ? mediaForm.category || null : null,
                title: mediaForm.title,
                description: mediaForm.description,
                alt_text: mediaForm.alt_text,
                sort_order: safeSortOrder,
                is_published: mediaForm.is_published,
              },
              mediaFile || undefined
            )

            toast.success('Website media updated')
          } else if (mediaFile) {
            await createWebsiteMedia(
              {
                placement: mediaForm.placement,
                category: mediaForm.placement === 'gallery' ? mediaForm.category || null : null,
                title: mediaForm.title,
                description: mediaForm.description,
                alt_text: mediaForm.alt_text,
                sort_order: safeSortOrder,
                is_published: mediaForm.is_published,
              },
              mediaFile
            )

            toast.success('Website media uploaded')
          }

          resetMediaForm()
          await loadMedia()
        } catch (error) {
          console.error('Error saving media:', error)
          const message = error instanceof Error ? error.message : String(error)
          if (/row.level security|rls|new row violates/i.test(message)) {
            toast.error('Permission denied', { description: 'Your session may have expired. Try logging out and back in.' })
          } else if (/storage|bucket|upload/i.test(message)) {
            toast.error('Image upload failed', { description: message })
          } else {
            toast.error('Failed to save media', { description: message })
          }
        } finally {
          setIsSavingMedia(false)
        }
      },
    })
  }

  const requestToggleMediaVisibility = (item: WebsiteMediaItem, nextPublishedState: boolean) => {
    queueConfirmation({
      title: nextPublishedState ? 'Publish this image live?' : 'Hide this image from the website?',
      message:
        nextPublishedState
          ? 'The image will immediately become visible on the live site if it is not archived.'
          : 'The image will immediately stop appearing on the live site.',
      actionLabel: nextPublishedState ? 'Publish image' : 'Hide image',
      tone: 'default',
      onConfirm: async () => {
        try {
          await setWebsiteMediaPublishedState(item.id, nextPublishedState)
          toast.success(nextPublishedState ? 'Image published' : 'Image hidden')
          await loadMedia()
        } catch (error) {
          console.error('Error updating publish state:', error)
          const msg = error instanceof Error ? error.message : String(error)
          toast.error('Failed to update visibility', { description: msg })
        }
      },
    })
  }

  const requestArchiveMedia = (item: WebsiteMediaItem) => {
    queueConfirmation({
      title: 'Archive this image?',
      message:
        'Archived images are removed from the live website but kept in the system so they can be restored later.',
      actionLabel: 'Archive image',
      tone: 'danger',
      onConfirm: async () => {
        try {
          await archiveWebsiteMedia(item.id)
          toast.success('Image archived')
          await loadMedia()
        } catch (error) {
          console.error('Error archiving media:', error)
          const msg = error instanceof Error ? error.message : String(error)
          toast.error('Failed to archive image', { description: msg })
        }
      },
    })
  }

  const requestRestoreMedia = (item: WebsiteMediaItem) => {
    queueConfirmation({
      title: 'Restore this image?',
      message:
        'Restoring returns the image to the media library. If it remains published, it can appear on the live site immediately.',
      actionLabel: 'Restore image',
      tone: 'default',
      onConfirm: async () => {
        try {
          await restoreWebsiteMedia(item.id)
          toast.success('Image restored')
          await loadMedia()
        } catch (error) {
          console.error('Error restoring media:', error)
          const msg = error instanceof Error ? error.message : String(error)
          toast.error('Failed to restore image', { description: msg })
        }
      },
    })
  }

  const requestMoveMedia = async (item: WebsiteMediaItem, direction: 'up' | 'down') => {
    // Build the ordered list of siblings as currently displayed
    const siblingItems = [...mediaItems]
      .filter(
        (mediaItem) =>
          mediaItem.placement === item.placement &&
          mediaItem.is_archived === item.is_archived
      )
      .sort((a, b) => {
        if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })

    const currentIndex = siblingItems.findIndex((mediaItem) => mediaItem.id === item.id)

    if (currentIndex === -1) {
      toast.error('Unable to locate this image in the current order.')
      return
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (targetIndex < 0 || targetIndex >= siblingItems.length) {
      toast.error(
        direction === 'up'
          ? 'Already at the top of this section.'
          : 'Already at the bottom of this section.'
      )
      return
    }

    // Optimistic update — reorder locally so UI responds instantly
    const reordered = [...siblingItems]
    const [moved] = reordered.splice(currentIndex, 1)
    reordered.splice(targetIndex, 0, moved)

    const updatedSortOrders = new Map(reordered.map((m, i) => [m.id, i]))
    setMediaItems((prev) =>
      prev.map((m) =>
        updatedSortOrders.has(m.id) ? { ...m, sort_order: updatedSortOrders.get(m.id)! } : m
      )
    )

    try {
      await moveWebsiteMedia(item.id, direction)
      await loadMedia()
    } catch (error) {
      console.error('Error moving media:', error)
      // Revert the optimistic update on failure
      await loadMedia()
      const msg = error instanceof Error ? error.message : String(error)
      toast.error('Failed to update image order', { description: msg })
    }
  }

  const requestDeleteMedia = (item: WebsiteMediaItem) => {
    queueConfirmation({
      title: 'Delete this image permanently?',
      message:
        'This removes the image record and its stored file. This action cannot be undone.',
      actionLabel: 'Delete permanently',
      tone: 'danger',
      onConfirm: async () => {
        try {
          await deleteWebsiteMedia(item.id)
          if (mediaForm.id === item.id) {
            resetMediaForm()
          }
          toast.success('Image deleted permanently')
          await loadMedia()
        } catch (error) {
          console.error('Error deleting media:', error)
          const msg = error instanceof Error ? error.message : String(error)
          toast.error('Failed to delete image', { description: msg })
        }
      },
    })
  }

  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  const filteredOrders = orders
    .filter((order) => {
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus
      const matchesSource = sourceFilter === 'all' || order.source === sourceFilter
      const matchesSearch =
        normalizedSearchQuery.length === 0 ||
        [
          order.customer_name,
          order.customer_email,
          order.customer_phone,
          order.event_type,
          order.cake_description,
          order.design_preferences,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearchQuery)

      return matchesStatus && matchesSource && matchesSearch
    })
    .sort((left, right) => {
      if (focusOrderId === left.id) {
        return -1
      }

      if (focusOrderId === right.id) {
        return 1
      }

      return new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
    })

  const normalizedMediaSearchQuery = mediaSearchQuery.trim().toLowerCase()
  const filteredMedia = mediaItems.filter((item) => {
    const matchesPlacement = mediaPlacementFilter === 'all' || item.placement === mediaPlacementFilter

    const matchesState =
      mediaStateFilter === 'all' ||
      (mediaStateFilter === 'archived' && item.is_archived) ||
      (mediaStateFilter === 'live' && !item.is_archived && item.is_published) ||
      (mediaStateFilter === 'draft' && !item.is_archived && !item.is_published)

    const matchesSearch =
      normalizedMediaSearchQuery.length === 0 ||
      [
        item.title,
        item.description,
        item.alt_text,
        item.category,
        item.placement,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalizedMediaSearchQuery)

    return matchesPlacement && matchesState && matchesSearch
  })

  const stats = {
    total: orders.length,
    new: orders.filter((order) => order.status === 'new').length,
    started: orders.filter((order) => order.status === 'started').length,
    inProgress: orders.filter((order) => order.status === 'in_progress').length,
    completed: orders.filter((order) => order.status === 'completed').length,
    active: orders.filter((order) => order.status === 'started' || order.status === 'in_progress').length,
    chatbot: orders.filter((order) => order.source === 'chatbot').length,
    contactForm: orders.filter((order) => order.source === 'contact_form').length,
  }

  const mediaStats = {
    total: mediaItems.length,
    live: mediaItems.filter((item) => !item.is_archived && item.is_published).length,
    draft: mediaItems.filter((item) => !item.is_archived && !item.is_published).length,
    archived: mediaItems.filter((item) => item.is_archived).length,
    hero: mediaItems.filter((item) => item.placement === 'hero' && !item.is_archived).length,
    gallery: mediaItems.filter((item) => item.placement === 'gallery' && !item.is_archived).length,
  }

  const recentOrders = orders.slice(0, 5)
  const adminDraft = buildAdminNewOrderNotification(previewOrder, buildDashboardOrderLink(previewOrder.id))
  const acknowledgementDraft = buildCustomerOrderAcknowledgementNotification(previewOrder)
  const startedDraft = buildCustomerOrderStatusNotification(previewOrder, 'started', 'new')
  const progressDraft = buildCustomerOrderStatusNotification(previewOrder, 'in_progress', 'started')
  const completedDraft = buildCustomerOrderStatusNotification(previewOrder, 'completed', 'in_progress')
  const activeViewConfig = adminViews.find((view) => view.id === activeView) || adminViews[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 px-4 pb-12 pt-20">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-4 rounded-3xl border border-purple-100 bg-white/90 p-3 shadow-lg backdrop-blur-sm lg:hidden">
          <div className="flex items-center gap-3 overflow-x-auto">
            {adminViews.map((view) => (
              <button
                key={view.id}
                onClick={() => setView(view.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeView === view.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px,minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-[2rem] border border-purple-100 bg-white/90 p-4 shadow-xl backdrop-blur-sm">
              <div className="border-b border-purple-100 px-3 pb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-purple-600">EVO Cakes</p>
                <h1 className="mt-2 text-2xl font-bold text-gray-900">Admin</h1>
              </div>

              <nav className="mt-4 space-y-2">
                {adminViews.map((view) => {
                  const Icon = view.icon

                  return (
                    <button
                      key={view.id}
                      onClick={() => setView(view.id)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all ${
                        activeView === view.id
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{view.label}</span>
                    </button>
                  )
                })}
              </nav>

              <div className="mt-6 space-y-2 border-t border-purple-100 pt-4">
                <button
                  onClick={() => {
                    void loadOrders(true)
                    void loadMedia()
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-gray-700 transition-all hover:bg-gray-100"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-gray-700 transition-all hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="flex flex-col gap-3 rounded-[2rem] border border-purple-100 bg-white/90 p-5 shadow-xl backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-3xl font-bold text-gray-900">{activeViewConfig.label}</h2>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500">
                {lastUpdatedAt && (
                  <span className="rounded-full bg-gray-100 px-3 py-1">
                    Updated {lastUpdatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
                {focusOrderId && activeView === 'orders' && (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">
                    Focus order pinned
                  </span>
                )}
              </div>
            </div>

            {activeView === 'overview' && (
              <div className="space-y-5">

                {/* ── Metric row ── */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <MetricCard label="Total Orders" value={stats.total} tone="blue" icon={<Circle className="h-5 w-5 text-blue-500" />} />
                  <MetricCard label="Active Pipeline" value={stats.active} tone="purple" icon={<Clock3 className="h-5 w-5 text-purple-500" />} />
                  <MetricCard label="Completed" value={stats.completed} tone="green" icon={<CheckCircle2 className="h-5 w-5 text-green-500" />} />
                  <MetricCard label="Live Media" value={mediaStats.live} tone="pink" icon={<ImagePlus className="h-5 w-5 text-pink-500" />} />
                </div>

                {/* ── Pipeline ── */}
                <section className="rounded-3xl border border-purple-100 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
                  <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Order Pipeline</h2>
                      <p className="text-sm text-gray-500">Click any stage to open the filtered order list.</p>
                    </div>
                    {lastUpdatedAt && (
                      <p className="text-xs text-gray-400">
                        Updated {lastUpdatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {orderStatuses.map((status) => {
                      const count = status === 'new' ? stats.new : status === 'started' ? stats.started : status === 'in_progress' ? stats.inProgress : stats.completed
                      return (
                        <button
                          key={status}
                          onClick={() => { setView('orders'); setFilterStatus(status) }}
                          className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg ${getStatusClasses(status)}`}
                        >
                          <p className="text-xs font-bold uppercase tracking-widest opacity-70">{orderStatusLabels[status]}</p>
                          <p className="mt-3 text-4xl font-extrabold leading-none">{count}</p>
                          <p className="mt-2 text-xs leading-snug opacity-80">{orderStatusDescriptions[status]}</p>
                          <div className="absolute bottom-3 right-3 opacity-20 transition-opacity group-hover:opacity-40">
                            <ClipboardList className="h-8 w-8" />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </section>

                {/* ── Recent Orders + System Status ── */}
                <div className="grid gap-5 xl:grid-cols-[1.4fr,1fr]">

                  {/* Recent Orders */}
                  <section className="rounded-3xl border border-purple-100 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                        <p className="text-sm text-gray-500">Latest activity from contact form and chatbot.</p>
                      </div>
                      <button
                        onClick={() => setView('orders')}
                        className="shrink-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:from-pink-600 hover:to-purple-600"
                      >
                        View all
                      </button>
                    </div>

                    {recentOrders.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-pink-200 bg-pink-50/50 px-5 py-8 text-center">
                        <p className="text-sm font-medium text-gray-600">No orders yet.</p>
                        <p className="mt-1 text-xs text-gray-400">Orders from the contact form and chatbot will appear here.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {recentOrders.map((order) => (
                          <button
                            key={order.id}
                            onClick={() => { setView('orders'); setSearchParams({ view: 'orders', order: order.id }) }}
                            className="group flex w-full items-center gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-3.5 text-left transition-all hover:border-purple-200 hover:bg-purple-50/40 hover:shadow-sm"
                          >
                            {/* Avatar */}
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-sm font-bold text-white shadow-sm">
                              {order.customer_name.charAt(0).toUpperCase()}
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="truncate text-sm font-semibold text-gray-900">{order.customer_name}</p>
                                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getStatusClasses(order.status)}`}>
                                  {formatOrderStatus(order.status)}
                                </span>
                              </div>
                              <p className="mt-0.5 truncate text-xs text-gray-500">{order.cake_description}</p>
                            </div>

                            {/* Meta */}
                            <div className="shrink-0 text-right">
                              <p className="text-xs text-gray-400">{formatEventDate(order.event_date)}</p>
                              <p className="mt-0.5 text-[10px] uppercase tracking-wide text-gray-400">
                                {order.source === 'chatbot' ? 'Chatbot' : 'Form'}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* System Status */}
                  <section className="rounded-3xl border border-purple-100 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 shadow-md">
                        <ShieldCheck className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">System Status</h2>
                        <p className="text-xs text-gray-500">What's live and running.</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {[
                        { label: 'Edge function deployed', done: true },
                        { label: 'Resend API key configured', done: true },
                        { label: 'Admin notification email set', done: true },
                        { label: 'Customer reply-to Gmail set', done: true },
                        { label: 'Supabase storage buckets active', done: true },
                        { label: 'RLS policies applied', done: true },
                        { label: 'Domain DNS records submitted', done: true },
                        { label: 'Resend domain verified', done: false },
                      ].map(({ label, done }) => (
                        <div
                          key={label}
                          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${done ? 'bg-emerald-50' : 'bg-amber-50'}`}
                        >
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${done ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white'}`}>
                            {done ? '✓' : '⏳'}
                          </span>
                          <span className={`${done ? 'text-emerald-800' : 'text-amber-800'}`}>{label}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setView('notifications')}
                      className="mt-5 w-full rounded-2xl border border-purple-200 bg-purple-50 py-3 text-sm font-semibold text-purple-700 transition-all hover:bg-purple-100"
                    >
                      Review email templates →
                    </button>
                  </section>

                </div>
              </div>
            )}

            {activeView === 'orders' && (
              <div className="space-y-6">
            <section className="rounded-3xl border border-purple-100 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
              <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Order Operations</h2>
                  <p className="text-sm text-gray-600">Search, prioritize, and move orders through the workflow.</p>
                </div>

                <div className="relative w-full lg:max-w-xl">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by customer, email, phone, or cake details"
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-700 outline-none transition-all focus:border-purple-300 focus:ring-2 focus:ring-purple-200"
                  />
                </div>
              </div>

              <div className="grid gap-3 xl:grid-cols-[1fr,auto]">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      filterStatus === 'all'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                        : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    All Statuses
                  </button>
                  {orderStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        filterStatus === status
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                          : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {formatOrderStatus(status)}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setSourceFilter('all')}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      sourceFilter === 'all'
                        ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All Sources
                  </button>
                  {(Object.keys(sourceLabels) as Array<Exclude<SourceFilter, 'all'>>).map((source) => (
                    <button
                      key={source}
                      onClick={() => setSourceFilter(source)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        sourceFilter === source
                          ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {sourceLabels[source]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span>{filteredOrders.length} showing</span>
                <span>{stats.chatbot} chatbot</span>
                <span>{stats.contactForm} contact form</span>
                {focusOrderId && (
                  <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-700">
                    Focus order pinned to top
                  </span>
                )}
                {lastUpdatedAt && (
                  <span>Updated {lastUpdatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                )}
              </div>
            </section>

            {isLoadingOrders ? (
              <LoadingPanel label="Loading orders..." />
            ) : filteredOrders.length === 0 ? (
              <EmptyPanel
                title="No orders match the current filters."
                description="Try widening the search or resetting the status and source filters."
              />
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order, index) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    index={index}
                    isFocused={order.id === focusOrderId}
                    onStatusChange={requestStatusChange}
                  />
                ))}
              </div>
            )}
              </div>
            )}

            {activeView === 'media' && (
              <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
            <section ref={mediaFormRef} className="rounded-3xl border border-purple-100 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${mediaForm.id ? 'bg-purple-100 text-purple-700' : 'bg-pink-100 text-pink-700'}`}>
                  {mediaForm.id ? <Pencil className="h-5 w-5" /> : <Upload className="h-5 w-5" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {mediaForm.id ? 'Edit Website Media' : 'Add Website Media'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {mediaForm.id ? 'Update the details or replace the image file.' : 'Upload hero slides or gallery images that can go live without touching repo files.'}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-gray-700">
                    <span>Placement</span>
                    <select
                      value={mediaForm.placement}
                      onChange={(event) => {
                        const nextPlacement = event.target.value as MediaPlacement
                        setMediaForm((current) => ({
                          ...current,
                          placement: nextPlacement,
                          category: nextPlacement === 'gallery' ? current.category || 'Wedding Cakes' : '',
                        }))
                      }}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-purple-300 focus:ring-2 focus:ring-purple-200"
                    >
                      {mediaPlacementOptions.map((placement) => (
                        <option key={placement} value={placement}>
                          {mediaPlacementLabels[placement]}
                        </option>
                      ))}
                    </select>
                  </label>

                  {mediaForm.placement === 'gallery' && (
                    <label className="space-y-2 text-sm font-medium text-gray-700">
                      <span>Category</span>
                      <select
                        value={mediaForm.category}
                        onChange={(event) => setMediaForm((current) => ({ ...current, category: event.target.value as GalleryContentCategory }))}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-purple-300 focus:ring-2 focus:ring-purple-200"
                      >
                        {galleryContentCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-gray-700">
                    <span>Title</span>
                    <input
                      type="text"
                      value={mediaForm.title}
                      onChange={(event) => setMediaForm((current) => ({ ...current, title: event.target.value }))}
                      placeholder="Optional title for admin and hero copy"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-purple-300 focus:ring-2 focus:ring-purple-200"
                    />
                  </label>

                  <label className="space-y-2 text-sm font-medium text-gray-700">
                    <span>Sort Order</span>
                    <input
                      type="number"
                      value={mediaForm.sort_order}
                      onChange={(event) => setMediaForm((current) => ({ ...current, sort_order: event.target.value }))}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-purple-300 focus:ring-2 focus:ring-purple-200"
                    />
                  </label>
                </div>

                <label className="space-y-2 text-sm font-medium text-gray-700">
                  <span>Description / Subtitle</span>
                  <textarea
                    rows={3}
                    value={mediaForm.description}
                    onChange={(event) => setMediaForm((current) => ({ ...current, description: event.target.value }))}
                    placeholder="Hero slides use this as the subtitle. Gallery items can use it as internal context."
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-purple-300 focus:ring-2 focus:ring-purple-200"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-gray-700">
                  <span>Alt Text</span>
                  <input
                    type="text"
                    value={mediaForm.alt_text}
                    onChange={(event) => setMediaForm((current) => ({ ...current, alt_text: event.target.value }))}
                    placeholder="Describe the image for accessibility"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition-all focus:border-purple-300 focus:ring-2 focus:ring-purple-200"
                  />
                </label>

                <div className="space-y-3">
                  {mediaFilePreview && (
                    <div className="relative overflow-hidden rounded-2xl border border-purple-200 bg-gray-50">
                      <img
                        src={mediaFilePreview}
                        alt="Preview"
                        className="h-48 w-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                      {mediaFile && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-2">
                          <p className="truncate text-xs font-medium text-white">{mediaFile.name}</p>
                        </div>
                      )}
                    </div>
                  )}
                  <label className="flex cursor-pointer flex-col gap-3 rounded-2xl border border-dashed border-purple-200 bg-purple-50/60 p-4 text-sm font-medium text-gray-700 transition-colors hover:border-purple-400 hover:bg-purple-50">
                    <span className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-purple-600" />
                      {mediaFile ? 'Change selected image' : mediaForm.id ? 'Replace image file (optional)' : 'Click to select image'}
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(event) => {
                        const file = event.target.files?.[0] || null
                        setMediaFile(file)
                        if (file) {
                          const preview = URL.createObjectURL(file)
                          setMediaFilePreview(preview)
                        } else if (!mediaForm.id) {
                          setMediaFilePreview(null)
                        }
                      }}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500">
                      {mediaFile ? `✓ ${mediaFile.name} (${(mediaFile.size / 1024 / 1024).toFixed(1)} MB)` : mediaForm.id ? 'Leave empty to keep the current image.' : 'PNG, JPG, or WEBP · up to 10MB'}
                    </p>
                  </label>
                </div>

                <label className="flex items-center gap-3 rounded-2xl border border-pink-100 bg-pink-50/70 px-4 py-3 text-sm font-medium text-gray-800">
                  <input
                    type="checkbox"
                    checked={mediaForm.is_published}
                    onChange={(event) => setMediaForm((current) => ({ ...current, is_published: event.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  Publish immediately after saving
                </label>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleMediaSubmit}
                    disabled={isSavingMedia}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-pink-600 hover:to-purple-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {mediaForm.id ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {mediaForm.id ? 'Save Changes' : 'Upload Media'}
                  </button>

                  {mediaForm.id && (
                    <button
                      onClick={resetMediaForm}
                      className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-purple-100 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
              {/* Library header */}
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
                  <p className="mt-1 text-sm text-gray-500">Manage all website images — arrange, hide, archive, restore, or delete.</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-semibold text-emerald-700">{mediaStats.live} Live</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <span className="text-sm font-semibold text-amber-700">{mediaStats.draft} Draft</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2">
                    <span className="h-2 w-2 rounded-full bg-gray-400" />
                    <span className="text-sm font-semibold text-gray-600">{mediaStats.archived} Archived</span>
                  </div>
                </div>
              </div>

              {mediaSetupMessage && (
                <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
                  {mediaSetupMessage}
                </div>
              )}

              {/* Filters */}
              <div className="mb-5 space-y-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={mediaSearchQuery}
                    onChange={(event) => setMediaSearchQuery(event.target.value)}
                    placeholder="Search by title, description, category, or alt text…"
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-4 text-sm text-gray-700 outline-none transition-all focus:border-purple-300 focus:ring-2 focus:ring-purple-200"
                  />
                </div>

                {/* Placement filter */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Placement:</span>
                  {(['all', ...mediaPlacementOptions] as const).map((placement) => {
                    const count = placement === 'all'
                      ? mediaItems.length
                      : mediaItems.filter((i) => i.placement === placement).length
                    return (
                      <button
                        key={placement}
                        onClick={() => setMediaPlacementFilter(placement)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                          mediaPlacementFilter === placement
                            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                            : 'border border-gray-200 bg-white text-gray-600 hover:border-purple-200 hover:bg-purple-50'
                        }`}
                      >
                        {placement === 'all' ? 'All' : mediaPlacementLabels[placement]}
                        <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                          mediaPlacementFilter === placement ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                        }`}>{count}</span>
                      </button>
                    )
                  })}
                </div>

                {/* State filter */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Status:</span>
                  {([
                    { value: 'all' as const, label: 'All', count: mediaItems.length },
                    { value: 'live' as const, label: 'Live', count: mediaStats.live },
                    { value: 'draft' as const, label: 'Draft', count: mediaStats.draft },
                    { value: 'archived' as const, label: 'Archived', count: mediaStats.archived },
                  ]).map(({ value, label, count }) => (
                    <button
                      key={value}
                      onClick={() => setMediaStateFilter(value)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                        mediaStateFilter === value
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'border border-gray-200 bg-white text-gray-600 hover:border-purple-200 hover:bg-purple-50'
                      }`}
                    >
                      {label}
                      <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        mediaStateFilter === value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>{count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {isLoadingMedia ? (
                <LoadingPanel label="Loading media library…" />
              ) : filteredMedia.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/40 px-6 py-12 text-center">
                  <ImageIcon className="mx-auto mb-3 h-10 w-10 text-purple-300" />
                  <p className="text-base font-semibold text-gray-700">
                    {mediaItems.length === 0 ? 'No images uploaded yet' : 'No images match these filters'}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {mediaItems.length === 0
                      ? 'Use the upload form to add your first gallery or hero image.'
                      : `Try selecting "All" for both placement and status, or clear the search.`}
                  </p>
                  {mediaItems.length > 0 && (
                    <button
                      onClick={() => { setMediaPlacementFilter('all'); setMediaStateFilter('all'); setMediaSearchQuery('') }}
                      className="mt-4 rounded-full bg-purple-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-purple-700"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredMedia.map((item) => (
                    <div
                      key={item.id}
                      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md ${
                        item.is_archived ? 'border-gray-200 opacity-75' : 'border-purple-100'
                      }`}
                    >
                      {/* Image thumbnail */}
                      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
                        <img
                          src={item.public_url}
                          alt={item.alt_text || item.title || 'Website media preview'}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            target.parentElement!.innerHTML += `<div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:8px;"><svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='#c084fc' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='3' width='18' height='18' rx='2'/><circle cx='8.5' cy='8.5' r='1.5'/><polyline points='21,15 16,10 5,21'/></svg><p style='font-size:12px;color:#a78bfa;margin:0'>Image unavailable</p></div>`
                          }}
                        />
                        {/* Overlay badges */}
                        <div className="absolute left-2 top-2 flex gap-1.5">
                          <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                            {mediaPlacementLabels[item.placement]}
                          </span>
                          {item.category && (
                            <span className="rounded-full bg-pink-500/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                              {item.category}
                            </span>
                          )}
                        </div>
                        <div className="absolute right-2 top-2">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm ${
                            item.is_archived
                              ? 'bg-gray-700/80 text-white'
                              : item.is_published
                                ? 'bg-emerald-500/90 text-white'
                                : 'bg-amber-400/90 text-white'
                          }`}>
                            {item.is_archived ? 'Archived' : item.is_published ? '● Live' : '○ Draft'}
                          </span>
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="p-4">
                        <p className="truncate text-sm font-semibold text-gray-900">{item.title || 'Untitled image'}</p>
                        {item.description && (
                          <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{item.description}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-400">Sort order: {item.sort_order} · {formatEventDate(item.updated_at)}</p>

                        {/* Actions row */}
                        <div className="mt-3 flex flex-wrap items-center gap-1.5">
                          {/* Edit */}
                          <button
                            onClick={() => {
                              setMediaForm(buildMediaFormState(item))
                              setMediaFile(null)
                              setMediaFilePreview(item.public_url)
                              setTimeout(() => {
                                mediaFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                              }, 50)
                            }}
                            className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
                          >
                            <Pencil className="h-3 w-3" />
                            Edit
                          </button>

                          {/* Arrange */}
                          <button
                            onClick={() => requestMoveMedia(item, 'up')}
                            className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-50"
                            title="Move up"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => requestMoveMedia(item, 'down')}
                            className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-50"
                            title="Move down"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>

                          {item.is_archived ? (
                            <>
                              <button
                                onClick={() => requestRestoreMedia(item)}
                                className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-all hover:bg-emerald-200"
                              >
                                <RotateCcw className="h-3 w-3" />
                                Restore
                              </button>
                              <button
                                onClick={() => requestDeleteMedia(item)}
                                className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 transition-all hover:bg-red-200"
                              >
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => requestToggleMediaVisibility(item, !item.is_published)}
                                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                                  item.is_published
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                }`}
                              >
                                {item.is_published ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                                {item.is_published ? 'Hide' : 'Publish'}
                              </button>
                              <button
                                onClick={() => requestArchiveMedia(item)}
                                className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-all hover:bg-red-100"
                              >
                                <Archive className="h-3 w-3" />
                                Archive
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
              </div>
            )}

            {activeView === 'notifications' && (
              <div className="space-y-6">
            <section className="rounded-3xl border border-purple-100 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                  <BellRing className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Professional Notification Drafts</h2>
                  <p className="text-sm text-gray-600">These are the templates the system is prepared to send.</p>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <NotificationCard
                  title="Admin New Order Alert"
                  subject={adminDraft.subject}
                  content={adminDraft.text}
                  asideLabel="Admin SMS"
                  asideContent={adminDraft.sms}
                />
                <NotificationCard
                  title="Customer Receipt Confirmation"
                  subject={acknowledgementDraft.subject}
                  content={acknowledgementDraft.text}
                />
                <NotificationCard
                  title="Customer Update: Started"
                  subject={startedDraft.subject}
                  content={startedDraft.text}
                />
                <NotificationCard
                  title="Customer Update: In Progress"
                  subject={progressDraft.subject}
                  content={progressDraft.text}
                />
                <NotificationCard
                  title="Customer Update: Completed"
                  subject={completedDraft.subject}
                  content={completedDraft.text}
                />
              </div>
            </section>

            <section className="rounded-3xl border border-purple-100 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-gray-900">Operational Notes</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-pink-50 px-5 py-4 text-sm text-gray-700">
                  New orders can notify the admin by email and SMS with a direct dashboard link to the order queue.
                </div>
                <div className="rounded-2xl bg-purple-50 px-5 py-4 text-sm text-gray-700">
                  Customers can now receive an acknowledgement email as soon as an order is submitted through the chatbot or contact form.
                </div>
                <div className="rounded-2xl bg-blue-50 px-5 py-4 text-sm text-gray-700">
                  Status changes only move forward one step at a time so customers do not receive confusing workflow emails out of order.
                </div>
                <div className="rounded-2xl bg-emerald-50 px-5 py-4 text-sm text-gray-700">
                  The dashboard link supports <code>?view=orders&amp;order=&lt;id&gt;</code> so admin alerts can deep-link directly into the queue.
                </div>
              </div>
            </section>
              </div>
            )}
          </div>
        </div>
      </div>

      {confirmationState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-3xl border border-purple-100 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                confirmationState.tone === 'danger' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {confirmationState.tone === 'danger' ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : (
                  <ShieldCheck className="h-5 w-5" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{confirmationState.title}</h3>
                <p className="text-sm text-gray-600">Please confirm this live action.</p>
              </div>
            </div>

            <p className="text-sm leading-6 text-gray-700">{confirmationState.message}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleConfirmAction}
                disabled={isConfirmingAction}
                className={`rounded-full px-5 py-3 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
                  confirmationState.tone === 'danger'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
                }`}
              >
                {isConfirmingAction ? 'Saving...' : confirmationState.actionLabel}
              </button>
              <button
                onClick={() => setConfirmationState(null)}
                disabled={isConfirmingAction}
                className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({
  label,
  value,
  tone,
  icon,
}: {
  label: string
  value: number
  tone: 'blue' | 'purple' | 'green' | 'pink'
  icon: ReactNode
}) {
  const toneClasses = {
    blue: 'bg-blue-100',
    purple: 'bg-purple-100',
    green: 'bg-green-100',
    pink: 'bg-pink-100',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-purple-100 bg-white/90 p-6 shadow-xl backdrop-blur-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${toneClasses[tone]}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  )
}

function MetricPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-pink-100 bg-pink-50/70 px-4 py-3 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-600">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

function LoadingPanel({ label }: { label: string }) {
  return (
    <div className="rounded-3xl border border-purple-100 bg-white/90 py-16 text-center shadow-xl backdrop-blur-sm">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
      <p className="mt-4 text-gray-600">{label}</p>
    </div>
  )
}

function EmptyPanel({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-purple-100 bg-white/90 px-6 py-16 text-center shadow-xl backdrop-blur-sm">
      <p className="text-lg font-semibold text-gray-900">{title}</p>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  )
}

function NotificationCard({
  title,
  subject,
  content,
  asideLabel,
  asideContent,
}: {
  title: string
  subject: string
  content: string
  asideLabel?: string
  asideContent?: string
}) {
  return (
    <div className="rounded-3xl border border-purple-100 bg-white p-5 shadow-md">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-purple-600">{title}</p>
      <p className="mt-3 text-base font-semibold text-gray-900">{subject}</p>
      <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">
        {content}
      </pre>
      {asideLabel && asideContent && (
        <div className="mt-4 rounded-2xl bg-pink-50 p-4 text-sm text-gray-700">
          <p className="font-semibold text-pink-700">{asideLabel}</p>
          <p className="mt-2">{asideContent}</p>
        </div>
      )}
    </div>
  )
}

function OrderCard({
  order,
  index,
  isFocused,
  onStatusChange,
}: {
  order: ResolvedOrder
  index: number
  isFocused: boolean
  onStatusChange: (order: ResolvedOrder, status: OrderStatus) => void
}) {
  const [showImages, setShowImages] = useState(false)
  const sourceLabel = order.source === 'chatbot' ? 'Chatbot' : 'Contact Form'
  const sourceClasses =
    order.source === 'chatbot'
      ? 'border-purple-200 bg-purple-100 text-purple-700'
      : 'border-sky-200 bg-sky-100 text-sky-700'
  const nextStatus = getNextOrderStatus(order.status)

  const orderSummaryParts = [
    order.event_type ? `${order.event_type} cake` : 'Cake order',
    order.event_date ? `for ${formatEventDate(order.event_date)}` : null,
    order.serving_size ? `serving ${order.serving_size}` : null,
    order.cake_description ? `details: ${order.cake_description}` : null,
    order.dietary_restrictions ? `dietary: ${order.dietary_restrictions}` : null,
  ].filter(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`rounded-3xl border bg-white/90 p-6 shadow-xl backdrop-blur-sm ${
        isFocused ? 'border-amber-300 ring-2 ring-amber-200' : 'border-purple-100'
      }`}
    >
      <div className="grid gap-6 xl:grid-cols-[0.95fr,1.1fr,0.95fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full border px-3 py-1 text-sm font-medium ${getStatusClasses(order.status)}`}>
                {formatOrderStatus(order.status)}
              </span>
              <span className={`rounded-full border px-3 py-1 text-sm font-medium ${sourceClasses}`}>
                {sourceLabel}
              </span>
              {isFocused && (
                <span className="rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
                  Linked from alert
                </span>
              )}
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>{formatEventDate(order.created_at)}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-900">
              <User className="h-4 w-4 text-purple-600" />
              <span className="font-semibold">{order.customer_name}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4 text-purple-600" />
              <a href={`mailto:${order.customer_email}`} className="transition-colors hover:text-purple-600">
                {order.customer_email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-4 w-4 text-purple-600" />
              <a href={`tel:${order.customer_phone}`} className="font-semibold transition-colors hover:text-purple-600">
                {order.customer_phone}
              </a>
            </div>
            {order.event_type && (
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span>
                  {order.event_type}
                  {order.event_date ? ` (${formatEventDate(order.event_date)})` : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Order Summary</label>
            <p className="mt-1 leading-6 text-gray-800">{orderSummaryParts.join(', ')}</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <MessageSquare className="h-4 w-4" />
              Cake Description
            </label>
            <p className="mt-1 text-gray-800">{order.cake_description}</p>
          </div>

          {order.design_preferences && order.design_preferences !== order.cake_description && (
            <div>
              <label className="text-sm font-medium text-gray-600">Design Notes</label>
              <p className="mt-1 text-gray-800">{order.design_preferences}</p>
            </div>
          )}

          {order.order_images.length > 0 && (
            <button
              onClick={() => setShowImages((current) => !current)}
              className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700 transition-all hover:bg-purple-200"
            >
              <ImageIcon className="h-4 w-4" />
              {showImages ? 'Hide' : 'Show'} {order.order_images.length} reference image{order.order_images.length > 1 ? 's' : ''}
            </button>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-600">Workflow</label>
          <div className={`rounded-2xl border px-4 py-4 ${getStatusClasses(order.status)}`}>
            <span className="block text-xs font-semibold uppercase tracking-[0.18em]">Current Stage</span>
            <span className="mt-2 block text-lg font-semibold">{formatOrderStatus(order.status)}</span>
            <span className="mt-1 block text-sm opacity-90">{orderStatusDescriptions[order.status]}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {orderStatuses.map((status) => {
              const isCurrent = status === order.status
              const isUpcoming = status === nextStatus

              return (
                <div
                  key={status}
                  className={`rounded-2xl border px-3 py-2 text-center text-sm font-medium ${
                    isCurrent
                      ? 'border-purple-200 bg-purple-100 text-purple-700'
                      : isUpcoming
                        ? 'border-pink-200 bg-pink-50 text-pink-700'
                        : 'border-gray-200 bg-gray-50 text-gray-500'
                  }`}
                >
                  {formatOrderStatus(status)}
                </div>
              )
            })}
          </div>

          {nextStatus ? (
            <button
              onClick={() => onStatusChange(order, nextStatus)}
              className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-3 text-left text-white shadow-lg transition-all hover:from-pink-600 hover:to-purple-600"
            >
              <span className="block font-semibold">Mark as {formatOrderStatus(nextStatus)}</span>
              <span className="mt-1 block text-xs text-white/85">
                This is the next allowed step. A status update email will be sent to the customer.
              </span>
            </button>
          ) : (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              This order is complete. No further workflow emails will be sent.
            </div>
          )}
        </div>
      </div>

      {showImages && order.order_images.length > 0 && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {order.order_images.map((image) => (
              <a
                key={image.id}
                href={image.preview_url || image.image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-gray-200 transition-all hover:border-purple-400"
              >
                <img
                  src={image.preview_url || image.image_url}
                  alt={image.file_name || 'Order image'}
                  className="h-full w-full object-cover"
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
