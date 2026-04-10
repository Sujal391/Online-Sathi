'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  delta?: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ReactNode
  accent?: string
  delay?: number
}

export function StatCard({
  label,
  value,
  delta,
  trend = 'neutral',
  icon,
  accent = '#185FA5',
  delay = 0,
}: StatCardProps) {
  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-neutral-100 bg-white p-5',
        'hover:shadow-md hover:shadow-neutral-100 transition-shadow duration-300'
      )}
    >
      {/* accent bar */}
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-2xl"
        style={{ background: accent }}
      />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-wide text-neutral-400 uppercase">
            {label}
          </p>
          <p className="text-2xl font-semibold tracking-tight text-neutral-900">
            {value}
          </p>
          {delta && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium',
                trend === 'up' && 'text-emerald-600',
                trend === 'down' && 'text-red-500',
                trend === 'neutral' && 'text-neutral-400'
              )}
            >
              <TrendIcon className="h-3 w-3" />
              {delta}
            </div>
          )}
        </div>
        {icon && (
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: `${accent}15` }}
          >
            <span style={{ color: accent }}>{icon}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}