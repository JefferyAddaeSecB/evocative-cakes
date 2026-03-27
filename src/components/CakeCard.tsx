import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Gift } from 'lucide-react'

interface CakeCardProps {
  image: string
  price: string
  category: string
  title: string
  description: string
  buttonLabel: string
}

export default function CakeCard({
  image,
  price,
  category,
  title,
  description,
  buttonLabel,
}: CakeCardProps) {
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="rounded-lg overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 bg-white/80 backdrop-blur-sm group-hover:bg-white/90 h-full flex flex-col">
        {/* Image area */}
        <div className="relative h-80 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
            {price}
          </div>
        </div>

        {/* Card body */}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-pink-600">{category}</span>
            <Gift className="w-5 h-5 text-pink-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4 flex-1">{description}</p>
          <Link to="/contact" className="no-underline">
            <button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-3 rounded-full font-semibold transition-all duration-300 hover:shadow-lg">
              {buttonLabel}
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
