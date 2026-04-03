import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import GalleryGrid from '@/components/GalleryGrid'

export default function GalleryPage() {
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen pt-16 md:pt-20">
      {/* HEADER */}
      <section className="px-4 pb-5 pt-8 text-center sm:pb-6 sm:pt-10 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-4 flex items-center justify-center space-x-2 md:mb-6">
              <Sparkles className="h-5 w-5 text-yellow-500 md:h-6 md:w-6" />
              <span className="rounded-full border border-purple-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-purple-600 backdrop-blur-sm md:px-4 md:py-2 md:text-lg">
                Our Portfolio
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 mb-3 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:mt-4 md:mb-4 md:text-6xl"
          >
            {categoryParam ? `${categoryParam}` : 'Our Gallery'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg md:max-w-2xl md:text-xl"
          >
            Explore our portfolio of cakes, cupcakes, cookies, and celebration treats to see the joy we have helped create for countless moments
          </motion.p>
        </div>
      </section>

      {/* GALLERY GRID */}
      <section className="px-4 pb-10 pt-2 md:py-10">
        <div className="container mx-auto max-w-7xl">
          <GalleryGrid initialCategory={categoryParam || undefined} />
        </div>
      </section>
    </div>
  )
}
