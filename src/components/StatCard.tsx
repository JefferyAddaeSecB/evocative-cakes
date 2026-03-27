import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  gradient: string
  value: number
  suffix: string
  label: string
  index?: number
}

export default function StatCard({
  icon: Icon,
  gradient,
  value,
  suffix,
  label,
  index = 0,
}: StatCardProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const motionValue = useMotionValue(0)
  const roundedValue = useTransform(motionValue, Math.round)

  useEffect(() => {
    if (inView) {
      const controls = animate(motionValue, value, {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      })

      return controls.stop
    }
  }, [inView, motionValue, value])

  return (
    <motion.div
      ref={ref}
      className="rounded-3xl border border-white/70 bg-white/82 p-8 text-center shadow-xl backdrop-blur-sm"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -6, scale: 1.02 }}
    >
      <motion.div
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r ${gradient} shadow-lg`}
        animate={
          inView
            ? {
                y: [0, -6, 0],
                rotate: [0, -6, 0, 6, 0],
                scale: [1, 1.06, 1],
              }
            : {}
        }
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.12,
        }}
      >
        <Icon className="w-8 h-8 text-white" />
      </motion.div>
      <div className="mt-4 text-4xl font-bold text-gray-800">
        <motion.span>{roundedValue}</motion.span>
        {suffix}
      </div>
      <p className="mt-2 text-gray-600">{label}</p>
    </motion.div>
  )
}
