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
    Active: 'bg-emerald-50 text-emerald-700',
    Inactive: 'bg-red-50 text-red-600',
    Pending: 'bg-amber-50 text-amber-700',
    Done: 'bg-emerald-50 text-emerald-700',
    Paid: 'bg-blue-50 text-blue-700',
    Review: 'bg-orange-50 text-orange-700',
    Failed: 'bg-red-50 text-red-600',
}

export function StatusPill({ status }: { status: string }) {
    return (
        <span
            className={cn(
                'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                STATUS_STYLES[status] ?? 'bg-neutral-100 text-neutral-600'
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
        <div className="rounded-2xl border border-neutral-100 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                    {title}
                </h3>
                {viewAllHref && (
                    <a
                        href={viewAllHref}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                        View all →
                    </a>
                )}
            </div>
            <div className="overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-neutral-50">
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    className="pb-2 text-left text-xs font-medium text-neutral-400"
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
                                className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors"
                            >
                                {columns.map((col) => (
                                    <td key={String(col.key)} className="py-2.5 text-sm text-neutral-700">
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