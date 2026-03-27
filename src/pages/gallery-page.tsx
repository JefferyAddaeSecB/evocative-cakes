import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import GalleryGrid from '@/components/GalleryGrid'

export default function GalleryPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* HEADER */}
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <span className="text-lg font-medium text-purple-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200">
                Our Portfolio
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mt-4 mb-4"
          >
            Our Gallery
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Explore our portfolio of beautiful cakes and see the joy we've helped create for countless celebrations
          </motion.p>
        </div>
      </section>

      {/* GALLERY GRID */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-7xl">
          <GalleryGrid />
        </div>
      </section>
    </div>
  )
}
