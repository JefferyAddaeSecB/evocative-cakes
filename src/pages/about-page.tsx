import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, Heart, Award, Users, Clock } from 'lucide-react'
import StatCard from '@/components/StatCard'

const stats = [
  { icon: Heart, gradient: 'from-pink-400 to-rose-400', value: 500, suffix: '+', label: 'Happy Customers' },
  { icon: Award, gradient: 'from-purple-400 to-violet-400', value: 5, suffix: '+', label: 'Years Experience' },
  { icon: Users, gradient: 'from-blue-400 to-cyan-400', value: 8, suffix: '', label: 'Team Members' },
  { icon: Clock, gradient: 'from-green-400 to-emerald-400', value: 1000, suffix: '+', label: 'Cakes Made' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16 md:pt-20">
      {/* SECTION 1 - Hero (2-column) */}
      <section className="px-4 pb-8 pt-8 sm:pt-10 md:py-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Left Column */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="mb-4 flex items-center space-x-2 md:mb-6">
                  <Sparkles className="h-5 w-5 text-yellow-500 md:h-6 md:w-6" />
                  <span className="rounded-full border border-purple-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-purple-600 backdrop-blur-sm md:px-4 md:py-2 md:text-lg">
                    Our Story
                  </span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-2 mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:mt-4 md:mb-6 md:text-6xl"
              >
                About EVO Cakes
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-4 text-base leading-relaxed text-gray-600 sm:text-lg"
              >
                Founded in 2020 with a passion for creating extraordinary cakes, EVO Cakes has become
                the premier destination for custom wedding and birthday cakes in the city.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-base leading-relaxed text-gray-600 sm:text-lg"
              >
                Our team of skilled bakers and decorators combines traditional techniques with modern artistry
                to create cakes that are not just delicious, but true works of art. Every cake tells a story,
                and we're honored to be part of your special moments.
              </motion.p>
            </div>

            {/* Right Column - Image with floating heart */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <img
                src="/images/gallery/Wedding-Cakes/20250503_085520.jpg"
                alt="Signature EVO Cakes wedding design"
                className="h-[340px] w-full rounded-3xl object-cover shadow-2xl sm:h-[500px]"
              />
              {/* Floating heart badge */}
              <motion.div
                className="absolute -right-3 -top-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-rose-400 shadow-2xl sm:-right-6 sm:-top-6 sm:h-24 sm:w-24"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Heart className="h-7 w-7 fill-white text-white sm:h-10 sm:w-10" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - Stats Grid */}
      <section className="bg-white/30 px-4 py-10 backdrop-blur-sm md:py-16">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 - Mission */}
      <section className="px-4 py-12 text-center md:py-20">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center justify-center space-x-2 md:mb-6">
              <Sparkles className="h-5 w-5 text-yellow-500 md:h-6 md:w-6" />
              <span className="rounded-full border border-purple-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-purple-600 backdrop-blur-sm md:px-4 md:py-2 md:text-lg">
                Our Mission
              </span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 mb-4 text-3xl font-bold text-gray-800 sm:text-4xl md:mt-4 md:mb-6 md:text-5xl"
          >
            Creating Sweet Memories
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto mb-8 max-w-3xl text-base text-gray-600 sm:text-lg md:mb-10 md:text-xl"
          >
            To create exceptional cakes that exceed expectations and make every celebration memorable.
            We believe that every cake should be as unique as the person celebrating, crafted with
            the finest ingredients and unlimited creativity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/contact">
              <button className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-3 text-base font-semibold text-white shadow-xl transition-all duration-300 hover:from-pink-600 hover:to-purple-600 hover:shadow-2xl md:px-10 md:py-4 md:text-lg">
                Start Your Order →
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
