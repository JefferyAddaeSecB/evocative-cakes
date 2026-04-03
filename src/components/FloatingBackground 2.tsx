import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'

interface Dot {
  id: number
  left: number
  top: number
  speed: number
  y: number
}

export default function FloatingBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [dots, setDots] = useState<Dot[]>([])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX - window.innerWidth / 2,
        y: e.clientY - window.innerHeight / 2,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Initialize 20 dots
  useEffect(() => {
    const initialDots: Dot[] = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      speed: Math.random() * 1.2 + 0.3,
      y: 0,
    }))
    setDots(initialDots)
  }, [])

  // Animate dots using RAF
  useEffect(() => {
    let rafId: number

    const animate = () => {
      setDots((prevDots) =>
        prevDots.map((dot) => {
          let newY = dot.y - dot.speed

          // Reset to bottom when off screen
          if (newY < -120) {
            newY = 120
          }

          return { ...dot, y: newY }
        })
      )

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Solid gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50" />

      {/* Large orb top-left - mouse parallax */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-200/30 to-purple-200/30 rounded-full blur-3xl"
        animate={{
          x: mousePos.x * 0.05,
          y: mousePos.y * 0.05,
          scale: [1, 1.12, 1],
        }}
        transition={{
          scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      {/* Orb bottom-right - opposite parallax */}
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-200/30 to-pink-200/30 rounded-full blur-3xl"
        animate={{
          x: -mousePos.x * 0.03,
          y: -mousePos.y * 0.03,
          scale: [1, 0.92, 1],
        }}
        transition={{
          scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      {/* Orb mid-right - slow rotation */}
      <motion.div
        className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-purple-200/20 to-blue-200/20 rounded-full blur-2xl"
        animate={{
          rotate: 360,
          x: mousePos.x * 0.02,
          y: mousePos.y * 0.02,
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
        }}
      />

      {/* 20 floating dots */}
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="absolute w-2 h-2 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full opacity-40"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            transform: `translateY(${dot.y}px)`,
          }}
        />
      ))}

      {/* Subtle shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  )
}
