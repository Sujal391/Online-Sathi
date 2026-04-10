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
    <div className="rounded-2xl border border-neutral-100 bg-white p-5">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400">
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
            className="flex flex-col items-start gap-2 rounded-xl border border-neutral-100 p-4 text-left transition-colors hover:border-neutral-200 hover:bg-neutral-50"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ background: `${action.accent}15`, color: action.accent }}
            >
              {action.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-800">{action.label}</p>
              <p className="text-xs text-neutral-400">{action.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}