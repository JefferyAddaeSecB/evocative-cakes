import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'

interface Dot {
  id: number
  left: number
  top: number
  speed: number
  y: number
}

interface Ornament {
  id: number
  left: number
  top: number
  size: number
  duration: number
  delay: number
  drift: number
  type: 'heart' | 'sparkle'
}

function createDots() {
  return Array.from({ length: 20 }).map((_, index) => ({
    id: index,
    left: Math.random() * 100,
    top: Math.random() * 100,
    speed: Math.random() * 1.2 + 0.3,
    y: 0,
  }))
}

function createOrnaments(): Ornament[] {
  return Array.from({ length: 14 }).map((_, index) => ({
    id: index,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 24 + 16,
    duration: Math.random() * 6 + 7,
    delay: Math.random() * 2.5,
    drift: Math.random() * 18 + 10,
    type: index % 3 === 0 ? ('sparkle' as const) : ('heart' as const),
  }))
}

export default function FloatingBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [dots, setDots] = useState<Dot[]>(() => createDots())
  const [ornaments] = useState<Ornament[]>(() => createOrnaments())

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePos({
        x: event.clientX - window.innerWidth / 2,
        y: event.clientY - window.innerHeight / 2,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    let rafId: number

    const animate = () => {
      setDots((previousDots) =>
        previousDots.map((dot) => {
          let nextY = dot.y - dot.speed

          if (nextY < -120) {
            nextY = 120
          }

          return { ...dot, y: nextY }
        })
      )

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-blue-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,207,232,0.45),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(196,181,253,0.28),_transparent_38%)]" />

      <motion.div
        className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-pink-200/30 to-purple-200/30 blur-3xl"
        animate={{
          x: mousePos.x * 0.05,
          y: mousePos.y * 0.05,
          scale: [1, 1.12, 1],
        }}
        transition={{
          scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-gradient-to-r from-blue-200/30 to-pink-200/30 blur-3xl"
        animate={{
          x: -mousePos.x * 0.03,
          y: -mousePos.y * 0.03,
          scale: [1, 0.92, 1],
        }}
        transition={{
          scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      <motion.div
        className="absolute right-1/3 top-1/2 h-64 w-64 rounded-full bg-gradient-to-r from-purple-200/20 to-blue-200/20 blur-2xl"
        animate={{
          rotate: 360,
          x: mousePos.x * 0.02,
          y: mousePos.y * 0.02,
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
        }}
      />

      {ornaments.map((ornament) => {
        const Icon = ornament.type === 'heart' ? Heart : Sparkles
        const iconClassName =
          ornament.type === 'heart'
            ? 'h-full w-full text-pink-300/65'
            : 'h-full w-full text-purple-300/55'

        return (
          <motion.div
            key={ornament.id}
            className="absolute"
            style={{
              left: `${ornament.left}%`,
              top: `${ornament.top}%`,
              width: ornament.size,
              height: ornament.size,
            }}
            animate={{
              x: [0, ornament.drift, 0],
              y: [0, -ornament.drift, 0],
              rotate: [-8, 10, -8],
              scale: [0.9, 1.08, 0.9],
              opacity: [0.12, 0.34, 0.12],
            }}
            transition={{
              duration: ornament.duration,
              delay: ornament.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Icon
              className={iconClassName}
              fill={ornament.type === 'heart' ? 'currentColor' : 'none'}
            />
          </motion.div>
        )
      })}

      {dots.map((dot) => (
        <div
          key={dot.id}
          className="absolute h-2 w-2 rounded-full bg-gradient-to-r from-pink-300 to-purple-300 opacity-40"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            transform: `translateY(${dot.y}px)`,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
