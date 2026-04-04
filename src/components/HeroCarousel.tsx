import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getPublishedWebsiteMedia } from '@/lib/supabase'

interface Slide {
  id: string
  title: string
  subtitle: string
  image: string
  alt: string
}

const slideCopy = [
  {
    title: 'Elegant Wedding Cakes',
    subtitle: 'Make your special day unforgettable with our stunning wedding cake designs',
  },
  {
    title: 'Birthday Celebrations',
    subtitle: 'Custom birthday cakes that bring joy and sweetness to every celebration',
  },
  {
    title: 'Custom Creations',
    subtitle: 'Unique designs tailored to your vision and special occasions',
  },
  {
    title: 'Anniversary Specials',
    subtitle: 'Romantic designs to celebrate your love story',
  },
  {
    title: 'Cookies and Treats',
    subtitle: 'Delicious cookies and treats crafted for gifting, parties, and dessert tables',
  },
  {
    title: 'Fruit Elegance',
    subtitle: 'Fresh fruit-topped cakes with vibrant flavors',
  },
  {
    title: 'Celebrations',
    subtitle: 'Custom cakes and sweets made to elevate birthdays, milestones, and special events',
  },
  {
    title: 'Floral Dreams',
    subtitle: 'Beautiful floral decorations for your perfect day',
  },
  {
    title: 'Artisan Masterpiece',
    subtitle: 'Hand-crafted cakes with artistic precision',
  },
  {
    title: 'Celebration Bliss',
    subtitle: 'Every cake tells a story of joy and celebration',
  },
  {
    title: 'Luxury Finishes',
    subtitle: 'Polished details and elegant decoration for memorable celebrations',
  },
  {
    title: 'Sweet Centerpieces',
    subtitle: 'Showstopping cakes designed to anchor your biggest moments',
  },
] as const

// Only use first 6 hero images — reduces initial load, rest are never seen anyway
const heroImageFiles = [
  'hero 1.jpg',
  'hero 2.jpg',
  'hero 3.jpg',
  'hero 4.jpg',
  'hero 5.jpg',
  'hero 6.jpg',
]

const getSlideNumber = (fileName: string) => {
  const match = fileName.match(/\d+/)
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER
}

const fallbackSlides: Slide[] = heroImageFiles
  .slice()
  .sort((left, right) => getSlideNumber(left) - getSlideNumber(right))
  .map((fileName, index) => {
    const slideNumber = getSlideNumber(fileName)
    const copy = slideCopy[index % slideCopy.length]

    return {
      id: `fallback-${fileName}`,
      ...copy,
      image: encodeURI(`/images/hero-slideshow/${fileName}`),
      alt: `EVO Cakes hero slideshow image ${slideNumber}`,
    }
  })

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [slides, setSlides] = useState<Slide[]>(fallbackSlides)

  useEffect(() => {
    let isCancelled = false

    const loadHeroSlides = async () => {
      try {
        const media = await getPublishedWebsiteMedia('hero')

        if (isCancelled || media.length === 0) {
          return
        }

        setSlides(
          media.map((item, index) => ({
            id: item.id,
            title: item.title || slideCopy[index % slideCopy.length].title,
            subtitle: item.description || slideCopy[index % slideCopy.length].subtitle,
            image: item.public_url,
            alt: item.alt_text || item.title || `EVO Cakes hero slide ${index + 1}`,
          }))
        )
      } catch (error) {
        console.error('Failed to load live hero slides:', error)
      }
    }

    void loadHeroSlides()

    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    setCurrent((previousCurrent) => {
      if (slides.length === 0) return 0
      return previousCurrent % slides.length
    })
  }, [slides.length])

  // Auto-advance — pauses when tab is hidden (Page Visibility API)
  useEffect(() => {
    if (slides.length === 0) return undefined

    const tick = () => {
      if (!document.hidden) {
        setCurrent((prev) => (prev + 1) % slides.length)
      }
    }

    const timer = window.setInterval(tick, 4500)
    return () => window.clearInterval(timer)
  }, [slides.length])

  const slide = slides[current] || fallbackSlides[0]

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-3xl shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.alt}
            // First slide is above-the-fold LCP — eager + high priority
            loading={current === 0 ? 'eager' : 'lazy'}
            decoding={current === 0 ? 'sync' : 'async'}
            fetchPriority={current === 0 ? 'high' : 'auto'}
            width={1200}
            height={600}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-3 text-3xl font-bold"
            >
              {slide.title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg opacity-90"
            >
              {slide.subtitle}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/30"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/30"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
        {slides.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`rounded-full transition-all duration-300 ${
              index === current
                ? 'h-3 w-3 scale-125 bg-white'
                : 'h-3 w-3 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
