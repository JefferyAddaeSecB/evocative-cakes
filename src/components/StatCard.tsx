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
        duration: 2,
        ease: 'easeOut',
      })

      return controls.stop
    }
  }, [inView, motionValue, value])

  return (
    <motion.div
      ref={ref}
      className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1 }}
    >
      <div className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center mx-auto shadow-lg`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
      <div className="text-4xl font-bold text-gray-800 mt-4">
        <motion.span>{roundedValue}</motion.span>
        {suffix}
      </div>
      <p className="text-gray-600 mt-2">{label}</p>
    </motion.div>
  )
}
