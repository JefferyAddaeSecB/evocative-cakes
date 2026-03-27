import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, Gift, Crown, Heart } from 'lucide-react'
import CakeCard from '@/components/CakeCard'

const birthdayCakes = [
  {
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    price: '$65',
    category: 'Birthday Cakes',
    title: 'Rainbow Delight',
    description: 'Colorful layers with rainbow buttercream and sprinkles',
  },
  {
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80',
    price: '$75',
    category: 'Birthday Cakes',
    title: 'Chocolate Fantasy',
    description: 'Rich chocolate cake with ganache and chocolate decorations',
  },
  {
    image: 'https://images.unsplash.com/photo-1557925923-cd4648e211a0?w=800&q=80',
    price: '$85',
    category: 'Birthday Cakes',
    title: 'Unicorn Dreams',
    description: 'Vanilla cake with pastel colors and magical unicorn topper',
  },
  {
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80',
    price: '$70',
    category: 'Birthday Cakes',
    title: 'Sports Theme',
    description: 'Custom sports-themed cake with edible team logos',
  },
]

const weddingCakes = [
  {
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80',
    price: '$299',
    category: 'Wedding Cakes',
    title: 'Classic Elegance',
    description: 'Three-tier vanilla cake with buttercream roses',
  },
  {
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
    price: '$349',
    category: 'Wedding Cakes',
    title: 'Rustic Romance',
    description: 'Naked cake with fresh flowers and berries',
  },
  {
    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800&q=80',
    price: '$279',
    category: 'Wedding Cakes',
    title: 'Modern Minimalist',
    description: 'Clean lines with geometric patterns and metallic accents',
  },
  {
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80',
    price: '$399',
    category: 'Wedding Cakes',
    title: 'Floral Paradise',
    description: 'Delicate sugar flowers and intricate piping',
  },
]

const customCakes = [
  {
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80',
    price: '$150',
    category: 'Custom Designs',
    title: 'Corporate Logo',
    description: 'Edible logo and company colors',
  },
  {
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800&q=80',
    price: '$120',
    category: 'Custom Designs',
    title: 'Anniversary Special',
    description: 'Personalized with photos and special dates',
  },
  {
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80',
    price: '$95',
    category: 'Custom Designs',
    title: 'Graduation Cake',
    description: 'School colors and graduation cap topper',
  },
  {
    image: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800&q=80',
    price: '$85',
    category: 'Custom Designs',
    title: 'Baby Shower',
    description: 'Gender reveal or themed baby shower design',
  },
]

export default function CakesPage() {
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
                Our Collection
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mt-4 mb-4"
          >
            Our Cake Collection
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Discover our range of handcrafted cakes, each designed to make your celebration unforgettable
          </motion.p>
        </div>
      </section>

      {/* SECTION 1 - Birthday Cakes */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg mx-auto">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mt-6">Birthday Cakes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-3">
              Celebrate another year with our custom birthday creations. From whimsical designs to elegant masterpieces, we create the perfect centerpiece for your celebration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {birthdayCakes.map((cake, i) => (
              <CakeCard key={i} {...cake} buttonLabel="Order This Cake" />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2 - Wedding Cakes */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center shadow-lg mx-auto">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mt-6">Wedding Cakes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-3">
              Elegant designs for your special day. Our wedding cakes are crafted with precision and artistry, ensuring a stunning centerpiece that tastes as amazing as it looks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {weddingCakes.map((cake, i) => (
              <CakeCard key={i} {...cake} buttonLabel="Order This Cake" />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 - Custom Designs */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg mx-auto">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mt-6">Custom Designs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-3">
              Bring your unique vision to life. Whether it's a corporate event, anniversary, or special celebration, we'll create a custom cake that perfectly matches your theme.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {customCakes.map((cake, i) => (
              <CakeCard key={i} {...cake} buttonLabel="Order This Cake" />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 - Custom Orders CTA */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100/80 via-purple-100/80 to-blue-100/80 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-200/20 to-purple-200/20" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 mb-4 border border-purple-200">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-purple-700 text-sm font-medium">Custom Orders</span>
          </div>

          <h2 className="text-4xl font-bold text-gray-800 mb-4">Don't See What You're Looking For?</h2>

          <p className="text-gray-600 text-lg mb-8">
            We specialize in custom designs! Share your vision with us and we'll create the perfect cake for your special occasion.
          </p>

          <Link to="/contact">
            <button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-10 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg">
              Request Custom Design
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}
