import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryImage {
  id: number
  photo: string
  alt: string
}

const galleryImages: GalleryImage[] = [
  { id: 1, photo: 'photo-1621303837174-89787a7d4729', alt: 'Elegant Wedding Cake' },
  { id: 2, photo: 'photo-1578985545062-69928b1d9587', alt: 'Classic Three-Tier' },
  { id: 3, photo: 'photo-1558618666-fcd25c85cd64', alt: 'Rainbow Birthday' },
  { id: 4, photo: 'photo-1606313564200-e75d5e30476c', alt: 'Chocolate Masterpiece' },
  { id: 5, photo: 'photo-1464349095431-e9a21285b5f3', alt: 'Custom Design' },
  { id: 6, photo: 'photo-1557925923-cd4648e211a0', alt: 'Artistic Creation' },
  { id: 7, photo: 'photo-1571115764595-644a1f56a55c', alt: 'Modern Minimalist' },
  { id: 8, photo: 'photo-1586985289688-ca3cf47d3e6e', alt: 'Floral Paradise' },
  { id: 9, photo: 'photo-1563729784474-d77dbb933a9e', alt: 'Delicate Sugar Art' },
  { id: 10, photo: 'photo-1565958011703-44f9829ba187', alt: 'Celebration Cake' },
  { id: 11, photo: 'photo-1535254973040-607b474cb50d', alt: 'Baby Shower Special' },
  { id: 12, photo: 'photo-1551024506-0bccd828d307', alt: 'Custom Toppers' },
]

export default function GalleryGrid() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const goToPrev = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null
      return (prev - 1 + galleryImages.length) % galleryImages.length
    })
  }, [])

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null
      return (prev + 1) % galleryImages.length
    })
  }, [])

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null)
      } else if (e.key === 'ArrowLeft') {
        goToPrev()
      } else if (e.key === 'ArrowRight') {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryImages.map((img, index) => (
          <motion.div
            key={img.id}
            className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-xl h-80"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            viewport={{ once: true }}
            onClick={() => setLightboxIndex(index)}
          >
            <img
              src={`https://images.unsplash.com/${img.photo}?w=600&q=80`}
              alt={img.alt}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full"
            >
              <img
                src={`https://images.unsplash.com/${galleryImages[lightboxIndex].photo}?w=1200&q=90`}
                alt={galleryImages[lightboxIndex].alt}
                className="w-full h-auto rounded-lg"
              />
              {/* Close button */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-2 transition-all duration-300 z-10"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Prev button */}
              <button
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-3 transition-all duration-300 z-10"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              {/* Next button */}
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-3 transition-all duration-300 z-10"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              {/* Counter */}
              <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                <p className="text-lg font-semibold bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
                  {lightboxIndex + 1} / {galleryImages.length}
                </p>
                <p className="text-sm mt-2">{galleryImages[lightboxIndex].alt}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
