import React from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
  rating: number
  delay?: number
}

export default function TestimonialCard({
  quote,
  author,
  role,
  rating,
  delay = 0,
}: TestimonialCardProps) {
  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="text-gray-700 text-lg mb-6 italic">"{quote}"</p>
      <div>
        <p className="font-bold text-gray-800">{author}</p>
        <p className="text-sm text-gray-600">{role}</p>
      </div>
    </motion.div>
  )
}
