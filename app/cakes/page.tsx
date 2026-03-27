"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Gift, Crown, Sparkles } from "lucide-react"

const birthdayCakes = [
  { image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", price: 65, name: "Rainbow Delight", description: "Colorful layers with rainbow buttercream" },
  { image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400", price: 75, name: "Chocolate Fantasy", description: "Rich chocolate with ganache" },
  { image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400", price: 85, name: "Unicorn Dreams", description: "Vanilla with pastel colors" },
  { image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400", price: 70, name: "Sports Theme", description: "Custom sports-themed cake" },
]

const weddingCakes = [
  { image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400", price: 299, name: "Classic Elegance", description: "Three-tier vanilla with roses" },
  { image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400", price: 349, name: "Rustic Romance", description: "Naked cake with fresh flowers" },
  { image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400", price: 279, name: "Modern Minimalist", description: "Clean lines with metallic accents" },
  { image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400", price: 399, name: "Floral Paradise", description: "Delicate sugar flowers" },
]

const CakeCard = ({ cake, index }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -10 }}
    className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
  >
    <div className="relative h-64">
      <Image src={cake.image} alt={cake.name} fill className="object-cover" />
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 font-semibold text-purple-600">
        ${cake.price}
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{cake.name}</h3>
      <p className="text-gray-600 mb-4">{cake.description}</p>
      <Link href="/contact">
        <button className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-full py-3 font-semibold transition-all">
          Order This Cake
        </button>
      </Link>
    </div>
  </motion.div>
)

export default function Cakes() {
  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="bg-white/60 backdrop-blur-sm border border-purple-200 text-purple-600 text-sm font-medium px-4 py-2 rounded-full inline-block mb-6">
              ⭐ Our Collection
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
              Our Cake Collection
            </h1>
            <p className="text-xl text-gray-600">
              Discover our range of handcrafted cakes
            </p>
          </motion.div>

          {/* Birthday Cakes */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Birthday Cakes</h2>
                <p className="text-gray-600">Perfect for celebrations</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {birthdayCakes.map((cake, index) => (
                <CakeCard key={index} cake={cake} index={index} />
              ))}
            </div>
          </div>

          {/* Wedding Cakes */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Wedding Cakes</h2>
                <p className="text-gray-600">Elegant designs for your special day</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {weddingCakes.map((cake, index) => (
                <CakeCard key={index} cake={cake} index={index} />
              ))}
            </div>
          </div>

          {/* Custom CTA */}
          <div className="relative py-16 px-8 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-100/80 via-purple-100/80 to-blue-100/80" />
            <div className="relative z-10 text-center">
              <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Don't See What You're Looking For?</h2>
              <p className="text-lg text-gray-600 mb-6">
                We specialize in custom designs! Share your vision with us.
              </p>
              <Link href="/contact">
                <button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full px-8 py-4 text-lg font-semibold shadow-xl transition-all">
                  Request Custom Design
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
