import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LogOut, Phone, Mail, Calendar, User,
  MessageSquare, Image as ImageIcon, CheckCircle2,
  Circle, Clock3
} from 'lucide-react'
import {
  supabase,
  getAllOrders,
  resolveOrderImageUrl,
  subscribeToOrders,
  updateOrderStatus,
} from '@/lib/supabase'
import { toast } from 'sonner'

interface Order {
  id: string
  source: string
  customer_name: string
  customer_email: string
  customer_phone: string
  event_type: string | null
  event_date: string | null
  cake_description: string
  design_preferences: string | null
  dietary_restrictions: string | null
  serving_size: string | null
  status: 'new' | 'in_progress' | 'completed'
  created_at: string
  order_images: Array<{
    id: string
    image_url: string
    file_name: string | null
    preview_url?: string
  }>
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'in_progress' | 'completed'>('all')
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/admin/login')
      }
    }

    loadOrders()
    checkAuth()

    // Subscribe to real-time updates
    const subscription = subscribeToOrders((payload) => {
      console.log('Real-time update:', payload)
      loadOrders() // Reload orders when there's a change

      if (payload.eventType === 'INSERT') {
        toast.success('New order received!', {
          description: `From ${payload.new.customer_name}`
        })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  const loadOrders = async () => {
    try {
      const data = await getAllOrders()
      const ordersWithResolvedImages = await Promise.all(
        ((data as Order[]) || []).map(async (order) => ({
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
    } catch (error) {
      console.error('Error loading orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const handleStatusChange = async (orderId: string, newStatus: 'new' | 'in_progress' | 'completed') => {
    try {
      await updateOrderStatus(orderId, newStatus)
      toast.success('Status updated!')
      loadOrders()
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(order => order.status === filterStatus)

  const stats = {
    total: orders.length,
    new: orders.filter(o => o.status === 'new').length,
    inProgress: orders.filter(o => o.status === 'in_progress').length,
    completed: orders.filter(o => o.status === 'completed').length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pt-20 px-4 pb-12">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Manage your cake orders</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Circle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">New</p>
                <p className="text-3xl font-bold text-orange-600">{stats.new}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Circle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">In Progress</p>
                <p className="text-3xl font-bold text-purple-600">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'new', 'in_progress', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === status
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-4">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-2xl">
            <p className="text-gray-500">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => (
              <OrderCard
                key={order.id}
                order={order}
                index={index}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Order Card Component
function OrderCard({
  order,
  index,
  onStatusChange
}: {
  order: Order
  index: number
  onStatusChange: (orderId: string, status: 'new' | 'in_progress' | 'completed') => void
}) {
  const [showImages, setShowImages] = useState(false)

  const statusColors = {
    new: 'bg-orange-100 text-orange-700 border-orange-200',
    in_progress: 'bg-purple-100 text-purple-700 border-purple-200',
    completed: 'bg-green-100 text-green-700 border-green-200',
  }

  const orderSummaryParts = [
    order.event_type ? `${order.event_type} cake` : 'Cake order',
    order.event_date ? `for ${new Date(order.event_date).toLocaleDateString()}` : null,
    order.serving_size ? `serving ${order.serving_size}` : null,
    order.cake_description ? `details: ${order.cake_description}` : null,
    order.dietary_restrictions ? `dietary: ${order.dietary_restrictions}` : null,
  ].filter(Boolean)

  const orderSummary = orderSummaryParts.join(', ')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg"
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Customer Info */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[order.status]}`}>
                {order.status.replace('_', ' ')}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-800 mb-2">
              <User className="w-4 h-4 text-purple-600" />
              <span className="font-semibold">{order.customer_name}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Mail className="w-4 h-4 text-purple-600" />
              <a href={`mailto:${order.customer_email}`} className="hover:text-purple-600">
                {order.customer_email}
              </a>
            </div>

            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Phone className="w-4 h-4 text-purple-600" />
              <a href={`tel:${order.customer_phone}`} className="hover:text-purple-600 font-semibold">
                {order.customer_phone}
              </a>
            </div>

            {order.event_type && (
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>{order.event_type}</span>
                {order.event_date && (
                  <span className="text-sm">({new Date(order.event_date).toLocaleDateString()})</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Middle: Order Details */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-600">Order Summary</label>
            <p className="mt-1 text-gray-800 leading-6">{orderSummary}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Cake Description
            </label>
            <p className="text-gray-800 mt-1">{order.cake_description}</p>
          </div>

          {order.design_preferences && order.design_preferences !== order.cake_description && (
            <div>
              <label className="text-sm font-medium text-gray-600">Design Notes</label>
              <p className="text-gray-800">{order.design_preferences}</p>
            </div>
          )}

          {order.dietary_restrictions && (
            <div>
              <label className="text-sm font-medium text-gray-600">Dietary Restrictions</label>
              <p className="text-gray-800">{order.dietary_restrictions}</p>
            </div>
          )}

          {order.serving_size && (
            <div>
              <label className="text-sm font-medium text-gray-600">Serving Size</label>
              <p className="text-gray-800">{order.serving_size}</p>
            </div>
          )}

          {order.order_images.length > 0 && (
            <button
              onClick={() => setShowImages(!showImages)}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              <ImageIcon className="w-4 h-4" />
              {order.order_images.length} Image{order.order_images.length > 1 ? 's' : ''}
            </button>
          )}
        </div>

        {/* Right: Status Management */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-600">Update Status</label>
          <div className="space-y-2">
            {(['new', 'in_progress', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => onStatusChange(order.id, status)}
                disabled={order.status === status}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${
                  order.status === status
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white cursor-default'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      {showImages && order.order_images.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {order.order_images.map((image) => (
              <a
                key={image.id}
                href={image.preview_url || image.image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-400 transition-all"
              >
                <img
                  src={image.preview_url || image.image_url}
                  alt={image.file_name || 'Order image'}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
