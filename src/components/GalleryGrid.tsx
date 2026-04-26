import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  galleryCategories,
  galleryContentCategories,
  type GalleryCategory,
  type GalleryContentCategory,
} from '@/lib/admin-workflow'
import { getPublishedWebsiteMedia } from '@/lib/supabase'

interface GalleryImage {
  id: string
  src: string
  previewSrc: string
  alt: string
  category: GalleryContentCategory
}

// Preview folder names — match /public/images/gallery-previews/ exactly
const galleryFolders: Record<GalleryContentCategory, string> = {
  'Wedding Cakes': 'Wedding-Cakes',
  'Birthday Cakes': 'Birthday-Cakes',
  Cupcakes: 'Cupcakes',
  'Cookies & Treats': 'Cookies-and-Treats',
  'Custom Cakes': 'Custom Cakes',
}

// Full-res folder names — match /public/images/gallery/ exactly (case-sensitive, note trailing spaces)
const galleryFullResFolders: Record<GalleryContentCategory, string> = {
  'Wedding Cakes': 'WEDDING-CAKES ',
  'Birthday Cakes': 'Birthday-Cakes',
  Cupcakes: 'CUPCAKES ',
  'Cookies & Treats': 'COOKIES AND TREATS',
  'Custom Cakes': 'CUSTOM-CAKES',
}

const galleryFileMap: Record<GalleryContentCategory, string[]> = {
  'Wedding Cakes': Array.from({ length: 19 }, (_, i) => `${i + 1}.jpg`),
  'Birthday Cakes': Array.from({ length: 46 }, (_, i) => `${i + 1}.jpg`),
  Cupcakes: Array.from({ length: 23 }, (_, i) => `${i + 1}.jpg`),
  'Cookies & Treats': Array.from({ length: 31 }, (_, i) => `${i + 1}.jpg`),
  'Custom Cakes': Array.from({ length: 56 }, (_, i) => `${i + 1}.jpg`),
}

const buildGallerySrc = (category: GalleryContentCategory, fileName: string) =>
  `/images/gallery/${encodeURIComponent(galleryFullResFolders[category])}/${encodeURIComponent(fileName)}`

const buildGalleryPreviewSrc = (folder: string, fileName: string) =>
  `/images/gallery-previews/${encodeURIComponent(folder)}/${encodeURIComponent(fileName)}`

const buildAltText = (
  category: GalleryContentCategory,
  fileName: string,
  index: number
) => {
  const cleanedTitle = fileName
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/^IMG\s*/i, '')
    .replace(/\bWA\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!/[A-Za-z]/.test(cleanedTitle)) {
    return `${category} ${String(index + 1).padStart(2, '0')}`
  }

  return `${category}: ${cleanedTitle}`
}

const staticGalleryImages: GalleryImage[] = galleryContentCategories.flatMap((category) =>
  galleryFileMap[category].map((fileName, index) => ({
    id: `static-${category}-${fileName}`,
    src: buildGallerySrc(category, fileName),
    previewSrc: buildGalleryPreviewSrc(galleryFolders[category], fileName),
    alt: buildAltText(category, fileName, index),
    category,
  }))
)

function buildLiveMediaAltText(image: {
  category: GalleryContentCategory
  title: string | null
  description: string | null
  alt_text: string | null
}) {
  return image.alt_text || image.title || image.description || `${image.category} cake by EVO Cakes`
}

const PAGE_SIZE = 18

