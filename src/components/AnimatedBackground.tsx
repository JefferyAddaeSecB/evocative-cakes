import { motion } from 'framer-motion'
import { useMemo } from 'react'

const BlobMotion = motion.div

export default function AnimatedBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 2,
        size: Math.random() * 4 + 2,
      })),
    []
  )

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Large animated blobs - 3D floating effect */}
      <BlobMotion
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.3, 0.9, 1],
          opacity: [0.3, 0.6, 0.4, 0.3],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-300/40 to-purple-300/40 rounded-full blur-3xl"
      />

      <BlobMotion
        animate={{
          x: [0, -120, 80, 0],
          y: [0, 80, -100, 0],
          scale: [1, 0.8, 1.2, 1],
          opacity: [0.4, 0.5, 0.6, 0.4],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-300/40 to-pink-300/40 rounded-full blur-3xl"
      />

      <BlobMotion
        animate={{
          x: [0, 60, -80, 0],
          y: [0, -120, 60, 0],
          rotate: [0, 180, 360, 0],
          scale: [1, 1.1, 0.95, 1],
          opacity: [0.3, 0.5, 0.4, 0.3],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute top-1/2 right-1/3 w-72 h-72 bg-gradient-to-r from-purple-300/30 to-blue-300/30 rounded-full blur-2xl"
      />

      {/* Extra large glowing blob */}
      <BlobMotion
        animate={{
          x: [0, -100, 100, 0],
          y: [0, 100, -80, 0],
          scale: [0.9, 1.2, 0.95, 0.9],
          opacity: [0.2, 0.4, 0.3, 0.2],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
        className="absolute -top-1/4 -left-1/4 w-full h-full max-w-5xl max-h-5xl bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-blue-400/20 rounded-full blur-3xl"
      />

      {/* Floating particles - enhanced */}
      {particles.map((particle) => (
        <BlobMotion
          key={particle.id}
          animate={{
            y: [0, -window.innerHeight - 100, 0],
            x: [0, Math.sin(particle.id) * 50, 0],
            opacity: [0, 1, 0.8, 0.2, 0],
            scale: [0, 1, 1, 0.8, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, rgba(236,72,153,0.8), rgba(139,92,246,0.4))`,
            boxShadow: '0 0 20px rgba(236, 72, 153, 0.6), 0 0 40px rgba(139, 92, 246, 0.4)',
          }}
        />
      ))}

      {/* Radial gradient overlay for depth */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 bg-radial-gradient from-pink-500/5 via-transparent to-blue-500/5 pointer-events-none"
      />

      {/* Grid pattern for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(236,72,153,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
    </div>
  )
}
