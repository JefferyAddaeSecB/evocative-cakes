import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, Heart, Star } from 'lucide-react'
import HeroCarousel from '@/components/HeroCarousel'
import CakeCard from '@/components/CakeCard'

const birthdayCakeImage = '/images/gallery/Birthday-Cakes/20250607_122824.jpg'

const featuredCakes = [
  {
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
    price: '$299',
    category: 'Wedding Cakes',
    title: 'Elegant Wedding',
    description: 'Three-tier vanilla cake with buttercream roses',
  },
  {
    image: birthdayCakeImage,
    price: '$89',
    category: 'Birthday Cakes',
    title: 'Birthday Celebration',
    description: 'Chocolate cake with rainbow sprinkles',
  },
  {
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80',
    price: '$199',
    category: 'Custom Designs',
    title: 'Custom Design',
    description: 'Personalized cake made just for you',
  },
]

export default function HomePage() {
  const featuredRef = useRef(null)
  const ctaRef = useRef(null)
  const featuredInView = useInView(featuredRef, { once: true })
  const ctaInView = useInView(ctaRef, { once: true })

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen">
      {/* SECTION 1 - Hero */}
      <section className="min-h-screen relative overflow-hidden flex items-center">
        <div className="container mx-auto max-w-7xl px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center space-x-2 mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-8 h-8 text-yellow-500" />
                  </motion.div>
                  <span className="text-lg font-medium text-purple-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200">
                    Premium Cake Artistry
                  </span>
                </div>
              </motion.div>

              {/* H1 Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-7xl lg:text-8xl font-bold leading-tight"
              >
                <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent block">
                  EVO
                </span>
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block">
                  Cakes
                </span>
              </motion.h1>

              {/* Paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl text-gray-600 leading-relaxed max-w-2xl mt-6"
              >
                Creating magical moments with our handcrafted cakes. From elegant weddings to joyful
                birthdays, we bring your sweetest dreams to life with artistry and passion.
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-6 mt-10"
              >
                <Link to="/contact">
                  <button className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-10 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 text-lg font-semibold overflow-hidden">
                    <span className="relative z-10 flex items-center gap-2">
                      Order Now <ArrowRight className="w-5 h-5" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-500" />
                  </button>
                </Link>
                <Link to="/gallery">
                  <button className="inline-flex items-center gap-2 border-2 border-purple-400 text-purple-600 px-10 py-4 rounded-full hover:bg-purple-50 transition-all duration-300 text-lg font-semibold">
                    View Gallery <Heart className="w-5 h-5" />
                  </button>
                </Link>
              </motion.div>
            </div>

            {/* Right Column - HeroCarousel */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative"
            >
              <HeroCarousel />
              {/* Floating gold star badge */}
              <motion.div
                className="absolute -top-6 -right-6 w-28 h-28 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-2xl z-10"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <Star className="w-10 h-10 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2 - Featured Creations */}
      <section className="py-24 px-4" ref={featuredRef}>
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuredInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-800">Featured Creations</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-4">
              Discover our most popular cake designs, crafted with love and attention to detail
            </p>
          </motion.div>

          {/* Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={featuredInView ? 'show' : 'hidden'}
            className="grid md:grid-cols-3 gap-10"
          >
            {featuredCakes.map((cake, i) => (
              <motion.div key={i} variants={itemVariants}>
                <CakeCard {...cake} buttonLabel="Customize This Cake" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 - CTA */}
      <section className="py-32 px-4 relative overflow-hidden" ref={ctaRef}>
        {/* Animated gradient bg */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-pink-100/80 via-purple-100/80 to-blue-100/80 backdrop-blur-sm"
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ backgroundSize: '200% 200%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-200/20 to-purple-200/20" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          {/* Spinning badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
          >
            <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-purple-200">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-5 h-5 text-purple-500" />
              </motion.div>
              <span className="text-purple-700 font-medium">Ready to Order?</span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            className="text-5xl font-bold text-gray-800 mb-6"
          >
            Ready to Create Your Dream Cake?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-2xl text-gray-600 max-w-3xl mx-auto mb-10"
          >
            Let our expert bakers bring your vision to life. From concept to creation, we're here to
            make your special day unforgettable.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/contact">
              <button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 text-lg font-semibold">
                Customize a Cake
              </button>
            </Link>
            <Link to="/gallery">
              <button className="border-2 border-purple-400 hover:border-purple-500 text-purple-600 hover:bg-purple-50 px-10 py-4 rounded-full transition-all duration-300 text-lg font-semibold">
                View Our Work
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
