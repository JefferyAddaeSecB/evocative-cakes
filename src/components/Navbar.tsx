import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavLink, Link } from 'react-router-dom'
import { CakeSlice, Menu, X, ArrowRight, Sparkles } from 'lucide-react'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact Us', path: '/contact' },
  { label: 'FAQ', path: '/faq' },
]

const NavMotion = motion.nav
const DivMotion = motion.div
const ButtonMotion = motion.button

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <NavMotion
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-purple-200 shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <DivMotion
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <CakeSlice className="w-4 h-4 text-white" />
            </DivMotion>
            <span className="text-lg font-bold leading-none tracking-tight">
              <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Evocative
              </span>{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Cakes
              </span>
            </span>
            <motion.div
              className="ml-1"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="h-4 w-4 text-yellow-500" />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div key={link.path} className="relative overflow-visible">
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `text-base font-semibold transition-all duration-300 hover:text-purple-600 relative group no-underline ${
                      isActive ? 'text-purple-600' : 'text-gray-600'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full overflow-hidden">
                        <motion.div
                          className="w-full h-full rounded-full"
                          style={{
                            background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)',
                            opacity: 0.6,
                          }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: isActive ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </>
                  )}
                </NavLink>
              </div>
            ))}
          </div>

          {/* Order Now Button (Desktop) */}
          <div className="hidden md:block">
            <Link to="/contact">
              <button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm flex items-center gap-2">
                Order Now
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <ButtonMotion
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-xl border transition-all duration-300 active:scale-95 ${
              isMenuOpen
                ? 'border-purple-300 bg-white/90 shadow-md shadow-purple-100'
                : 'border-white/40 bg-white/70 hover:bg-white/90 shadow-sm backdrop-blur-sm'
            }`}
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-purple-600" />
              ) : (
                <Menu className="w-6 h-6 text-purple-600" />
              )}
            </motion.div>
          </ButtonMotion>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <DivMotion
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden pt-3"
            >
              <div className="rounded-[1.75rem] border border-white/70 bg-white/92 p-3 shadow-[0_20px_45px_rgba(168,85,247,0.16)] backdrop-blur-xl">
                <div className="flex flex-col gap-2">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <NavLink
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) =>
                          `block rounded-2xl border px-4 py-3 text-sm font-semibold no-underline transition-all duration-300 ${
                            isActive
                              ? 'border-purple-200 bg-gradient-to-r from-pink-50 to-purple-50 text-purple-700 shadow-sm shadow-purple-100'
                              : 'border-transparent bg-slate-50/90 text-slate-700 hover:border-purple-100 hover:bg-white hover:text-purple-600'
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    </motion.div>
                  ))}
                </div>
              </div>
            </DivMotion>
          )}
        </AnimatePresence>
      </div>
    </NavMotion>
  )
}
