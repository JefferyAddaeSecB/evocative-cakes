import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'

type GalleryCategory =
  | 'All'
  | 'Wedding Cakes'
  | 'Birthday Cakes'
  | 'Cupcakes'
  | 'Custom Cakes'
  | 'Celebrations'

interface GalleryImage {
  id: number
  src: string
  alt: string
  category: Exclude<GalleryCategory, 'All'>
}

const galleryCategories: GalleryCategory[] = [
  'All',
  'Wedding Cakes',
  'Birthday Cakes',
  'Cupcakes',
  'Custom Cakes',
  'Celebrations',
]

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=1200&q=90',
    alt: 'Elegant Wedding Cake',
    category: 'Wedding Cakes',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=90',
    alt: 'Classic Three-Tier',
    category: 'Wedding Cakes',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=1200&q=90',
    alt: 'Floral Paradise',
    category: 'Wedding Cakes',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=1200&q=90',
    alt: 'Delicate Sugar Art',
    category: 'Wedding Cakes',
  },
  {
    id: 5,
    src: '/images/gallery/Birthday-Cakes/20250607_122824.jpg',
    alt: 'Birthday Cake Collection',
    category: 'Birthday Cakes',
  },
  {
    id: 6,
    src: '/images/gallery/Cupcakes/20170806_141555.jpg',
    alt: 'Cupcake Collection 01',
    category: 'Cupcakes',
  },
  {
    id: 7,
    src: '/images/gallery/Cupcakes/20180117_151219.jpg',
    alt: 'Cupcake Collection 02',
    category: 'Cupcakes',
  },
  {
    id: 8,
    src: '/images/gallery/Cupcakes/20180117_152032.jpg',
    alt: 'Cupcake Collection 03',
    category: 'Cupcakes',
  },
  {
    id: 9,
    src: '/images/gallery/Cupcakes/20180211_121804.jpg',
    alt: 'Cupcake Collection 04',
    category: 'Cupcakes',
  },
  {
    id: 10,
    src: '/images/gallery/Cupcakes/20180428_182734.jpg',
    alt: 'Cupcake Collection 05',
    category: 'Cupcakes',
  },
  {
    id: 11,
    src: '/images/gallery/Cupcakes/20210509_101403.jpg',
    alt: 'Cupcake Collection 06',
    category: 'Cupcakes',
  },
  {
    id: 12,
    src: '/images/gallery/Cupcakes/20220205_173258.jpg',
    alt: 'Cupcake Collection 07',
    category: 'Cupcakes',
  },
  {
    id: 13,
    src: '/images/gallery/Cupcakes/20230312_183505.jpg',
    alt: 'Cupcake Collection 08',
    category: 'Cupcakes',
  },
  {
    id: 14,
    src: '/images/gallery/Cupcakes/20240616_132756.jpg',
    alt: 'Cupcake Collection 09',
    category: 'Cupcakes',
  },
  {
    id: 15,
    src: '/images/gallery/Cupcakes/20250607_122824.jpg',
    alt: 'Cupcake Collection 10',
    category: 'Cupcakes',
  },
  {
    id: 16,
    src: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1200&q=90',
    alt: 'Custom Design',
    category: 'Custom Cakes',
  },
  {
    id: 17,
    src: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=1200&q=90',
    alt: 'Celebration Cake',
    category: 'Celebrations',
  },
  {
    id: 18,
    src: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=1200&q=90',
    alt: 'Baby Shower Special',
    category: 'Celebrations',
  },
]

export default function GalleryGrid() {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('All')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filteredImages =
    selectedCategory === 'All'
      ? galleryImages
      : galleryImages.filter((image) => image.category === selectedCategory)

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
  }, [selectedCategory])

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
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {galleryCategories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`inline-flex min-h-12 w-full items-center justify-center rounded-full border px-4 py-3 text-center text-sm font-semibold transition-all duration-300 ${
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
            Add photos to this category folder and they can be surfaced here next.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="group relative h-80 cursor-pointer overflow-hidden rounded-2xl shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              onClick={() => setLightboxIndex(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-purple-700 shadow-md backdrop-blur-sm">
                {image.category}
              </div>

              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <ZoomIn className="h-8 w-8 text-white" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightboxIndex !== null && filteredImages[lightboxIndex] && (
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
                src={filteredImages[lightboxIndex].src}
                alt={filteredImages[lightboxIndex].alt}
                className="w-full rounded-lg"
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
                <p className="mt-2 text-sm">{filteredImages[lightboxIndex].alt}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
