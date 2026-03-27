import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles } from 'lucide-react'

interface Dot {
  id: number
  left: number
  top: number
  size: number
  duration: number
  delay: number
  driftX: number
  driftY: number
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

function createDots(isCompactMotion: boolean) {
  const count = isCompactMotion ? 10 : 20

  return Array.from({ length: count }).map((_, index) => ({
    id: index,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 8 + 4,
    duration: Math.random() * 7 + 9,
    delay: Math.random() * 6,
    driftX: Math.random() * 18 - 9,
    driftY: Math.random() * 120 + 55,
  }))
}

function createOrnaments(isCompactMotion: boolean): Ornament[] {
  const count = isCompactMotion ? 8 : 14

  return Array.from({ length: count }).map((_, index) => ({
    id: index,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * (isCompactMotion ? 14 : 24) + (isCompactMotion ? 12 : 16),
    duration: Math.random() * (isCompactMotion ? 4 : 6) + (isCompactMotion ? 8 : 7),
    delay: Math.random() * 2.5,
    drift: Math.random() * (isCompactMotion ? 12 : 18) + (isCompactMotion ? 6 : 10),
    type: index % 3 === 0 ? ('sparkle' as const) : ('heart' as const),
  }))
}

export default function FloatingBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isCompactMotion, setIsCompactMotion] = useState(false)
  const [dots, setDots] = useState<Dot[]>(() => createDots(false))
  const [ornaments, setOrnaments] = useState<Ornament[]>(() => createOrnaments(false))

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px), (prefers-reduced-motion: reduce)')
    const updateMotionMode = () => {
      const compactMode = mediaQuery.matches
      setIsCompactMotion(compactMode)
      setDots(createDots(compactMode))
      setOrnaments(createOrnaments(compactMode))
    }

    updateMotionMode()
    mediaQuery.addEventListener('change', updateMotionMode)

    return () => mediaQuery.removeEventListener('change', updateMotionMode)
  }, [])

  useEffect(() => {
    if (isCompactMotion) {
      setMousePos({ x: 0, y: 0 })
      return
    }

    const handleMouseMove = (event: MouseEvent) => {
      setMousePos({
        x: event.clientX - window.innerWidth / 2,
        y: event.clientY - window.innerHeight / 2,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [isCompactMotion])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-blue-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,207,232,0.45),_transparent_42%),radial-gradient(circle_at_bottom_right,_rgba(196,181,253,0.28),_transparent_38%)]" />

      <motion.div
        className="absolute left-1/4 top-1/4 h-80 w-80 rounded-full bg-gradient-to-r from-pink-200/25 to-purple-200/25 blur-3xl sm:h-96 sm:w-96 sm:from-pink-200/30 sm:to-purple-200/30"
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
        className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-blue-200/20 to-pink-200/22 blur-3xl sm:h-80 sm:w-80 sm:from-blue-200/30 sm:to-pink-200/30"
        animate={{
          x: -mousePos.x * 0.03,
          y: -mousePos.y * 0.03,
          scale: [1, 0.92, 1],
        }}
        transition={{
          scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      {!isCompactMotion && (
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
      )}

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
          className="floating-dot absolute rounded-full bg-gradient-to-r from-pink-300 to-purple-300 opacity-35"
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            width: dot.size,
            height: dot.size,
            ['--dot-drift-x' as string]: `${dot.driftX}px`,
            ['--dot-drift-y' as string]: `${dot.driftY}px`,
            ['--dot-duration' as string]: `${dot.duration}s`,
            ['--dot-delay' as string]: `${dot.delay}s`,
          } as CSSProperties}
        />
      ))}

      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent sm:via-white/10"
        animate={{ opacity: [0.28, 0.48, 0.28] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
