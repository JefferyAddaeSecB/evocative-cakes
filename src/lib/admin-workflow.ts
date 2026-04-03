export const orderStatuses = ['new', 'started', 'in_progress', 'completed'] as const

export type OrderStatus = (typeof orderStatuses)[number]

export const orderStatusLabels: Record<OrderStatus, string> = {
  new: 'New',
  started: 'Started',
  in_progress: 'In Progress',
  completed: 'Completed',
}

export const orderStatusDescriptions: Record<OrderStatus, string> = {
  new: 'New request received and awaiting review.',
  started: 'Order has been accepted and planning has started.',
  in_progress: 'Cake production is actively underway.',
  completed: 'Order is finished and ready for pickup, delivery, or closeout.',
}

export const galleryContentCategories = [
  'Wedding Cakes',
  'Birthday Cakes',
  'Cupcakes',
  'Cookies & Treats',
  'Custom Cakes',
] as const

export const galleryCategories = ['All', ...galleryContentCategories] as const

export type GalleryContentCategory = (typeof galleryContentCategories)[number]
export type GalleryCategory = (typeof galleryCategories)[number]

export const mediaPlacements = ['gallery', 'hero'] as const

export type MediaPlacement = (typeof mediaPlacements)[number]

export const mediaPlacementLabels: Record<MediaPlacement, string> = {
  gallery: 'Gallery',
  hero: 'Hero Slideshow',
}

export function formatOrderStatus(status: OrderStatus) {
  return orderStatusLabels[status]
}

export function getOrderStatusIndex(status: OrderStatus) {
  return orderStatuses.indexOf(status)
}

export function getNextOrderStatus(status: OrderStatus): OrderStatus | null {
  const nextIndex = getOrderStatusIndex(status) + 1
  return orderStatuses[nextIndex] ?? null
}

export function canAdvanceOrderStatus(currentStatus: OrderStatus, nextStatus: OrderStatus) {
  return getNextOrderStatus(currentStatus) === nextStatus
}

export function isGalleryContentCategory(value: string | null | undefined): value is GalleryContentCategory {
  if (!value) {
    return false
  }

  return galleryContentCategories.includes(value as GalleryContentCategory)
}
