import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const ScrollToTop = () => {
  window.scrollTo(0, 0)
}

interface Category {
  id: number
  name: string
  image: string
  description: string
  color: string
}

const categories: Category[] = [
  {
    id: 1,
    name: 'Wedding Cakes',
    image: '/images/gallery/Wedding-Cakes/Tracy and Lawrence.JPG',
    description: 'Elegant designs for your special day',
    color: 'from-rose-400 to-pink-600',
  },
  {
    id: 2,
    name: 'Birthday Cakes',
    image: '/images/gallery/Birthday-Cakes/20250914_111455.jpg',
    description: 'Celebrate with joy and flavor',
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 3,
    name: 'Cookies & Treats',
    image: '/images/gallery/Cookies-and-Treats/Macarons.JPG',
    description: 'Delightful bite-sized treats',
    color: 'from-blue-400 to-blue-600',
  },
]

export default function FeaturedCategories() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Explore Our Creations
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Browse our handcrafted collections and find your perfect cake
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link
                to={`/gallery?category=${encodeURIComponent(category.name)}`}
                onClick={ScrollToTop}
              >
                <div className="group relative h-80 rounded-2xl overflow-hidden shadow-xl cursor-pointer">
                  {/* Image */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Overlay Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="group-hover:translate-y-0 translate-y-4 transition-transform duration-500"
                    >
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {category.name}
                      </h3>
                      <p className="text-white/90 text-sm md:text-base mb-4">
                        {category.description}
                      </p>

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span>View Collection</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-16 text-center"
        >
          <Link to="/gallery" onClick={ScrollToTop}>
            <button className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 md:px-12 py-3 md:py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 text-base md:text-lg font-semibold overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Explore Full Gallery <ArrowRight className="w-5 h-5" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-500" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
