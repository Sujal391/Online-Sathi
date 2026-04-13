'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface TableColumn<T> {
    key: keyof T
    label: string
    render?: (val: T[keyof T], row: T) => React.ReactNode
}

interface MiniTableProps<T> {
    title: string
    columns: TableColumn<T>[]
    rows: T[]
    viewAllHref?: string
}

const STATUS_STYLES: Record<string, string> = {
    Active: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    Inactive: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400',
    Pending: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400',
    Done: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    Paid: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400',
    Review: 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400',
    Failed: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400',
}

export function StatusPill({ status }: { status: string }) {
    return (
        <span
            className={cn(
                'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                STATUS_STYLES[status] ?? 'bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400'
            )}
        >
            {status}
        </span>
    )
}

export function MiniTable<T extends Record<string, unknown>>({
    title,
    columns,
    rows,
    viewAllHref,
}: MiniTableProps<T>) {
    return (
        <div className="rounded-2xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    {title}
                </h3>
                {viewAllHref && (
                    <a
                        href={viewAllHref}
                        className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                    >
                        View all →
                    </a>
                )}
            </div>
            <div className="overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-zinc-100 dark:border-white/5">
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    className="pb-2 text-left text-xs font-medium text-zinc-400 dark:text-zinc-500"
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <motion.tr
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.05 + 0.3 }}
                                className="border-b border-zinc-50 dark:border-white/5 last:border-0 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
                            >
                                {columns.map((col) => (
                                    <td key={String(col.key)} className="py-2.5 text-sm text-zinc-700 dark:text-zinc-300">
                                        {col.render
                                            ? col.render(row[col.key], row)
                                            : String(row[col.key])}
                                    </td>
                                ))}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}