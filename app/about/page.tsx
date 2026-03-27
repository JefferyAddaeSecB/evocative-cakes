"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Heart, Award, Users, Clock } from "lucide-react"

export default function About() {
  return (
    <div className="min-h-screen pt-20">
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/60 backdrop-blur-sm border border-purple-200 text-purple-600 text-sm font-medium px-4 py-2 rounded-full inline-block mb-8"
          >
            ⭐ Our Story
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-8"
          >
            About EVO Cakes
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 text-lg text-gray-600 mb-12"
          >
            <p>
              Founded in 2020 with a passion for creating extraordinary cakes, EVO Cakes has become the premier destination for custom wedding and birthday cakes in the city.
            </p>
            <p>
              Our team of skilled bakers and decorators combines traditional techniques with modern artistry to create cakes that are not just delicious, but true works of art.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl mb-20"
          >
            <Image
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"
              alt="Bakery"
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {[
              { icon: Heart, number: "500+", label: "Happy Customers", color: "from-pink-400 to-rose-400" },
              { icon: Award, number: "5+", label: "Years Experience", color: "from-purple-400 to-violet-400" },
              { icon: Users, number: "8", label: "Team Members", color: "from-blue-300 to-sky-400" },
              { icon: Clock, number: "1000+", label: "Cakes Made", color: "from-green-400 to-teal-400" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4 mx-auto`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-800 mb-1">{stat.number}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Mission CTA */}
          <div className="relative py-24 px-8 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-100/80 via-purple-100/80 to-blue-100/80" />
            <div className="relative z-10 text-center">
              <div className="bg-white/60 backdrop-blur-sm border border-purple-200 text-purple-600 text-sm font-medium px-4 py-2 rounded-full inline-block mb-6">
                ✨ Our Mission
              </div>
              <h2 className="text-5xl font-bold text-gray-800 mb-6">Creating Sweet Memories</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                To create exceptional cakes that exceed expectations and make every celebration memorable
              </p>
              <Link href="/contact">
                <button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full px-8 py-4 text-lg font-semibold shadow-xl transition-all">
                  Start Your Order →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
