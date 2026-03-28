import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'

type GalleryCategory =
  | 'All'
  | 'Wedding Cakes'
  | 'Birthday Cakes'
  | 'Cupcakes'
  | 'Cookies & Treats'
  | 'Celebrations'

type GalleryLeafCategory = Exclude<GalleryCategory, 'All'>

interface GalleryImage {
  id: number
  src: string
  alt: string
  category: GalleryLeafCategory
}

const galleryContentCategories: GalleryLeafCategory[] = [
  'Wedding Cakes',
  'Birthday Cakes',
  'Cupcakes',
  'Cookies & Treats',
  'Celebrations',
]

const galleryCategories: GalleryCategory[] = ['All', ...galleryContentCategories]

const galleryFolders: Record<GalleryLeafCategory, string> = {
  'Wedding Cakes': 'Wedding-Cakes',
  'Birthday Cakes': 'Birthday-Cakes',
  Cupcakes: 'Cupcakes',
  'Cookies & Treats': 'Cookies & Treats',
  Celebrations: 'Celebrations',
}

const galleryFileMap: Record<GalleryLeafCategory, string[]> = {
  'Wedding Cakes': [
    '20210710_173432.jpg',
    '20211009_110702.jpg',
    '20211009_111143.jpg',
    '20211009_144413.jpg',
    '20211030_120003.jpg',
    '20211030_164229.jpg',
    '20250503_085520.jpg',
    'Anivesary cake.JPG',
    'IMG-20170807-WA0019.jpg',
    'IMG-20170807-WA0021.jpg',
    'IMG-20170807-WA0022.jpg',
    'Purple cake and cupcakes side.JPG',
    'Purple cake.JPG',
    'Screenshot_20220910-114520_Instagram.jpg',
    'Tracy and Lawrence.JPG',
    'Tracy and Lawrence2.JPG',
    'main 1.jpg',
  ],
  'Birthday Cakes': [
    '13th Birthday cake.JPG',
    '20171022_111010.jpg',
    '20180915_183807.jpg',
    '20180915_184042.jpg',
    '20230415_163811.jpg',
    '20230521_131007.jpg',
    '20230909_161902.jpg',
    '20240107_151916.jpg',
    '20250308_165530.jpg',
    '20250308_165619.jpg',
    '20250330_154937.jpg',
    '20250607_122824.jpg',
    '20250914_111455.jpg',
    '20251025_072504.jpg',
    '20251224_122832.jpg',
    '20251224_153517.jpg',
    '20260222_094129.jpg',
    'IMG-20171022-WA0006.jpg',
    'IMG-20181007-WA0002.jpg',
  ],
  Cupcakes: [
    '20170806_141555.jpg',
    '20180117_151219.jpg',
    '20180117_152032.jpg',
    '20180117_154532.jpg',
    '20180211_121804.jpg',
    '20180211_151204.jpg',
    '20180408_133449.jpg',
    '20180428_182734.jpg',
    '20180901_145321.jpg',
    '20210509_101403.jpg',
    '20220205_173258.jpg',
    '20220313_140552.jpg',
    '20220327_151713.jpg',
    '20220508_181222.jpg',
    '20220508_181356.jpg',
    '20220508_181856.jpg',
    '20230311_121042.jpg',
    '20230312_183505.jpg',
    '20230922_173943.jpg',
    '20240505_125823.jpg',
    '20240616_132756.jpg',
    '20240622_094521.jpg',
    '20250607_083402.jpg',
    '20250607_083419.jpg',
    '20250607_083459.jpg',
    '20250607_083520.jpg',
    '20250607_083528.jpg',
    '20250607_111655.jpg',
    '20260207_104846.jpg',
    'IMG-20170807-WA0014.jpg',
    'IMG-20171022-WA0005.jpg',
    'IMG-20180211-WA0004.jpg',
    'Purple cake and cupcakes.JPG',
    'Purple cupcakes.JPG',
  ],
  'Cookies & Treats': [
    '20171126_130720.jpg',
    '20171218_213207.jpg',
    '20180211_202214.jpg',
    '20180212_080354.jpg',
    '20181220_215604.jpg',
    '20181220_222010.jpg',
    '20240413_121924.jpg',
    '20240413_141838.jpg',
    '20240413_142136.jpg',
    '20240927_184551.jpg',
    '20250610_184713.jpg',
    '20250627_180942.jpg',
    '20250810_152719.jpg',
    '20250810_152829.jpg',
    'Dessert bowl.JPG',
    'Macarons.JPG',
    'Rice krispy squares.JPG',
  ],
  Celebrations: [
    '20170512_232340.jpg',
    '20180401_111317.jpg',
    '20180401_111524.jpg',
    '20180422_184949.jpg',
    '20180422_191223.jpg',
    '20181121_075933.jpg',
    '20210417_195713.jpg',
    '20210925_130456.jpg',
    '20220709_140912.jpg',
    '20250518_121054.jpg',
    'IMG-20180422-WA0027.jpg',
  ],
}

const buildGallerySrc = (folder: string, fileName: string) =>
  `/images/gallery/${encodeURIComponent(folder)}/${encodeURIComponent(fileName)}`

const buildAltText = (
  category: GalleryLeafCategory,
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

let nextImageId = 1

const galleryImages: GalleryImage[] = galleryContentCategories.flatMap((category) =>
  galleryFileMap[category].map((fileName, index) => ({
    id: nextImageId++,
    src: buildGallerySrc(galleryFolders[category], fileName),
    alt: buildAltText(category, fileName, index),
    category,
  }))
)

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
                loading="lazy"
                decoding="async"
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
