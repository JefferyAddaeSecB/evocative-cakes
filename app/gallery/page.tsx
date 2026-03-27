"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

const galleryItems = [
  { image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=400&auto=format", caption: "Elegant Wedding Cake", tag: "Wedding" },
  { image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format", caption: "Birthday Celebration", tag: "Birthday" },
  { image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&auto=format", caption: "Corporate Event", tag: "Corporate" },
  { image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format", caption: "Anniversary Special", tag: "Anniversary" },
  { image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&auto=format", caption: "Baby Shower Delight", tag: "Baby Shower" },
  { image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format", caption: "Graduation Cake", tag: "Graduation" },
]

export default function Gallery() {
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
              ⭐ Our Portfolio
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-4">
              Our Gallery
            </h1>
            <p className="text-xl text-gray-600">
              Browse our portfolio of beautiful cake creations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-20">
            {galleryItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer h-[300px]"
              >
                <Image
                  src={item.image}
                  alt={item.caption}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                    {item.tag}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <h3 className="text-xl font-bold">{item.caption}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="relative py-16 px-8 rounded-3xl overflow-hidden text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-100/80 via-purple-100/80 to-blue-100/80" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Ready to Create Your Masterpiece?</h2>
              <Link href="/contact">
                <button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full px-8 py-4 text-lg font-semibold shadow-xl transition-all">
                  Start Your Order
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
