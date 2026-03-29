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
    <div className="min-h-screen pt-20">
      {/* SECTION 1 - Hero (2-column) */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center space-x-2 mb-6">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  <span className="text-lg font-medium text-purple-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200">
                    Our Story
                  </span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mt-4 mb-6"
              >
                About EVO Cakes
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 text-lg leading-relaxed mb-4"
              >
                Founded in 2020 with a passion for creating extraordinary cakes, EVO Cakes has become
                the premier destination for custom wedding and birthday cakes in the city.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 text-lg leading-relaxed"
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
                src="/images/gallery/Wedding-Cakes/main%201.jpg"
                alt="Signature EVO Cakes wedding design"
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
              {/* Floating heart badge */}
              <motion.div
                className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center shadow-2xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Heart className="w-10 h-10 text-white fill-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - Stats Grid */}
      <section className="py-16 px-4 bg-white/30 backdrop-blur-sm">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 - Mission */}
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <span className="text-lg font-medium text-purple-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200">
                Our Mission
              </span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold text-gray-800 mt-4 mb-6"
          >
            Creating Sweet Memories
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-10"
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
              <button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-10 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg">
                Start Your Order →
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
