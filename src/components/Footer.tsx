import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, Phone, Mail, MapPin, Cake } from 'lucide-react'
import { useMemo } from 'react'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Our Cakes', href: '/cakes' },
  { label: 'Gallery', href: '/gallery' },
]

const FooterMotion = motion.footer
const DivMotion = motion.div
const AMotion = motion.a

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const particles = useMemo(
    () =>
      Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: 8 + Math.random() * 6,
        delay: Math.random() * 2,
      })),
    []
  )

  return (
    <FooterMotion
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden"
    >
      {/* Animated top border */}
      <div className="absolute top-0 left-0 right-0 h-1">
        <motion.div
          className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            backgroundSize: '200% 200%',
          }}
        />
      </div>

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          animate={{
            y: [0, -300, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
          className="absolute w-1 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
          style={{
            left: `${particle.left}%`,
            bottom: '0%',
            boxShadow: '0 0 10px rgba(236, 72, 153, 0.8)',
          }}
        />
      ))}

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <DivMotion
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 mb-4"
            >
              <Cake className="w-6 h-6 text-pink-500" />
              <h3 className="text-2xl font-bold">EVO Cakes</h3>
            </motion.div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Crafting delicious moments with handmade cakes for every celebration.
            </p>
          </DivMotion>

          {/* Quick Links */}
          <DivMotion
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <motion.li
                  key={link.href}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-pink-500 transition-colors no-underline text-sm"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </DivMotion>

          {/* Contact Info */}
          <DivMotion
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <motion.li
                whileHover={{ x: 5 }}
                className="flex items-start gap-3"
              >
                <Phone className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+1 (555) 000-0000</span>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:info@evocakes.com"
                  className="text-gray-400 hover:text-pink-500 transition-colors text-sm no-underline"
                >
                  info@evocakes.com
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  123 Cake Street<br />
                  Sweet City, SC 12345
                </span>
              </motion.li>
            </ul>
          </DivMotion>

          {/* Follow Us */}
          <DivMotion
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6">Follow Us</h4>
            <div className="flex gap-4">
              {['facebook', 'instagram', 'twitter', 'pinterest'].map((social) => (
                <AMotion
                  key={social}
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center text-gray-400 hover:text-pink-500 transition-colors"
                >
                  {social.charAt(0).toUpperCase()}
                </AMotion>
              ))}
            </div>
          </DivMotion>
        </div>

        {/* Divider */}
        <motion.div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-gray-400 text-sm"
            >
              &copy; {currentYear} EVO Cakes. Made with{' '}
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-block"
              >
                <Heart className="w-4 h-4 inline mx-1 text-pink-500" />
              </motion.span>{' '}
              by our team.
            </motion.p>

            <div className="flex gap-6">
              <motion.a
                href="#"
                whileHover={{ color: '#ec4899' }}
                className="text-gray-400 transition-colors text-sm no-underline"
              >
                Privacy Policy
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ color: '#ec4899' }}
                className="text-gray-400 transition-colors text-sm no-underline"
              >
                Terms of Service
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </FooterMotion>
  )
}
