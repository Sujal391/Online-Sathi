'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface FeedItem {
  id: string
  text: string
  time: string
  type: 'success' | 'info' | 'warning' | 'error'
}

const TYPE_STYLES = {
  success: 'bg-emerald-500',
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
}

interface ActivityFeedProps {
  items: FeedItem[]
  title?: string
}

export function ActivityFeed({ items, title = 'Recent Activity' }: ActivityFeedProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 p-5 backdrop-blur-sm">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        {title}
      </h3>
      <div className="space-y-0">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="flex gap-3 border-b border-zinc-100 dark:border-white/5 py-3 last:border-0"
          >
            <div className="mt-1.5 flex-shrink-0">
              <span className={cn('block h-2 w-2 rounded-full', TYPE_STYLES[item.type])} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug">{item.text}</p>
              <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">{item.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}