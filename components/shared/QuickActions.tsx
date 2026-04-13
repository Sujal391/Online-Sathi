'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export interface QuickAction {
  label: string
  description: string
  icon: React.ReactNode
  href: string
  accent: string
}

interface QuickActionsProps {
  actions: QuickAction[]
}

export function QuickActions({ actions }: QuickActionsProps) {
  const router = useRouter()

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 p-5 backdrop-blur-sm">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, i) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 + 0.2, duration: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(action.href)}
            className="flex flex-col items-start gap-2 rounded-xl border border-zinc-200 dark:border-white/5 p-4 text-left transition-all hover:border-zinc-300 dark:hover:border-white/20 hover:bg-zinc-50 dark:hover:bg-white/5"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ background: `${action.accent}15`, color: action.accent }}
            >
              {action.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{action.label}</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">{action.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}