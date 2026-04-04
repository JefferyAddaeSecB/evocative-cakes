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

const galleryFolders: Record<GalleryContentCategory, string> = {
  'Wedding Cakes': 'Wedding-Cakes',
  'Birthday Cakes': 'Birthday-Cakes',
  Cupcakes: 'Cupcakes',
  'Cookies & Treats': 'Cookies-and-Treats',
  'Custom Cakes': 'Custom Cakes',
}

const galleryFileMap: Record<GalleryContentCategory, string[]> = {
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
  'Custom Cakes': [
    '20160416_163409.jpg',
    '20160903_143033.jpg',
    '20170506_163304-1.jpg',
    '20170506_163304.jpg',
    '20170512_232340.jpg',
    '20170618_101628.jpg',
    '20171014_162924.jpg',
    '20171014_162936.jpg',
    '20171126_125954.jpg',
    '20171224_121322.jpg',
    '20180218_091133.jpg',
    '20180401_111317.jpg',
    '20180401_111524.jpg',
    '20180422_184949.jpg',
    '20180422_191223.jpg',
    '20181028_113921.jpg',
    '20181028_113933.jpg',
    '20181121_075933.jpg',
    '20201226_193432.jpg',
    '20210218_072434.jpg',
    '20210417_195713.jpg',
    '20210503_175208.jpg',
    '20210821_180309.jpg',
    '20210925_130456.jpg',
    '20220528_173321.jpg',
    '20220709_140912.jpg',
    '20220909_175501.jpg',
    '20220924_124758.jpg',
    '20221127_183753.jpg',
    '20230415_102802.jpg',
    '20230520_132304.jpg',
    '20230922_173531.jpg',
    '20240413_132620.jpg',
    '20240622_094617.jpg',
    '20241123_092231.jpg',
    '20241214_144908.jpg',
    '20250314_171632.jpg',
    '20250314_180519.jpg',
    '20250329_143349.jpg',
    '20250518_121054.jpg',
    '20250607_122157.jpg',
    '20250719_121722.jpg',
    '20250727_092303.jpg',
    '20250913_143631.jpg',
    '20250913_144058.jpg',
    '20251115_112449.jpg',
    '20251224_122642.jpg',
    '20260216_171939.jpg',
    'Agent cody cake.JPG',
    'Hot Wheels cake.JPG',
    'IMG-20141105-WA0004.jpg',
    'IMG-20180422-WA0027.jpg',
    'IMG-20190812-WA0009.jpg',
    'IMG-20200628-WA0017.jpg',
    'IMG-20200921-WA0001.jpg',
    'Matthews cake.JPG',
    'Orange basketball cake.JPG',
    'Tax Practitioner cake.JPG',
  ],
}

const buildGallerySrc = (folder: string, fileName: string) =>
  `/images/gallery/${encodeURIComponent(folder)}/${encodeURIComponent(fileName)}`

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
    src: buildGallerySrc(galleryFolders[category], fileName),
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
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-6 lg:grid-cols-3">
          {filteredImages.map((image, index) => (
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
