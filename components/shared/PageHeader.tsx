'use client'

import { motion } from 'framer-motion'

interface PageHeaderProps {
  title: string
  subtitle: string
  badge?: string
  badgeColor?: string
  children?: React.ReactNode
}

export function PageHeader({
  title,
  subtitle,
  badge,
  badgeColor = '#185FA5',
  children,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-start justify-between gap-4"
    >
      <div className="space-y-1">
        {badge && (
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{ background: `${badgeColor}15`, color: badgeColor }}
          >
            {badge}
          </span>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h1>
        <p className="text-sm text-neutral-500">{subtitle}</p>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </motion.div>
  )
}