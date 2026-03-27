"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Heart, Phone, Mail, MapPin, Cake } from "lucide-react"
import { useMemo } from "react"

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Cakes", href: "/cakes" },
  { label: "Gallery", href: "/gallery" },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  // Generate consistent particle positions
  const particles = useMemo(() =>
    Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      left: (i * 11.3 + 5.7) % 100,
      duration: 8 + (i % 4),
      delay: (i % 2),
    })),
    []
  )

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-gray-900 text-white relative overflow-hidden"
    >
      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5">
        <motion.div
          style={{ background: "linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)" }}
          className="h-full"
          animate={{
            boxShadow: [
              "0 0 5px #ec4899, 0 0 10px #8b5cf6",
              "0 0 10px #8b5cf6, 0 0 15px #3b82f6",
              "0 0 5px #ec4899, 0 0 10px #8b5cf6",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            left: `${particle.left}%`,
            bottom: 0,
          }}
          animate={{
            y: [0, -100],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <Cake className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">EVO Cakes</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Creating magical moments with our handcrafted cakes since 2020. Your sweetest dreams, our specialty.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔗
              </motion.span>
              Quick Links
            </h3>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <motion.div key={link.href} whileHover={{ x: 5 }}>
                  <Link
                    href={link.href}
                    className="block text-gray-400 hover:text-white transition-all duration-300 text-sm py-1 hover:bg-white/5 rounded px-2 -mx-2"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📞
              </motion.span>
              Contact Info
            </h3>
            <div className="space-y-3">
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-300 p-2 rounded hover:bg-white/5"
              >
                <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                  <Phone className="w-4 h-4" />
                </motion.div>
                (555) 123-CAKE
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-300 p-2 rounded hover:bg-white/5"
              >
                <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                  <Mail className="w-4 h-4" />
                </motion.div>
                hello@evocakes.com
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors duration-300 p-2 rounded hover:bg-white/5"
              >
                <motion.div whileHover={{ scale: 1.2, rotate: 10 }}>
                  <MapPin className="w-4 h-4" />
                </motion.div>
                123 Sweet Street, Bakery City
              </motion.div>
            </div>
          </motion.div>

          {/* Follow Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                🌟
              </motion.span>
              Follow Us
            </h3>
            <div className="flex gap-3">
              {[
                { icon: "📘", label: "Facebook" },
                { icon: "📸", label: "Instagram" },
                { icon: "🐦", label: "Twitter" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-2xl hover:opacity-80 transition-all duration-300 p-2 rounded-full hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500"
                  title={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm flex items-center justify-center gap-2 flex-wrap">
            © {currentYear} EVO Cakes. All rights reserved. Made with
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="w-4 h-4 text-red-400 fill-current" />
            </motion.span>
            for sweet celebrations
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
