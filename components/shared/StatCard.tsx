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
        'relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 p-5 backdrop-blur-sm',
        'hover:shadow-md hover:shadow-zinc-100 dark:hover:shadow-none transition-all duration-300'
      )}
    >
      {/* accent bar */}
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-2xl"
        style={{ background: accent }}
      />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium tracking-wide text-zinc-400 dark:text-zinc-500 uppercase">
            {label}
          </p>
          <p className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {value}
          </p>
          {delta && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-medium',
                trend === 'up' && 'text-emerald-600 dark:text-emerald-400',
                trend === 'down' && 'text-red-500 dark:text-red-400',
                trend === 'neutral' && 'text-zinc-400 dark:text-zinc-500'
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