export default function GalleryGrid({ initialCategory }: { initialCategory?: string }) {
  const normalizedInitialCategory =
    initialCategory && galleryCategories.includes(initialCategory as GalleryCategory)
      ? (initialCategory as GalleryCategory)
      : 'All'

  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>(normalizedInitialCategory)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [lightboxImageSrc, setLightboxImageSrc] = useState<string | null>(null)
  const [thumbnailFallbackIds, setThumbnailFallbackIds] = useState<string[]>([])
  const [liveImages, setLiveImages] = useState<GalleryImage[]>([])
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    let isCancelled = false

    const loadLiveGalleryMedia = async () => {
      try {
        const media = await getPublishedWebsiteMedia('gallery')

        if (isCancelled) {
          return
        }

        setLiveImages(
          media
            .filter((item): item is typeof item & { category: GalleryContentCategory } =>
              Boolean(item.category) && galleryContentCategories.includes(item.category as GalleryContentCategory)
            )
            .map((item) => ({
              id: `live-${item.id}`,
              src: item.public_url,
              previewSrc: item.public_url,
              alt: buildLiveMediaAltText(item),
              category: item.category,
            }))
        )
      } catch (error) {
        console.error('Failed to load live gallery media:', error)
      }
    }

    void loadLiveGalleryMedia()

    return () => {
      isCancelled = true
    }
  }, [])

  const allImages = [...liveImages, ...staticGalleryImages]
  const filteredImages =
    selectedCategory === 'All'
      ? allImages
      : allImages.filter((image) => image.category === selectedCategory)

  const visibleImages = filteredImages.slice(0, visibleCount)
  const hasMore = visibleCount < filteredImages.length

  const activeImage = lightboxIndex !== null ? filteredImages[lightboxIndex] : null

  const goToPrev = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null || filteredImages.length === 0) return null
      return (prev - 1 + filteredImages.length) % filteredImages.length
    })
  }, [filteredImages.length])

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null || filteredImages.length === 0) return null
      return (prev + 1) % filteredImages.length
    })
  }, [filteredImages.length])

  useEffect(() => {
    setLightboxIndex(null)
    setVisibleCount(PAGE_SIZE)
  }, [selectedCategory])

  useEffect(() => {
    setLightboxImageSrc(activeImage?.src ?? null)
  }, [activeImage])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxIndex(null)
      } else if (event.key === 'ArrowLeft') {
        goToPrev()
      } else if (event.key === 'ArrowRight') {
        goToNext()
      }
    }

    if (lightboxIndex !== null) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [lightboxIndex, goToPrev, goToNext])

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-2.5 sm:mb-8 sm:gap-3 xl:grid-cols-6">
        {galleryCategories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`inline-flex min-h-11 w-full items-center justify-center rounded-full border px-3 py-2.5 text-center text-[13px] font-semibold transition-all duration-300 sm:min-h-12 sm:px-4 sm:py-3 sm:text-sm ${
              selectedCategory === category
                ? 'border-pink-200 bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-200/80'
                : 'border-pink-100 bg-pink-50/80 text-purple-700 hover:border-pink-200 hover:bg-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredImages.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-pink-200 bg-white/70 px-6 py-16 text-center shadow-lg backdrop-blur-sm">
          <p className="text-lg font-semibold text-slate-800">
            No images in {selectedCategory} yet.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            New media uploaded from the admin dashboard will appear here automatically.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-6 lg:grid-cols-3">
            {visibleImages.map((image, index) => (
              <motion.div
                key={image.id}
                className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-2xl shadow-xl sm:h-80 sm:aspect-auto"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.12, margin: '180px 0px' }}
                onClick={() => setLightboxIndex(index)}
              >
                <img
                  src={thumbnailFallbackIds.includes(image.id) ? image.src : image.previewSrc}
                  alt={image.alt}
                  width={400}
                  height={500}
                  loading={index < 6 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={index < 3 ? 'high' : 'auto'}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 50vw"
                  onError={() => {
                    setThumbnailFallbackIds((currentIds) =>
                      currentIds.includes(image.id) ? currentIds : [...currentIds, image.id]
                    )
                  }}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <ZoomIn className="h-7 w-7 text-white sm:h-8 sm:w-8" />
                </div>
              </motion.div>
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-white px-8 py-3 text-sm font-semibold text-purple-700 shadow-md transition-all hover:border-pink-300 hover:bg-pink-50 hover:shadow-lg"
              >
                Load more
                <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs font-bold text-pink-600">
                  {filteredImages.length - visibleCount} remaining
                </span>
              </button>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {lightboxIndex !== null && activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-4xl"
            >
              <img
                src={lightboxImageSrc ?? activeImage.src}
                alt={activeImage.alt}
                onError={() => {
                  if (lightboxImageSrc !== activeImage.previewSrc) {
                    setLightboxImageSrc(activeImage.previewSrc)
                  }
                }}
                className="w-full h-[80vh] object-contain rounded-lg"
              />

              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all duration-300 hover:bg-white/40"
              >
                <X className="h-6 w-6 text-white" />
              </button>

              <button
                onClick={(event) => {
                  event.stopPropagation()
                  goToPrev()
                }}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/40"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>

              <button
                onClick={(event) => {
                  event.stopPropagation()
                  goToNext()
                }}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/20 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/40"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-center text-white">
                <p className="inline-block rounded-full bg-black/40 px-4 py-2 text-lg font-semibold backdrop-blur-sm">
                  {lightboxIndex + 1} / {filteredImages.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
